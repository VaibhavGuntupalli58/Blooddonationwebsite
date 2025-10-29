import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { DonorsPage } from "./components/DonorsPage";
import { LoginPage } from "./components/LoginPage";
import { DonationForm } from "./components/DonationForm";
import { Toaster } from "./components/ui/sonner";
import { createClient } from "./utils/supabase/client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const supabase = createClient();

      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && session.access_token) {
        setAccessToken(session.access_token);
        setUser(session.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();

      await supabase.auth.signOut();
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar
          isAuthenticated={isAuthenticated}
          userName={user?.user_metadata?.name}
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/donate-form" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/donate-form"
            element={
              isAuthenticated && accessToken ? (
                <DonationForm accessToken={accessToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
