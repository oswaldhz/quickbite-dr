const { Cart, CartItem, MenuItem, Restaurant } = require('../models');
const AppError = require('../utils/AppError');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [{ model: MenuItem }]
      },
      { model: Restaurant }
    ]
  });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

const getCart = async (userId) => {
  return await getOrCreateCart(userId);
};

const addItemToCart = async (userId, menuItemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const menuItem = await MenuItem.findByPk(menuItemId);
  if (!menuItem) throw new AppError('Menu item not found', 404);
  if (!menuItem.available) throw new AppError('Menu item is not available', 400);

  // If cart already has a different restaurant, clear it
  if (cart.restaurantId && cart.restaurantId !== menuItem.restaurantId) {
    await CartItem.destroy({ where: { cartId: cart.id } });
    cart.restaurantId = menuItem.restaurantId;
    await cart.save();
  } else if (!cart.restaurantId) {
    cart.restaurantId = menuItem.restaurantId;
    await cart.save();
  }

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, menuItemId }
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    await CartItem.create({
      cartId: cart.id,
      menuItemId,
      quantity
    });
  }

  return await getCart(userId);
};

const updateCartItemQuantity = async (userId, menuItemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, menuItemId }
  });
  if (!cartItem) throw new AppError('Item not in cart', 404);

  if (quantity <= 0) {
    await cartItem.destroy();
  } else {
    cartItem.quantity = quantity;
    await cartItem.save();
  }

  const remainingItems = await CartItem.count({ where: { cartId: cart.id } });
  if (remainingItems === 0) {
    cart.restaurantId = null;
    await cart.save();
  }

  return await getCart(userId);
};

const removeItemFromCart = async (userId, menuItemId) => {
  const cart = await getOrCreateCart(userId);
  const deleted = await CartItem.destroy({
    where: { cartId: cart.id, menuItemId }
  });
  if (!deleted) throw new AppError('Item not found in cart', 404);

  const remainingItems = await CartItem.count({ where: { cartId: cart.id } });
  if (remainingItems === 0) {
    cart.restaurantId = null;
    await cart.save();
  }

  return await getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (cart) {
    await CartItem.destroy({ where: { cartId: cart.id } });
    cart.restaurantId = null;
    await cart.save();
  }
  return await getCart(userId);
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
};