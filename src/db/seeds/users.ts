import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 1,
            email: 'demo@example.com',
            name: 'Demo User',
            roles: 'CUSTOMER',
            createdAt: Math.floor(new Date('2024-12-01').getTime() / 1000),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});