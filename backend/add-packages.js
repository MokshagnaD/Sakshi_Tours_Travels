require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');

const packages = [
  {
    slug: "kerala-backwaters-paradise",
    title: "Kerala Backwaters Paradise",
    destination: "Kerala",
    price: 18500,
    durationDays: 6,
    category: "Nature",
    packageType: "DOMESTIC",
    description: "Experience the serene backwaters of Kerala with houseboat stays, Ayurvedic treatments, and spice plantation visits. Perfect for couples and families seeking tranquility.",
    inclusions: [
      "5 nights accommodation (2 nights houseboat + 3 nights resort)",
      "All meals (breakfast, lunch, dinner)",
      "Houseboat cruise in Alleppey backwaters",
      "Ayurvedic spa session",
      "Spice plantation tour in Thekkady",
      "Kathakali dance performance",
      "Airport transfers and sightseeing transport"
    ],
    itinerary: [
      { day: 1, title: "Arrival", activities: "Arrival in Cochin, transfer to Munnar hill station" },
      { day: 2, title: "Munnar", activities: "Munnar sightseeing - Tea gardens, Mattupetty Dam" },
      { day: 3, title: "Thekkady", activities: "Travel to Thekkady, spice plantation tour" },
      { day: 4, title: "Alleppey", activities: "Transfer to Alleppey, board houseboat" },
      { day: 5, title: "Backwaters", activities: "Houseboat cruise, evening at beach resort" },
      { day: 6, title: "Departure", activities: "Departure from Cochin airport" }
    ],
    images: [],
    ratings: 4.8,
    reviews: 156,
    isActive: true
  },
  {
    slug: "rajasthan-royal-heritage-tour",
    title: "Rajasthan Royal Heritage Tour",
    destination: "Rajasthan",
    price: 24500,
    durationDays: 8,
    category: "Heritage",
    packageType: "DOMESTIC",
    description: "Explore the royal palaces, majestic forts, and vibrant culture of Rajasthan. Visit Jaipur, Udaipur, and Jodhpur with luxury heritage hotel stays.",
    inclusions: [
      "7 nights in heritage hotels and palaces",
      "Daily breakfast and 4 traditional dinners",
      "All fort and palace entry tickets",
      "Camel safari in Thar Desert",
      "Boat ride in Lake Pichola, Udaipur",
      "Cultural folk dance performances",
      "AC transportation and guide services"
    ],
    itinerary: [
      { day: 1, title: "Jaipur Arrival", activities: "Arrival in Jaipur, City Palace visit" },
      { day: 2, title: "Pink City", activities: "Amber Fort, Hawa Mahal, local markets" },
      { day: 3, title: "Blue City", activities: "Travel to Jodhpur, Mehrangarh Fort" },
      { day: 4, title: "Golden City", activities: "Jodhpur to Jaisalmer, evening at leisure" },
      { day: 5, title: "Desert Safari", activities: "Jaisalmer Fort, camel safari and desert camp" },
      { day: 6, title: "Lake City", activities: "Travel to Udaipur, City of Lakes" },
      { day: 7, title: "Palaces", activities: "Udaipur palaces, boat ride, cultural show" },
      { day: 8, title: "Departure", activities: "Departure from Udaipur" }
    ],
    images: [],
    ratings: 4.7,
    reviews: 203,
    isActive: true
  },
  {
    slug: "himachal-adventure-expedition",
    title: "Himachal Adventure Expedition",
    destination: "Himachal Pradesh",
    price: 16800,
    durationDays: 7,
    category: "Adventure",
    packageType: "ADVENTURE",
    description: "Thrilling adventure in the Himalayas with trekking, river rafting, paragliding, and mountain biking. Perfect for adventure enthusiasts and nature lovers.",
    inclusions: [
      "6 nights accommodation (hotels and camps)",
      "All meals during the tour",
      "Professional trekking guide and equipment",
      "River rafting in Beas River",
      "Paragliding session in Bir Billing",
      "Mountain biking equipment",
      "All adventure activity fees and permits"
    ],
    itinerary: [
      { day: 1, title: "Arrival", activities: "Arrival in Manali, acclimatization" },
      { day: 2, title: "Adventure", activities: "Solang Valley adventure activities" },
      { day: 3, title: "Trekking", activities: "Trek to Jogini Falls, evening at leisure" },
      { day: 4, title: "Paragliding", activities: "Travel to Bir, paragliding session" },
      { day: 5, title: "Biking", activities: "Mountain biking and nature walks" },
      { day: 6, title: "Rafting", activities: "River rafting in Kullu, bonfire night" },
      { day: 7, title: "Departure", activities: "Departure from Manali" }
    ],
    images: [],
    ratings: 4.6,
    reviews: 89,
    isActive: true
  },
  {
    slug: "golden-triangle-classic",
    title: "Golden Triangle Classic",
    destination: "Delhi-Agra-Jaipur",
    price: 21200,
    durationDays: 6,
    category: "Heritage",
    packageType: "DOMESTIC",
    description: "India's most popular tourist circuit covering Delhi's monuments, Agra's Taj Mahal, and Jaipur's royal palaces. Perfect introduction to India's rich heritage.",
    inclusions: [
      "5 nights in 4-star hotels",
      "Daily breakfast and welcome dinner",
      "Taj Mahal sunrise visit with guide",
      "Red Fort and India Gate in Delhi",
      "Amber Fort elephant ride in Jaipur",
      "Shopping tours in local markets",
      "AC car with driver for entire tour"
    ],
    itinerary: [
      { day: 1, title: "Delhi Arrival", activities: "Arrival in Delhi, Red Fort and Chandni Chowk" },
      { day: 2, title: "Delhi Tour", activities: "Delhi sightseeing - India Gate, Lotus Temple" },
      { day: 3, title: "Agra", activities: "Drive to Agra, Taj Mahal sunset visit" },
      { day: 4, title: "Taj & Jaipur", activities: "Taj Mahal sunrise, drive to Jaipur via Fatehpur Sikri" },
      { day: 5, title: "Pink City", activities: "Jaipur - Amber Fort, City Palace, Hawa Mahal" },
      { day: 6, title: "Departure", activities: "Departure from Jaipur" }
    ],
    images: [],
    ratings: 4.9,
    reviews: 312,
    isActive: true
  },
  {
    slug: "andaman-island-paradise",
    title: "Andaman Island Paradise",
    destination: "Andaman & Nicobar",
    price: 28900,
    durationDays: 7,
    category: "Beach",
    packageType: "HONEYMOON",
    description: "Pristine beaches, crystal clear waters, and exotic marine life. Includes scuba diving, snorkeling, and island hopping in India's tropical paradise.",
    inclusions: [
      "6 nights beachfront resort accommodation",
      "All meals and evening snacks",
      "Scuba diving certification course",
      "Snorkeling at multiple locations",
      "Island hopping to Neil and Havelock",
      "Glass bottom boat rides",
      "All water sports equipment and transfers"
    ],
    itinerary: [
      { day: 1, title: "Arrival", activities: "Arrival in Port Blair, Cellular Jail visit" },
      { day: 2, title: "Havelock", activities: "Ferry to Havelock Island, Radhanagar Beach" },
      { day: 3, title: "Scuba Diving", activities: "Scuba diving at Elephant Beach" },
      { day: 4, title: "Neil Island", activities: "Neil Island excursion, natural bridges" },
      { day: 5, title: "Water Sports", activities: "Snorkeling and water sports" },
      { day: 6, title: "Port Blair", activities: "Return to Port Blair, shopping and leisure" },
      { day: 7, title: "Departure", activities: "Departure from Port Blair" }
    ],
    images: [],
    ratings: 4.8,
    reviews: 127,
    isActive: true
  }
];

const addPackages = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing existing packages...');
    await Package.deleteMany({});

    console.log('📦 Adding new packages...');
    const result = await Package.insertMany(packages);
    
    console.log(`✅ Successfully added ${result.length} packages:`);
    result.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.title} - ₹${pkg.price} (${pkg.durationDays} days) - ${pkg.packageType}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
};

addPackages();