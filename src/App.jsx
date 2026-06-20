import { useState } from 'react'
import JerseyViewer3D from './JerseyViewer3D'
import DetailPanel from './DetailPanel'
import { HOTSPOT_DATA } from './hotspotData'

export default function App() {
  const [activeDetail, setActiveDetail] = useState(null)

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(160deg, #0a1628 0%, #0d2044 50%, #0a1628 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ padding: '20px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', color: '#C9A96A', margin: '0 0 4px', textTransform: 'uppercase' }}>FIFA World Cup 2026</p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: '#fff', margin: 0 }}>
            Vancouver <span style={{ color: '#C9A96A' }}>Host City Kit</span>
          </h1>
        </div>
        <div style={{ background: 'rgba(201,169,106,0.12)', border: '0.5px solid #C9A96A', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: '#C9A96A', letterSpacing: '0.1em' }}>
          CONCEPT
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <JerseyViewer3D onHotspotClick={(id) => setActiveDetail(HOTSPOT_DATA[id] || null)} />
      </div>

      {activeDetail && <DetailPanel data={activeDetail} onClose={() => setActiveDetail(null)} />}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '10px 0 16px', flexShrink: 0 }}>
        {['Rooted Here', 'Moving Together', 'Coast Mountains'].map(tag => (
          <span key={tag} style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
