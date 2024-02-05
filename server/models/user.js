// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   createdEvents: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'Event'
//     }
//   ]
// });

// module.exports = mongoose.model('User', userSchema);

const knex = require('../config/knexfile');
const bcrypt = require('bcryptjs');

module.exports = {
  async createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return knex('users').insert({ email, password: hashedPassword }).returning('id');
  },

  async findUserByEmail(email) {
    return knex('users').where('email', email).first();
  },
  async findUserById(id) {
    return knex('users').where('id', id).first();
  }
};
