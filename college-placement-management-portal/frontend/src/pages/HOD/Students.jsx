import { useEffect, useState } from 'react';
import client from '../../api/axiosClient';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

export default function Students() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => client.get(`/hod/students`, { params: { search } }).then(r => setRows(r.data));
  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [search]);

  const save = async () => {
    await client.put(`/hod/students/${editing._id}`, editing);
    toast.success('Updated');
    setEditing(null);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Students</h2>
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <input className="border rounded px-3 py-2 w-72" placeholder="Search name/email/roll"
                 value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={load} className="px-3 py-2 rounded border">Refresh</button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><Th>Roll</Th><Th>Name</Th><Th>Email</Th><Th>CGPA</Th><Th>Backlogs</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <Td>{r.rollNo}</Td><Td>{r.name}</Td><Td>{r.email}</Td>
                <Td>{r.cgpa}</Td><Td>{r.backlogCount}</Td><Td>{r.status}</Td>
                <Td><button onClick={() => setEditing(r)} className="px-3 py-1 rounded border">Edit</button></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* edit drawer */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-5 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Edit Student</h3>
              <button onClick={() => setEditing(null)} className="text-slate-500">✕</button>
            </div>
            <Field label="Name" value={editing.name} onChange={v => setEditing(s => ({ ...s, name: v }))} />
            <Field label="Email" value={editing.email} onChange={v => setEditing(s => ({ ...s, email: v }))} />
            <Field label="Phone" value={editing.phone || ''} onChange={v => setEditing(s => ({ ...s, phone: v }))} />
            <Field label="CGPA" type="number" value={editing.cgpa} onChange={v => setEditing(s => ({ ...s, cgpa: +v }))} />
            <Field label="Backlogs" type="number" value={editing.backlogCount} onChange={v => setEditing(s => ({ ...s, backlogCount: +v }))} />
            <div className="mt-4 flex gap-2">
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }) { return <th className="text-left p-3 font-medium">{children}</th>; }
function Td({ children }) { return <td className="p-3">{children}</td>; }
function Field({ label, value, onChange, type='text' }) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <input className="w-full border rounded px-3 py-2" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}
