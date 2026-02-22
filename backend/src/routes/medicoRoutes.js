const { Router } = require('express');
const MedicoController = require('../controllers/MedicoController/MedicoController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authRecepcionista');
const routes = new Router();

routes.post('/medicos', auth, authRecep, MedicoController.create);
routes.get('/medicos', auth, MedicoController.list);
routes.get('/medicos/buscar', auth, MedicoController.select);
routes.put('/medicos', auth, authRecep, MedicoController.update);
routes.delete('/medicos', auth, authRecep, MedicoController.delete);

module.exports = routes;