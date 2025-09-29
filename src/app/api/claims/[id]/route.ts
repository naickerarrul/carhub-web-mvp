import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { claims, claimEvents, mediaAssets, vehicles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract and validate ID parameter
    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Extract userId from authorization header
    let userId: number | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === 'demo-token') {
        userId = 1; // Demo user ID
      }
    }

    // Get claim by ID with user filter
    const claimQuery = db.select().from(claims).where(eq(claims.id, parseInt(id))).limit(1);
    const claimResult = await claimQuery;

    if (claimResult.length === 0) {
      return NextResponse.json({ 
        error: 'Claim not found' 
      }, { status: 404 });
    }

    const claim = claimResult[0];

    // Check if claim belongs to the user (if userId is provided)
    if (userId && claim.userId !== userId) {
      return NextResponse.json({ 
        error: 'Claim not found' 
      }, { status: 404 });
    }

    // If no userId provided and we have a claim, we should still restrict access
    if (!userId) {
      return NextResponse.json({ 
        error: 'Claim not found' 
      }, { status: 404 });
    }

    // Get related events
    const events = await db.select()
      .from(claimEvents)
      .where(eq(claimEvents.claimId, parseInt(id)))
      .orderBy(desc(claimEvents.createdAt));

    // Get related media assets
    const media = await db.select()
      .from(mediaAssets)
      .where(eq(mediaAssets.claimId, parseInt(id)))
      .orderBy(desc(mediaAssets.createdAt));

    // Get vehicle data
    const vehicleQuery = db.select({
      plate: vehicles.plate,
      make: vehicles.make,
      model: vehicles.model
    }).from(vehicles).where(eq(vehicles.id, claim.vehicleId)).limit(1);
    
    const vehicleResult = await vehicleQuery;
    const vehicle = vehicleResult.length > 0 ? vehicleResult[0] : null;

    // Build response object with all related data
    const response = {
      id: claim.id,
      ref: claim.ref,
      userId: claim.userId,
      vehicleId: claim.vehicleId,
      incidentAt: claim.incidentAt,
      locationLat: claim.locationLat,
      locationLng: claim.locationLng,
      locationText: claim.locationText,
      policeReportNo: claim.policeReportNo,
      insurerName: claim.insurerName,
      insurerRef: claim.insurerRef,
      status: claim.status,
      severity: claim.severity,
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt,
      events: events.map(event => ({
        id: event.id,
        type: event.type,
        payload: event.payload,
        actorType: event.actorType,
        actorId: event.actorId,
        createdAt: event.createdAt
      })),
      media: media.map(asset => ({
        id: asset.id,
        kind: asset.kind,
        url: asset.url,
        mime: asset.mime,
        sizeBytes: asset.sizeBytes,
        checksum: asset.checksum,
        createdAt: asset.createdAt
      })),
      vehicle: vehicle
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}