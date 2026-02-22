const AgendamentoRepo = require('../../repositories/AgendamentoRepository');

module.exports = {
    async list(req, res) {
        try {
            const agendamentos = await AgendamentoRepo.findPendentes();

            // Retorna os agendamentos direto (se estiver vazio, retorna [], o que não quebra o frontend)
            res.status(200).json(agendamentos);
            
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}