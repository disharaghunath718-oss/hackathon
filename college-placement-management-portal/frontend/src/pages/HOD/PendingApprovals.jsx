import { useEffect, useState } from 'react';
import client from '../../api/axiosClient';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

export default function PendingApprovals() {
  const [rows, setRows] = useState([]);
  const load = () => client.get('/hod/pending').then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await client.patch(`/hod/students/${id}/approve`);
    toast.success('Approved');
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Pending Approvals</h2>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500">Students awaiting approval</p>
          <button onClick={load} className="px-3 py-1 rounded border">Refresh</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><Th>Name</Th><Th>Roll</Th><Th>Email</Th><Th>Dept</Th><Th></Th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <Td>{r.name}</Td><Td>{r.rollNo}</Td><Td>{r.email}</Td><Td>{r.department}</Td>
                <Td><button onClick={() => approve(r._id)} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button></Td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="5" className="py-6 text-center text-slate-500">No pending approvals</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Th({ children }) { return <th className="text-left p-3 font-medium">{children}</th>; }
function Td({ children }) { return <td className="p-3">{children}</td>; }
