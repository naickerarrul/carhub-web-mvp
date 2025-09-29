import { db } from '@/db';
import { vehicles } from '@/db/schema';

async function main() {
    const sampleVehicles = [
        {
            userId: 1,
            plate: 'VAB1234',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            insurerName: 'Great Eastern',
            policyNo: 'POL123456',
            policyValidFrom: Math.floor(new Date('2024-01-01').getTime() / 1000),
            policyValidTo: Math.floor(new Date('2025-12-31').getTime() / 1000),
            createdAt: Math.floor(new Date('2024-02-15').getTime() / 1000),
        }
    ];

    await db.insert(vehicles).values(sampleVehicles);
    
    console.log('✅ Vehicles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});