const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Restaurant name cannot be empty' }
    }
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: 'Photo URL must be a valid URL' }
    }
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Address cannot be empty' }
    }
  },
  cuisineType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Cuisine type cannot be empty' }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'suspended'),
    allowNull: false,
    defaultValue: 'pending'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'restaurants'
});

module.exports = Restaurant;