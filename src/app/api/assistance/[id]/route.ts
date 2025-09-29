import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assistanceRequests, vehicles, providers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Extract userId from authentication
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === 'demo-token') {
        userId = 1; // Demo user ID
      }
    }

    // Build query condition - must belong to authenticated user if userId exists
    const whereCondition = userId 
      ? and(eq(assistanceRequests.id, parseInt(id)), eq(assistanceRequests.userId, userId))
      : eq(assistanceRequests.id, parseInt(id));

    // Get assistance request
    const assistanceRequestResult = await db.select()
      .from(assistanceRequests)
      .where(whereCondition)
      .limit(1);

    if (assistanceRequestResult.length === 0) {
      return NextResponse.json({ 
        error: 'Assistance request not found' 
      }, { status: 404 });
    }

    const assistanceRequest = assistanceRequestResult[0];

    // Get vehicle data
    const vehicleResult = await db.select({
      plate: vehicles.plate,
      make: vehicles.make,
      model: vehicles.model
    })
      .from(vehicles)
      .where(eq(vehicles.id, assistanceRequest.vehicleId))
      .limit(1);

    const vehicle = vehicleResult.length > 0 ? vehicleResult[0] : null;

    // Get provider data if providerId is set
    let provider = null;
    if (assistanceRequest.providerId) {
      const providerResult = await db.select({
        name: providers.name,
        contact: providers.contact
      })
        .from(providers)
        .where(eq(providers.id, assistanceRequest.providerId))
        .limit(1);

      provider = providerResult.length > 0 ? providerResult[0] : null;
    }

    // Build response object
    const response = {
      id: assistanceRequest.id,
      ref: assistanceRequest.ref,
      userId: assistanceRequest.userId,
      vehicleId: assistanceRequest.vehicleId,
      service: assistanceRequest.service,
      lat: assistanceRequest.lat,
      lng: assistanceRequest.lng,
      notes: assistanceRequest.notes,
      status: assistanceRequest.status,
      providerId: assistanceRequest.providerId,
      priceQuotedRm: assistanceRequest.priceQuotedRm,
      priceFinalRm: assistanceRequest.priceFinalRm,
      createdAt: assistanceRequest.createdAt,
      updatedAt: assistanceRequest.updatedAt,
      vehicle,
      provider
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET assistance request error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}