const bcrypt = require('bcryptjs');
const Event = require('../models/event.js');
const User = require('../models/user.js');
const Booking = require('../models/booking.js');

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map((event) => ({
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }));
    } catch (err) {
        throw err;
    }
};
const singleEvent = async (eventId) =>{
    try{
        const event = await Event.findById(eventId)

        return {
            ...event._doc,
            _id: event._doc.id,
            creator: user.bind(this, event.creator)
        }
    }catch(err){
        throw err;
    }
}
const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const eventsList = await Event.find();
            return eventsList.map((event) => ({
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event._doc.creator)
            }));
        } catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
          const bookings = await Booking.find();
          return bookings.map(booking => {
            return {
              ...booking._doc,
              _id: booking.id,
              user: user.bind(this, booking._doc.user),
              event: singleEvent.bind(this, booking._doc.event),
              createdAt: new Date(booking._doc.createdAt).toISOString(),
              updatedAt: new Date(booking._doc.updatedAt).toISOString()
            };
          });
        } catch (err) {
          throw err;
        }
      },

    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '6597a152c33233400c96416f'
        });

        let temp;

        try {
            const result = await event.save();
            console.log(result);
            temp = {
                ...result._doc,
                _id: result._doc._id.toString(),
                creator: user.bind(this, result._doc.creator)
            };

            const userResult = await User.findById(result._doc.creator);
            if (!userResult) {
                throw new Error("User doesn't already exist");
            }

            userResult.createdEvents.push(event);
            await userResult.save();

            return temp;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();
            console.log(result);
            return {
                ...result._doc,
                _id: result._doc._id.toString()
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
          user: '6597a152c33233400c96416f',
          event: fetchedEvent
        });
        const result = await booking.save();
        return {
          ...result._doc,
          _id: result.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
      },
      cancelBooking: async args => {
        try {
          const booking = await Booking.findById(args.bookingId).populate('event');
          const event = {
            ...booking.event._doc,
            _id: booking.event.id,
            creator: user.bind(this, booking.event._doc.creator)
          };
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      }
};
