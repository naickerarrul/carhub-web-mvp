import { db } from '@/db';
import { claimEvents } from '@/db/schema';

async function main() {
    const sampleClaimEvents = [
        {
            claimId: 1,
            type: 'CREATED',
            actorType: 'USER',
            actorId: 1,
            payload: JSON.stringify({
                incident: {
                    date: '2024-01-15T10:30:00Z',
                    location: 'Jalan Ampang, Kuala Lumpur',
                    description: 'Rear-end collision at traffic light intersection',
                    weather: 'Clear',
                    roadCondition: 'Dry'
                },
                damage: {
                    severity: 'MODERATE',
                    description: 'Significant damage to rear bumper and boot',
                    estimatedCost: 'RM 8,500'
                },
                parties: {
                    otherDriver: {
                        name: 'Ahmad Rahman',
                        vehiclePlate: 'WXY 1234',
                        insurerName: 'Great Eastern'
                    }
                }
            }),
            createdAt: 1705315800
        },
        {
            claimId: 2,
            type: 'CREATED',
            actorType: 'USER',
            actorId: 1,
            payload: JSON.stringify({
                incident: {
                    date: '2024-01-20T14:45:00Z',
                    location: 'PLUS Highway KM 45.2',
                    description: 'Single vehicle accident - hit road barrier during heavy rain',
                    weather: 'Heavy Rain',
                    roadCondition: 'Wet'
                },
                damage: {
                    severity: 'MAJOR',
                    description: 'Front-end damage, airbags deployed, windshield cracked',
                    estimatedCost: 'RM 25,000'
                },
                injuries: {
                    driverInjury: 'Minor cuts from glass',
                    medicalAttention: 'Treated at scene by paramedics'
                }
            }),
            createdAt: 1705747500
        },
        {
            claimId: 2,
            type: 'STATUS_CHANGED',
            actorType: 'ADMIN',
            actorId: null,
            payload: JSON.stringify({
                statusChange: {
                    from: 'SUBMITTED',
                    to: 'IN_REVIEW',
                    reason: 'Initial documentation review completed',
                    reviewedBy: 'Claims Officer Sarah Lim',
                    notes: 'All required documents received. Proceeding with detailed assessment.'
                },
                nextSteps: [
                    'Schedule vehicle inspection',
                    'Contact workshop for repair estimate',
                    'Review police report details'
                ]
            }),
            createdAt: 1705834200
        }
    ];

    await db.insert(claimEvents).values(sampleClaimEvents);
    
    console.log('✅ Claim events seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});