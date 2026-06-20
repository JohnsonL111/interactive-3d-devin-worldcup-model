import { useState, useRef, useCallback } from 'react'
import JerseyViewer3D from './JerseyViewer3D'
import ShortsViewer3D from './ShortsViewer3D'
import DetailPanel from './DetailPanel'
import { HOTSPOT_DATA } from './hotspotData'

const BASE = import.meta.env.BASE_URL

// Realistic mode uses the background-removed design photos
const REALISTIC_URLS = {
  jerseyFront: `${BASE}demo/jersey_front.png`,
  jerseyBack:  `${BASE}demo/jersey_back.png`,
  shortsFront: `${BASE}demo/shorts_front.png`,
  shortsBack:  `${BASE}demo/shorts_back.png`,
}

// Blender mode uses the renders from the 3d branch
const BLENDER_URLS = {
  jerseyFront: `${BASE}demo/blender_front.png`,
  jerseyBack:  `${BASE}demo/blender_back.png`,
  shortsFront: null,
  shortsBack:  null,
}

const MODES = [
  { key: 'model',    label: '3D Model'  },
  { key: 'realistic',label: 'Realistic' },
  { key: 'blender',  label: 'Blender'   },
]

export default function App() {
  const [activeDetail, setActiveDetail] = useState(null)
  const [viewMode, setViewMode] = useState('model') // 'model' | 'realistic' | 'blender'

  // Shared rotation state — live refs so both viewers stay perfectly in sync
  const rotY = useRef(0.3)
  const rotX = useRef(0)

  // flip / zoomBack functions exposed by JerseyViewer3D once it mounts
  const flipFn = useRef(null)
  const zoomBackFn = useRef(null)
  const handleFlipReady = useCallback((fn) => { flipFn.current = fn }, [])
  const handleZoomBackReady = useCallback((fn) => { zoomBackFn.current = fn }, [])
  const handleFlip = useCallback(() => { flipFn.current?.() }, [])
  const handleClose = useCallback(() => { zoomBackFn.current?.(); setActiveDetail(null) }, [])

  const handleHotspot = useCallback((id) => {
    setActiveDetail(HOTSPOT_DATA[id] || null)
  }, [])

  const urls = viewMode === 'realistic' ? REALISTIC_URLS
             : viewMode === 'blender'   ? BLENDER_URLS
             : { jerseyFront: null, jerseyBack: null, shortsFront: null, shortsBack: null }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(160deg, #0a1628 0%, #0d2044 50%, #0a1628 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', color: '#C9A96A', margin: '0 0 4px', textTransform: 'uppercase' }}>FIFA World Cup 2026</p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: '#fff', margin: 0 }}>
            Vancouver <span style={{ color: '#C9A96A' }}>Host City Kit</span>
          </h1>
        </div>

        {/* View mode toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(201,169,106,0.3)',
          borderRadius: 24, padding: 3, gap: 2,
        }}>
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              style={{
                background: viewMode === key ? '#C9A96A' : 'transparent',
                border: 'none',
                color: viewMode === key ? '#0a1628' : 'rgba(255,255,255,0.45)',
                borderRadius: 20, padding: '5px 14px',
                fontSize: 11, letterSpacing: '0.08em',
                cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                fontWeight: viewMode === key ? 600 : 400,
                transition: 'all 0.18s',
              }}
            >
              {label}
            </button>
          ))}
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
            onFlipReady={handleFlipReady}
            onZoomBackReady={handleZoomBackReady}
            customFrontUrl={urls.jerseyFront}
            customBackUrl={urls.jerseyBack}
          />
        </div>

        {/* Shorts — takes remaining ~42% */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <ShortsViewer3D
            onHotspotClick={handleHotspot}
            rotY={rotY}
            rotX={rotX}
            customFrontUrl={urls.shortsFront}
            customBackUrl={urls.shortsBack}
          />
        </div>
      </div>

      {/* Footer — controls + tags */}
      <div style={{ flexShrink: 0, padding: '10px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.10em', margin: 0 }}>
          drag to rotate · tap dots to explore
        </p>
        <button onClick={handleFlip} style={{
          background: 'rgba(10,22,40,0.85)', border: '0.5px solid #C9A96A',
          color: '#C9A96A', borderRadius: 20, padding: '8px 18px',
          fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
        }}>Flip ↺</button>
      </div>

      {activeDetail && <DetailPanel data={activeDetail} onClose={handleClose} />}
    </div>
  )
}
