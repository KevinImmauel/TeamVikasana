'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AssignBeatForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        beat_id: '',
        assigned_to: '',
        assigned_by: '',
        area_covered: '',
        start_time: '',
        end_time: '',
        priority_level: '',
        special_instructions: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/beats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to assign beat');

            router.push('/beats');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-lg rounded-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center mb-4">Assign New Beat</h2>
                <input className="border p-2 rounded" name="beat_id" placeholder="Beat ID" value={formData.beat_id} onChange={handleChange} required />
                <input className="border p-2 rounded" name="assigned_to" placeholder="Assigned To" value={formData.assigned_to} onChange={handleChange} required />
                <input className="border p-2 rounded" name="assigned_by" placeholder="Assigned By" value={formData.assigned_by} onChange={handleChange} required />
                <input className="border p-2 rounded" name="area_covered" placeholder="Area Covered" value={formData.area_covered} onChange={handleChange} required />
                <input className="border p-2 rounded" type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
                <input className="border p-2 rounded" type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
                <input className="border p-2 rounded" name="priority_level" placeholder="Priority Level" value={formData.priority_level} onChange={handleChange} required />
                <textarea className="border p-2 rounded" name="special_instructions" placeholder="Special Instructions" value={formData.special_instructions} onChange={handleChange} />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Assign Beat</button>
            </form>
        </div>
    );
};

export default AssignBeatForm;
