import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assistanceRequests, vehicles, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Authentication helper
async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // Demo token handling
  if (token === 'demo-token') {
    const demoUser = await db.select()
      .from(users)
      .where(eq(users.id, 1))
      .limit(1);
    return demoUser[0] || null;
  }
  
  // For real tokens, implement proper JWT validation here
  // For now, return null for any other token
  return null;
}

// Request validation schema
const createAssistanceRequestSchema = z.object({
  service: z.enum(['TOW', 'TYRE', 'BATTERY', 'FUEL', 'LOCKOUT']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  notes: z.string().optional(),
  vehicleId: z.number().int().positive()
});

// Generate unique reference number
function generateRef(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999) + 1;
  const sequence = String(random).padStart(4, '0');
  return `AR-${year}${month}-${sequence}`;
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON' 
      }, { status: 400 });
    }

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate request body with Zod
    const validation = createAssistanceRequestSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors
      }, { status: 400 });
    }

    const { service, lat, lng, notes, vehicleId } = validation.data;

    // Verify vehicle exists and belongs to user
    const vehicle = await db.select()
      .from(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
      .limit(1);

    if (vehicle.length === 0) {
      return NextResponse.json({ 
        error: 'Vehicle not found or does not belong to user',
        code: 'VEHICLE_NOT_FOUND' 
      }, { status: 400 });
    }

    // Generate unique reference
    const ref = generateRef();
    const now = Date.now();

    // Create assistance request
    const newRequest = await db.insert(assistanceRequests)
      .values({
        ref,
        userId: user.id,
        vehicleId,
        service,
        lat,
        lng,
        notes: notes || null,
        status: 'NEW',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    if (newRequest.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to create assistance request',
        code: 'CREATE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json(newRequest[0], { status: 201 });

  } catch (error) {
    console.error('POST assistance request error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}