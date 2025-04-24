import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/MainProvider';

const ProtectedRoute = () => {
  const { session, loading } = useAuth(); // Hole Session und Ladezustand aus dem Auth-Context

  // Zeige nichts oder einen Ladeindikator, während die Session geprüft wird
  if (loading) {
    return <div>Loading...</div>; // Oder eine ansprechendere Ladekomponente
  }

  // Wenn eine Session existiert (Benutzer ist eingeloggt), rendere die geschützten Routen
  // <Outlet /> repräsentiert die verschachtelten Kind-Routen (z.B. /home, /profile)
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 