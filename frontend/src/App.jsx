import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup'
import EmployeeDashboard from './Components/EmployeeDashboard'
import AdminDashboard from './Components/AdminDashboard'
import { Route, Routes, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore';
import { useState, useEffect } from 'react'

function App() {
  const user = useAuthStore((state) => state.user);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            user.role === 'admin' ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/employee-dashboard" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/employee-dashboard"
        element={
          user && user.role === 'employee' ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          user && user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard') : '/login'} />}
      />
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  )
}

export default App
