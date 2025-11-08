
import React, { useState } from 'react'
import client from '../../api/axiosClient'
import Card from '../../components/Card'
import toast from 'react-hot-toast'

export default function Reports() {
  const [loading, setLoading] = useState(false)
  const exportDeptExcel = async () => {
  try {
    const res = await client.get('/reports/department/excel', { responseType: 'arraybuffer' });
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'department.xlsx'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Department Excel exported');
  } catch { toast.error('Export failed'); }
};


  const exportExcel = async () => {
    setLoading(true)
    try {
      const res = await client.post('/applications/filter', { exportExcel: true }, { responseType: 'arraybuffer' })
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'applications.xlsx'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reports</h2>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Generate reports for your department</p>
            <p className="text-xs text-slate-400">Excel export with filters</p>
          </div>
          <button onClick={exportExcel} disabled={loading} className="px-4 py-2 bg-brand-500 text-white rounded">
            {loading ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </Card>
    </div>
  )
}
