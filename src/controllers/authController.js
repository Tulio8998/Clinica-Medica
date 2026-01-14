const MedicoRepo = require('../repositories/MedicoRepository');
const PacienteRepo = require('../repositories/PacienteRepository');
const EnfermeiroRepo = require('../repositories/EnfermeiroRepository');
const RecepRepo = require('../repositories/RecepcionistaRepository');

module.exports = {
    async login(req, res) {
        try {
            const { email, senha, tipo } = req.body;

            if (!email || !senha || !tipo) {
                return res.status(400).json({ erro: "Email, senha e tipo são obrigatórios" });
            }

            let usuario = null;

            switch(tipo.toLowerCase()) {
                case 'medico': 
                    usuario = await MedicoRepo.findByEmail(email);
                    break;
                case 'paciente': 
                    usuario = await PacienteRepo.findByEmail(email);
                    break;
                case 'recepcionista': 
                    usuario = await RecepRepo.findByEmail(email);
                    break;
                case 'enfermeiro': 
                    usuario = await EnfermeiroRepo.findByEmail(email);
                    break;
                default: 
                    return res.status(400).json({ erro: "Tipo de usuário inválido" });
            }

            if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado" });
            
            if (usuario.senha !== senha) return res.status(401).json({ erro: "Senha incorreta" });

            const { senha: _, ...dadosUsuario } = usuario;
            
            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                usuario: dadosUsuario,
                tipo: tipo
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};