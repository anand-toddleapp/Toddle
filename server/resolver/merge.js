const DataLoader = require('dataloader');
const Event = require('../models/event');
const User = require('../models/user');
const { dateToString } = require('../helpers/date');

const eventLoader = new DataLoader(eventIds => events(eventIds));
const userLoader = new DataLoader(userIds => User.find({ _id: { $in: userIds } }));

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  creator: async () => user(event.creator),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  _id: booking.id,
  user: async () => user(booking._doc.user),
  event: async () => singleEvent(booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
