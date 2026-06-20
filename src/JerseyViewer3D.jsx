import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ← Rename your .glb file to match this, then drop it in the /public folder
const MODEL_PATH = '/jersey.glb'

// Hotspot dots in LOCAL model space.
// x: left(-) / right(+)   y: up(+) / down(-)   z: front(+) / back(-)
// Tune these positions once you can see the loaded model.
const HOTSPOTS = [
  { id: 'blossom',   x: -0.20, y:  0.52, z:  0.14, label: 'Cherry Blossoms',       isFront: true  },
  { id: 'collar',    x:  0.00, y:  0.78, z:  0.12, label: 'V-Collar',               isFront: true  },
  { id: 'mesh',      x: -0.40, y:  0.28, z:  0.04, label: 'Underarm Mesh',          isFront: true  },
  { id: 'fabric',    x:  0.18, y:  0.08, z:  0.14, label: 'Performance Knit',       isFront: true  },
  { id: 'mountains', x:  0.22, y:  0.20, z:  0.14, label: 'Coast Mountains',        isFront: true  },
  { id: 'tag',       x: -0.14, y: -0.68, z:  0.10, label: 'Care & Edition Tag',     isFront: true  },
  { id: 'spine',     x:  0.00, y:  0.22, z: -0.14, label: 'Reflective Back Stripe', isFront: false },
]

function makeHotspotSprite() {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#C9A96A'
  ctx.beginPath(); ctx.arc(64, 64, 22, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(64, 64, 13, 0, Math.PI * 2); ctx.fill()
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c),
    transparent: true,
    opacity: 0.92,
    depthTest: false,
  })
  return new THREE.Sprite(mat)
}

export default function JerseyViewer3D({ onHotspotClick }) {
  const mountRef = useRef(null)
  const stateRef = useRef({
    renderer: null, scene: null, camera: null, controls: null,
    jerseyGroup: null, animFrameId: null,
    hotspotSprites: [],
    rotY: 0.3, isDragging: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const flip = useCallback(() => {
    const s = stateRef.current
    if (!s.jerseyGroup) return
    const start = s.jerseyGroup.rotation.y
    const target = start + Math.PI
    let t = 0
    function step() {
      t = Math.min(1, t + 0.04)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      s.jerseyGroup.rotation.y = start + ease * (target - start)
      if (t < 1) requestAnimationFrame(step)
    }
    step()
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    const s = stateRef.current
    const W = mount.clientWidth, H = mount.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)
    s.renderer = renderer

    // Scene & camera
    const scene = new THREE.Scene()
    s.scene = scene

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
    camera.position.set(0, 0, 3.0)
    s.camera = camera

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const key = new THREE.DirectionalLight(0xFFF5E0, 1.6)
    key.position.set(-2, 3, 4); scene.add(key)
    const fill = new THREE.DirectionalLight(0xD0E8FF, 0.7)
    fill.position.set(3, 0, 2); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x4080C0, 0.5)
    rim.position.set(0, -1, -3); scene.add(rim)

    // OrbitControls for smooth drag-to-rotate
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableZoom = true
    controls.minDistance = 1.5
    controls.maxDistance = 6
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    s.controls = controls

    // Stop auto-rotate on user interaction, resume after 2s
    renderer.domElement.addEventListener('pointerdown', () => {
      controls.autoRotate = false
      clearTimeout(s._autoTimer)
    })
    renderer.domElement.addEventListener('pointerup', () => {
      s._autoTimer = setTimeout(() => { controls.autoRotate = true }, 2000)
    })

    // Jersey group
    const jerseyGroup = new THREE.Group()
    scene.add(jerseyGroup)
    s.jerseyGroup = jerseyGroup

    // Load GLB
    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      (gltf) => {
        const model = gltf.scene

        // Center and scale to fit
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 1.8 / maxDim
        model.scale.setScalar(scale)
        model.position.sub(center.multiplyScalar(scale))

        jerseyGroup.add(model)

        // Add hotspot sprites
        HOTSPOTS.forEach(h => {
          const sprite = makeHotspotSprite()
          sprite.scale.set(0.10, 0.10, 1)
          sprite.position.set(h.x, h.y, h.z)
          sprite.userData = { id: h.id, isFront: h.isFront }
          jerseyGroup.add(sprite)
          s.hotspotSprites.push(sprite)
        })

        setLoading(false)
      },
      undefined,
      (err) => {
        console.error('GLB load error:', err)
        setError('Could not load jersey.glb — make sure the file is in the /public folder.')
        setLoading(false)
      }
    )

    // Raycaster for hotspot clicks
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()
    let pointerMoved = false

    renderer.domElement.addEventListener('pointerdown', () => { pointerMoved = false })
    renderer.domElement.addEventListener('pointermove', () => { pointerMoved = true })
    renderer.domElement.addEventListener('pointerup', (e) => {
      if (pointerMoved) return
      const rect = renderer.domElement.getBoundingClientRect()
      mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse2D, camera)
      const hits = raycaster.intersectObjects(s.hotspotSprites)
      if (hits.length > 0) onHotspotClick(hits[0].object.userData.id)
    })

    // Animate
    function animate() {
      s.animFrameId = requestAnimationFrame(animate)
      controls.update()

      // Show hotspot dots only on their respective face
      if (s.jerseyGroup) {
        const frontFacing = Math.cos(s.jerseyGroup.rotation.y) > 0
        s.hotspotSprites.forEach(sp => {
          sp.visible = sp.userData.isFront === frontFacing
        })
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    function onResize() {
      const W = mount.clientWidth, H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(s.animFrameId)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
          background: 'rgba(6,24,48,0.85)',
          color: '#C9A96A', fontFamily: 'sans-serif',
        }}>
          <div style={{
            width: 36, height: 36, border: '3px solid rgba(201,169,106,0.25)',
            borderTopColor: '#C9A96A', borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: '0.1em' }}>LOADING MODEL</p>
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(6,24,48,0.9)', color: '#ff6b6b',
          fontFamily: 'sans-serif', fontSize: 13, padding: 32,
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      <button onClick={flip} style={{
        position: 'absolute', bottom: 20, right: 20,
        background: 'rgba(10,22,40,0.85)', border: '0.5px solid #C9A96A',
        color: '#C9A96A', borderRadius: 20, padding: '8px 18px',
        fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'sans-serif',
      }}>Flip ↺</button>

      <p style={{
        position: 'absolute', bottom: 24, left: 20,
        fontSize: 11, color: 'rgba(255,255,255,0.35)',
        fontFamily: 'sans-serif', letterSpacing: '0.1em', margin: 0,
      }}>drag to rotate · tap dots to explore</p>
    </div>
  )
}
