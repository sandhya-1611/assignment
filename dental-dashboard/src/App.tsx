import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { Login } from './app/components/Login';

const theme = createTheme();

// Demo pages
const Home = () => <div>Home Page</div>;
const PatientDashboard = () => <div>Patient Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

// Wrapper to protect routes
const PrivateRoute = ({
  children,
  requireAdmin = false,
}: {
  children: JSX.Element;
  requireAdmin?: boolean;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && !user.isAdmin) return <Navigate to="/patient/dashboard" replace />;

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
