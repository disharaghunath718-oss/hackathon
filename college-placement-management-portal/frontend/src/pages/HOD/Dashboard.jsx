
// import React from 'react'
// import Card from '../../components/Card'

// export default function HODDashboard() {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold">HOD Dashboard</h2>
//       <div className="grid md:grid-cols-2 gap-4 mt-4">
//         <Card><div className="text-sm text-slate-500">Pending Approvals</div><div className="mt-2">Students awaiting approval</div></Card>
//         <Card><div className="text-sm text-slate-500">Department Performance</div><div className="mt-2">Charts & exports</div></Card>
//       </div>
//     </div>
//   )
// }

import { Link } from 'react-router-dom';
import Card from '../../components/Card';

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">HOD Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Link to="/hod/pending"><Card><div className="text-sm text-slate-500">Pending Approvals</div><div className="mt-2">Students awaiting approval</div></Card></Link>
        <Link to="/hod/students"><Card><div className="text-sm text-slate-500">Verify/Edit Profiles</div><div className="mt-2">Search & update students</div></Card></Link>
        <Link to="/hod/stats"><Card><div className="text-sm text-slate-500">Department Performance</div><div className="mt-2">Key metrics & companies</div></Card></Link>
        <Link to="/hod/reports"><Card><div className="text-sm text-slate-500">Reports</div><div className="mt-2">Excel / PDF export</div></Card></Link>
      </div>
    </div>
  );
}
