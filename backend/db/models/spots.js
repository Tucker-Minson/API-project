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
      Spot.belongsTo(models.User, {foreignKey: "userId"})
      
      Spot.hasMany(models.Image, {foreignKey: "spotId"})
    }
  }
  Spot.init({
    userId: {
      type:DataTypes.INTEGER,
      unique: true,
      onDelete: "CASCADE"
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
      type:DataTypes.INTEGER,
    },
    lng: {
      type:DataTypes.INTEGER,
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
