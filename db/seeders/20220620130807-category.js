'use strict';

const categories = [
  {
    name: "Hoby"
  },
  {
    name: "Kendaraan"
  },
  {
    name: "Baju"
  },
  {
    name: "Elektronik"
  },
  {
    name: "Kesehatan"
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const timestamp = new Date()

    const data = categories.map((category) => ({
      name: category.name,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await queryInterface.bulkInsert("categories", data, {})

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("categories", null, {})
  }
};
