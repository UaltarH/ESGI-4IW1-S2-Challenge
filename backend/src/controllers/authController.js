import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
// import { sendConfirmationEmail, sendResetPasswordEmail, sendAccountBlockedEmail } from './emailConfig.js';


export default class authController {

  static async register(req, res) {
    
      try {
        const { nom, prenom, email, email_cfg, password, password_cfg, telephone, role, haveConsented, wantsMailNewProduct, wantsMailRestockProduct, wantsMailChangingPrice, wantsMailNewsletter } = req.body;

        if (email !== email_cfg || password !== password_cfg) {
          return res.status(400).json({
            msg: "Les confirmations ne sont pas bonnes!"
          });
        }

        if (!email || !password || !nom || !prenom) {
          return res.status(400).json({ msg: "Il faut remplir tous les champs !" });
        }

        if (!isPasswordValid(password)) {
          return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, chiffres, lettres minuscules et majuscules." });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
          return res.status(400).json({ msg: "L'email existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = await User.create({
          nom,
          prenom,
          email,
          password: hashedPassword,
          telephone,
          role,
          haveConsented,
          isVerified: false,
          lastUpdatedPassword: new Date(),
          wantsMailNewProduct,
          wantsMailRestockProduct,
          wantsMailChangingPrice,
          wantsMailNewsletter,
        });

        // Generate confirmation token
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Send confirmation email
        await sendConfirmationEmail(newUser, token);

        res.status(201).json({ newUser, msg: "Utilisateur créé avec succès. Veuillez vérifier votre email pour confirmer votre compte." });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };


  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ msg: "Il faut remplir tous les champs !" });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'Account not verified. Please verify your account to log in.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = (password) => {
        const minLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      };

      const isPasswordExpired = (lastUpdatedPassword) => {
        const now = new Date();
        const diffInDays = Math.floor((now - lastUpdatedPassword) / (1000 * 60 * 60 * 24));
        return diffInDays >= 60;
      };

      if (isPasswordExpired(user.lastUpdatedPassword)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await sendResetPasswordEmail(user, token);
        return res.status(401).json({ message: 'Your password has expired. A reset link has been sent to your email.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };



  static confirmEmail = async (req, res) => {
    try {
      const { token } = req.params;

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ msg: 'Email déjà confirmé.' });
      }

      user.isVerified = true;
      await user.save();

      res.status(200).json({ msg: 'Email confirmé avec succès.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static checkPasswordExpiry = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (user && isPasswordExpired(user.lastUpdatedPassword)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        await sendResetPasswordEmail(user, token);
        return res.status(401).json({ message: 'Your password has expired. A reset link has been sent to your email.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
      }

      // Génération du tokenDemandesRGPD
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      // Envoi de l'email de réinitialisation
      await sendResetPasswordEmail(user, token);

      res.status(200).json({ msg: 'Email de réinitialisation envoyé.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password, password_cfg } = req.body;

      if (password !== password_cfg) {
        return res.status(400).json({ msg: 'Les mots de passe ne correspondent pas.' });
      }

      if (!isPasswordValid(password)) {
        return res.status(400).json({ msg: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, chiffres, lettres minuscules et majuscules.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
      }

      user.password = await bcrypt.hash(password, 5);
      user.lastUpdatedPassword = new Date();
      await user.save();

      res.status(200).json({ msg: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static resetPasswordPage = (req, res) => {
    const { token } = req.params;
    res.send(`
    <form action="/auth/reset-password/${token}" method="POST">
      <input type="hidden" name="token" value="${token}" />
      <label for="password">New Password:</label>
      <input type="password" id="password" name="password" required>
      <label for="password_cfg">Confirm New Password:</label>
      <input type="password" id="password_cfg" name="password_cfg" required>
      <button type="submit">Reset Password</button>
    </form>
  `);
  };

  static loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3,
    handler: async (req, res) => {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (user) {
        await sendAccountBlockedEmail(user);
      }

      res.status(429).json({
        message: "Trop de tentatives de connexion. Votre compte est temporairement bloqué et sera débloqué dans 10 minutes."
      });
    }
  });
}