const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Review = require('../models/Review');
const Package = require('../models/Package');

// Create review (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const { package: packageId, rating, title, comment } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ msg: 'Package not found' });

    const review = new Review({
      user: req.user.id,
      package: packageId,
      rating,
      title,
      comment,
    });
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get reviews for a package
router.get('/package/:packageId', async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId, approved: true }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: get all reviews
router.get('/', auth, adminOnly, async (req, res) => {
  const list = await Review.find().populate('user package');
  res.json(list);
});

// Update review (author or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete review (author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await review.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
