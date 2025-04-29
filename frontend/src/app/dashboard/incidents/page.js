"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import api from "@/utils/axiosInstance";
import UserInfoModal from "@/utils/UserInfoModal";


export default function IncidentsManagement() {
  const { hasRole } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [loc, setLoc] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [incidentType, setIncidentType] = useState("Other"); 


  useEffect(() => {
    async function fetchIncidents() {
      try {
        setLoading(true);
        const response = await api.get("/incident");
        setIncidents(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching incidents data:", error);
        setError("Failed to load incidents data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    });
  };

  const fetchUserLocation = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      setUserLocation(`${latitude}, ${longitude}`);
      setLoc({
        latitude, longitude
      })
    } catch (err) {
      console.error("Location fetch failed:", err.message);
      setUserLocation("Failed to get location");
    }
  };

  const handleReportIncidentClick = () => {
    setIsModalOpen(true);
    fetchUserLocation();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const incidentData = {
      incident_type: formData.get("incident_type"),
      location: loc,
      description: formData.get("description"),
      attachments: formData.get("attachments"),
    };
    console.log(incidentData)

    try {
      const newIncident = await api.post("/incident/", incidentData);
      setIncidents((prevIncidents) => [newIncident, ...prevIncidents]);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting incident:", error);
      setError("Failed to report incident. Please try again.");
    }
  };

  // Handle opening image in modal
  const handleViewImage = (imagePath) => {
    setImageUrl(imagePath);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading incidents data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive p-6 rounded-lg">
        <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Incident Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage incident reports</p>
        </div>

        <div className="mt-4 md:mt-0">
          <button className="btn-primary" onClick={handleReportIncidentClick}>
            + Report New Incident
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">🚨 Report a New Incident</h2>

            <form onSubmit={handleSubmitIncident} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Incident Type</label>
                <select
                  name="incident_type"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={incidentType || "Other"} // Set default to "Other"
                  onChange={(e) => setIncidentType(e.target.value)} // Handle state change
                  required
                >
                  <option value="Traffic">Traffic</option>
                  <option value="Theft">Theft</option>
                  <option value="Assault">Assault</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Disturbance">Disturbance</option>
                  <option value="Other">Other</option>
                </select>
              </div>


              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="location"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={fetchUserLocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  >
                    🔄 Reload
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Attachments</label>
                <input
                  type="file"
                  name="attachments"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {incidents.length === 0 ? (
        <div className="card py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No incidents reported</h3>
            <p className="text-muted-foreground">No incidents have been reported yet.</p>
            <button className="btn-primary mt-4" onClick={handleReportIncidentClick}>
              Report New Incident
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Reported By</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Reported On</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-border">
                  <td className="p-3">{incident._id?.slice(-2) || "N/A"}</td>

                  <td className="p-3">{incident.incident_type}</td>
                  <td className="p-3">
                    <a
                      href={`https://www.google.com/maps?q=${incident.location?.latitude},${incident.location?.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Location
                    </a>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => setSelectedUserId(incident.reported_by)}
                      className="text-blue-600 hover:underline"
                    >
                      {incident.reported_by}
                    </button>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${incident.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : incident.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(incident.reported_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-3">
                    <button className="text-primary hover:underline mr-2">View</button>
                    {(hasRole("SuperAdmin") || hasRole("SHO")) && (
                      <button className="text-primary hover:underline">Update</button>
                    )}
                    {/* Open image view if available */}
                    {incident.attachments && incident.attachments.length > 0 && (
                      <button
                        onClick={() => handleViewImage(incident.attachments[0].url)}
                        className="text-primary hover:underline ml-2"
                      >
                        View Image
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
            <img src={imageUrl} alt="Incident Attachment" className="w-full h-auto" />
            <button
              onClick={() => setImageUrl("")}
              className="mt-4 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <UserInfoModal
        userId={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}
