'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Images';
    return queryInterface.bulkInsert(options, [
      {spotId:1, preview:false},
      {spotId:1, preview:false},
      {spotId:2, preview:false},
      {spotId:2, preview:false},
      {spotId:3, preview:false},
      {spotId:3, preview:false},
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
