import React, { useState } from 'react';
import client from '../../api/axiosClient';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

export default function ATS() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [skills, setSkills] = useState('react, node, mongodb');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return toast.error('Attach resume');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobDescription', jd);
      fd.append('requiredSkills', skills);
      const r = await client.post('/ats/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setResult(r.data);
      toast.success('Analyzed with Gemini');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">ATS (Gemini)</h2>
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm text-slate-500 mb-1">Resume (PDF/DOCX)</div>
            <input type="file" accept=".pdf,.docx,.txt" onChange={e=>setFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <div className="text-sm text-slate-500 mb-1">Required skills (comma)</div>
            <input className="w-full p-2 border rounded" value={skills} onChange={e=>setSkills(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-slate-500 mb-1">Job Description (optional)</div>
            <textarea rows={4} className="w-full p-2 border rounded" value={jd} onChange={e=>setJd(e.target.value)} />
          </div>
        </div>
        <button onClick={analyze} disabled={loading} className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded">
          {loading ? 'Analyzing…' : 'Analyze with Gemini'}
        </button>
      </Card>

      {result && (
        <Card>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div><b>Score:</b> {result?.jobFit?.score}/100</div>
            <div><b>Missing skills:</b> {result?.jobFit?.missingSkills?.join(', ') || '—'}</div>
            <div className="md:col-span-2"><b>Reasoning:</b> {result?.jobFit?.reasoning}</div>
            <div className="md:col-span-2"><b>Candidate skills:</b> {result?.candidate?.skills?.join(', ') || '—'}</div>
            <div className="md:col-span-2"><b>Suggested bullets:</b>
              <ul className="list-disc ml-6 mt-1">
                {result?.suggestions?.bullets?.map((b,i)=><li key={i}>{b}</li>)}
              </ul>
            </div>
            <div className="md:col-span-2"><b>Formatting tips:</b>
              <ul className="list-disc ml-6 mt-1">
                {result?.suggestions?.formattingTips?.map((t,i)=><li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
