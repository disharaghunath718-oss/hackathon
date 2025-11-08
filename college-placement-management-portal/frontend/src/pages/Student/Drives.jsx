import React, { useEffect, useState } from 'react';
import client from '../../api/axiosClient';
import toast from 'react-hot-toast';
import Card from '../../components/Card';

export default function Drives() {
  const [drives, setDrives] = useState([]);

  // ✅ Fetch all active drives
  useEffect(() => {
    client
      .get('/drives/active')
      .then((r) => setDrives(r.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle resume upload and apply
  const onApply = async (driveId, e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.resume.files[0];
    if (!file) return toast.error('Please attach a resume.');

    const fd = new FormData();
    fd.append('driveId', driveId);
    fd.append('resume', file);

    try {
      const res = await client.post('/applications/upload-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message || 'Application submitted successfully!');
      form.reset();
    } catch (err) {
      console.error('❌ Upload error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Placement Drives</h2>
      {drives.length === 0 ? (
        <p className="text-slate-500">No active drives right now.</p>
      ) : (
        <div className="grid gap-4">
          {drives.map((d) => (
            <Card key={d._id} className="flex justify-between items-center p-4">
              <div>
                <div className="font-semibold text-lg">
                  {d.companyName} — {d.role}
                </div>
                <div className="text-sm text-slate-500">{d.description}</div>
              </div>
              <form onSubmit={(e) => onApply(d._id, e)} className="flex items-center gap-2">
                <input
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="text-sm"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Apply
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
