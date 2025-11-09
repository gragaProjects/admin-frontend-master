import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="...">
      {/* ... other sidebar items test ... */}
      <Link 
        to="/members" 
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        <FaUsers className="mr-2" />
        <span>Members</span>
      </Link>
      {/* ... other sidebar items ... */}
    </aside>
  );
};

export default Sidebar; 