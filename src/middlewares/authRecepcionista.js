const RecepRepo = require('../repositories/RecepcionistaRepository');

async function verificarRecepcionista(req, res, next) {
    try {
        const { id_recep } = req.body;

        if (!id_recep) {
            return res.status(400).json({ erro: "ID da recepcionista é obrigatório." });
        }
        
        const recepcionista = await RecepRepo.findById(id_recep);

        if (!recepcionista) {
            return res.status(403).json({ erro: "Recepcionista não encontrada." });
        }

        next();

    } catch (error) {
        return res.status(500).json({ erro: "Erro na validação: " + error.message });
    }
}

module.exports = verificarRecepcionista;