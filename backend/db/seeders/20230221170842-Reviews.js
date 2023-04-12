'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {userId:1, spotId:1, review: "It is definatly a place", stars:3},
      {userId:2, spotId:1,review:  "Wish the cookies were better", stars:3.5},
      {userId:3, spotId:1, review: "I don't remember a thing", stars:5},
      {userId:4, spotId:1, review: "Met my wife here", stars:5},
      {userId:5, spotId:1, review: "Met some creepy here", stars:2.5},

      {userId:1, spotId:2, review: "Came for the bars, stayed for the Scares", stars:5},
      {userId:2, spotId:2, review: "Smells like pee", stars:2},
      {userId:3, spotId:2, review: "Heard the food was good, that was a LIE", stars:2},
      {userId:4, spotId:2, review: "If I could give more stars I would", stars:5},
      {userId:5, spotId:2, review: "random review here", stars:5},

      {userId:1, spotId:3, review: "only like 20 min from my house, but still should have stayed home", stars:3},
      {userId:2, spotId:3, review: "Traffic was crazy, But the tickets where cheap", stars:5},
      {userId:3, spotId:3, review: "HELLO", stars:3.5},
      {userId:4, spotId:3, review: "This is another Review", stars:3},
      {userId:5, spotId:3, review: "Is this a waste of time? Probably", stars:4.5},

      {userId:1, spotId:4, review: "This are Most definitley words!", stars:4},
      {userId:2, spotId:4, review: "food was bad, was sick the whole time", stars:1},
      {userId:3, spotId:4, review: "Think I saw something spooky", stars:5},
      {userId:4, spotId:4, review: "My kids dragged me here, the Ghost dragged them away", stars:5},
      {userId:5, spotId:4, review: "dropped and broke my phone", stars:1.5},

      {userId:1, spotId:5, review: "Didn't see any bodies", stars:2},
      {userId:2, spotId:5, review: "Southern food beats all", stars:5},
      {userId:3, spotId:5, review: "Went with my conservative uncle, it got really weird", stars:1},
      {userId:4, spotId:5, review: "long walk", stars:1},
      {userId:5, spotId:5, review: "Slept overnight, The civil war actors didn't like it. Not sure whay they were there after midnight...", stars:5},

      {userId:1, spotId:6, review: "Strange amount of Black cats", stars:5},
      {userId:2, spotId:6, review: "Delicious BBQ", stars:5},
      {userId:3, spotId:6, review: "Felt like I was being watched", stars:2},
      {userId:4, spotId:6, review: "ruined my Honeymoon", stars:1},
      {userId:5, spotId:6, review: "Came for a day stayed for a week!", stars:5},

  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};
