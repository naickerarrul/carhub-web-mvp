import { db } from '@/db';
import { assistanceRequests } from '@/db/schema';

async function main() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    const sampleAssistanceRequests = [
        {
            ref: 'AR-202412-0001',
            userId: 1,
            vehicleId: 1,
            service: 'TOW',
            lat: 3.1478,
            lng: 101.6953,
            notes: 'Car broke down on highway, need towing service',
            status: 'NEW',
            providerId: null,
            priceQuotedRm: null,
            priceFinalRm: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
    ];

    await db.insert(assistanceRequests).values(sampleAssistanceRequests);
    
    console.log('✅ Assistance requests seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});