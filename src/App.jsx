import React, { useState, useEffect, } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate,useNavigate  } from 'react-router-dom'
import { FaBars, FaChevronLeft, FaChevronRight, FaChartBar, FaCompass, FaUserMd, FaUsers, 
  FaStar, FaHospital, FaCalendarAlt, FaBlog, FaShoppingCart, FaCog ,FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
//import NewDoctors from './components/newdoctors/index.jsx';
//12.11.25
// ✅ Healthcare Directory pages
import Hospitals from "./components/HealthcareDirectory/Hospitals";
import DirectoryDoctors from "./components/HealthcareDirectory/DirectoryDoctors";
import Diagnostics from "./components/HealthcareDirectory/Diagnostics";
import Physiotherapy from "./components/HealthcareDirectory/Physiotherapy";
import Homecare from "./components/HealthcareDirectory/Homecare";
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
  //12.11.25
  const [openMenu, setOpenMenu] = useState(""); // submenu toggle


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
  const iconColor = '#3ea767';
  const navigation = [
    { name: 'Dashboard', path: '/', icon: <FaChartBar  style={{ color: iconColor }}/>, color: '' },//text-purple-500
    { name: 'Navigators', path: '/navigators', icon: <FaCompass  style={{ color: iconColor }}/>, color: '' },//text-blue-500
     { name: 'AH Doctors', path: '/doctors', icon: <FaUserMd style={{ color: iconColor }} />,  color: 'text-green-500' },
   //  { name: 'New Doctors', path: '/newdoctors', icon: <FaUserMd style={{ color: iconColor }} />, color: '' },

     { name: 'Members', path: '/members', icon: <FaUsers  style={{ color: iconColor }} />, color: '' },//text-indigo-500
     //new
     // ✅ SIMPLE SUBMENU — no toggle, no extra code
{
  name: "Healthcare Directory",
  icon: <FaHospital style={{ color: iconColor }} />,
  children: [
    { name: "Hospitals", path: "/directory/hospitals" },
    { name: "Doctors", path: "/directory/doctors" },
    { name: "Diagnostics", path: "/directory/diagnostics" },
    { name: "Physiotherapy", path: "/directory/physiotherapy" },
    { name: "Homecare", path: "/directory/homecare" },
  ]
},
     //new
     { name: 'AHANA', path: '/ahana', icon: <FaStar  style={{ color: iconColor }} />, color: '' },//text-yellow-500
    // { name: 'Empanelled Doctors', path: '/empanelled-doctors', icon: <FaHospital />, color: 'text-teal-500' },
     { name: 'Appointments', path: '/appointments', icon: <FaCalendarAlt  style={{ color: iconColor }} />, color: 'text-red-500' },
    // { name: 'Blog', path: '/blog', icon: <FaBlog />, color: 'text-pink-500' },
    // { name: 'Ecommerce', path: '/ecommerce', icon: <FaShoppingCart />, color: 'text-orange-500' },
    { name: 'Settings', path: '/settings', icon: <FaCog  style={{ color: iconColor }} />, color: 'text-gray-500' },
  ];

  return (
    <SnackbarProvider>
      <Router>
        <div className="min-h-screen h-screen bg-gray-100">
          {isAuthenticated ? (
            <div className="flex h-screen overflow-hidden">
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between bg-white p-3 shadow-md fixed top-0 left-0 right-0 z-30">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSidebarExpanded(!isSidebarExpanded)} 
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <FaBars className="w-6 h-6 text-gray-700" />
                  </button>
                  <img src="/assets/logo_new.png" alt="AssistHealth" className="h-8 object-contain" />
                </div>
              </div>
              {/* Sidebar */}
              {/* <aside 
                className={`flex bg-white shadow-lg flex-col fixed h-full transition-all duration-300 ease-in-out z-20
                  ${isSidebarExpanded ? 'w-72' : 'w-20'} mobile:hidden tablet:flex`}
              > */}
            {/* <aside 
            className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
            ${isSidebarExpanded ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 ${isSidebarExpanded ? 'w-72' : 'w-20'}`}
          > */}
           {/* <aside 
                className={`flex bg-white shadow-lg flex-col fixed h-full transition-all duration-300 ease-in-out z-20
                  ${isSidebarExpanded ? 'w-72' : 'w-20'} mobile:hidden tablet:flex`}
              >  */}
  <aside
  className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out
    ${isSidebarExpanded ? "w-72" : "w-20"} 
    ${isSidebarExpanded ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0`}
>

  {/* ✅ Logo Section with Mobile Close Button */}
  <div className="p-3 border-b flex items-center justify-between">
    <img
      src="/assets/logo_new.png"
      alt="AssistHealth"
      className={`${isSidebarExpanded ? "h-12 w-auto" : "h-10 w-10"} object-contain`}
    />

    {/* Desktop Collapse Toggle */}
    <button
      onClick={() => setSidebarExpanded(!isSidebarExpanded)}
      className="p-2 rounded-full hover:bg-gray-100 transition hidden lg:block"
    >
      {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
    </button>

    {/* ✅ Mobile Close (X) Button */}
    <button
      onClick={() => setSidebarExpanded(false)}
      className="p-2 rounded-full hover:bg-gray-100 transition lg:hidden"
    >
      ✖
    </button>
  </div>

  {/* Navigation */}
  <nav className="flex-1 overflow-y-auto px-3 py-5">
    <ul className="space-y-2">
      {/* {navigation.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
              ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`
            }
            onClick={() => {
              if (window.innerWidth < 1024) setSidebarExpanded(false);
            }}
          >
            <span className="text-xl">{item.icon}</span>
            {isSidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        </li>
      ))} */}
{navigation.map((item) => (
  <li key={item.name}>
    {item.children ? (
      <>
        {/* ✅ MAIN MENU - clickable + toggle */}
        <div
          className="flex items-center gap-4 px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => setOpenMenu(openMenu === item.name ? "" : item.name)}
        >
          <span className="text-xl">{item.icon}</span>
          {isSidebarExpanded && (
            <span className="flex-1 whitespace-nowrap">{item.name}</span>
          )}

         {isSidebarExpanded && (
  <span className="text-gray-500">
    {openMenu === item.name ? <FaChevronUp /> : <FaChevronDown />}
  </span>
)}
        </div>

        {/* ✅ SUBMENU CONTENT (open only if selected AND sidebar expanded) */}
        {openMenu === item.name && isSidebarExpanded && (
          <ul className="ml-10 space-y-1">
            {item.children.map((sub) => (
              <li key={sub.path}>
                <NavLink
                  to={sub.path}
                  className={({ isActive }) =>
                    `block py-2 rounded-md text-sm
                    ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
                  }
                  onClick={() => window.innerWidth < 1024 && setSidebarExpanded(false)}
                >
                  {sub.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </>
    ) : (
      /* ✅ Original default menu unchanged */
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
          ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`
        }
        onClick={() => window.innerWidth < 1024 && setSidebarExpanded(false)}
      >
        <span className="text-xl">{item.icon}</span>
        {isSidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
      </NavLink>
    )}
  </li>
))}

    </ul>
  </nav>
</aside>

{/* Overlay (for mobile only) */}
{isSidebarExpanded && (
  <div
    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
    onClick={() => setSidebarExpanded(false)}
  ></div>
)}

              {/* Main Content Area */}
             <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
  ${isSidebarExpanded ? 'ml-72' : 'ml-0'} lg:mt-0 mt-12`}>

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
                      {/* new doctor */}
                      {/* <Route path="/newdoctors" element={<ProtectedRoute><NewDoctors /></ProtectedRoute>} />   */}

                        <Route path="/directory/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
                        <Route path="/directory/doctors" element={<ProtectedRoute><DirectoryDoctors /></ProtectedRoute>} />
                        <Route path="/directory/diagnostics" element={<ProtectedRoute><Diagnostics /></ProtectedRoute>} />
                        <Route path="/directory/physiotherapy" element={<ProtectedRoute><Physiotherapy /></ProtectedRoute>} />
                        <Route path="/directory/homecare" element={<ProtectedRoute><Homecare /></ProtectedRoute>} />

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
