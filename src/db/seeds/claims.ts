import { db } from '@/db';
import { claims } from '@/db/schema';

async function main() {
    const sampleClaims = [
        {
            ref: 'CH-202412-0001',
            userId: 1,
            vehicleId: 1,
            incidentAt: 1733760000, // December 9, 2024 16:00:00 UTC
            locationLat: 3.1390,
            locationLng: 101.6869,
            locationText: 'Jalan Bukit Bintang',
            policeReportNo: null,
            insurerName: 'Great Eastern',
            insurerRef: null,
            status: 'SUBMITTED',
            severity: 'MINOR',
            createdAt: 1733760300, // December 9, 2024 16:05:00 UTC
            updatedAt: 1733760300, // December 9, 2024 16:05:00 UTC
        },
        {
            ref: 'CH-202412-0002',
            userId: 1,
            vehicleId: 1,
            incidentAt: 1734019200, // December 12, 2024 16:00:00 UTC
            locationLat: 3.1073,
            locationLng: 101.5951,
            locationText: 'SS2 Area',
            policeReportNo: 'PJ123456',
            insurerName: 'Great Eastern',
            insurerRef: null,
            status: 'IN_REVIEW',
            severity: 'MODERATE',
            createdAt: 1734019500, // December 12, 2024 16:05:00 UTC
            updatedAt: 1734105900, // December 13, 2024 16:05:00 UTC
        }
    ];

    await db.insert(claims).values(sampleClaims);
    
    console.log('✅ Claims seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});