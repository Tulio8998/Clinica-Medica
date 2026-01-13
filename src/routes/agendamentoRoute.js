const { Router } = require('express');
const agendamentoController = require('../controllers/RecepcionistaController/RecepcionistaAgendamentoController');
const medicoController = require('../controllers/MedicoController/MedicoAgendamentoController');
const authRecep = require('../middlewares/authRecepcionista');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/agendamento/recepcionista', authRecep, agendamentoController.create);
routes.get('/agendamento/recepcionista', agendamentoController.list);
routes.get('/agendamento/recepcionista/buscar', agendamentoController.select);
routes.put('/agendamento/recepcionista', authRecep, agendamentoController.update);
routes.delete('/agendamento/recepcionista', agendamentoController.delete);


routes.get('/agendamento/medico', medicoController.list);
routes.get('/agendamento/medico/buscar', medicoController.select);
routes.put('/agendamento/medico', authMedic, medicoController.update);



module.exports = routes;