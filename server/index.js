const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/index.js');
const resolver = require('./resolver/index.js');
const isAuth = require('./middleware/is-auth');
const knex = require('./config/knexfile.js'); // Import Knex instance
require("dotenv").config();

const port = 5000;

const startServer = async () => {
  try {
    // Connect to the PostgreSQL database
    await knex.raw('SELECT 1');
    console.log('Connected to PostgreSQL database');

    // Initialize Express application
    const app = express();

    app.use(isAuth);
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });

    app.use(
      '/graphql',
      graphqlHTTP({
        schema: schema,
        rootValue: resolver,
        graphiql: true,
      })
    );

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
    process.exit(1); // Exit the application if unable to connect to the database
  }
};

// Call the async function to start the server after connecting to the database
startServer();
