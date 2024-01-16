const {findBookings, createBooking, getBookingWithEvent, deleteBooking} = require("../models/booking");
const { getEventById } = require("../models/event");

const {transformBooking, transformEvent } = require('./merge');


module.exports = {
    bookings: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      try {
        const bookings = await findBookings();
        console.log(bookings);

        return bookings.map(booking => {
          return transformBooking(booking);
        });
      } catch (err) {
        throw err;
      }
    },
    bookEvent: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const result = await createBooking(req.userId, args.eventId)
      console.log(result);
      return transformBooking(result[0]);
    },
    cancelBooking: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      try {
        const event = await getBookingWithEvent(args.bookingId);
        console.log(event)
        const fetchevent = transformEvent(event);
        await deleteBooking(args.bookingId);
        return fetchevent;
      } catch (err) {
        throw err;
      }
    }
  };