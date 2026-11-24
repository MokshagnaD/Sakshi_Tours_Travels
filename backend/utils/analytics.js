const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

// Sales Analytics
const getSalesAnalytics = async (startDate, endDate) => {
  const bookings = await Booking.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['confirmed', 'completed'] }
  }).populate('package');

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalBookings = bookings.length;
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  return {
    totalRevenue,
    totalBookings,
    averageBookingValue,
    bookings: bookings.length
  };
};

// Popular Destinations
const getPopularDestinations = async () => {
  const popularPackages = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$package', bookingCount: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
    { $sort: { bookingCount: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'packages', localField: '_id', foreignField: '_id', as: 'packageInfo' } },
    { $unwind: '$packageInfo' }
  ]);

  return popularPackages.map(item => ({
    packageId: item._id,
    title: item.packageInfo.title,
    destination: item.packageInfo.destination,
    bookingCount: item.bookingCount,
    totalRevenue: item.totalRevenue
  }));
};

// Monthly Revenue Report
const getMonthlyRevenue = async (year) => {
  const monthlyData = await Booking.aggregate([
    {
      $match: {
        createdAt: { 
          $gte: new Date(`${year}-01-01`), 
          $lte: new Date(`${year}-12-31`) 
        },
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, index) => {
    const data = monthlyData.find(item => item._id === index + 1);
    return {
      month,
      revenue: data ? data.revenue : 0,
      bookings: data ? data.bookings : 0
    };
  });
};

// Customer Analytics
const getCustomerAnalytics = async () => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const activeCustomers = await User.countDocuments({ 
    role: 'customer', 
    lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
  });

  const topCustomers = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$user', totalSpent: { $sum: '$totalAmount' }, bookingCount: { $sum: 1 } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
    { $unwind: '$userInfo' }
  ]);

  return {
    totalCustomers,
    activeCustomers,
    topCustomers: topCustomers.map(customer => ({
      name: customer.userInfo.name,
      email: customer.userInfo.email,
      totalSpent: customer.totalSpent,
      bookingCount: customer.bookingCount
    }))
  };
};

module.exports = {
  getSalesAnalytics,
  getPopularDestinations,
  getMonthlyRevenue,
  getCustomerAnalytics
};