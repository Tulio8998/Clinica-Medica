const Usuario = require("./UsuarioModel");

class Medico extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, numero, uf, crm) {
        super(nome, cpf, 'MEDICO', email, senha, dataNasc, endereco, numero);
        this.uf = uf;
        this.crm = crm;
    }
}

module.exports = Medico;