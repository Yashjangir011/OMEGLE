import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Chat from "./components/pages/Chat";
import Login_page from "./components/pages/Login_page";
import Signup_page from "./components/pages/Signup_page";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <Signup_page onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login_page onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
