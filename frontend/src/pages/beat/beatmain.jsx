'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import api from '@/utils/axiosInstance';

export default function BeatsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [beats, setBeats] = useState([]);
    const [formData, setFormData] = useState({
        beat_id: '',
        assigned_to: '',
        area_covered: '',
        start_time: '',
        end_time: '',
        priority_level: '',
        special_instructions: '',
    });

    const fetchBeats = async () => {
        try {
            const response = await api.get('/beat/');
            setBeats(response.data);
        } catch (error) {
            console.error('Failed to fetch beats:', error);
        }
    };

    useEffect(() => {
        fetchBeats();
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
                            <p className="text-gray-700"><strong>Assigned To:</strong> {beat.assigned_to}</p>
                            <p className="text-gray-700"><strong>Area Covered:</strong> {beat.area_covered.join(', ')}</p>
                            <p className="text-gray-700"><strong>Priority:</strong> {beat.priority_level}</p>
                            <p className="text-gray-700"><strong>Timing:</strong> {new Date(beat.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(beat.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                            <input
                                type="text"
                                name="beat_id"
                                placeholder="Beat ID"
                                value={formData.beat_id}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <input
                                type="text"
                                name="assigned_to"
                                placeholder="Assigned To (Constable User ID)"
                                value={formData.assigned_to}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <input
                                type="text"
                                name="area_covered"
                                placeholder="Area Covered (comma separated)"
                                value={formData.area_covered}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                           {/*  <div className="flex gap-4">
                                <input
                                    type="time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-xl"
                                    required
                                />
                                <input
                                    type="time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-xl"
                                    required
                                />
                            </div> */}
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
        </div>
    );
}
