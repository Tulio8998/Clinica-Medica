const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class PacienteRepository {
    async create(paciente) {
        const db = getDb();
        return await db.collection('pacientes').insertOne(paciente);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('pacientes').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('pacientes').findOne({ _id: new ObjectId(id) });
    }

    async findByCpfOrEmail(cpf, email) {
        const db = getDb();
        return await db.collection('pacientes').findOne({
            $or: [{ cpf }, { email }]
        });
    }
    
    async findByEmail(email) {
        const db = getDb();
        return await db.collection('pacientes').findOne({ email });
    }

    async update(id, dados) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('pacientes').updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('pacientes').deleteOne({ _id: new ObjectId(id) });
    }
    
}

module.exports = new PacienteRepository();