import User from '../models/user.js';
import Product from '../models/product.js';

export default class UserController {
  static async register(req, res) {
    try {
      // Créer un nouvel utilisateur en base de données
      const firstname = req.query.firstName;
      const email = req.query.email;
      const lastname = req.query.lastName;
      // const password = req.query.password;
      const newUser = await User.create({
        firstName: firstname,
        email: email,
        lastName: lastname,
        password: password
      });
      res.json(newUser); // Renvoyer les données de l'utilisateur créé en réponse
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur' });
    }
  };
  static login(req, res) {
    try {
      // Trouver l'utilisateur en base de données
      const user = async () => await Product.findOne({
        where: {
          email: email,
          password: password
        }
      });

      res.json(user); // Renvoyer les données de l'utilisateur trouvé en réponse
    } catch (error) {
      console.error('Erreur lors de la connexion de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la connexion de l\'utilisateur' });
    }
  }
}
