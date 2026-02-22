import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Calendar } from 'lucide-react';
import '../../styles/Scheduling.css';

export const Scheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    id_paci: '',
    id_medic: '',
    data: '',
    horario: '',
    horarioFim: '',
    descricao: '',
    status: false,
  });

  const fetchData = async () => {
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [aptRes, patRes, docRes] = await Promise.all([
        fetch('http://localhost:3001/agendamento/recepcionista', { headers }),
        fetch('http://localhost:3001/pacientes', { headers }),
        fetch('http://localhost:3001/medicos', { headers })
      ]);

      if (aptRes.ok) setAppointments(await aptRes.json());
      if (patRes.ok) setPatients(await patRes.json());
      if (docRes.ok) setDoctors(await docRes.json());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const agora = new Date();
    const dataBaseStr = formData.data.includes('/') ? formData.data.split('/').reverse().join('-') : formData.data;
    const dataInicio = new Date(`${dataBaseStr}T${formData.horario}`);
    const dataFim = new Date(`${dataBaseStr}T${formData.horarioFim}`);

    if (!editingAppointment && dataInicio < agora) {
       alert("⚠️ Não é possível agendar para um horário que já passou.");
       return; 
    }

    if (dataFim <= dataInicio) {
      alert("⚠️ O horário de saída deve ser depois do horário de entrada!");
      return;
    }

    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` };

    try {
      let response;
      if (editingAppointment) {
        response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "PUT",
          headers,
          body: JSON.stringify({ ...formData, id_agend: editingAppointment._id }),
        });
      } else {
        response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "POST",
          headers,
          body: JSON.stringify({ ...formData, status: false }), 
        });
      }

      if (response.ok) {
        alert(editingAppointment ? 'Agendamento atualizado!' : 'Agendamento criado!');
        setIsOpen(false);
        resetForm();
        fetchData();
      } else {
        const result = await response.json();
        alert(`Erro: ${result.erros ? result.erros.join(', ') : result.erro}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };
  
  const resetForm = () => {
    setFormData({ id_paci: '', id_medic: '', data: '', horario: '', horarioFim: '', descricao: '', status: false });
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      id_paci: appointment.id_paci,
      id_medic: appointment.id_medic,
      data: appointment.data,
      horario: appointment.horario,
      horarioFim: appointment.horarioFim,
      descricao: appointment.descricao,
      status: appointment.status
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (response.ok) {
          alert('Agendamento excluído com sucesso!');
          fetchData();
        }
      } catch (error) { console.error(error); }
    }
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return '';
    if (dataString.includes('/')) return dataString; 
    if (dataString.includes('-')) {
      const [ano, mes, dia] = dataString.split('T')[0].split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return dataString;
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredAppointments = (appointments || []).filter((apt) => {
    const patient = patients.find((p) => String(p._id) === String(apt.id_paci));
    const doctor = doctors.find((d) => String(d._id) === String(apt.id_medic));
    const matchPatient = patient?.nome?.toLowerCase().includes(filterPatient.toLowerCase()) ?? false;
    const matchDoctor = doctor?.nome?.toLowerCase().includes(filterDoctor.toLowerCase()) ?? false;
    let matchDate = filterDate ? apt.data === filterDate : apt.data >= today;
    return matchPatient && matchDoctor && matchDate;
  });

  const sortedFiltered = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.data}T${a.horario}`);
    const dateB = new Date(`${b.data}T${b.horario}`);
    return dateB.getTime() - dateA.getTime();
  });

  const groupedAppointments = sortedFiltered.reduce((groups, apt) => {
    const dateKey = formatarDataBR(apt.data);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(apt);
    return groups;
  }, {});

  return (
    <div>
      <div className="scheduling-header">
        <div className="scheduling-header-content">
          <h1>Agendamentos</h1>
          <p>Gerencie os agendamentos de consultas</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Novo Agendamento
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input type="text" className="input" placeholder="🔍 Filtrar por Paciente..." value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)} style={{ maxWidth: '300px' }} />
        <input type="text" className="input" placeholder="🩺 Filtrar por Médico..." value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} style={{ maxWidth: '300px' }} />
        <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}/>
            <input type="date" className="input" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ paddingLeft: '35px', maxWidth: '180px' }} />
        </div>
        {filterDate && <button className="btn-ghost" onClick={() => setFilterDate('')}>Limpar Data</button>}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Horário</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedAppointments).length === 0 ? (
              <tr><td colSpan="5" className="empty-state">Nenhum agendamento encontrado</td></tr>
            ) : (
              Object.keys(groupedAppointments).map((date) => (
                <React.Fragment key={date}>
                  <tr style={{ backgroundColor: '#f0fdf4', borderBottom: '2px solid #c6f6d5' }}>
                    <td colSpan="5" style={{ fontWeight: 'bold', color: '#166534', padding: '0.75rem 1rem' }}>📅 {date}</td>
                  </tr>
                  {groupedAppointments[date].map((appointment) => {
                    const patient = patients.find((p) => String(p._id) === String(appointment.id_paci));
                    const doctor = doctors.find((d) => String(d._id) === String(appointment.id_medic));
                    
                    const isCompleted = appointment.status === true || appointment.status === "true";

                    return (
                      <tr key={appointment._id}>
                        <td>{patient?.nome}</td>
                        <td>{doctor?.nome}</td>
                        <td>{appointment.horario} às {appointment.horarioFim}</td>
                        <td>
                          <span className={`status-badge ${isCompleted ? 'completed' : 'pending'}`}>
                            {isCompleted ? 'Concluído' : 'Pendente'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(appointment)} title="Editar"><Pencil size={16} /></button>
                            <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(appointment._id)} title="Excluir"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="label">Paciente</label>
                  <select className="select" value={formData.id_paci} onChange={(e) => setFormData({ ...formData, id_paci: e.target.value })} required>
                    <option value="">Selecione o paciente</option>
                    {patients.map((p) => <option key={p._id} value={p._id}>{p.nome}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Médico</label>
                  <select className="select" value={formData.id_medic} onChange={(e) => setFormData({ ...formData, id_medic: e.target.value })} required>
                    <option value="">Selecione o médico</option>
                    {doctors.map((d) => <option key={d._id} value={d._id}>{d.nome}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Data</label>
                  <input type="date" className="input" value={formData.data} min={today} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Entrada</label>
                  <input type="time" className="input" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Saída</label>
                  <input type="time" className="input" value={formData.horarioFim} onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })} required />
                </div>
                <div className="form-group form-group-full">
                  <label className="label">Descrição</label>
                  <textarea className="textarea" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn btn-success">{editingAppointment ? 'Atualizar' : 'Agendar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};