const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require("./utils/auth");
const path = require('path');

const { typeDefs, resolvers } = require("./schemas");
const db = require('./config/connection');
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/')));
}
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`));
});
};

startApolloServer(typeDefs, resolvers);