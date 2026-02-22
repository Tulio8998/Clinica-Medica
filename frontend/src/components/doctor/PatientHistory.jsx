import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, Clipboard, ArrowRight } from 'lucide-react';
import '../../styles/PatientHistory.css';

export const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const storedUser = localStorage.getItem('@Clinica:user');
        const token = storedUser ? JSON.parse(storedUser).token : '';
        const res = await fetch('http://localhost:3001/pacientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setPatients(await res.json());
      } catch (error) { console.error(error); }
    };
    fetchPatients();
  }, []);

  const handleSelectPatient = async (patient) => {
  setLoading(true);
  setSelectedPatient(patient);
  
  // LOG 1: Ver qual ID estamos procurando
  const pId = (patient._id || patient.id)?.toString();
  console.log("🔎 Buscando histórico para o Paciente ID:", pId);

  try {
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    
    const res = await fetch('http://localhost:3001/evolucao', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
        const allEvos = await res.json();
        const pId = String(selectedPatient?._id || selectedPatient?.id);

        console.log("🔍 Filtrando evoluções para o Paciente String ID:", pId);

        const filtered = allEvos.filter(e => {
          // Garante a comparação entre Strings puras
          const evoPaciId = String(e.id_paci || e.paciente_id || e.id_paciente || '');
          return evoPaciId === pId;
        });

        console.log("✅ Evoluções após o filtro:", filtered);
        setEvolutions(filtered);
      }
      
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="history-container">
      <div className="page-header">
        <h1>Prontuário e Histórico</h1>
        <p>Histórico clínico completo dos pacientes</p>
      </div>

      <div className="history-layout">
        <aside className="patient-sidebar card">
          <div className="p-3">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                className="input" 
                placeholder="Nome ou CPF..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="patient-list">
            {patients.filter(p => p.nome?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <div key={p._id || p.id} className={`patient-list-item ${selectedPatient?._id === p._id ? 'active' : ''}`} onClick={() => handleSelectPatient(p)}>
                <div className="patient-avatar">{p.nome?.charAt(0)}</div>
                <div className="patient-info">
                  <p className="name">{p.nome}</p>
                  <p className="cpf">CPF: {p.cpf}</p>
                </div>
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </aside>

        <main className="evolution-main">
          {selectedPatient ? (
            <div className="evolution-content">
              <div className="card mb-4 info-card">
                <div className="card-content">
                  <h3>{selectedPatient.nome}</h3>
                  <p>CPF: {selectedPatient.cpf} | Sangue: {selectedPatient.tipoSang || 'O+'}</p>
                </div>
              </div>

              <div className="timeline">
                {loading ? <p>Buscando prontuário...</p> : evolutions.length === 0 ? (
                  <div className="empty-history card">
                    <Clipboard size={40}/>
                    <p>Nenhuma evolução encontrada para este paciente.</p>
                  </div>
                ) : (
                  evolutions.map((evo, i) => (
                    <div key={i} className="timeline-item card">
                      <div className="timeline-marker"></div>
                      <div className="evo-date">
                        <Calendar size={14}/> 
                        {evo.data_criacao 
                          ? new Date(evo.data_criacao).toLocaleDateString('pt-BR') 
                          : "Data não registrada"}
                      </div>
                      <div className="evo-content">
                        <p><strong>CID:</strong> {evo.cid_prin} {evo.cid_secun !== 'N/A' && `| ${evo.cid_secun}`}</p>
                        <p style={{marginTop: '8px', whiteSpace: 'pre-wrap'}}>{evo.resumo}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state-view">
              <FileText size={64}/>
              <p>Selecione um paciente para ver o histórico clínico.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};