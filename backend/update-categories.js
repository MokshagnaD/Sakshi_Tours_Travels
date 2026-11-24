require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sakshi';

async function updatePackageCategories() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGO_URI);
    
    console.log('📦 Fetching existing packages...');
    const packages = await Package.find({});
    console.log(`Found ${packages.length} packages`);
    
    // Update each package with appropriate categories
    for (const pkg of packages) {
      let categories = [];
      const title = pkg.title?.toLowerCase() || '';
      const description = pkg.description?.toLowerCase() || '';
      const destination = pkg.destination?.toLowerCase() || '';
      
      // Categorize based on title, description, and destination
      if (title.includes('beach') || destination.includes('goa') || destination.includes('andaman')) {
        categories.push('Beach');
      }
      if (title.includes('adventure') || title.includes('trek') || title.includes('safari')) {
        categories.push('Adventure');
      }
      if (title.includes('heritage') || title.includes('palace') || destination.includes('rajasthan')) {
        categories.push('Heritage');
      }
      if (title.includes('nature') || title.includes('backwater') || destination.includes('kerala')) {
        categories.push('Nature');
      }
      if (title.includes('spiritual') || title.includes('temple') || destination.includes('varanasi')) {
        categories.push('Spiritual');
      }
      if (destination.includes('himachal') || destination.includes('kashmir') || title.includes('mountain')) {
        categories.push('Adventure', 'Nature');
      }
      
      // Default category if none matched
      if (categories.length === 0) {
        categories.push('Nature');
      }
      
      // Remove duplicates
      categories = [...new Set(categories)];
      
      // Update package
      await Package.findByIdAndUpdate(pkg._id, { categories });
      console.log(`✅ Updated "${pkg.title}" with categories: ${categories.join(', ')}`);
    }
    
    console.log('🎉 All packages updated with categories!');
    
  } catch (error) {
    console.error('❌ Error updating packages:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updatePackageCategories();