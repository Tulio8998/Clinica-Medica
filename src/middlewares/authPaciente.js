const PacienteRepo = require('../repositories/PacienteRepository');

async function verificarPaciente(req, res, next) {
    try {
        const { id_paci } = req.body;
        if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });
        
        const paciente = await PacienteRepo.findById(id_paci);
        if (!paciente) return res.status(403).json({ erro: "Paciente não encontrado." });

        next();
    } catch (error) {
        return res.status(500).json({ erro: "Erro validação: " + error.message });
    }
}
module.exports = verificarPaciente;