const verifyToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;