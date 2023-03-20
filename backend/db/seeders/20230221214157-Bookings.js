'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {spotId:1,userId:1,startDate:'2023-05-10',endDate:'2023-05-12',},
      {spotId:2,userId:1,startDate:'2023-05-14',endDate:'2023-05-16',},
      {spotId:3,userId:1,startDate:'2023-05-18',endDate:'2023-05-20',},
      {spotId:1,userId:2,startDate:'2023-05-02',endDate:'2023-05-04',},
      {spotId:2,userId:2,startDate:'2023-05-06',endDate:'2023-05-08',},
      {spotId:3,userId:2,startDate:'2023-05-10',endDate:'2023-05-12',},
      {spotId:1,userId:3,startDate:'2023-04-01',endDate:'2023-04-05',},
      {spotId:2,userId:3,startDate:'2023-04-06',endDate:'2023-04-10',},
      {spotId:3,userId:3,startDate:'2023-04-15',endDate:'2023-04-20',},
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
