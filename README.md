# 🏥 Sistema de Gestão Clínica

Documentação funcional e técnica do sistema, incluindo **papéis dos usuários** e **rotas da API**.

---

<br>

## 👥 Perfis de Usuário

<details>
  <summary><strong>🧾 Recepção (RECEPCIONISTA)</strong></summary>

  > A Recepção é o ponto inicial do atendimento do paciente e exerce um papel central no fluxo do sistema.

  ### Responsabilidades

  - Criar, listar, selecionar, editar e remover **Pacientes**
  - Criar, listar, selecionar, editar e remover **Médicos**
  - Criar, listar, selecionar, editar e remover **Enfermeiros**
  - Criar, listar, selecionar, editar e remover **Agendamentos**
  - Criar, listar, selecionar e editar **Recepcionistas**

  ### Dinâmica (exemplo)

  1. O paciente chega à clínica  
  2. A recepção confere se o paciente já possui cadastro  
  3. Caso não exista, o cadastro é criado  
  4. A recepção agenda a consulta vinculando:
     - Paciente
     - Médico
     - Data e horário

  ### Regras

  - ✅ Apenas a recepção pode criar agendamentos  
  - ❌ A recepção não acessa prontuários, não cria triagem e não prescreve

</details>

---

<details>
  <summary><strong>🩺 Enfermagem (ENFERMEIRO)</strong></summary>

  > O Enfermeiro atua na fase pré-consulta, sendo responsável pela avaliação inicial do paciente.

  ### Responsabilidades

  - Criar, listar, selecionar, editar e remover **Triagens**
  - Criar, listar, selecionar, editar e remover **Medicamentos**
  - Criar, listar e selecionar **dispensação de medicamentos**

  ### Dinâmica (exemplo)

  1. O paciente chega para o atendimento  
  2. O enfermeiro realiza a triagem  
  3. Registra sinais vitais, altura, peso e observações clínicas  
  4. Classifica o risco do paciente  
  5. O médico acessa essas informações durante a consulta

  ### Regras

  - ⚠️ O enfermeiro não cria diagnósticos e não prescreve receitas

</details>

---

<details>
  <summary><strong>🧑‍⚕️ Médico (MÉDICO)</strong></summary>

  > O Médico é responsável pelo atendimento clínico e pela gestão do prontuário do paciente.

  ### Responsabilidades

  - Listar e selecionar **Agendamentos**
  - Encerrar **Agendamentos** (atendimentos)
  - Listar, editar e selecionar **Triagens**
  - Criar, listar, selecionar, editar e remover **Evoluções médicas**
  - Criar, listar, selecionar, editar e remover **Receitas**
  - Criar, listar, selecionar, editar e remover **Exames**

  ### Dinâmica

  1. O médico acessa sua agenda  
  2. Visualiza a triagem do paciente  
  3. Realiza o atendimento clínico  
  4. Registra a evolução médica  
  5. Prescreve receitas e solicita exames, se necessário

  ### Regras

  - 🔒 O médico não cria usuários e não agenda consultas

</details>


---
<br>
<br>
<br>

# 📚 Documentação da API

### 🔐 Autenticação

#### POST `/login`

Autentica usuários do sistema (**Admin, Médico, Enfermeiro, Recepcionista ou Paciente**).

**Entrada:**  
- Email  
- Senha  
- Perfil  

**Saída:**  
- Token JWT para autenticação das rotas protegidas

---

### Rotas da Recepção

#### 📅 Agendamentos

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/agendamento/recepcionista` | Cria um agendamento |
| GET | `/agendamento/recepcionista` | Lista todos os agendamentos |
| GET | `/agendamento/recepcionista/buscar` | Busca agendamento por ID |
| PUT | `/agendamento/recepcionista` | Atualiza data/horário |
| DELETE | `/agendamento/recepcionista` | Remove um agendamento |

---

#### 👤 Pacientes

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/pacientes` | Cadastra paciente |
| GET | `/pacientes` | Lista pacientes |
| GET | `/pacientes/buscar` | Busca paciente por ID |
| PUT | `/pacientes` | Atualiza paciente |
| DELETE | `/pacientes` | Remove paciente |

---

#### 🧑‍⚕️ Médicos

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/medicos` | Cadastra médico |
| GET | `/medicos` | Lista médicos |
| GET | `/medicos/buscar` | Busca médico |
| PUT | `/medicos` | Atualiza médico |
| DELETE | `/medicos` | Remove médico |

---

#### 🩺 Enfermeiros

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/enfermeiros` | Cadastra enfermeiro |
| GET | `/enfermeiros` | Lista enfermeiros |
| GET | `/enfermeiros/buscar` | Busca enfermeiro |
| PUT | `/enfermeiros` | Atualiza enfermeiro |
| DELETE | `/enfermeiros` | Remove enfermeiro |

---

#### 🩺 Triagem (Enfermagem)

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/triagem/enfermeiro` | Cria triagem |
| GET | `/triagem/enfermeiro` | Lista triagens |
| GET | `/triagem/enfermeiro/buscar` | Busca triagem |
| PUT | `/triagem/enfermeiro` | Atualiza triagem |
| DELETE | `/triagem/enfermeiro` | Remove triagem |

---

#### 🧠 Evolução Médica

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/evolucao` | Cria evolução |
| GET | `/evolucao` | Lista evoluções |
| GET | `/evolucao/buscar` | Busca evolução |
| PUT | `/evolucao` | Atualiza evolução |
| DELETE | `/evolucao` | Remove evolução |

---

#### 💊 Receitas

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/receitas` | Cria receita |
| GET | `/receitas` | Lista receitas |
| GET | `/receitas/buscar` | Busca receita |
| PUT | `/receitas` | Atualiza receita |
| DELETE | `/receitas` | Remove receita |

---

#### 🧪 Exames

| Método | Rota | Descrição |
|------|------|-----------|
| POST | `/exames` | Solicita exame |
| GET | `/exames` | Lista exames |
| GET | `/exames/buscar` | Busca exame |
| PUT | `/exames` | Atualiza exame |
| DELETE | `/exames` | Remove exame |
