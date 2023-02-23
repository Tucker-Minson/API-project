'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {foreignKey: "userId", as: 'ownerId'})

      Spot.hasMany(models.Review, {foreignKey: "spotId"})
      Spot.hasMany(models.Image, {foreignKey: "spotId"})
      Spot.hasMany(models.Booking, {foreignKey: "spotId"})
    }
  }
  Spot.init({
    userId: {
      type:DataTypes.INTEGER,
    },
    address: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type:DataTypes.STRING,
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false,

    },
    lat: {
      type:DataTypes.FLOAT,
    },
    lng: {
      type:DataTypes.FLOAT,
    },
    name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    avgRating: {
      type:DataTypes.INTEGER,
    },
    previewImage: {
      type:DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
