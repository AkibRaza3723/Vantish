import prisma from './lib/db/dbConnect.js';

async function diagnoseDB() {
  try {
    const usersCount = await prisma.user.count();
    console.log(`Total users in DB: ${usersCount}`);

    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true
      }
    });

    console.log('\nSample users in database:');
    users.forEach(u => {
      console.log(`- ID: ${u.id}`);
      console.log(`  Name: ${u.name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Username: ${u.username}`);
      console.log(`  Role: ${u.role}\n`);
    });
  } catch (err) {
    console.error('Database connection or query failed:', err);
  } finally {
    process.exit(0);
  }
}

diagnoseDB();
