
// import React, { useState } from 'react'
// import client from '../../api/axiosClient'
// import toast from 'react-hot-toast'
// import Card from '../../components/Card'

// export default function TPODrives() {
//   const [form, setForm] = useState({ companyName: '', role: '', description: '' })

//   const onCreate = async (e) => {
//     e.preventDefault()
//     try {
//       await client.post('/drives', form)
//       toast.success('Drive created')
//       setForm({ companyName: '', role: '', description: '' })
//     } catch (err) {
//       toast.error('Create failed')
//     }
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Manage Drives</h2>
//       <Card>
//         <form onSubmit={onCreate} className="grid gap-3">
//           <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Company name" className="p-2 border rounded" />
//           <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role" className="p-2 border rounded" />
//           <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="p-2 border rounded" />
//           <button className="py-2 bg-brand-500 text-white rounded">Create Drive</button>
//         </form>
//       </Card>
//     </div>
//   )
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const token = localStorage.getItem("token");

  // 🟢 Fetch all drives
  const fetchDrives = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/drives", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrives(res.data);
    } catch (error) {
      console.error("❌ Error fetching drives:", error);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // 🟢 Delete drive
  const handleDeleteDrive = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/drives/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Drive deleted successfully!");
      fetchDrives();
    } catch (error) {
      console.error("❌ Error deleting drive:", error);
      alert("Failed to delete drive.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Manage Drives</h1>

      {drives.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">
          No current drives found 😴
        </p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-3">Company</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Package</th>
              <th className="border p-3">Date</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr key={drive._id} className="hover:bg-gray-50">
                <td className="border p-3">{drive.companyName}</td>
                <td className="border p-3">{drive.role}</td>
                <td className="border p-3">{drive.package || "—"}</td>
                <td className="border p-3">
                  {drive.date
                    ? new Date(drive.date).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleDeleteDrive(drive._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Drives;