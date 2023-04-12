'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      }, {
        ownerId: 2,
        address: "624 Pirates Alley",
        city: "New Orleans",
        state: "Louisiana",
        country: "United States of America",
        lat: 29.95849,
        lng: -90.06421,
        name: "Faulkner House Books",
        description: "Haunted House turned into a book store",
        price: 25
      }, {
        ownerId: 3,
        address: "120 NW 3rd Ave",
        city: "Portland",
        state: "Oregon",
        country: "United States of America",
        lat: 45.52522,
        lng: -122.67111,
        name: "Haunted Shanghai Tunnel",
        description: "Haunted tunnels beneath",
        price: 40
      },  {
        ownerId: 4,
        address: "333 E Wonderview Ave",
        city: "Estes Park",
        state: "Colorado",
        country: "United States of America",
        lat:40.38334,
        lng:-105.51896,
        name: "The Stanley Hotel",
        description: "Real hotel that Was the Inspariation of Stephen King's 'The Shining'",
        price: 55
      },  {
        ownerId: 5,
        address: "219 Baltimore St",
        city: "Gettysburg",
        state: "Pennsylvania",
        country: "United States of America",
        lat: 39.82817,
        lng: -77.23118,
        name: "Gettysburg Ghost Walk",
        description: "Location of one of the Bloodies battles in American history",
        price: 15
      },  {
        ownerId: 5,
        address: "51 Charter St",
        city: "Salem",
        state: "Massachusetts ",
        country: "United States of America",
        lat: 42.52091,
        lng: -70.89129,
        name: "Salem Witch Village",
        description: "Location of the Salem Witch trials",
        price: 101
      },
], {});

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};
