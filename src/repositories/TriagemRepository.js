const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class TriagemRepository {
    async create(triagem) {
        const db = getDb();
        return await db.collection('triagens').insertOne(triagem);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('triagens').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('triagens').findOne({ _id: new ObjectId(id) });
    }

    async update(id, dados) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('triagens').updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('triagens').deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = new TriagemRepository();