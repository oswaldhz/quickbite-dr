const { MenuItem, Restaurant, Category } = require('../models');
const AppError = require('../utils/AppError');

const createMenuItem = async (data) => {
  // Verify restaurant exists
  const restaurant = await Restaurant.findByPk(data.restaurantId);
  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  // Verify category if provided
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
  }

  const menuItem = await MenuItem.create(data);
  return menuItem;
};

const getMenuItemsByRestaurant = async (restaurantId) => {
  const items = await MenuItem.findAll({
    where: { restaurantId },
    include: [{ model: Category, as: 'category' }],
    order: [['name', 'ASC']]
  });
  return items;
};

const updateMenuItem = async (id, data) => {
  const menuItem = await MenuItem.findByPk(id);
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  // If changing category, verify it exists
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
  }

  await menuItem.update(data);
  return menuItem;
};

const deleteMenuItem = async (id) => {
  const menuItem = await MenuItem.findByPk(id);
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  await menuItem.destroy();
  return { message: 'Menu item deleted successfully' };
};

module.exports = {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem
};