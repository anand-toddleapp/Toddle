// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const bookingSchema = new Schema(
//   {
//     event: {
//       type: Schema.Types.ObjectId,
//       ref: 'Event'
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Booking', bookingSchema);

const knex = require('../config/knexfile');

module.exports = {
  async findBookings() {
    return knex('bookings').select('*');
  },

  async createBooking(userId, eventId) {
    return knex('bookings').insert({ user_id: userId, event_id: eventId }).returning('*');
  },

  async deleteBooking(bookingId) {
    return knex('bookings').where('id', bookingId).del();
  },

   async getBookingWithEvent (bookingId) {
    try {
      const booking = await knex('bookings')
        .where('bookings.id', bookingId)
        .leftJoin('events', 'bookings.event_id', 'events.id')
        .select('events.*')
        .first();
  
      return booking; 
    } catch (error) {
      throw new Error(`Error fetching booking with event: ${error.message}`);
    }
  },
};
