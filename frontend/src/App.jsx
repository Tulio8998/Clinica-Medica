import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Login } from '../src/components/Login';
import { Sidebar, TopBar } from '../src/components/Layout';
import { ReceptionistDashboard } from '../src/components/receptionist/Dashboard';
import { UserManagement } from '../src/components/receptionist/UserManagement';
import { Scheduling } from '../src/components/receptionist/Scheduling';
import { TriagePage } from '../src/components/nurse/TriagePage';
import { PharmacyPage } from '../src/components/nurse/PharmacyPage';
import { DoctorQueue } from '../src/components/doctor/DoctorQueue';
import { ConsultationPage } from '../src/components/doctor/ConsultationPage';
import { PatientHistory } from '../src/components/doctor/PatientHistory';
import '../src/styles/global.css';
import '../src/styles/App.css';

const AppContent = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultationAppointmentId, setConsultationAppointmentId] = useState(null);

  if (!currentUser) {
    return <Login />;
  }

  const getDefaultPage = () => {
    if (currentUser.role === 'recepcionista' || currentUser.role === 'admin') {
      return 'dashboard';
    } else if (currentUser.role === 'enfermeiro') {
      return 'triage';
    } else if (currentUser.role === 'medico') {
      return 'queue';
    }
    return 'dashboard';
  };

  const actualPage = currentPage || getDefaultPage();

  const renderPage = () => {
    // Handle doctor consultation flow
    if (consultationAppointmentId && (currentUser.role === 'medico' || currentUser.role === 'admin')) {
      return (
        <ConsultationPage
          appointmentId={consultationAppointmentId}
          onBack={() => {
            setConsultationAppointmentId(null);
            setCurrentPage('queue');
          }}
        />
      );
    }

        // Nurse pages
    if (currentUser.role === 'admin') {
      switch (actualPage) {
        case 'dashboard':
          return <ReceptionistDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        case 'queue':
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
        case 'history':
          return <PatientHistory />;
        case 'triage':
          return <TriagePage />;
        case 'pharmacy':
          return <PharmacyPage />;
        default:
          return <ReceptionistDashboard />;
      }
    }

    // Receptionist pages
    if (currentUser.role === 'recepcionista' || currentUser.role === 'admin') {
      switch (actualPage) {
        case 'dashboard':
          return <ReceptionistDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        case 'queue':
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
        case 'history':
          return <PatientHistory />;
        default:
          return <ReceptionistDashboard />;
      }
    }

    // Nurse pages
    if (currentUser.role === 'enfermeiro') {
      switch (actualPage) {
        case 'triage':
          return <TriagePage />;
        case 'pharmacy':
          return <PharmacyPage />;
        default:
          return <TriagePage />;
      }
    }

    // Doctor pages
    if (currentUser.role === 'medico') {
      switch (actualPage) {
        case 'queue':
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
        case 'consultation':
          return consultationAppointmentId ? (
            <ConsultationPage
              appointmentId={consultationAppointmentId}
              onBack={() => {
                setConsultationAppointmentId(null);
                setCurrentPage('queue');
              }}
            />
          ) : (
            <DoctorQueue onStartConsultation={setConsultationAppointmentId} />
          );
        case 'history':
          return <PatientHistory />;
        default:
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
      }
    }

    return <ReceptionistDashboard />;
  };

  return (
    <div className="app-container">
      <Sidebar
        currentPage={actualPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setConsultationAppointmentId(null);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main-wrapper">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-main-content">
          <div className="app-content-container">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
