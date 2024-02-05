
const knex = require('../config/knexfile');

module.exports = {
  async findEvents() {
    return knex('events').select('*');
  },

  async createEvent(eventInput, userId) {
    return knex('events').insert({
      title: eventInput.title,
      description: eventInput.description,
      price: eventInput.price,
      date: eventInput.date,
      creator_id: userId,
    }).returning('*');
  },
  async getEventById(eventId) {
      return await knex('events').where('id', eventId);
  },
  async getEventsByUserId(userId) {
    return await knex('events').where('creator_id', userId);
},
  async getEventsByIds(eventIds){
    return await knex('events').whereIn('id', eventIds)
  }
};