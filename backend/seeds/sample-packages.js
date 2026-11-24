require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../models/Package');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const samplePackages = [
  {
    title: 'Goa Beach Paradise',
    description: 'Experience the beautiful beaches of Goa with water sports, beach parties, and stunning sunsets. Perfect for couples and groups looking for a fun-filled vacation.',
    destination: 'Goa',
    price: 15000,
    durationDays: 5,
    categories: ['Beach', 'Adventure', 'Nightlife'],
    inclusions: ['Accommodation', 'Breakfast', 'Airport Transfer', 'Water Sports'],
    itinerary: [
      { day: 1, title: 'Arrival', activities: 'Check-in, Beach walk, Welcome dinner' },
      { day: 2, title: 'North Goa', activities: 'Baga Beach, Calangute Beach, Water sports' },
      { day: 3, title: 'South Goa', activities: 'Palolem Beach, Butterfly Beach, Sunset cruise' },
      { day: 4, title: 'Adventure Day', activities: 'Scuba diving, Parasailing, Beach party' },
      { day: 5, title: 'Departure', activities: 'Check-out, Airport transfer' }
    ],
    availableDates: [
      new Date('2024-12-15'),
      new Date('2024-12-25'),
      new Date('2025-01-10'),
      new Date('2025-01-20')
    ],
    images: ['https://example.com/goa1.jpg', 'https://example.com/goa2.jpg']
  },
  {
    title: 'Kerala Backwaters Retreat',
    description: 'Discover the serene backwaters of Kerala with houseboat stays, Ayurvedic treatments, and traditional cuisine. A perfect escape into nature.',
    destination: 'Kerala',
    price: 18000,
    durationDays: 6,
    categories: ['Nature', 'Relaxation', 'Culture'],
    inclusions: ['Houseboat Stay', 'All Meals', 'Ayurvedic Massage', 'Local Transport'],
    itinerary: [
      { day: 1, title: 'Arrival Kochi', activities: 'Airport pickup, City tour, Chinese fishing nets' },
      { day: 2, title: 'Munnar Hills', activities: 'Tea plantations, Mattupetty Dam, Echo Point' },
      { day: 3, title: 'Thekkady Wildlife', activities: 'Periyar Wildlife Sanctuary, Spice plantation tour' },
      { day: 4, title: 'Alleppey Backwaters', activities: 'Houseboat check-in, Backwater cruise' },
      { day: 5, title: 'Kumarakom', activities: 'Bird sanctuary, Village walk, Ayurvedic treatment' },
      { day: 6, title: 'Departure', activities: 'Check-out, Kochi airport transfer' }
    ],
    availableDates: [
      new Date('2024-12-20'),
      new Date('2025-01-05'),
      new Date('2025-01-15'),
      new Date('2025-02-01')
    ],
    images: ['https://example.com/kerala1.jpg', 'https://example.com/kerala2.jpg']
  },
  {
    title: 'Rajasthan Royal Heritage',
    description: 'Explore the royal heritage of Rajasthan with magnificent palaces, desert safaris, and cultural performances. A journey through India\'s royal past.',
    destination: 'Rajasthan',
    price: 25000,
    durationDays: 8,
    categories: ['Heritage', 'Culture', 'Desert'],
    inclusions: ['Palace Hotels', 'All Meals', 'Desert Safari', 'Cultural Shows', 'Guide'],
    itinerary: [
      { day: 1, title: 'Jaipur Arrival', activities: 'City Palace, Hawa Mahal, Local markets' },
      { day: 2, title: 'Jaipur Sightseeing', activities: 'Amber Fort, Jal Mahal, Jantar Mantar' },
      { day: 3, title: 'Jodhpur Blue City', activities: 'Mehrangarh Fort, Blue city walk, Umaid Bhawan' },
      { day: 4, title: 'Jaisalmer Golden City', activities: 'Jaisalmer Fort, Patwon Ki Haveli' },
      { day: 5, title: 'Desert Safari', activities: 'Sam Sand Dunes, Camel safari, Desert camp' },
      { day: 6, title: 'Udaipur City of Lakes', activities: 'City Palace, Lake Pichola, Jagdish Temple' },
      { day: 7, title: 'Udaipur Sightseeing', activities: 'Saheliyon Ki Bari, Fateh Sagar Lake, Sunset boat ride' },
      { day: 8, title: 'Departure', activities: 'Check-out, Airport transfer' }
    ],
    availableDates: [
      new Date('2024-12-10'),
      new Date('2025-01-12'),
      new Date('2025-02-05'),
      new Date('2025-02-20')
    ],
    images: ['https://example.com/rajasthan1.jpg', 'https://example.com/rajasthan2.jpg']
  },
  {
    title: 'Himachal Adventure Trek',
    description: 'Experience the thrill of trekking in the Himalayas with breathtaking views, adventure activities, and mountain culture.',
    destination: 'Himachal Pradesh',
    price: 12000,
    durationDays: 7,
    categories: ['Adventure', 'Trekking', 'Mountains'],
    inclusions: ['Camping', 'Meals', 'Trekking Guide', 'Equipment', 'Transport'],
    itinerary: [
      { day: 1, title: 'Manali Arrival', activities: 'Arrival, acclimatization, local sightseeing' },
      { day: 2, title: 'Solang Valley', activities: 'Adventure sports, paragliding, zorbing' },
      { day: 3, title: 'Trek Start', activities: 'Trek to base camp, camping' },
      { day: 4, title: 'Summit Day', activities: 'Early morning summit, return to camp' },
      { day: 5, title: 'Kasol Valley', activities: 'Trek to Kasol, Israeli cafe culture' },
      { day: 6, title: 'Tosh Village', activities: 'Village exploration, local culture' },
      { day: 7, title: 'Departure', activities: 'Return journey, departure' }
    ],
    availableDates: [
      new Date('2025-03-15'),
      new Date('2025-04-10'),
      new Date('2025-05-05'),
      new Date('2025-09-20')
    ],
    images: ['https://example.com/himachal1.jpg', 'https://example.com/himachal2.jpg']
  },
  {
    title: 'Andaman Island Escape',
    description: 'Pristine beaches, crystal clear waters, and water sports in the beautiful Andaman Islands. Perfect for beach lovers and adventure seekers.',
    destination: 'Andaman',
    price: 22000,
    durationDays: 6,
    categories: ['Beach', 'Adventure', 'Island'],
    inclusions: ['Beach Resort', 'All Meals', 'Water Sports', 'Island Hopping', 'Snorkeling'],
    itinerary: [
      { day: 1, title: 'Port Blair Arrival', activities: 'Cellular Jail, Light & Sound show' },
      { day: 2, title: 'Havelock Island', activities: 'Radhanagar Beach, sunset viewing' },
      { day: 3, title: 'Water Adventures', activities: 'Scuba diving, snorkeling, water sports' },
      { day: 4, title: 'Neil Island', activities: 'Natural Bridge, Bharatpur Beach' },
      { day: 5, title: 'Ross Island', activities: 'Historical ruins, island exploration' },
      { day: 6, title: 'Departure', activities: 'Shopping, airport transfer' }
    ],
    availableDates: [
      new Date('2024-12-28'),
      new Date('2025-01-18'),
      new Date('2025-02-10'),
      new Date('2025-03-05')
    ],
    images: ['https://example.com/andaman1.jpg', 'https://example.com/andaman2.jpg']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sakshi');
    console.log('Connected to MongoDB');

    // Clear existing packages
    await Package.deleteMany({});
    console.log('Cleared existing packages');

    // Insert sample packages
    const packages = await Package.insertMany(samplePackages);
    console.log(`Inserted ${packages.length} sample packages`);

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'sakshitours@gmail.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('sakshi@123', salt);
      
      const admin = new User({
        name: 'Sakshi Tours Admin',
        email: 'sakshitours@gmail.com',
        passwordHash,
        role: 'admin',
        phone: '9999999999'
      });
      
      await admin.save();
      console.log('Created admin user: sakshitours@gmail.com / sakshi@123');
    }

    // Create sample customer if doesn't exist
    const customerExists = await User.findOne({ email: 'customer@test.com' });
    if (!customerExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('customer123', salt);
      
      const customer = new User({
        name: 'Test Customer',
        email: 'customer@test.com',
        passwordHash,
        role: 'customer',
        phone: '8888888888'
      });
      
      await customer.save();
      console.log('Created customer user: customer@test.com / customer123');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();