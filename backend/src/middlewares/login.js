const { Router } = require('express');
const { User } = require('../sequelize/models');

const router = new Router();

router.post("/login", async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
        return res.status(401);
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

