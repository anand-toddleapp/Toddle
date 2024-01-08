const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/index.js');
const resolver = require('./resolver/index.js');
const isAuth = require('./middleware/is-auth');
// const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const mongoose = require("mongoose")
const app = express();
 
mongoose.connect(`mongodb+srv://kali:kali@cluster0.msujdem.mongodb.net/booking?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(port, console.log(`Server running on port ${port}`));
})
.catch((err)=>
{
    console.log(err);
}
)
app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      rootValue: resolver,
      graphiql: true
    })
  );
  