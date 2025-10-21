import React, { useState, useEffect } from 'react'
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import api from '../../services/api'

const BasicSettings = () => {
  const [settings, setSettings] = useState({
    key: "subscription",
    value: {
      one_time_registration_cost: 1000,
      premium_membership_cost: 3000
    },
    category: "general",
    description: "Its about base subscription package and other related charges"
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get('/api/v1/common/settings')
      
      if (response.status === 'success' && Array.isArray(response.data)) {
        // Find subscription settings from the array
        const subscriptionSettings = response.data.find(setting => setting.key === 'subscription')
        
        if (subscriptionSettings) {
          setSettings(subscriptionSettings)
        } else {
          throw new Error('Subscription settings not found')
        }
      } else {
        throw new Error('Failed to fetch settings')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch settings')
      console.error('Error fetching settings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      value: {
        ...prev.value,
        [field]: parseInt(value) || 0
      }
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Only send the two editable fields in the update
      const updateData = {
        key: 'subscription',
        value: {
          one_time_registration_cost: parseInt(settings.value.one_time_registration_cost),
          premium_membership_cost: parseInt(settings.value.premium_membership_cost)
        }
      }

      const response = await api.put(`/api/v1/common/settings/${settings._id}`, updateData)

      if (response.status === 'success') {
        // Update local state with the response data
        setSettings(prev => ({
          ...prev,
          value: {
            ...prev.value,
            one_time_registration_cost: updateData.value.one_time_registration_cost,
            premium_membership_cost: updateData.value.premium_membership_cost
          }
        }))
        setIsEditing(false)
      } else {
        throw new Error(response.message || 'Failed to update settings')
      }
    } catch (err) {
      setError(err.message || 'Failed to update settings')
      console.error('Error updating settings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !settings._id) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {settings.key}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {settings.category}
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <FaEdit size={20} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                ) : (
                  <FaSave size={20} />
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Registration Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One Time Registration Cost (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                value={settings.value.one_time_registration_cost}
                onChange={(e) => handleInputChange('one_time_registration_cost', e.target.value)}
                disabled={!isEditing || isLoading}
                min="0"
                className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-transparent bg-gray-50 text-gray-700'
                  }`}
              />
            </div>
          </div>

          {/* Premium Membership Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Premium Membership Cost (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                value={settings.value.premium_membership_cost}
                onChange={(e) => handleInputChange('premium_membership_cost', e.target.value)}
                disabled={!isEditing || isLoading}
                min="0"
                className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-transparent bg-gray-50 text-gray-700'
                  }`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">
              {settings.description}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BasicSettings 