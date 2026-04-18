const adminService = require('../services/admin.service');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getAllRestaurantsAdmin = async (req, res, next) => {
  try {
    const restaurants = await adminService.getAllRestaurantsAdmin(req.query);
    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsersAdmin();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.userId, role);
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllRestaurantsAdmin,
  getAllUsersAdmin,
  updateUserRole
};