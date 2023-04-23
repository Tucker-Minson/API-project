'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Spot, {foreignKey: "spotId"})
      Image.belongsTo(models.Review, {foreignKey: "reviewId"})
    }
  }
  Image.init({
    spotId: {
      type:DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    reviewId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    url: {
      type: DataTypes.STRING
    },
    preview: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
