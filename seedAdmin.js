import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';
import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);
dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const admin = await User.create({
      email: 'admin@gmail.com',
      password: '123456',
      role: 'admin'
    });

    console.log(`Admin created successfully: ${admin.email} / 123456`);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
