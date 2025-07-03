const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

function authorizeRoles(...roles) {
  return (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Non authentifié" });

    try {
      const decoded = jwt.verify(token, SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
}

module.exports = authorizeRoles;