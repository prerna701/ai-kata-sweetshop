import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User } from '../models/User';
import { Sweet } from '../models/Sweet';

const seedData = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin'
    });

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      email: 'customer@sweetshop.com',
      password: customerPassword,
      name: 'Customer User',
      role: 'customer'
    });

    // Create sample sweets
    const sweets = [
      {
        name: 'Premium Chocolate Bar',
        category: 'Chocolate',
        price: 4.99,
        quantity: 50,
        description: 'Rich dark chocolate with almonds'
      },
      {
        name: 'Gummy Bears',
        category: 'Candy',
        price: 2.49,
        quantity: 100,
        description: 'Assorted fruit flavored gummy bears'
      },
      {
        name: 'Butter Cookies',
        category: 'Biscuit',
        price: 3.99,
        quantity: 75,
        description: 'Traditional butter cookies'
      },
      {
        name: 'Red Velvet Cake',
        category: 'Cake',
        price: 12.99,
        quantity: 10,
        description: 'Moist red velvet cake with cream cheese frosting'
      },
      {
        name: 'Croissant',
        category: 'Pastry',
        price: 2.99,
        quantity: 30,
        description: 'Freshly baked buttery croissant'
      },
      {
        name: 'Vanilla Ice Cream',
        category: 'Ice Cream',
        price: 3.49,
        quantity: 40,
        description: 'Classic vanilla bean ice cream'
      },
      {
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 1.99,
        quantity: 60,
        description: 'Traditional Indian sweet in sugar syrup'
      },
      {
        name: 'Jelly Beans',
        category: 'Candy',
        price: 1.79,
        quantity: 0,
        description: 'Assorted flavored jelly beans'
      }
    ];

    await Sweet.insertMany(sweets);

    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@sweetshop.com');
    console.log('Password: admin123');
    console.log('\nCustomer credentials:');
    console.log('Email: customer@sweetshop.com');
    console.log('Password: customer123');
    console.log('\nTotal sweets created:', sweets.length);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();