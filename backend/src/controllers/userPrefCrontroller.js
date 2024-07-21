const { User_pref } = require('../sequelize/models');

class UserPrefController {
    static async getUserPref(req, res) {
        try {
            const userPref = await User_pref.findOne({ where: { UserId: req.params.userId } });
            if (!userPref) {
                return res.status(404).json({ error: 'User preferences not found' });
            }

            res.json({ userPref });
        } catch (error) {
            console.error('Erreur dans getUserPref :', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUserPref(req, res) {
        try {
            const userPref = await User_pref.findOne({ where: { UserId: req.params.userId } });
            if (!userPref) {
                return res.status(404).json({ error: 'User preferences not found' });
            }

            userPref.newProduct = req.body.newProduct;
            userPref.restockProduct = req.body.restockProduct;
            userPref.priceChange = req.body.priceChange;
            await userPref.save();
            res.json({ userPref });
        } catch (error) {
            console.error('Erreur dans updateUserPref :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserPrefController;