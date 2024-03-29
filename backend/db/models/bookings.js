'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot, {foreignKey: "spotId"})
      Booking.belongsTo(models.User, {foreignKey: "userId"})
    }
  }
  Booking.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      onDelete: 'CASCADE'

    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull: false,

    },
    startDate: {
      type:DataTypes.STRING,
      allowNull:false,
      // validate: {
      //   isDate: true,
      // }
    },
    endDate: {
      type:DataTypes.STRING,
      allowNull:false,
      // validate: {
      //   isDate:true,
      //   endDateIsAfterStartDate() {
      //     if (this.startDate.isAfter(this.endDate)){
      //       throw new Error("Start date must be before end date.")
      //     }
      //   }
      // }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
