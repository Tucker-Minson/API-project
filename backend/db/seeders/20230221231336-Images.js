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
      {spotId:1, url: 'its a picture', preview:false},
      {spotId:2, url: 'its a picture', preview:false},
      {spotId:3, url: 'its a picture', preview:false},
      {spotId:4, url: 'its a picture', preview:false},
      {spotId:5, url: 'its a picture', preview:false},
      {spotId:6, url: 'its a picture', preview:false},

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
