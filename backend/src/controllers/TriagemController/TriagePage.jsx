import React, { useState, useEffect } from 'react';
import { Activity, Save, Clock, User, AlertCircle } from 'lucide-react';
import '../../styles/Pharmacy.css'; // Reutilizando estilos existentes ou crie Triage.css

export const TriagePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sinais_vitais: '',
    peso: '',
    altura: '',
    classificacao: 'verde',
    descricao: '',
    id_enfer: '' // Aqui será armazenado o ID da enfermeira selecionada
  });

  // Buscar Agendamentos e Enfermeiros ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('@Clinica:user');
        const token = storedUser ? JSON.parse(storedUser).token : '';
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Buscar Agendamentos (Assumindo rota que lista agendamentos gerais ou de enfermagem)
        // Se não tiver rota específica, usamos a geral e filtramos no front se necessário
        const resApp = await fetch('http://localhost:3001/agendamentos', { headers });
        if (resApp.ok) {
          const data = await resApp.json();
          // Filtra apenas agendamentos pendentes (status false) e que ainda não têm triagem (opcional)
          setAppointments(data.filter(a => a.status === false));
        }

        // 2. Buscar Lista de Enfermeiros para o Dropdown
        const resNurse = await fetch('http://localhost:3001/enfermeiros', { headers });
        if (resNurse.ok) {
          const data = await resNurse.json();
          setNurses(data);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Preencher o ID do enfermeiro automaticamente se o usuário logado for um enfermeiro
  useEffect(() => {
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    
    if (userObj && userObj.role === 'enfermeiro') {
      setFormData(prev => ({ ...prev, id_enfer: userObj.id || userObj._id }));
    }
  }, []);

  const handleSelectAppointment = (apt) => {
    setSelectedAppointment(apt);
    // Limpa o formulário, mas mantém o enfermeiro se já estiver selecionado
    setFormData(prev => ({
      ...prev,
      sinais_vitais: '',
      peso: '',
      altura: '',
      classificacao: 'verde',
      descricao: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_enfer) {
      alert("Por favor, selecione o enfermeiro responsável.");
      return;
    }

    setLoading(true);
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';

    const payload = {
      ...formData,
      peso: Number(formData.peso),
      altura: Number(formData.altura),
      id_agen: selectedAppointment._id || selectedAppointment.id,
      id_paci: selectedAppointment.id_paci || selectedAppointment.paciente_id
    };

    try {
      const res = await fetch('http://localhost:3001/triagem/enfermeiro', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Triagem realizada com sucesso!");
        setSelectedAppointment(null);
        // Remove o agendamento da lista local
        setAppointments(appointments.filter(a => (a._id || a.id) !== (selectedAppointment._id || selectedAppointment.id)));
      } else {
        const err = await res.json();
        alert(`Erro: ${err.erros ? err.erros.join(', ') : (err.erro || 'Erro ao salvar')}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="triage-container" style={{ padding: '20px' }}>
      <div className="page-header mb-4">
        <h1>Triagem</h1>
        <p>Realize a triagem dos pacientes agendados</p>
      </div>

      <div className="dashboard-grid">
        {/* Lista de Agendamentos Pendentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fila de Espera</h3>
          </div>
          <div className="card-content">
            {appointments.length === 0 ? (
              <p className="empty-state">Nenhum paciente na fila.</p>
            ) : (
              <div className="appointments-list">
                {appointments.map(apt => (
                  <div 
                    key={apt._id || apt.id} 
                    className={`appointment-item ${selectedAppointment?._id === apt._id ? 'selected-item' : ''}`}
                    onClick={() => handleSelectAppointment(apt)}
                    style={{ cursor: 'pointer', border: selectedAppointment?._id === apt._id ? '2px solid var(--color-primary)' : '1px solid transparent' }}
                  >
                    <div className="appointment-info">
                      <p>{apt.paciente_nome || 'Paciente ID: ' + apt.id_paci}</p>
                      <p>{apt.horario} - {apt.descricao}</p>
                    </div>
                    <User size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Triagem */}
        {selectedAppointment ? (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dados da Triagem</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="label">Enfermeiro Responsável</label>
                  <select 
                    className="select"
                    value={formData.id_enfer}
                    onChange={(e) => setFormData({...formData, id_enfer: e.target.value})}
                    required
                  >
                    <option value="">Selecione o enfermeiro...</option>
                    {nurses.map(nurse => (
                      <option key={nurse._id || nurse.id} value={nurse._id || nurse.id}>
                        {nurse.nome} - COREN: {nurse.coren}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Peso (kg)</label>
                    <input className="input" type="number" step="0.1" value={formData.peso} onChange={e => setFormData({...formData, peso: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="label">Altura (m)</label>
                    <input className="input" type="number" step="0.01" value={formData.altura} onChange={e => setFormData({...formData, altura: e.target.value})} />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="label">Sinais Vitais (PA, Temp, FC)</label>
                  <input className="input" placeholder="Ex: 120/80 mmHg, 36.5°C" value={formData.sinais_vitais} onChange={e => setFormData({...formData, sinais_vitais: e.target.value})} required />
                </div>

                <div className="form-group mb-3">
                  <label className="label">Classificação de Risco</label>
                  <select className="select" value={formData.classificacao} onChange={e => setFormData({...formData, classificacao: e.target.value})}>
                    <option value="verde">Verde (Pouco Urgente)</option>
                    <option value="amarelo">Amarelo (Urgente)</option>
                    <option value="vermelho">Vermelho (Emergência)</option>
                    <option value="azul">Azul (Não Urgente)</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="label">Descrição / Queixa</label>
                  <textarea className="textarea" rows="3" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
                </div>

                <button type="submit" className="btn btn-success w-full" disabled={loading}>
                  {loading ? 'Salvando...' : 'Finalizar Triagem'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="card flex items-center justify-center p-8 text-gray-500">
            <AlertCircle size={48} className="mb-2" />
            <p>Selecione um paciente na fila para iniciar a triagem.</p>
          </div>
        )}
      </div>
    </div>
  );
};