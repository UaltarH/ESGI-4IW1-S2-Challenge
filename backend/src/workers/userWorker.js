const { userQueue } = require('../config/queueBullConfig');
const { User } = require('../sequelize/models');

userQueue.process(async (job) => {
    const { userId } = job.data;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            console.log(`User ${userId} not found or already processed`);
            return;
        }

        if (!user.is_verified) {
            await user.destroy();
            console.log(`User ${userId} account deleted due to lack of confirmation`);
        } else {
            console.log(`User ${userId} has confirmed their account`);
        }
    } catch (error) {
        console.error('Error processing user confirmation expiration:', error);
    }
});