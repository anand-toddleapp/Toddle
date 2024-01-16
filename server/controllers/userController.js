const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: 'User exists already.' });
      }

      const [userId] = await User.createUser(email, password);

      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ userId, token, tokenExpiration: 1 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findUserByEmail(email);

      if (!user) {
        return res.status(400).json({ message: 'User does not exist!' });
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        return res.status(401).json({ message: 'Password is incorrect!' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ userId: user.id, token, tokenExpiration: 1 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
