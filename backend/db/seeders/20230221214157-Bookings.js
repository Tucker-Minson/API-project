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
      {spotId:1,userId:1,startDate:'2023-04-10',endDate:'2023-04-11',},
      {spotId:1,userId:2,startDate:'2023-04-12',endDate:'2023-04-13',},
      {spotId:1,userId:3,startDate:'2023-04-14',endDate:'2023-04-15',},
      {spotId:1,userId:4,startDate:'2023-04-16',endDate:'2023-04-17',},
      {spotId:1,userId:5,startDate:'2023-04-18',endDate:'2023-04-19',},

      {spotId:2,userId:1,startDate:'2023-05-10',endDate:'2023-05-11',},
      {spotId:2,userId:2,startDate:'2023-05-12',endDate:'2023-05-13',},
      {spotId:2,userId:3,startDate:'2023-05-14',endDate:'2023-05-15',},
      {spotId:2,userId:4,startDate:'2023-05-16',endDate:'2023-05-17',},
      {spotId:2,userId:5,startDate:'2023-05-18',endDate:'2023-05-19',},

      {spotId:3,userId:1,startDate:'2023-06-10',endDate:'2023-06-11',},
      {spotId:3,userId:2,startDate:'2023-06-12',endDate:'2023-06-13',},
      {spotId:3,userId:3,startDate:'2023-06-14',endDate:'2023-06-15',},
      {spotId:3,userId:4,startDate:'2023-06-16',endDate:'2023-06-17',},
      {spotId:3,userId:5,startDate:'2023-06-18',endDate:'2023-06-19',},

      {spotId:4,userId:1,startDate:'2023-07-10',endDate:'2023-07-11',},
      {spotId:4,userId:2,startDate:'2023-07-12',endDate:'2023-07-13',},
      {spotId:4,userId:3,startDate:'2023-07-14',endDate:'2023-07-15',},
      {spotId:4,userId:4,startDate:'2023-07-16',endDate:'2023-07-17',},
      {spotId:4,userId:5,startDate:'2023-07-18',endDate:'2023-07-19',},

      {spotId:5,userId:1,startDate:'2023-08-10',endDate:'2023-08-11',},
      {spotId:5,userId:2,startDate:'2023-08-12',endDate:'2023-08-13',},
      {spotId:5,userId:3,startDate:'2023-08-14',endDate:'2023-08-15',},
      {spotId:5,userId:4,startDate:'2023-08-16',endDate:'2023-08-17',},
      {spotId:5,userId:5,startDate:'2023-08-18',endDate:'2023-08-19',},

      {spotId:6,userId:1,startDate:'2023-09-10',endDate:'2023-09-11',},
      {spotId:6,userId:2,startDate:'2023-09-12',endDate:'2023-09-13',},
      {spotId:6,userId:3,startDate:'2023-09-14',endDate:'2023-09-15',},
      {spotId:6,userId:4,startDate:'2023-09-16',endDate:'2023-09-17',},
      {spotId:6,userId:5,startDate:'2023-09-18',endDate:'2023-09-19',},


    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
