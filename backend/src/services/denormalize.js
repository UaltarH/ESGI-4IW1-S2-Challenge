// const User  = require('../models');  // Sequelize model
// const UserMongo = require('../models/userMongo');  // Mongoose model

const denormalizeUsers = async () => {
  try {
    const users = await User.findAll();
    const usersMongo = users.map(user => ({
      name: user.name,
      email: user.email,
      // map other fields as needed
    }));
    await UserMongo.insertMany(usersMongo);
    console.log('Users denormalized to MongoDB');
  } catch (error) {
    console.error('Error denormalizing users:', error);
  }
};

module.exports = denormalizeUsers;