import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/employee.model.js';

dotenv.config();

const DEMO_USERS = [
    {
        employeeId: 'ADMIN001',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'Admin@123',
        department: 'IT',
        phoneNo: '9999999999',
        role: 'admin'
    },
    {
        employeeId: 'EMP001',
        name: 'Demo Employee',
        email: 'employee@demo.com',
        password: 'Employee@123',
        department: 'HR',
        phoneNo: '8888888888',
        role: 'employee'
    }
];

async function seedDemoUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const userData of DEMO_USERS) {
            const exists = await Employee.findOne({
                $or: [{ email: userData.email }, { employeeId: userData.employeeId }]
            });

            if (exists) {
                console.log(`⏭️  Skipping "${userData.name}" — already exists`);
                continue;
            }

            const user = new Employee(userData);
            await user.save();
            console.log(`✅ Created ${userData.role}: ${userData.email} (${userData.employeeId})`);
        }

        console.log('\n🎉 Demo user seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
    }
}

seedDemoUsers();
