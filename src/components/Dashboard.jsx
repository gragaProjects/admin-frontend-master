import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserNurse, 
  FaUserMd, 
  FaUsers, 
  FaUserGraduate, 
  FaHospital, 
  FaCalendarCheck, 
  FaBlog, 
  FaUserFriends, 
  FaChevronLeft, 
  FaChevronRight, 
  FaBirthdayCake,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { getStats } from '../services/statsService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState([
    { name: 'Navigators', path: '/navigators', count: 0, icon: FaUserNurse, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { name: 'Doctors', path: '/doctors', count: 0, icon: FaUserMd, gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
    { name: 'Members', path: '/members', count: 0, icon: FaUsers, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { name: 'Ahana', path: '/ahana', count: 0, icon: FaUserGraduate, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
    { name: 'Empanelled Doctors', path: '/empanelled-doctors', count: 0, icon: FaHospital, gradient: 'bg-gradient-to-br from-red-500 to-red-700' },
    { name: 'Appointments', path: '/appointments', count: 0, icon: FaCalendarCheck, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
    { name: 'Blog', path: '/blog', count: 0, icon: FaBlog, gradient: 'bg-gradient-to-br from-teal-500 to-teal-700' },
    { name: 'Sub Profiles', path: '/members', count: 0, icon: FaUserFriends, gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-700' }
  ]);
  const [adminInfo, setAdminInfo] = useState(() => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        return {
          name: profile.name || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          profilePic: profile.profilePic || null
        };
      }
    } catch (error) {
      console.error('Error parsing profile:', error);
    }
    return {
      name: '',
      email: '',
      phoneNumber: '',
      profilePic: null
    };
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        const statsData = [
          { name: 'Navigators', path: '/navigators', count: response.navigators, icon: FaUserNurse, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
          { name: 'Doctors', path: '/doctors', count: response.doctors, icon: FaUserMd, gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
          { name: 'Members', path: '/members', count: response.members, icon: FaUsers, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
          { name: 'Ahana', path: '/ahana', count: response.students, icon: FaUserGraduate, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
          { name: 'Empanelled Doctors', path: '/empanelled-doctors', count: response.empDoctors, icon: FaHospital, gradient: 'bg-gradient-to-br from-red-500 to-red-700' },
          { name: 'Appointments', path: '/appointments', count: response.appointments, icon: FaCalendarCheck, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
          { name: 'Blog', path: '/blog', count: response.blogs, icon: FaBlog, gradient: 'bg-gradient-to-br from-teal-500 to-teal-700' },
          { name: 'Sub Profiles', path: '/members', count: response.subprofiles, icon: FaUserFriends, gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-700' }
        ];
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Update admin info when userProfile changes in localStorage
    const handleStorageChange = () => {
      try {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          setAdminInfo({
            name: profile.name || '',
            email: profile.email || '',
            phoneNumber: profile.phoneNumber || '',
            profilePic: profile.profilePic || null
          });
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add members data with birthdays
  const members = [
    { id: "MEM001", name: "Rajesh Kumar", dob: "1985-03-15" },
    { id: "MEM002", name: "Priya Sharma", dob: "1990-03-10" },
    { id: "MEM003", name: "Arun Patel", dob: "1982-03-22" },
    { id: "MEM004", name: "Lakshmi Venkatesh", dob: "1988-03-05" },
    { id: "MEM005", name: "Mohammed Khan", dob: "1975-03-18" }
  ];

  // Function to get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  // Function to get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Function to navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  // Function to get birthdays for a specific date
  const getBirthdaysForDate = (year, month, day) => {
    return members.filter(member => {
      const dob = new Date(member.dob);
      return dob.getMonth() === month && dob.getDate() === day;
    });
  };

  // Add appointments data
  const appointments = [
    {
      date: '2025-03-14',
      events: [
        { time: '10:00 AM', title: 'Dr. Sarah - Cardiology', type: 'doctor' },
        { time: '2:30 PM', title: 'John Smith - Follow-up', type: 'patient' }
      ]
    },
    {
      date: '2025-03-16',
      events: [
        { time: '11:30 AM', title: 'Dr. Patel - Orthopedics', type: 'doctor' },
        { time: '3:00 PM', title: 'Emma Wilson - First Visit', type: 'patient' },
        { time: '4:30 PM', title: 'Team Meeting', type: 'meeting' }
      ]
    }
  ];

  // Function to get events for a specific date
  const getEventsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = appointments.find(apt => apt.date === dateStr)?.events || [];
    const birthdays = getBirthdaysForDate(year, month, day).map(member => ({
      time: 'Birthday',
      title: `${member.name}'s Birthday`,
      type: 'birthday'
    }));
    return [...dayAppointments, ...birthdays];
  };

  return (
    <div className="p-4">
      {/* Welcome Container with Profile Info */}
      <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
        <div className="bg-gradient-to-r from-[#38B6FF] to-[#1E7FC9]">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {adminInfo.profilePic ? (
                    <img 
                      src={adminInfo.profilePic}
                      alt={adminInfo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">
                        {adminInfo.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Welcome back, {adminInfo.name}! 👋
                </h1>
                
                {/* Contact Information */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FaEnvelope className="h-5 w-5 text-white" />
                    <span className="text-sm text-white">{adminInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FaPhone className="h-5 w-5 text-white" />
                    <span className="text-sm text-white">{adminInfo.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className={`${item.gradient} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer`}
            onClick={() => navigate(item.path)}
          >
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-white">
                      {item.count.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-white/90 hover:text-white">
                    <span className="flex items-center">
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-xl font-medium text-gray-700">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Weekday headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDaysInMonth(currentDate).map((day, index) => {
              const events = day ? getEventsForDate(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ) : [];

              return (
                <div
                  key={index}
                  className={`
                    relative min-h-[120px] p-2 rounded-lg border border-gray-100
                    ${day === null ? 'bg-gray-50' : 'bg-white'}
                    ${day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() && 
                      currentDate.getFullYear() === new Date().getFullYear()
                        ? 'ring-2 ring-blue-500'
                        : ''}
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1 
                    ${day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() && 
                      currentDate.getFullYear() === new Date().getFullYear()
                        ? 'text-blue-500'
                        : 'text-gray-700'}
                  `}>
                    {day}
                  </div>
                  
                  {/* Events List */}
                  {events.length > 0 && (
                    <div className="space-y-1">
                      {events.map((event, i) => (
                        <div 
                          key={i} 
                          className={`
                            text-xs p-1 rounded flex items-center gap-1
                            ${event.type === 'doctor' ? 'bg-blue-50 text-blue-700' :
                              event.type === 'patient' ? 'bg-green-50 text-green-700' :
                              event.type === 'birthday' ? 'bg-pink-50 text-pink-700' :
                              'bg-yellow-50 text-yellow-700'}
                          `}
                        >
                          {event.type === 'birthday' && <FaBirthdayCake className="w-3 h-3" />}
                          <div>
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 