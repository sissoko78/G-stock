export function LoadingScreen({ label }: { label: string }) {
  return <main className="loading-screen" aria-busy="true">
    <div className="loading-content" role="status" aria-label={label}>
      <div className="loading-mark" aria-hidden="true"><span className="loading-spinner"/><b>G</b></div>
      <span className="loading-label">{label}</span>
    </div>
  </main>
}
