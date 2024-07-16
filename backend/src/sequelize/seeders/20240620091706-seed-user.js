const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { faker, de } = require("@faker-js/faker");

let userIds = [];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const numOfUsers = 15;

    for (let i = 0; i < numOfUsers; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const password = await bcrypt.hash("test", 10);
      const address = faker.location.streetAddress();
      const city = faker.location.city();
      const zipcode = Number(faker.location.zipCode("#####"));
      const phone = faker.phone.number();
      const birthdate = faker.date.birthdate();
      const country = faker.location.country();
      let role;
      if (i === 0) {
        role = "admin";
      }
      else if (i === 2) {
        role = "store_manager";
      } else if (i === 3) {
        role = "accountant";
      } else {
        role = "user";
      }

      const userId = uuidv4();
      userIds.push(userId);

      users.push({
        id: userId,
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        address: address,
        city: city,
        zipcode: zipcode,
        phone: phone,
        birthdate: birthdate,
        role: role,
        createdAt: new Date(),
        updatedAt: new Date(),
        country: country,
      });
    }

    return queryInterface.bulkInsert("User", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User", null, {});
  },
};

module.exports.userIds = userIds;
