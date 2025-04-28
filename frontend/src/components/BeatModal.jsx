"use client";

import { useState, useEffect } from 'react';

export default function BeatModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  constables = [],
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    frequency: 'Daily',
    constableId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        area: initialData.area || '',
        frequency: initialData.frequency || 'Daily',
        constableId: initialData.constableId || ''
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        area: '',
        frequency: 'Daily',
        constableId: ''
      });
      setIsEditing(false);
    }
    setErrors({});
  }, [initialData, isOpen]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Beat name is required';
    }
    
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, isEditing);
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {isEditing ? 'Edit Beat' : 'Create New Beat'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Beat Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Beat Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input w-full ${errors.name ? 'border-destructive' : ''}`}
                placeholder="Enter beat name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            {/* Area Assigned Field */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium mb-1">
                Area Assigned
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`input w-full ${errors.area ? 'border-destructive' : ''}`}
                placeholder="Enter area description"
                disabled={isLoading}
              />
              {errors.area && (
                <p className="mt-1 text-sm text-destructive">{errors.area}</p>
              )}
            </div>
            
            {/* Frequency Field */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={`input w-full ${errors.frequency ? 'border-destructive' : ''}`}
                disabled={isLoading}
              >
                <option value="Daily">Daily</option>
                <option value="Night">Night</option>
                <option value="Weekly">Weekly</option>
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-destructive">{errors.frequency}</p>
              )}
            </div>
            
            {/* Constable Assigned Field */}
            <div>
              <label htmlFor="constableId" className="block text-sm font-medium mb-1">
                Constable Assigned
              </label>
              <select
                id="constableId"
                name="constableId"
                value={formData.constableId}
                onChange={handleChange}
                className="input w-full"
                disabled={isLoading}
              >
                <option value="">-- Select Constable --</option>
                {constables.map(constable => (
                  <option key={constable.id} value={constable.id}>
                    {constable.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t border-border px-6 py-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : isEditing ? 'Update Beat' : 'Create Beat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}