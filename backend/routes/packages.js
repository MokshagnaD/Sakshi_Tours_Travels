const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Image upload endpoint
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ msg: 'No images uploaded' });
    }
    
    const imageUrls = req.files.map(file => `/uploads/packages/${file.filename}`);
    console.log('Image URLs:', imageUrls);
    res.json({ images: imageUrls });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ msg: 'Failed to upload images', error: err.message });
  }
});

// List + search + filter + pagination
router.get('/', async (req, res) => {
  try {
    const { 
      q, 
      destination, 
      category, 
      minPrice, 
      maxPrice, 
      minDuration, 
      maxDuration,
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = { isActive: true };
    
    // Text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { destination: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Destination filter
    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }
    
    // Category filter
    if (category) {
      filter.categories = { $in: [category] };
    }
    
    // Package type filter
    const { packageType } = req.query;
    if (packageType) {
      filter.packageType = packageType;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Duration filter
    if (minDuration || maxDuration) {
      filter.durationDays = {};
      if (minDuration) filter.durationDays.$gte = parseInt(minDuration);
      if (maxDuration) filter.durationDays.$lte = parseInt(maxDuration);
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const packages = await Package.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Package.countDocuments(filter);
    
    res.json({ 
      data: packages, 
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    console.log('Creating package with data:', req.body);
    const pkg = new Package(req.body);
    await pkg.save();
    console.log('Package saved successfully:', pkg._id);
    res.json(pkg);
  } catch (err) {
    console.error('Package creation error:', err);
    if (err.code === 11000) {
      res.status(400).json({ msg: 'Package with this title already exists' });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ msg: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ msg: 'Failed to save package', error: err.message });
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ msg: 'Package not found' });
    }
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    console.log('Updating package:', req.params.id, 'with data:', req.body);
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ msg: 'Package not found' });
    console.log('Package updated successfully');
    res.json(pkg);
  } catch (err) {
    console.error('Package update error:', err);
    if (err.name === 'ValidationError') {
      res.status(400).json({ msg: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ msg: 'Failed to update package', error: err.message });
    }
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ msg: 'Package not found' });
    res.json({ msg: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
