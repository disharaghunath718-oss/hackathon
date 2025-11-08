// import React, { useEffect, useState } from 'react';
// import client from '../../api/axiosClient';
// import toast from 'react-hot-toast';
// import Card from '../../components/Card';
// import { useNavigate } from 'react-router-dom';

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [file, setFile] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const nav = useNavigate();

//   const load = async () => {
//     try {
//       setError('');
//       const r = await client.get('/students/me'); // -> /api/students/me
//       setProfile(r.data);
//     } catch (err) {
//       const code = err?.response?.status;
//       const msg = err?.response?.data?.message || err.message || 'Failed to load profile';
//       setError(msg);
//       console.error('PROFILE ERROR:', err?.response || err);
//       toast.error(msg);
//       if (code === 401) {
//         // not authenticated or token invalid -> kick to login
//         nav('/login');
//       }
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const onUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return toast.error('Choose a file');
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append('resume', file);
//       const r = await client.post('/students/me/resume', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       toast.success('Resume uploaded');
//       setProfile(p => ({ ...p, resumeUrl: r.data.resumeUrl }));
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const submitForApproval = async () => {
//     setSubmitting(true);
//     try {
//       await client.post('/students/me/submit-for-approval');
//       toast.success('Submitted for HOD approval');
//       await load();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Submit failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (error && !profile) return <div className="text-red-600">Error: {error}</div>;
//   if (!profile) return <div>Loading…</div>;

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Profile</h2>

//       <div className="grid md:grid-cols-2 gap-4">
//         <Card>
//           <div className="text-sm text-slate-500">Personal details</div>
//           <div className="mt-3 space-y-1">
//             <div><strong>Name:</strong> {profile.name}</div>
//             <div><strong>Email:</strong> {profile.email}</div>
//             <div><strong>Department:</strong> {profile.department || '—'}</div>
//             <div><strong>Roll No:</strong> {profile.rollNo || '—'}</div>
//             <div><strong>Status:</strong> <span className="font-semibold">{profile.status || '—'}</span></div>
//             {profile.resumeUrl && (
//               <div className="text-sm">
//                 <strong>Resume:</strong> <a className="text-brand-600 underline" href={profile.resumeUrl} target="_blank" rel="noreferrer">View</a>
//               </div>
//             )}
//           </div>

//           <div className="mt-4">
//             <button
//               onClick={submitForApproval}
//               disabled={submitting}
//               className="px-4 py-2 border rounded disabled:opacity-50"
//             >
//               {submitting ? 'Submitting…' : 'Submit for approval'}
//             </button>
//           </div>
//         </Card>

//         <Card>
//           <div className="text-sm text-slate-500">Resume</div>
//           <form onSubmit={onUpload} className="mt-3 space-y-2">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={e => setFile(e.target.files?.[0] || null)}
//             />
//             <button
//               type="submit"
//               disabled={uploading}
//               className="px-4 py-2 bg-brand-500 text-white rounded disabled:opacity-50"
//             >
//               {uploading ? 'Uploading…' : 'Upload'}
//             </button>
//           </form>
//           <p className="text-xs text-slate-400 mt-2">PDF/DOC/DOCX, up to 5MB</p>
//         </Card>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useContext } from 'react'
import client from '../../api/axiosClient'
import toast from 'react-hot-toast'
import AuthContext from '../../context/AuthContext'
import Card from '../../components/Card'

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [file, setFile] = useState(null)

  useEffect(() => {
    client.get('/auth/me').then(r => setProfile(r.data)).catch(()=>{})
  }, [])

  const onUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Select a file')
    const fd = new FormData()
    fd.append('resume', file)
    try {
      await client.post('/applications/upload-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Uploaded')
    } catch (err) {
      toast.error('Upload failed')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm text-slate-500">Personal details</div>
          <div className="mt-3">
            <div><strong>Name:</strong> {profile?.name || user?.name}</div>
            <div><strong>Email:</strong> {profile?.email || user?.email}</div>
            <div><strong>Department:</strong> {profile?.department}</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-slate-500">Resume</div>
          <form onSubmit={onUpload} className="mt-3 space-y-2">
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files[0])} />
            <button className="mt-2 px-4 py-2 bg-brand-500 text-white rounded">Upload</button>
          </form>
        </Card>
      </div>
    </div>
  )
}

      