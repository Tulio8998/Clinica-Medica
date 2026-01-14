const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class MedicoRepository {
    async create(medico) {
        const db = getDb();
        return await db.collection('medicos').insertOne(medico);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('medicos').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('medicos').findOne({ _id: new ObjectId(id) });
    }

    async findByCpfOrEmail(cpf, email) {
        const db = getDb();
        return await db.collection('medicos').findOne({
            $or: [{ cpf }, { email }]
        });
    }

    async findByEmail(email) {
        const db = getDb();
        return await db.collection('medicos').findOne({ email });
    }

    async update(id, dados) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('medicos').updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('medicos').deleteOne({ _id: new ObjectId(id) });
    }

}

module.exports = new MedicoRepository();