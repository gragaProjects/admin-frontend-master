import { FaSearch } from 'react-icons/fa'
import { appointmentsService } from '../../services/appointmentsService'

const SearchAndFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onStatusChange }) => {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-4 min-w-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 flex-shrink-0">
        <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:w-64 xl:w-72">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}

export default SearchAndFilters