const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars (local .env)
dotenv.config({ path: './.env' });

const PackageSchema = new mongoose.Schema({
    title: String,
    description: String,
    destination: String,
    days: Number,
    nights: Number,
    price: Number,
    images: [String],
    category: [String],
    featured: Boolean,
    availableDates: [Date]
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    phone: String,
    loyaltyPoints: { type: Number, default: 0 }
});

// Check if models are already compiled to avoid overwriting
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if packages exist
        const count = await Package.countDocuments();
        if (count === 0) {
            console.log('Seeding Packages...');
            const packages = [
                {
                    title: 'Kerala Bliss',
                    description: 'Enjoy the backwaters of Kerala with a houseboat stay.',
                    destination: 'Kerala',
                    days: 5,
                    nights: 4,
                    price: 25000,
                    images: ['/uploads/kerala.jpg'], // Using relative path or placeholder
                    category: ['Nature', 'Relaxation'],
                    featured: true,
                    availableDates: [new Date(Date.now() + 86400000), new Date(Date.now() + 172800000)]
                },
                {
                    title: 'Goa Party',
                    description: 'Fun in the sun for 3 days.',
                    destination: 'Goa',
                    days: 3,
                    nights: 2,
                    price: 15000,
                    images: ['/uploads/goa.jpg'],
                    category: ['Beach', 'Party'],
                    featured: true,
                    availableDates: [new Date(Date.now() + 86400000)]
                }
            ];
            // Note: Images might need to be valid URLs if frontend checks strictly, but let's try placeholders
            await Package.insertMany(packages);
            console.log('Packages Seeded');
        } else {
            console.log('Packages already exist.');
        }

        // CheckAdmin
        const admin = await User.findOne({ email: 'admin@sakshitours.com' });
        if (!admin) {
            console.log('Seeding Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                name: 'Admin User',
                email: 'admin@sakshitours.com',
                password: hashedPassword,
                role: 'admin',
                phone: '1234567890'
            });
            console.log('Admin Seeded');
        } else {
            console.log('Admin already exists.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
