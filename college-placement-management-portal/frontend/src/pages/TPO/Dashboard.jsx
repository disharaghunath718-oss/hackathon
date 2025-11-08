
// import React from 'react'
// import Card from '../../components/Card'
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
// import { motion } from 'framer-motion'

// const data = [
//   { month: 'Jan', offers: 5 },
//   { month: 'Feb', offers: 8 },
//   { month: 'Mar', offers: 12 },
//   { month: 'Apr', offers: 9 },
//   { month: 'May', offers: 14 },
// ];

// export default function TPODashboard(){
//   return (
//     <div className="space-y-6">
//       <motion.h2 initial={{opacity:0}} animate={{opacity:1}} className="text-2xl font-semibold">TPO Dashboard</motion.h2>
//       <div className="grid md:grid-cols-3 gap-4">
//         <Card><div className="text-sm text-slate-500">Create Drive</div><button className="mt-3 px-3 py-2 bg-brand-500 text-white rounded">New</button></Card>
//         <Card><div className="text-sm text-slate-500">Applications</div><div className="mt-2">View & Filter</div></Card>
//         <Card><div className="text-sm text-slate-500">Reports</div><div className="mt-2">Export</div></Card>
//       </div>

//       <Card>
//         <h4 className="text-lg font-semibold mb-3">Offers Trend</h4>
//         <div style={{ width: '100%', height: 240 }}>
//           <ResponsiveContainer>
//             <LineChart data={data}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="offers" stroke="#0ea5e9" strokeWidth={3} dot={{ r:5 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </Card>
//     </div>
//   )
// }
import React, { useState } from "react";
import axios from "axios";

const TpoDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    date: "",
  });

  const token = localStorage.getItem("token");

  // Function to create a new drive
  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/drives", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Drive created successfully!");
      setShowForm(false);
      setFormData({ companyName: "", role: "", package: "", date: "" });
    } catch (error) {
      console.error("❌ Error creating drive:", error.response?.data || error);
      alert("Failed to create drive. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">TPO Dashboard</h1>

      {/* Create Drive Section */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-medium">Create Drive</h3>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New"}
        </button>
      </div>

      {/* Drive Creation Form */}
      {showForm && (
        <form
          onSubmit={handleCreateDrive}
          className="bg-gray-100 p-4 rounded-lg shadow-md w-[400px]"
        >
          <input
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Package"
            value={formData.package}
            onChange={(e) =>
              setFormData({ ...formData, package: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Drive
          </button>
        </form>
      )}

      {/* Offers Trend Section (keep your existing chart here) */}
      <div className="mt-8">
        {/* Your existing Offers Trend chart component remains here */}
      </div>
    </div>
  );
};

export default TpoDashboard;
