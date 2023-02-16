'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    },options);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', "firstName");
  }
};
