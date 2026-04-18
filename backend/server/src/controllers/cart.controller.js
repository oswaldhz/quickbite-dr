const cartService = require('../services/cart.service');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const cart = await cartService.addItemToCart(req.user.id, menuItemId, quantity || 1);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(req.user.id, parseInt(menuItemId), quantity);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user.id, parseInt(menuItemId));
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};