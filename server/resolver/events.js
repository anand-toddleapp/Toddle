const {findEvents, createEvent} = require("../models/event")
const {findUserById} = require('../models/user');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await findEvents();
      console.log(events);
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    
    let createdEvent;
    try {
      const creator = await findUserById(req.userId);
      
      if (!creator) {
        throw new Error('User not found.');
      }
      
      const result = await createEvent(args.eventInput, req.userId)
      createdEvent = transformEvent(result[0]);
      console.log(createdEvent);
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};