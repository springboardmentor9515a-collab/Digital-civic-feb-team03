export default function ExportReports() {
  const exportData = () => {
    alert("Reports Exported!")
  }

  return (
    <div className="card">
      <h2>Export Reports</h2>
      <button onClick={exportData}>Export CSV</button>
    </div>
  )
}
