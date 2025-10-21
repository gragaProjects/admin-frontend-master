import { useState } from 'react'
import NavigatorList from './NavigatorList'
import NurseList from './NurseList'
import AddNavigatorForm from './AddNavigatorForm'
import NavigatorDetail from './NavigatorDetail'
import AssignedMembersModal from './AssignedMembersModal'
import AssignedStudents from './AssignedStudents'

const NavigatorsComponent = () => {
  const [selectedNavigator, setSelectedNavigator] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAssignedMembers, setShowAssignedMembers] = useState(false)
  const [showAssignedStudents, setShowAssignedStudents] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('navigators')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFormSuccess = (tab) => {
    setActiveTab(tab);
    setShowAddForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const renderTabs = () => (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('navigators')}
            className={`${
              activeTab === 'navigators'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Navigators
          </button>
          {/* <button
            onClick={() => setActiveTab('nurses')}
            className={`${
              activeTab === 'nurses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Nurses
          </button> */}
        </nav>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex flex-col gap-6">
        {renderTabs()}
        
     {activeTab === 'navigators' ? (
          <NavigatorList 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowAddForm={setShowAddForm}
            setSelectedNavigator={setSelectedNavigator}
            setShowAssignedMembers={setShowAssignedMembers}
            refreshKey={refreshKey}
          />
        ) : (
          <NurseList 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowAddForm={setShowAddForm}
            setSelectedNavigator={setSelectedNavigator}
            setShowAssignedStudents={setShowAssignedStudents}
            refreshKey={refreshKey}
          />
        )}
      </div>

      {showAddForm && (
        <AddNavigatorForm 
          onClose={() => setShowAddForm(false)} 
          activeTab={activeTab}
          onSuccess={handleFormSuccess}
        />
      )}

      {selectedNavigator && !showAssignedMembers && !showAssignedStudents && (
        <NavigatorDetail 
          navigator={selectedNavigator} 
          onClose={() => setSelectedNavigator(null)}
          onDelete={(id) => {
            setSelectedNavigator(null);
            handleRefresh();
          }}
          onSuccess={(tab) => {
            setSelectedNavigator(null);
            setActiveTab(tab);
            handleRefresh();
          }}
        />
      )}

      {showAssignedMembers && selectedNavigator && (
        <AssignedMembersModal
          isOpen={showAssignedMembers}
          onClose={() => {
            setShowAssignedMembers(false);
            setSelectedNavigator(null);
          }}
          navigator={selectedNavigator}
        />
      )}

      {showAssignedStudents && selectedNavigator && (
        <AssignedStudents
          isOpen={showAssignedStudents}
          onClose={() => {
            setShowAssignedStudents(false);
            setSelectedNavigator(null);
          }}
          nurse={selectedNavigator}
        />
      )}
    </div>
  )
}

export default NavigatorsComponent 