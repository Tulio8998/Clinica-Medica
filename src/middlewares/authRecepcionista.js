const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

async function verificarRecepcionista(req, res, next) {
    try {
        const { id_recep } = req.body;

        if (!id_recep) {
            return res.status(400).json({ erro: "ID da recepcionista é obrigatório." });
        }
        const db = getDb();
        const recepcionista = await db.collection('recepcionistas').findOne({ 
            _id: new ObjectId(id_recep) 
        });

        if (!recepcionista) {
            return res.status(403).json({ erro: "Recepcionista não encontrada." });
        }

        next();

    } catch (error) {
        return res.status(500).json({ erro: "Erro na validação de permissão: " + error.message });
    }
}

module.exports = verificarRecepcionista;