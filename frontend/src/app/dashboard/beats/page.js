"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import beatsService from "../../services/beats";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BeatModal from "../../../components/BeatModal";

export default function BeatsManagement() {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock constables data - in production this would come from an API
  const [constables, setConstables] = useState([
    { id: "1001", name: "Officer J. Smith" },
    { id: "1002", name: "Officer M. Johnson" },
    { id: "1003", name: "Officer A. Williams" },
    { id: "1004", name: "Officer R. Brown" },
  ]);

  useEffect(() => {
    fetchBeats();
  }, []);
  
  // Fetch beats data from API
  async function fetchBeats() {
    try {
      setLoading(true);
      // In a real app, this would fetch data from API
      // const data = await beatsService.getAllBeats();
      
      // Mock data for demo purposes
      const data = [
        {
          id: "BT-001",
          name: "Downtown Beat",
          area: "Downtown Area",
          frequency: "Daily",
          constableId: "1001",
          constableName: "Officer J. Smith",
          status: "Active",
          time: "08:00 - 16:00"
        },
        {
          id: "BT-002",
          name: "Riverside Beat",
          area: "Riverside Zone",
          frequency: "Night",
          constableId: "1002",
          constableName: "Officer M. Johnson",
          status: "Scheduled",
          time: "16:00 - 00:00"
        }
      ];
      
      setBeats(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching beats:", error);
      setError("Failed to load beats data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  
  // Open modal for creating new beat
  const handleCreateBeat = () => {
    setSelectedBeat(null);
    setIsModalOpen(true);
  };
  
  // Open modal for editing beat
  const handleEditBeat = (beat) => {
    setSelectedBeat(beat);
    setIsModalOpen(true);
  };
  
  // Handle modal form submission for create/update
  const handleModalSubmit = async (formData, isEditing) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        // In a real app, this would call the update API
        // await beatsService.updateBeat(selectedBeat.id, formData);
        
        // Update local state (simulating API update)
        setBeats(beats.map(beat => 
          beat.id === selectedBeat.id 
            ? { 
                ...beat, 
                name: formData.name, 
                area: formData.area, 
                frequency: formData.frequency,
                constableId: formData.constableId,
                constableName: constables.find(c => c.id === formData.constableId)?.name || ''
              } 
            : beat
        ));
        
        showToast(`Beat "${formData.name}" updated successfully`, 'success');
      } else {
        // In a real app, this would call the create API
        // const newBeat = await beatsService.createBeat(formData);
        
        // Create mock beat and add to local state
        const newBeat = {
          id: `BT-${Math.floor(Math.random() * 1000)}`,
          ...formData,
          constableName: constables.find(c => c.id === formData.constableId)?.name || '',
          status: 'Scheduled',
          time: '08:00 - 16:00'
        };
        
        setBeats([...beats, newBeat]);
        showToast(`Beat "${formData.name}" created successfully`, 'success');
      }
      
      // Close modal on success
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} beat:`, error);
      showToast(`Failed to ${isEditing ? 'update' : 'create'} beat. Please try again.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle beat deletion
  const handleDeleteBeat = async (beat) => {
    if (!confirm(`Are you sure you want to delete the beat "${beat.name}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would call the delete API
      // await beatsService.deleteBeat(beat.id);
      
      // Remove from local state (simulating API deletion)
      setBeats(beats.filter(b => b.id !== beat.id));
      
      showToast(`Beat "${beat.name}" deleted successfully`, 'success');
    } catch (error) {
      console.error("Error deleting beat:", error);
      showToast('Failed to delete beat. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && beats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading beats data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive p-6 rounded-lg">
        <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => fetchBeats()} 
          className="mt-4 btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beat Management</h1>
          <p className="text-muted-foreground mt-1">Assign and monitor patrol beats</p>
        </div>
        
        {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
          <div className="mt-4 md:mt-0">
            <button 
              className="btn-primary"
              onClick={handleCreateBeat}
            >
              + Assign New Beat
            </button>
          </div>
        )}
      </div>

      {beats.length === 0 ? (
        <div className="card py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No active beats</h3>
            <p className="text-muted-foreground">No beats are currently assigned or active.</p>
            {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
              <button 
                className="btn-primary mt-4"
                onClick={handleCreateBeat}
              >
                Assign New Beat
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left">Beat ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Officer</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {beats.map((beat) => (
                <tr key={beat.id} className="border-b border-border">
                  <td className="p-3">{beat.id}</td>
                  <td className="p-3">{beat.name}</td>
                  <td className="p-3">{beat.area}</td>
                  <td className="p-3">{beat.constableName || 'Unassigned'}</td>
                  <td className="p-3">{beat.frequency}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 ${
                      beat.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      beat.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    } rounded-full text-xs`}>
                      {beat.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-primary hover:underline mr-2">View</button>
                    
                    {(hasRole("SuperAdmin") || hasRole("SHO")) && (
                      <>
                        <button 
                          className="text-primary hover:underline mr-2"
                          onClick={() => handleEditBeat(beat)}
                        >
                          Edit
                        </button>
                        
                        <button 
                          className="text-destructive hover:underline"
                          onClick={() => handleDeleteBeat(beat)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Beat Modal for Create/Edit */}
      <BeatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedBeat}
        constables={constables}
        isLoading={isSubmitting}
      />
    </div>
  );
}