import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { NavbarProvider } from './context/NavbarContext';
import Navigation from './components/layout/Navigation';
import AppRoutes from './components/routes/AppRoutes';
import HealthCheck from './components/common/HealthCheck';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavbarProvider>
          <Layout style={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Navigation />
            <HealthCheck />
            <Content style={{ 
              padding: '20px',
              marginTop: '48px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              borderRadius: '4px'
            }}>
              <AppRoutes />
            </Content>
          </Layout>
        </NavbarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 