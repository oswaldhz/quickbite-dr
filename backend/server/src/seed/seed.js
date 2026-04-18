require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, Restaurant, Category, MenuItem } = require('../models');
const logger = require('../utils/logger');

const seed = async () => {
  try {
    // Sync database (force recreate)
    await sequelize.sync({ force: true });
    logger.info('Database synced');

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Burgers' },
      { name: 'Pizza' },
      { name: 'Sushi' },
      { name: 'Drinks' },
      { name: 'Desserts' }
    ]);
    logger.info(`Created ${categories.length} categories`);

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@quickbite.com',
      password: 'admin123',
      role: 'admin'
    });

    const owner1 = await User.create({
      name: 'John Owner',
      email: 'owner1@quickbite.com',
      password: 'owner123',
      role: 'restaurant_owner'
    });

    const owner2 = await User.create({
      name: 'Jane Owner',
      email: 'owner2@quickbite.com',
      password: 'owner123',
      role: 'restaurant_owner'
    });

    const customer = await User.create({
      name: 'Alice Customer',
      email: 'customer@quickbite.com',
      password: 'customer123',
      role: 'customer'
    });

    logger.info('Users created');

    // Create restaurants
    const restaurant1 = await Restaurant.create({
      name: 'Burger Haven',
      photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      address: '123 Main St, Santo Domingo',
      cuisineType: 'American',
      status: 'approved',
      ownerId: owner1.id
    });

    const restaurant2 = await Restaurant.create({
      name: 'Sushi World',
      photoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
      address: '456 Ocean Ave, Santo Domingo',
      cuisineType: 'Japanese',
      status: 'approved',
      ownerId: owner2.id
    });

    const restaurant3 = await Restaurant.create({
      name: 'Pizza Palace',
      photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
      address: '789 Pizza Lane, Santo Domingo',
      cuisineType: 'Italian',
      status: 'pending',
      ownerId: owner1.id
    });

    logger.info('Restaurants created');

    // Create menu items for Burger Haven
    await MenuItem.bulkCreate([
      {
        name: 'Classic Cheeseburger',
        description: 'Angus beef patty with cheddar cheese, lettuce, tomato, and special sauce',
        price: 450.00,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        available: true,
        restaurantId: restaurant1.id,
        categoryId: categories[0].id // Burgers
      },
      {
        name: 'Bacon Deluxe',
        description: 'Beef patty with crispy bacon, American cheese, and BBQ sauce',
        price: 550.00,
        imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
        available: true,
        restaurantId: restaurant1.id,
        categoryId: categories[0].id
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with avocado, sprouts, and vegan mayo',
        price: 480.00,
        available: true,
        restaurantId: restaurant1.id,
        categoryId: categories[0].id
      },
      {
        name: 'Coca-Cola',
        description: '500ml bottle',
        price: 100.00,
        available: true,
        restaurantId: restaurant1.id,
        categoryId: categories[3].id // Drinks
      }
    ]);

    // Create menu items for Sushi World
    await MenuItem.bulkCreate([
      {
        name: 'California Roll',
        description: 'Crab, avocado, cucumber',
        price: 380.00,
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
        available: true,
        restaurantId: restaurant2.id,
        categoryId: categories[2].id // Sushi
      },
      {
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 320.00,
        available: true,
        restaurantId: restaurant2.id,
        categoryId: categories[2].id
      },
      {
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu and seaweed',
        price: 150.00,
        available: true,
        restaurantId: restaurant2.id,
        categoryId: categories[3].id
      }
    ]);

    logger.info('Menu items created');
    logger.info('Seeding completed successfully');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();