
import React, { useContext } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Doodles from './components/Doodles';
import Spinner from './components/Spinner';

const AppContent: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return user ? <Chat /> : <Login />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-blue-600/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[25%] w-[400px] h-[400px] bg-pink-600/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
        
        <Doodles />

        <main className="relative z-10">
          <AppContent />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
