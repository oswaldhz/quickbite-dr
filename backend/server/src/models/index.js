const sequelize = require('../config/db');
const User = require('./User');
const Restaurant = require('./Restaurant');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');

// User - Restaurant (owner)
User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'restaurants', onDelete: 'CASCADE' });
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Restaurant - MenuItem
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems', onDelete: 'CASCADE' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Category - MenuItem
Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'menuItems', onDelete: 'SET NULL' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User - Order (customer)
User.hasMany(Order, { foreignKey: 'customerId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Restaurant - Order
Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// MenuItem - OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId', as: 'orderItems', onDelete: 'RESTRICT' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

// User - Cart (one-to-one)
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Cart - Restaurant
Cart.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Cart, { foreignKey: 'restaurantId' });

// Cart - CartItem (one-to-many)
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// MenuItem - CartItem
MenuItem.hasMany(CartItem, { foreignKey: 'menuItemId' });
CartItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Category,
  MenuItem,
  Order,
  OrderItem,
  Cart,
  CartItem
};