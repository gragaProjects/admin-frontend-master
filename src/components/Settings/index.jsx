import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TabButton from './TabButton'
import BasicSettings from './BasicSettings'
import Utilities from './Utilities'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic') // old
  //const [activeTab, setActiveTab] = useState('utilities');

  const location = useLocation()

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location])

  const tabs = [
    { id: 'basic', label: 'Basic Settings' },
    { id: 'utilities', label: 'Utilities' }
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="bg-gray-50 p-1 rounded-lg inline-flex gap-2">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'basic' && <BasicSettings />}
        {activeTab === 'utilities' && <Utilities />}
      </div>
    </div>
  )
}

export default Settings 