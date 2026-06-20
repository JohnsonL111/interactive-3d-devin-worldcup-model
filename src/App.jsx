import { useState, useRef, useCallback } from 'react'
import JerseyViewer3D from './JerseyViewer3D'
import ShortsViewer3D from './ShortsViewer3D'
import DetailPanel from './DetailPanel'
import { HOTSPOT_DATA } from './hotspotData'

export default function App() {
  const [activeDetail, setActiveDetail] = useState(null)

  // Shared rotation state — live refs so both viewers stay perfectly in sync
  const rotY = useRef(0.3)
  const rotX = useRef(0)

  const handleHotspot = useCallback((id) => {
    setActiveDetail(HOTSPOT_DATA[id] || null)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(160deg, #0a1628 0%, #0d2044 50%, #0a1628 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
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

      {/* Kit viewers — jersey top, shorts bottom, stacked */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {/* Jersey — takes ~58% of the space */}
        <div style={{ flex: '0 0 58%', position: 'relative', minHeight: 0 }}>
          <JerseyViewer3D
            onHotspotClick={handleHotspot}
            sharedRotY={rotY}
            sharedRotX={rotX}
          />
        </div>

        {/* Divider label */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,169,106,0.18)' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(201,169,106,0.45)', textTransform: 'uppercase' }}>Shorts</span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,169,106,0.18)' }} />
        </div>

        {/* Shorts — takes remaining ~42% */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <ShortsViewer3D
            onHotspotClick={handleHotspot}
            rotY={rotY}
            rotX={rotX}
          />
        </div>
      </div>

      {/* Footer tags */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '8px 0 12px', flexShrink: 0 }}>
        {['Rooted Here', 'Moving Together', 'Coast Mountains'].map(tag => (
          <span key={tag} style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tag}</span>
        ))}
      </div>

      {activeDetail && <DetailPanel data={activeDetail} onClose={() => setActiveDetail(null)} />}
    </div>
  )
}
