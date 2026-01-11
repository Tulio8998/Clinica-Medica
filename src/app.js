const express = require('express');
const pacienteRoutes = require('./routes/pacienteRoutes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(pacienteRoutes);
  }
}

module.exports = new App().server;