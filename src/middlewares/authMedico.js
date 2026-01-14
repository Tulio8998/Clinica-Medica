const MedicoRepo = require('../repositories/MedicoRepository');

async function verificarMedico(req, res, next) {
    try {
        const { id_medic } = req.body;
        if (!id_medic) return res.status(400).json({ erro: "ID do médico é obrigatório." });
        
        const medico = await MedicoRepo.findById(id_medic);
        if (!medico) return res.status(403).json({ erro: "Médico não encontrado." });

        next();
    } catch (error) {
        return res.status(500).json({ erro: "Erro validação: " + error.message });
    }
}
module.exports = verificarMedico;