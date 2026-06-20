import { useRef, useState, useCallback } from 'react'

const GOLD = '#C9A86A'
const NAVY = 'rgba(10,22,40,0.92)'

const SLOTS = [
  { key: 'jerseyFront', label: 'Jersey',  side: 'Front' },
  { key: 'jerseyBack',  label: 'Jersey',  side: 'Back'  },
  { key: 'shortsFront', label: 'Shorts',  side: 'Front' },
  { key: 'shortsBack',  label: 'Shorts',  side: 'Back'  },
]

function DropZone({ slotKey, label, side, value, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    onChange(slotKey, url)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    loadFile(e.dataTransfer.files[0])
  }, [slotKey])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        flex: 1,
        minWidth: 110,
        border: `1px dashed ${dragging ? GOLD : 'rgba(201,168,106,0.35)'}`,
        borderRadius: 10,
        padding: '10px 8px',
        cursor: 'pointer',
        background: dragging ? 'rgba(201,168,106,0.08)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {value ? (
        <>
          <img
            src={value}
            alt={`${label} ${side}`}
            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, display: 'block' }}
          />
          <div style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(10,20,40,0.7)', borderRadius: 4, padding: '1px 5px', fontSize: 9, color: GOLD }}>✓</div>
        </>
      ) : (
        <div style={{ height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%' }}>
          <span style={{ fontSize: 22, opacity: 0.4 }}>↑</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.4 }}>Drop image<br/>or click</span>
        </div>
      )}
      <div style={{ fontSize: 10, color: value ? GOLD : 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textAlign: 'center' }}>
        <span style={{ opacity: 0.6 }}>{label} · </span>{side}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => loadFile(e.target.files[0])}
      />
    </div>
  )
}

export default function UploadPanel({ uploads, onChange, onReset, onTryDemo }) {
  const [open, setOpen] = useState(false)
  const anyUploaded = Object.values(uploads).some(Boolean)

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 64, right: 20, zIndex: 200,
          background: anyUploaded ? GOLD : NAVY,
          border: `0.5px solid ${GOLD}`,
          color: anyUploaded ? '#0a1628' : GOLD,
          borderRadius: 20, padding: '8px 16px',
          fontSize: 11, letterSpacing: '0.08em',
          cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: anyUploaded ? `0 0 12px rgba(201,168,106,0.4)` : 'none',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: 14 }}>🎨</span>
        {anyUploaded ? 'Custom Design' : 'Upload Design'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 108, right: 20, zIndex: 201,
          background: 'rgba(8,16,34,0.97)',
          border: `0.5px solid rgba(201,168,106,0.3)`,
          borderRadius: 14, padding: '18px 16px',
          width: 320,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Custom Design</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#fff', fontWeight: 500 }}>Upload your own kit</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '0 0 14px', lineHeight: 1.6 }}>
            Upload flat design images for each panel. JPG, PNG, or WebP — any size.
          </p>

          {/* Drop zones */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {SLOTS.map(s => (
              <DropZone key={s.key} {...s} value={uploads[s.key]} onChange={onChange} />
            ))}
          </div>

          {/* Demo button */}
          <button
            onClick={() => { onTryDemo(); setOpen(false) }}
            style={{
              width: '100%', padding: '9px 0', marginBottom: 8,
              background: 'rgba(201,168,106,0.10)',
              border: `0.5px solid rgba(201,168,106,0.4)`,
              borderRadius: 8, color: GOLD,
              fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            ✦ Try the Vancouver 2026 Demo Design
          </button>

          {/* Reset */}
          {anyUploaded && (
            <button
              onClick={() => { onReset(); setOpen(false) }}
              style={{
                width: '100%', padding: '8px 0',
                background: 'none', border: '0.5px solid rgba(255,255,255,0.12)',
                borderRadius: 8, color: 'rgba(255,255,255,0.4)',
                fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
              }}
            >
              Reset to Default Design
            </button>
          )}
        </div>
      )}
    </>
  )
}
