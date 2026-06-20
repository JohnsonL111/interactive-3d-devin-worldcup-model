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

// Photos mode uses the uploaded images
const PHOTOS_URLS = {
  jerseyFront: `${BASE}images/front2.png`,
  jerseyBack:  `${BASE}images/back2.png`,
  shortsFront: `${BASE}images/shortsfront.png`,
  shortsBack:  `${BASE}images/shortsback.png`,
}

// Hotspot dot positions (left%, top%) on each photo — tune after viewing in browser
const PHOTO_HOTSPOTS = {
  jerseyFront: [
    { id: 'collar',    left: 50, top:  8 },
    { id: 'blossom',   left: 28, top: 18 },
    { id: 'maple',     left: 54, top: 24 },
    { id: 'mesh',      left: 14, top: 42 },
    { id: 'fabric',    left: 50, top: 40 },
    { id: 'mountains', left: 50, top: 58 },
    { id: 'waves',     left: 60, top: 72 },
    { id: 'tag',       left: 24, top: 82 },
    { id: 'hem',       left: 50, top: 88 },
  ],
  jerseyBack: [
    { id: 'spine',  left: 50, top: 38 },
    { id: 'route',  left: 54, top: 50 },
    { id: 'coords', left: 50, top: 84 },
  ],
  shortsFront: [
    { id: 'shorts_number',  left: 30, top: 58 },
    { id: 'shorts_blossom', left: 22, top: 72 },
    { id: 'shorts_waves',   left: 62, top: 68 },
    { id: 'shorts_hem',     left: 50, top: 88 },
  ],
  shortsBack: [
    { id: 'shorts_maple', left: 50, top: 14 },
    { id: 'shorts_hem',   left: 50, top: 88 },
  ],
}

const MODES = [
  { key: 'model',    label: '3D Model'  },
  { key: 'realistic',label: 'Realistic' },
  { key: 'blender',  label: 'Blender'   },
  { key: 'photos',   label: 'Concept'   },
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
             : viewMode === 'photos'    ? PHOTOS_URLS
             : { jerseyFront: null, jerseyBack: null, shortsFront: null, shortsBack: null }

  const isPhotos = viewMode === 'photos'
  const [photosFront, setPhotosFront] = useState(true)
  const handlePhotosFlip = useCallback(() => setPhotosFront(f => !f), [])

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

      {/* Kit viewers */}
      {isPhotos ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '16px 32px', minHeight: 0 }}>
          {[
            { src: photosFront ? PHOTOS_URLS.jerseyFront  : PHOTOS_URLS.jerseyBack,  dots: photosFront ? PHOTO_HOTSPOTS.jerseyFront  : PHOTO_HOTSPOTS.jerseyBack,  alt: photosFront ? 'Jersey Front'  : 'Jersey Back'  },
            { src: photosFront ? PHOTOS_URLS.shortsFront  : PHOTOS_URLS.shortsBack,  dots: photosFront ? PHOTO_HOTSPOTS.shortsFront  : PHOTO_HOTSPOTS.shortsBack,  alt: photosFront ? 'Shorts Front'  : 'Shorts Back'  },
          ].map(({ src, dots, alt }) => (
            <div key={alt} style={{ position: 'relative', height: '100%', maxHeight: 560, display: 'flex', alignItems: 'center' }}>
              <img src={src} alt={alt} style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block' }} />
              {dots.map(h => (
                <button
                  key={h.id}
                  onClick={() => handleHotspot(h.id)}
                  title={HOTSPOT_DATA[h.id]?.title}
                  style={{
                    position: 'absolute',
                    left: `${h.left}%`,
                    top: `${h.top}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 26, height: 26,
                    borderRadius: '50%',
                    background: 'rgba(201,169,106,0.9)',
                    border: '2.5px solid #fff',
                    cursor: 'pointer',
                    padding: 0,
                    animation: 'photoPulse 2s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ))}
          <style>{`
            @keyframes photoPulse {
              0%,100% { box-shadow: 0 0 0 3px rgba(201,169,106,0.35); }
              50%      { box-shadow: 0 0 0 7px rgba(201,169,106,0.12); }
            }
          `}</style>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
      )}

      {/* Footer — controls + tags */}
      <div style={{ flexShrink: 0, padding: '10px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.10em', margin: 0 }}>
          {isPhotos ? 'tap flip to see the back' : 'drag to rotate · tap dots to explore'}
        </p>
        <button onClick={isPhotos ? handlePhotosFlip : handleFlip} style={{
          background: 'rgba(10,22,40,0.85)', border: '0.5px solid #C9A96A',
          color: '#C9A96A', borderRadius: 20, padding: '8px 18px',
          fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
        }}>Flip ↺</button>
      </div>

      {activeDetail && <DetailPanel data={activeDetail} onClose={handleClose} />}
    </div>
  )
}
