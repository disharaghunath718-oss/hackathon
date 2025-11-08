import React, { useEffect, useState } from 'react';
import client from '../../api/axiosClient';
import Card from '../../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const [drives, setDrives] = useState([]);
  const [apps, setApps] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    client.get('/drives/active').then(r => setDrives(r.data)).catch(()=>{});
    client.get('/applications/me').then(r => setApps(r.data)).catch(()=>{});
    client.get('/students/me').then(r => setMe(r.data)).catch(()=>{});
  }, []);

  const offers = apps.filter(a => a.status === 'selected').length;
  const pieData = [
    { name: 'Applied', value: apps.length },
    { name: 'Selected', value: offers }
  ];
  const colors = ['#0ea5e9', '#34d399'];

  const exportMine = async () => {
    try {
        const res = await client.get('/applications/me/export', { responseType: 'arraybuffer' });
        
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'my_applications.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.h2 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-2xl font-semibold">
        Student Dashboard
      </motion.h2>

      <div className="grid md:grid-cols-4 gap-4">
        <Card><div className="text-sm text-slate-500">Approval Status</div><div className="mt-2 text-xl font-semibold">{me?.status || '—'}</div></Card>
        <Card><div className="text-sm text-slate-500">Active Drives</div><div className="mt-2 text-2xl">{drives.length}</div></Card>
        <Card><div className="text-sm text-slate-500">Applications</div><div className="mt-2 text-2xl">{apps.length}</div></Card>
        <Card><div className="text-sm text-slate-500">Offers</div><div className="mt-2 text-2xl">{offers}</div></Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">Available Drives</h4>
              <a href="/student/drives" className="px-3 py-1 bg-brand-500 text-white rounded">View all</a>
            </div>
            <div className="space-y-3">
              {drives.slice(0, 5).map(d => (
                <motion.div key={d._id} whileHover={{scale:1.02}} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{d.companyName}</div>
                    <div className="text-sm text-slate-500">{d.role}</div>
                  </div>
                  <a href="/student/drives" className="px-3 py-1 bg-brand-500 text-white rounded">Apply</a>
                </motion.div>
              ))}
              {!drives.length && <div className="text-sm text-slate-500">No active drives.</div>}
            </div>
          </Card>
        </div>

        <Card>
          <h4 className="text-lg font-semibold mb-3">Snapshot</h4>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={40} outerRadius={70} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <button onClick={exportMine} className="mt-3 px-3 py-1 bg-slate-800 text-white rounded">Export my applications</button>
        </Card>
      </div>

      <Card>
        <h4 className="text-lg font-semibold mb-3">My Applications</h4>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><Th>Company</Th><Th>Role</Th><Th>Status</Th><Th>Applied At</Th></tr>
          </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a._id} className="border-t">
              <Td>{a.drive?.companyName || '-'}</Td>
              <Td>{a.drive?.role || '-'}</Td>
              <Td>{a.status}</Td>
              <Td>{new Date(a.createdAt).toLocaleString()}</Td>
            </tr>
          ))}
          {!apps.length && <tr><td colSpan="4" className="py-6 text-center text-slate-500">No applications yet.</td></tr>}
        </tbody>
        </table>
      </Card>
    </div>
  );
}

function Th({ children }) { return <th className="text-left p-3 font-medium">{children}</th>; }
function Td({ children }) { return <td className="p-3">{children}</td>; }
