const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { faker, de } = require("@faker-js/faker");

let userIds = [];

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

let boolean = [true, false];

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
      const token = uuidv4();
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
        country: "France",
        verification_token: token,
        token_expiration: new Date(Date.now() + 3600000),
        is_verified: boolean[getRandomIntInclusive(0, 1)]
      });
    }

    return queryInterface.bulkInsert("User", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User", null, {});
  },
};

module.exports.userIds = userIds;
