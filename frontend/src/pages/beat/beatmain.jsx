'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import api from '@/utils/axiosInstance';
import UserInfoModal from "@/utils/UserInfoModal";

export default function BeatsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [beats, setBeats] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const getStationIdFromBeat = (beatId) => beatId;
    
    const beatOptions = ['STN001', 'STN002', 'STN003', 'STN004', 'STN005', 'STN006', 'STN007'];
    const [formData, setFormData] = useState({
        beat_id: '',
        assigned_to: '',
        area_covered: '',
        start_time: '',
        end_time: '',
        priority_level: '',
        special_instructions: '',
    });
    const filteredUsers = users.filter(user => user.stationId === formData.beat_id)
    // (formData.beat_id));



    const fetchBeats = async () => {
        try {
            const response = await api.get('/beat/');
            setBeats(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch beats:', error);
        }
    };

    useEffect(() => {
        fetchBeats();
    }, []);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/all/data');
                setUsers(response.data.users);
                console.log(users)
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);


    
   


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                area_covered: formData.area_covered.split(',').map(item => item.trim()), // convert comma separated to array
                start_time: new Date(`1970-01-01T${formData.start_time}:00Z`), // treat as time only
                end_time: new Date(`1970-01-01T${formData.end_time}:00Z`),
            };
            const resp =  api.post('/beat/', payload);
            fetchBeats();
            setIsModalOpen(false);
            setFormData({
                beat_id: '',
                assigned_to: '',
                area_covered: '',
                start_time: '',
                end_time: '',
                priority_level: '',
                special_instructions: '',
            });
        } catch (error) {
            console.error('Failed to assign beat:', error);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Beats Management</h1>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-2xl shadow-md hover:bg-primary-700 transition"
                >
                    + Create Beat
                </button>
            </div>

            {/* Beats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beats.length > 0 ? (
                    beats.map((beat) => (
                        <div key={beat._id} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">Beat ID: {beat.beat_id}</h2>
                            <button
                                onClick={() => setSelectedUserId(beat.assigned_to)}
                                className="text-blue-600 hover:underline"
                            >
                                {beat.assigned_to}
                            </button>
                            <p className="text-gray-700"><strong>Assigned To:</strong> {beat.assigned_to}</p>

                            <p className="text-gray-700"><strong>Area Covered:</strong> {beat.area_covered.join(', ')}</p>
                            <p className="text-gray-700"><strong>Priority:</strong> {beat.priority_level.enum[0]}</p>
                            <p className="text-gray-700"><strong>Timing:</strong> {new Date(beat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(beat.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-gray-700"><strong>Status:</strong> {beat.status}</p>
                            <p className="text-gray-500 mt-2"><strong>Instructions:</strong> {beat.special_instructions}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No beats assigned yet.</p>
                )}
            </div>

            {/* Modal for Creating Beat */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-2xl font-bold">Assign a New Beat</Dialog.Title>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                                ✖️
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                name="beat_id"
                                value={formData.beat_id}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            >
                                <option value="">Select Beat ID</option>
                                {beatOptions.map(id => (
                                    <option key={id} value={id}>{id}</option>
                                ))}
                            </select>

                            <select
                                name="assigned_to"
                                value={formData.assigned_to}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                                disabled={!formData.beat_id}
                            >
                                <option value="">Select User</option>
                                {filteredUsers?.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.stationId}) ({user.rank})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="area_covered"
                                placeholder="Area Covered (comma separated)"
                                value={formData.area_covered}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <input
                                type="text"
                                name="priority_level"
                                placeholder="Priority Level"
                                value={formData.priority_level}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <textarea
                                name="special_instructions"
                                placeholder="Special Instructions"
                                value={formData.special_instructions}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                            />

                            <button
                                type="submit"
                                className="w-full py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition"
                            >
                                Assign Beat
                            </button>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
              <UserInfoModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                  />
        </div>
    );
}
