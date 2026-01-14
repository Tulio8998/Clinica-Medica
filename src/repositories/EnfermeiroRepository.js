const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class EnfermeiroRepository {
    async create(enfermeiro) {
        const db = getDb();
        return await db.collection('enfermeiros').insertOne(enfermeiro);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('enfermeiros').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('enfermeiros').findOne({ _id: new ObjectId(id) });
    }

    async findByCpfOrEmail(cpf, email) {
        const db = getDb();
        return await db.collection('enfermeiros').findOne({
            $or: [{ cpf }, { email }]
        });
    }
    
    async findByEmail(email) {
        const db = getDb();
        return await db.collection('enfermeiros').findOne({ email });
    }

    async update(id, dados) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('enfermeiros').updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('enfermeiros').deleteOne({ _id: new ObjectId(id) });
    }

}

module.exports = new EnfermeiroRepository();