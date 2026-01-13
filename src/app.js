const express = require('express');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const enfermeiroRoutes = require('./routes/enfermeiroRoutes');
const recepcionistaRoutes = require('./routes/recepcionistaRoutes');
const agendamentoRoutes =  require('./routes/agendamentoRoutes')
const authRoutes = require('./routes/authRoutes');
const triagemRoutes =  require('./routes/triagemRoutes')

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
    this.server.use(medicoRoutes);
    this.server.use(enfermeiroRoutes);
    this.server.use(recepcionistaRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(authRoutes);
    this.server.use(triagemRoutes);
  }
}

module.exports = new App().server;