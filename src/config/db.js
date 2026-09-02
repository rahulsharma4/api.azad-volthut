const mongoose = require('mongoose');
const dns = require('dns');

// Use reliable Google/Cloudflare DNS servers to prevent querySrv ECONNREFUSED on local ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if setting DNS fails
}

const ensureAdminExists = async () => {
  try {
    const User = require('../models/userModel');
    const adminEmail = process.env.ADMIN_EMAIL || 'rahulmishra9291@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@rbs123';
    
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: process.env.ADMIN_NAME || 'Admin RBS Solar',
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || '9305332019',
        password: adminPassword,
        role: 'admin',
        status: 'active'
      });
      await admin.save();
      console.log(`✅ Default Admin user created successfully: ${adminEmail}`);
    } else {
      const isMatch = await admin.matchPassword(adminPassword);
      if (!isMatch) {
        admin.password = adminPassword;
        await admin.save();
        console.log(`✅ Admin password updated to match environment configuration: ${adminEmail}`);
      } else {
        console.log(`✅ Admin user verified: ${adminEmail}`);
      }
    }
  } catch (err) {
    console.error('Error verifying/seeding admin user:', err.message);
  }
};

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await ensureAdminExists();
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log('Retrying MongoDB connection in 10 seconds...');
      setTimeout(connectWithRetry, 10000);
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
