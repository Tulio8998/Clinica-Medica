const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class AgendamentoRepository {
    async create(agendamento) {
        const db = getDb();
        return await db.collection('agendamentos').insertOne(agendamento);
    }

    async findAll() {
        const db = getDb();
        return await db.collection('agendamentos').find({}).toArray();
    }

    async findById(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('agendamentos').findOne({ _id: new ObjectId(id) });
    }

    async findPendentes() {
        const db = getDb();
        return await db.collection('agendamentos').find({ status: true }).toArray();
    }

    async update(id, dados) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('agendamentos').updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) return null;
        return await db.collection('agendamentos').deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = new AgendamentoRepository();