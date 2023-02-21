'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {userId:1, spotId:1, review: "This spot is awesome!", stars:5},
      {userId:2, spotId:1,review: "ehh this place was overhyped... good food though", stars:3.5},
      {userId:3, spotId:1, review: "I think I could stay here forever", stars:5},
      {userId:1, spotId:2, review: "is this a bar? or is it a grill", stars:3},
      {userId:2, spotId:2, review: "going back for trivia night", stars:5},
      {userId:3, spotId:2, review: "I think I could stay here forever", stars:5},

  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};
