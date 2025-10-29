import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplet, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ isAuthenticated, userName, onLogout }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <Droplet className="w-8 h-8" fill="white" />
            <span className="text-xl">BloodBank</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`relative transition-colors duration-300 hover:text-red-100 ${
                isActive("/") ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-white" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`relative transition-colors duration-300 hover:text-red-100 ${
                isActive("/about") ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-white" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/donors"
              className={`relative transition-colors duration-300 hover:text-red-100 ${
                isActive("/donors") ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-white" : ""
              }`}
            >
              Donors
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {userName}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50 transition-all duration-300 hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50 transition-all duration-300 hover:shadow-lg"
                >
                  Login to Donate
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
