const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lms_key_123';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const { users } = require('../data/store');
      const user = users.find(u => u._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = { ...user };
      delete req.user.password;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

module.exports = { protect, generateToken };
