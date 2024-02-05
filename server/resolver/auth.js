const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {createUser, findUserByEmail} = require("../models/user");

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await findUserByEmail(args.userInput.email)
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const user = await createUser(args.userInput.email, args.userInput.password);
      console.log(user);
      return { _id: user[0].id, password: null };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        throw new Error('User does not exist!');
      }
      console.log(password, user.password);
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'somesupersecretkey',
        {
          expiresIn: '1h'
        }
      );
      return { userId: user.id, token, tokenExpiration: 1 };
    } catch (error) {
      throw error;
    }
  },
};

