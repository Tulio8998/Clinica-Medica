import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';
import '../../styles/DoctorQueue.css'; 

export const DoctorQueue = ({ onStartConsultation }) => {
  const [appointments, setAppointments] = useState([]);
  const [triages, setTriages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      if (!storedUser) return;
      
      const userObj = JSON.parse(storedUser);
      const headers = { 'Authorization': `Bearer ${userObj.token}` };

      const resApt = await fetch('http://localhost:3001/agendamento/medico', { headers });
      const dataApt = await resApt.json();
      
      const resTri = await fetch('http://localhost:3001/triagem/medico', { headers });
      const dataTri = await resTri.json();
      
      const resPac = await fetch('http://localhost:3001/pacientes', { headers });
      const dataPac = await resPac.json();

      setAppointments(Array.isArray(dataApt) ? dataApt : []);
      setTriages(Array.isArray(dataTri) ? dataTri : []);
      setPatients(Array.isArray(dataPac) ? dataPac : []);
    } catch (error) {
      console.error('Erro ao buscar fila do médico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingWithTriage = [];
  const pendingNoTriage = [];
  const completed = [];

  appointments.forEach((apt) => {
    const aptId = String(apt._id || apt.id);
    const hasTriage = triages.find(t => String(t.id_agen || t.id_agend || t.appointmentId || '') === aptId);
    
    const isPending = apt.status !== true && apt.status !== "atendido" && apt.status !== "true";

    if (!isPending) {
      completed.push(apt);
    } else if (hasTriage) {
      pendingWithTriage.push({ ...apt, triage: hasTriage });
    } else {
      pendingNoTriage.push(apt);
    }
  });

  pendingWithTriage.sort((a, b) => {
    const priorityOrder = { red: 0, yellow: 1, green: 2, blue: 3 };
    const pA = (a.triage && a.triage.classificacao) ? (priorityOrder[a.triage.classificacao] ?? 4) : 4;
    const pB = (b.triage && b.triage.classificacao) ? (priorityOrder[b.triage.classificacao] ?? 4) : 4;

    if (pA !== pB) return pA - pB;
    return String(a.horario || '').localeCompare(String(b.horario || ''));
  });

  // Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
  const formatData = (dataStr) => {
    if (!dataStr) return 'N/A';
    if (dataStr.includes('-')) {
      const [ano, mes, dia] = dataStr.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  const renderPatientCard = (apt, showAction, customBadgeLabel) => {
    const aptId = String(apt._id || apt.id);
    const patient = patients.find((p) => String(p._id || p.id) === String(apt.id_paci || apt.paciente_id));
    const triage = apt.triage;

    const getRiskClass = (risk) => {
      const classes = { red: 'emergency', yellow: 'urgent', green: 'normal', blue: 'normal' };
      return classes[risk] || 'normal';
    };

    return (
      <div key={aptId} className={`patient-queue-item ${!showAction ? 'opacity-75' : ''}`} style={{ marginBottom: '1rem' }}>
        <div className="patient-queue-header">
          <div className="patient-queue-info">
            <h3 style={{ margin: 0 }}>{patient?.nome || 'Paciente não encontrado'}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>CPF: {patient?.cpf || '---'}</p>
          </div>
          {triage ? (
            <span className={`priority-badge ${getRiskClass(triage.classificacao)}`}>
              {triage.classificacao === 'red' ? 'Emergência' : 
               triage.classificacao === 'yellow' ? 'Urgência' : 'Normal'}
            </span>
          ) : (
            <span className="priority-badge" style={{ background: '#e2e8f0', color: '#475569' }}>
              {customBadgeLabel || 'Aguardando Triagem'}
            </span>
          )}
        </div>

        <div className="patient-queue-details">
          <div className="patient-queue-detail">
            <strong>Data:</strong>
            <span>{formatData(apt.data)}</span>
          </div>
          <div className="patient-queue-detail">
            <strong>Horário:</strong>
            <span>{apt.horario || 'N/A'}</span>
          </div>
          {triage && (
            <div className="patient-queue-detail">
              <strong>Sinais Vitais:</strong>
              <span>{triage.sinais_vitais || 'N/A'}</span>
            </div>
          )}
        </div>

        {showAction && (
          <div className="patient-queue-actions mt-3">
            <button className="btn btn-primary" onClick={() => onStartConsultation(aptId)}>
              Iniciar Consulta
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-4">Carregando painel do médico...</div>;

  return (
    <div>
      <div className="queue-header">
        <h1>Painel de Atendimento</h1>
        <p>Visão geral de todos os agendamentos do dia</p>
      </div>

      <div className="dashboard-stats mb-4" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Prontos (Com Triagem)</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{pendingWithTriage.length}</div>
          </div>
        </div>
        
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Enfermaria (Realizando Triagem)</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{pendingNoTriage.length}</div>
          </div>
        </div>
      </div>

      {appointments.length === 0 && (
        <div className="card mb-4">
          <div className="card-content text-center" style={{ color: '#64748b' }}>
            O servidor não enviou nenhum agendamento para este médico hoje.
          </div>
        </div>
      )}

      {pendingWithTriage.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#16a34a', marginBottom: '1rem' }}>🟢 Fila Pronta</h2>
          <div className="grid">
            {pendingWithTriage.map(apt => renderPatientCard(apt, true))}
          </div>
        </div>
      )}

      {pendingNoTriage.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#ca8a04', marginBottom: '1rem' }}>🟡 Na Enfermaria (Sem Triagem)</h2>
          <div className="grid">
            {pendingNoTriage.map(apt => renderPatientCard(apt, false))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '1rem' }}>✔️ Já Atendidos</h2>
          <div className="grid">
            {completed.map(apt => renderPatientCard(apt, false, 'Atendido'))}
          </div>
        </div>
      )}
    </div>
  );
};