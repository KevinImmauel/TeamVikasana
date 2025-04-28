'use client';

import { useEffect, useState } from 'react';

const BeatList = () => {
    const [beats, setBeats] = useState([]);

    useEffect(() => {
        const fetchBeats = async () => {
            try {
                const res = await fetch('/api/beats');
                const data = await res.json();
                setBeats(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBeats();
    }, []);

    return (
        <div className="max-w-5xl mx-auto my-8 p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Assigned Beats</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Beat ID</th>
                            <th className="p-2">Assigned To</th>
                            <th className="p-2">Area Covered</th>
                            <th className="p-2">Start Time</th>
                            <th className="p-2">End Time</th>
                            <th className="p-2">Priority</th>
                            <th className="p-2">Instructions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beats.map((beat) => (
                            <tr key={beat._id} className="border-t">
                                <td className="p-2">{beat.beat_id}</td>
                                <td className="p-2">{beat.assigned_to}</td>
                                <td className="p-2">{beat.area_covered}</td>
                                <td className="p-2">{new Date(beat.start_time).toLocaleString()}</td>
                                <td className="p-2">{new Date(beat.end_time).toLocaleString()}</td>
                                <td className="p-2">{beat.priority_level}</td>
                                <td className="p-2">{beat.special_instructions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BeatList;
