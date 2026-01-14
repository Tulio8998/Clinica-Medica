const EnfermeiroRepo = require('../repositories/EnfermeiroRepository');

async function verificarEnfermeiro(req, res, next) {
    try {
        const { id_enfer } = req.body;
        if (!id_enfer) return res.status(400).json({ erro: "ID do enfermeiro é obrigatório." });
        
        const enfermeiro = await EnfermeiroRepo.findById(id_enfer);
        if (!enfermeiro) return res.status(403).json({ erro: "Enfermeiro não encontrado." });

        next();
    } catch (error) {
        return res.status(500).json({ erro: "Erro validação: " + error.message });
    }
}
module.exports = verificarEnfermeiro;