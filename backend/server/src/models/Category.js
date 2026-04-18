const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: { msg: 'Category name must be unique' },
    validate: {
      notEmpty: { msg: 'Category name cannot be empty' }
    }
  }
}, {
  tableName: 'categories'
});

module.exports = Category;