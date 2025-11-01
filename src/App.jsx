import React, { useState, useEffect, } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate,useNavigate  } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaChartBar, FaCompass, FaUserMd, FaUsers, 
  FaStar, FaHospital, FaCalendarAlt, FaBlog, FaShoppingCart, FaCog } from 'react-icons/fa'
import './App.css'
import { SnackbarProvider } from './contexts/SnackbarContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import Navigators from './components/navigators'
import EmpanelledDoctors from './components/empanelledDoctors'
import Appointments from './components/appointments'
import Blog from './components/blogs'
import Ecommerce from './components/ecommerce'
import Settings from './components/Settings'
import Ahana from './components/ahana'
import Profile from './components/profile/Profile'
import Logo from './components/Logo'
import ProfileMenu from './components/common/ProfileMenu'
import NotificationMenu from './components/common/NotificationMenu'
import Members from './components/members/index.jsx'
import Doctors from './components/Doctors'
import Header from './components/common/Header'
import SchoolManagement from './components/Settings/school/index.jsx'
import HealthcareManagement from './components/Settings/healthcare/index.jsx'
import PackagesManagement from './components/Settings/packages/index.jsx'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};



function App() {
   
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [userName, setUserName] = useState(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      return profile.name || 'Admin';
    }
    return 'Admin';
  });

  //1.11.25
  // 🔒 Auto logout after 30 minutes or token expiry
 // 🕒 Auto logout after 30 minutes of inactivity
useEffect(() => {
  // Clear any old timer
  let timeout;

  // This function runs whenever user moves or types
  const resetTimer = () => {
    clearTimeout(timeout);
    // Start a new 30-minute timer
    timeout = setTimeout(() => {
      localStorage.clear();
      window.location.href = '/login'; // logout and redirect
    }, 30 * 60 * 1000); // 30 minutes
  };

  // Listen for user activity
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);

  // Start the first timer
  resetTimer();

  // Cleanup
  return () => {
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keydown', resetTimer);
    clearTimeout(timeout);
  };
}, []);

//1.11.25

  useEffect(() => {
    // Update userName when userProfile changes in localStorage
    const handleStorageChange = () => {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        setUserName(profile.name || 'Admin');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Update userName from profile
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      setUserName(profile.name || 'Admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setUserName('Admin');
    console.log('Logging out...');
  };

  const navigation = [
    { name: 'Dashboard', path: '/', icon: <FaChartBar />, color: 'text-purple-500' },
    { name: 'Navigators', path: '/navigators', icon: <FaCompass />, color: 'text-blue-500' },
    // { name: 'AH Doctors', path: '/doctors', icon: <FaUserMd />, color: 'text-green-500' },
    // { name: 'Members', path: '/members', icon: <FaUsers />, color: 'text-indigo-500' },
    // { name: 'AHANA', path: '/ahana', icon: <FaStar />, color: 'text-yellow-500' },
    // { name: 'Empanelled Doctors', path: '/empanelled-doctors', icon: <FaHospital />, color: 'text-teal-500' },
    // { name: 'Appointments', path: '/appointments', icon: <FaCalendarAlt />, color: 'text-red-500' },
    // { name: 'Blog', path: '/blog', icon: <FaBlog />, color: 'text-pink-500' },
    // { name: 'Ecommerce', path: '/ecommerce', icon: <FaShoppingCart />, color: 'text-orange-500' },
    { name: 'Settings', path: '/settings', icon: <FaCog />, color: 'text-gray-500' },
  ];

  return (
    <SnackbarProvider>
      <Router>
        <div className="min-h-screen h-screen bg-gray-100">
          {isAuthenticated ? (
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <aside 
                className={`flex bg-white shadow-lg flex-col fixed h-full transition-all duration-300 ease-in-out z-20
                  ${isSidebarExpanded ? 'w-72' : 'w-20'} mobile:hidden tablet:flex`}
              >
                {/* Logo Section */}
                <div className="p-2 sm:p-4 border-b flex items-center justify-between">
                  {isSidebarExpanded ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img 
                        src="/assets/assist-health-logo.png" 
                        alt="AssistHealth" 
                        className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                      />
                      <div className="text-lg sm:text-xl font-semibold">
                        <span className="text-gray-800">Assist</span>
                        <span className="text-[#38B6FF]">Health</span>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src="/assets/assist-health-logo.png" 
                      alt="AH" 
                      className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                    />
                  )}
                  <button 
                    onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {isSidebarExpanded ? <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-3">
                    {navigation.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                            ${isActive
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          <span className={`text-xl ${item.color} transition-colors`}>{item.icon}</span>
                          {isSidebarExpanded && (
                            <span className="font-medium whitespace-nowrap">{item.name}</span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Main Content Area */}
              <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                ${isSidebarExpanded ? 'ml-72' : 'ml-20'} mobile:ml-0`}>
                <Header onLogout={handleLogout} userName={userName} />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 mobile:p-4 bg-gray-50">
                  <div className="max-w-full mx-auto">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/navigators" element={<ProtectedRoute><Navigators /></ProtectedRoute>} />
                      <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
                      <Route path="/empanelled-doctors" element={<ProtectedRoute><EmpanelledDoctors /></ProtectedRoute>} />
                      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                      <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
                      <Route path="/ecommerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
                      <Route path="/ahana/*" element={<Ahana />} />
                      <Route path="/settings/schools" element={<SchoolManagement />} />
                      <Route path="/settings/healthcare" element={<HealthcareManagement />} />
                      <Route path="/settings/packages" element={<ProtectedRoute><PackagesManagement /></ProtectedRoute>} />
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SnackbarProvider>
  );
}

export default App;
