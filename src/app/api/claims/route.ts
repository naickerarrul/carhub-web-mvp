import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { claims, claimEvents, vehicles, mediaAssets } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

// Authentication middleware
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // Demo token maps to user ID 1
  if (token === 'demo-token') {
    return { id: 1 };
  }
  
  // For now, only support demo token
  // In production, you would validate JWT and extract user ID
  return null;
}

// Validation schemas
const createClaimSchema = z.object({
  incidentAt: z.number().int().positive(),
  locationLat: z.number().min(-90).max(90),
  locationLng: z.number().min(-180).max(180),
  locationText: z.string().optional(),
  policeReportNo: z.string().optional(),
  vehicleId: z.number().int().positive(),
  insurerName: z.string().optional(),
  severity: z.enum(['UNKNOWN', 'MINOR', 'MODERATE', 'MAJOR', 'FATALITY'])
});

// Generate unique claim reference
async function generateClaimRef(): Promise<string> {
  const now = new Date();
  const yearMonth = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0');
  
  // Get the highest sequence number for this month
  const lastClaim = await db.select({ ref: claims.ref })
    .from(claims)
    .where(eq(claims.ref, `CH-${yearMonth}-%`))
    .orderBy(desc(claims.ref))
    .limit(1);
  
  let sequence = 1;
  if (lastClaim.length > 0) {
    const lastRef = lastClaim[0].ref;
    const lastSequence = parseInt(lastRef.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `CH-${yearMonth}-${sequence.toString().padStart(4, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required for creating claims',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const validation = createClaimSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors
      }, { status: 400 });
    }

    const { incidentAt, locationLat, locationLng, locationText, policeReportNo, vehicleId, insurerName, severity } = validation.data;

    // Verify vehicle belongs to user
    const vehicle = await db.select()
      .from(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
      .limit(1);

    if (vehicle.length === 0) {
      return NextResponse.json({ 
        error: 'Vehicle not found or does not belong to user',
        code: 'VEHICLE_NOT_FOUND' 
      }, { status: 404 });
    }

    const ref = await generateClaimRef();
    const now = Date.now();

    const newClaim = await db.insert(claims)
      .values({
        ref,
        userId: user.id,
        vehicleId,
        incidentAt,
        locationLat,
        locationLng,
        locationText,
        policeReportNo,
        insurerName,
        severity,
        status: 'SUBMITTED',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Create CREATED event
    await db.insert(claimEvents)
      .values({
        claimId: newClaim[0].id,
        type: 'CREATED',
        payload: JSON.stringify({
          severity,
          location: { lat: locationLat, lng: locationLng, text: locationText }
        }),
        actorType: 'USER',
        actorId: user.id,
        createdAt: now
      });

    return NextResponse.json(newClaim[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required for viewing claims',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await db.select({
      id: claims.id,
      ref: claims.ref,
      status: claims.status,
      updatedAt: claims.updatedAt,
      plate: vehicles.plate
    })
      .from(claims)
      .innerJoin(vehicles, eq(claims.vehicleId, vehicles.id))
      .where(eq(claims.userId, user.id))
      .orderBy(desc(claims.updatedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}