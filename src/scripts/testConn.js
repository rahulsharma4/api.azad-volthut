require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: MongoDB Connection Error:', err.message);
    process.exit(1);
  });
