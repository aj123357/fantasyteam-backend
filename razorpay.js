const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'YOUR_API_KEY_ID',
  key_secret: 'YOUR_API_KEY_SECRET',
});

module.exports = razorpay