import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAppointmentForm from './AddAppointmentForm';
import EditAppointmentForm from './EditAppointmentForm';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import AppointmentsList from './AppointmentsList';
import SearchAndFilters from './SearchAndFilters';
import Pagination from './Pagination';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter
      };
      
      const response = await appointmentsService.getAppointments(params);
      
      // Handle case where response.data is an array directly
      if (Array.isArray(response?.data)) {
        setAppointments(response.data);
        const pages = Math.ceil(response.data.length / params.limit);
        setTotalPages(pages || 1);
        setPagination({
          total: Number(response.data.length) || 0,
          page: Number(params.page) || 1,
          pages: Number(pages) || 1,
          limit: Number(params.limit) || 10
        });
        return;
      }

      // Handle case where response.data is an object with status and data properties
      if (response?.data?.status === 'success' && Array.isArray(response.data.data)) {
        setAppointments(response.data.data);
        const pg = response.data.pagination;
        if (pg) {
          setTotalPages(Number(pg.pages) || 1);
          setPagination({
            total: Number(pg.total) || Number(response.data.data.length) || 0,
            page: Number(pg.page) || Number(params.page) || 1,
            pages: Number(pg.pages) || 1,
            limit: Number(pg.limit) || Number(params.limit) || 10
          });
        } else {
          const pages = Math.ceil(response.data.data.length / params.limit);
          setTotalPages(pages || 1);
          setPagination({
            total: Number(response.data.data.length) || 0,
            page: Number(params.page) || 1,
            pages: Number(pages) || 1,
            limit: Number(params.limit) || 10
          });
        }
        return;
      }

      // If we reach here, something went wrong with the response format
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from server');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      
      if (err.message === 'Network Error' || err.message.includes('Unable to connect')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        // Optionally redirect to login page
        // navigate('/login');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view appointments.');
      } else if (err.response?.status === 404) {
        // For 404, we'll treat it as empty appointments rather than an error
        setAppointments([]);
        setTotalPages(1);
        return;
      } else {
        setError(err.message || 'Failed to fetch appointments');
      }
      
      toast.error(err.message || 'Failed to fetch appointments');
      setAppointments([]);
      setTotalPages(1);
      setPagination({ total: 0, page: 1, pages: 1, limit: 10 });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentDetails = async (id) => {
    try {
      setLoading(true);
      const response = await appointmentsService.getAppointmentById(id);
      if (response?.data?.status === 'success' && response.data.data) {
        const appointmentData = response.data.data;
        setSelectedAppointment(appointmentData);
        setShowEditForm(true);
      } else {
        throw new Error('Failed to fetch appointment details');
      }
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      // Check specifically for 404 error
      if (err.response?.status === 404) {
        toast.error('This appointment no longer exists. It may have been deleted.');
      } else {
        toast.error(err.message || 'Failed to fetch appointment details');
      }
      // Close the edit form if it was open
      setShowEditForm(false);
      setSelectedAppointmentId(null);
      setSelectedAppointment(null);
    } finally {
      setLoading(false);
  }
  };

  const handleViewAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await appointmentsService.updateAppointmentStatus(appointmentId, newStatus);
      if (response.status === 'success') {
        toast.success('Status updated successfully');
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status');
  }
  };

  const handleAddAppointment = (memberId) => {
    setShowAddForm(true);
  };

  const handleEditAppointment = async (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    await fetchAppointmentDetails(appointmentId);
  };

  const handleDownload = (appointmentId) => {
    console.log('Downloading appointment:', appointmentId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1">
          <SearchAndFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onStatusChange={(data) => {
              setAppointments(data);
            }}
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Create Appointment
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
        <AppointmentsList 
          appointments={appointments}
          loading={loading}
          handleViewAppointment={handleViewAppointment}
          handleStatusChange={handleStatusChange}
          handleEditAppointment={handleEditAppointment}
          onDownload={handleDownload}
          onRefresh={fetchAppointments}
          pagination={pagination}
        />

          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              startIndex={(currentPage - 1) * (pagination?.limit || 10)}
              itemsPerPage={pagination?.limit || 10}
              totalItems={pagination?.total || 0}
            />
          </div>
        </>
        )}

      {showAddForm && (
        <AddAppointmentForm 
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchAppointments();
          }}
        />
      )}

      {showEditForm && selectedAppointment && (
        <EditAppointmentForm 
          onClose={() => {
            setShowEditForm(false);
            setSelectedAppointmentId(null);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            setShowEditForm(false);
            setSelectedAppointmentId(null);
            setSelectedAppointment(null);
            fetchAppointments();
          }}
          onSaveSuccess={() => {
            // Keep the edit form open after saving - just refresh the appointment data
            console.log('Main Appointments: onSaveSuccess called - keeping edit form open');
            fetchAppointmentDetails(selectedAppointmentId);
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

export default Appointments; 