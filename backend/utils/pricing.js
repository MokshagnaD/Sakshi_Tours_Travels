// Dynamic Pricing Utility
const calculateDynamicPrice = (basePrice, travelDate, numberOfPeople, packageData) => {
  let finalPrice = basePrice;
  let appliedDiscounts = [];
  
  // Seasonal Pricing
  const travelMonth = new Date(travelDate).getMonth() + 1;
  const peakMonths = [12, 1, 4, 5, 10, 11]; // Dec, Jan, Apr, May, Oct, Nov
  
  if (peakMonths.includes(travelMonth)) {
    finalPrice = finalPrice * 1.3; // 30% increase for peak season
  } else {
    finalPrice = finalPrice * 0.9; // 10% discount for off-peak
    appliedDiscounts.push({
      type: 'Seasonal',
      percentage: 10,
      amount: basePrice * 0.1,
      description: 'Off-peak season discount'
    });
  }
  
  // Early Bird Discount (30 days before travel)
  const daysUntilTravel = Math.ceil((new Date(travelDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysUntilTravel >= 30) {
    const earlyBirdDiscount = finalPrice * 0.1; // 10% early bird
    finalPrice -= earlyBirdDiscount;
    appliedDiscounts.push({
      type: 'EarlyBird',
      percentage: 10,
      amount: earlyBirdDiscount,
      description: 'Early bird discount (30+ days advance)'
    });
  }
  
  // Group Discount (5+ people)
  if (numberOfPeople >= 5) {
    const groupDiscount = finalPrice * 0.15; // 15% group discount
    finalPrice -= groupDiscount;
    appliedDiscounts.push({
      type: 'Group',
      percentage: 15,
      amount: groupDiscount,
      description: `Group discount for ${numberOfPeople} people`
    });
  }
  
  return {
    basePrice,
    finalPrice: Math.round(finalPrice),
    totalDiscount: appliedDiscounts.reduce((sum, d) => sum + d.amount, 0),
    appliedDiscounts
  };
};

// Generate Ticket Number
const generateTicketNumber = () => {
  const prefix = 'ST'; // Sakshi Tours
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Calculate Loyalty Points
const calculateLoyaltyPoints = (totalAmount) => {
  return Math.floor(totalAmount / 100); // 1 point per ₹100 spent
};

module.exports = {
  calculateDynamicPrice,
  generateTicketNumber,
  calculateLoyaltyPoints
};