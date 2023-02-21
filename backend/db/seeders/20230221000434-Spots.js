'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {address: "123 Disney Lane",
      city: "San Francisco",
      state: "California",
      country: "United States of America",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123
      }, {
        address: "1034 main Street",
        city: "Tigard",
        state: "Oregon",
        country: "United States of America",
        name: "Copper Mountain brewery",
        description: "bar and grill",
        price: 25
      }, {
        address: "10450 Oak Mountain trail",
        city: "Birmingham",
        state: "Alabama",
        country: "United States of America",
        name: "Oak Mountain State Park",
        description: "State Park",
        price: 10
      },
], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};
