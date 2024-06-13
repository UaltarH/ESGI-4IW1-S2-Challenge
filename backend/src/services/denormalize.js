import { User } from '../models';  // Sequelize model
import UserMongo from '../models/userMongo';  // Mongoose model

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

export default denormalizeUsers;