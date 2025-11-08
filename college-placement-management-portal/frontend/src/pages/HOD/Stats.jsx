// src/pages/hod/Stats.jsx
import { useEffect, useState } from 'react';
import client from '../../api/axiosClient';
import Card from '../../components/Card';

export default function Stats() {
  const [data, setData] = useState(null);
  useEffect(() => { client.get('/hod/stats').then(r => setData(r.data)); }, []);
  if (!data) return <div>Loading…</div>;
  const items = [
    ['Approved', data.total],
    ['Eligible', data.eligible],
    ['Applications', data.applied],
    ['Offers', data.offers],
    ['Drives', data.drivesCount],
    ['Placement Rate', `${data.placementRate}%`],
  ];
  return (
    <div>
      <h2 className="text-2xl font-semibold">Department Performance</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {items.map(([k,v]) => (
          <Card key={k}><div className="text-sm text-slate-500">{k}</div><div className="mt-2 text-xl font-semibold">{v}</div></Card>
        ))}
      </div>
      <Card>
        <div className="text-sm text-slate-500 mb-2">Top Companies</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><Th>Company</Th><Th>Applications</Th><Th>Offers</Th></tr></thead>
          <tbody>
            {data.byCompany.map(c => <tr key={c._id} className="border-t"><Td>{c._id}</Td><Td>{c.applications}</Td><Td>{c.offers}</Td></tr>)}
            {!data.byCompany.length && <tr><td colSpan="3" className="py-6 text-center text-slate-500">No data</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function Th({ children }) { return <th className="text-left p-3 font-medium">{children}</th>; }
function Td({ children }) { return <td className="p-3">{children}</td>; }
