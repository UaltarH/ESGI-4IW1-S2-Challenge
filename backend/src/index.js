import {authRouter, indexRouter, userRouter} from "./routes/index.js";
import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);


#!/usr/bin/env node
import {sequelize} from "./config/db.js";
import app from './app.js';

// Synchronisation de toutes les tables
await sequelize.sync({ force: true });
console.log('All models were synchronized successfully.');

import debug from 'debug';
debug('api:server');

import http from 'http';


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);


/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server HTTP node listening on http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}