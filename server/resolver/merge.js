const DataLoader = require('dataloader');
const { getEventsByIds, getEventById, getEventsByUserId } = require('../models/event');
const { findUserById } = require('../models/user');
const { dateToString } = require('../helpers/date');

// DataLoader instances
const eventLoader = new DataLoader(eventIds => getEventsByIds(eventIds));
const userLoader = new DataLoader(userIds => Promise.all(userIds.map(id => findUserById(id))));

const events = async (userId) => {
  try {
    const events = await getEventsByUserId(userId);
    console.log(events);
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await getEventById(eventId);
    return transformEvent(event[0]);
  } catch (err) {
    throw err;
  }
}; 
//test
const user = async (userId) => {
  try {
    const user = await userLoader.load(userId);
    return {
      _id: user.id,
      email: user.email,
      password: null,
      createdEvents: () => events(user.id)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => ({
  _id: event.id,
  title: event.title,
  description: event.description,
  price: event.price,
  date: dateToString(event.date),
  creator: ()=> user(event.creator_id),
});

const transformBooking = (booking) => ({
  _id: booking.id,
  user: () => user(booking.user_id),
  event: () => singleEvent(booking.event_id),
  createdAt: dateToString(booking.created_at),
  updatedAt: dateToString(booking.updated_at),
});

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
