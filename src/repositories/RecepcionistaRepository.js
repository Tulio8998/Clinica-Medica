const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class RecepcionistaRepository {
    async create(recep) {
        const db = getDb();
        return await db.collection('recepcionistas').insertOne(recep);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('recepcionistas').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('recepcionistas').findOne({ _id: new ObjectId(id) });
    }

    async findByCpfOrEmail(cpf, email) {
        const db = getDb();
        return await db.collection('recepcionistas').findOne({
            $or: [{ cpf }, { email }]
        });
    }
    
    async findByEmail(email) {
        const db = getDb();
        return await db.collection('recepcionistas').findOne({ email });
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('recepcionistas').deleteOne({ _id: new ObjectId(id) });
    }

}

module.exports = new RecepcionistaRepository();