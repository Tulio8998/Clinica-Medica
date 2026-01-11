class Usuario {
    constructor(nome, cpf, tipoPerfil, email, senha, dataNasc, endereco, numero) {
        this.nome = nome;
        this.cpf = cpf;
        this.tipoPerfil = tipoPerfil;
        this.email = email;
        this.senha = senha;
        this.dataNasc = dataNasc;
        this.data_cadastro = new Date();
        this.endereco = endereco;
        this.numero = numero;
    }
}

module.exports = Usuario;