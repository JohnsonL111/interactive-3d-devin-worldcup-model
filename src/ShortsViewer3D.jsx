import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

const C = {
  deepNavy:    '#0A1E42',
  navy:        '#0D2550',
  midNavy:     '#122B58',
  gold:        '#C9A86A',
  sakuraPink:  '#F0B8C8',
  sakuraMid:   '#E898B0',
  branchBrown: '#7A4858',
  white:       '#FFFFFF',
}

// ── Shared drawing helpers ────────────────────────────────────────────────────
function drawMapleLeaf(ctx, cx, cy, size) {
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = C.gold
  ctx.beginPath()
  const pts = [
    [0,-18],[2.5,-8],[10,-9],[6.5,0],[14,7],[7,5.5],[8.5,14],[0,10],
    [-8.5,14],[-7,5.5],[-14,7],[-6.5,0],[-10,-9],[-2.5,-8]
  ]
  pts.forEach(([x,y],i) => {
    const sx = x*size/18, sy = y*size/18
    i===0 ? ctx.moveTo(sx,sy) : ctx.lineTo(sx,sy)
  })
  ctx.closePath(); ctx.fill(); ctx.restore()
}

function drawBlossom(ctx, cx, cy, size, alpha=1) {
  ctx.save(); ctx.globalAlpha = alpha
  for (let i=0; i<5; i++) {
    const angle = (i/5)*Math.PI*2 - Math.PI/2
    const px = cx + Math.cos(angle)*size*0.48
    const py = cy + Math.sin(angle)*size*0.48
    ctx.fillStyle = i%2===0 ? C.sakuraPink : C.sakuraMid
    ctx.beginPath()
    ctx.ellipse(px, py, size*0.42, size*0.26, angle, 0, Math.PI*2)
    ctx.fill()
  }
  ctx.fillStyle = C.gold
  ctx.beginPath(); ctx.arc(cx, cy, size*0.16, 0, Math.PI*2); ctx.fill()
  ctx.restore()
}

function drawPetal(ctx, cx, cy, size, rotDeg, alpha=1) {
  ctx.save(); ctx.globalAlpha = alpha
  ctx.translate(cx, cy); ctx.rotate(rotDeg*Math.PI/180)
  ctx.fillStyle = C.sakuraPink
  ctx.beginPath(); ctx.ellipse(0, 0, size, size*0.55, 0, 0, Math.PI*2)
  ctx.fill(); ctx.restore()
}

// Cherry blossom branch for lower-left of shorts
function drawShortsBranch(ctx, x0, y0, W, H) {
  ctx.save()
  ctx.strokeStyle = C.branchBrown; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  // main branch going up-right
  ctx.lineWidth = W*0.007; ctx.globalAlpha = 0.9
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.bezierCurveTo(x0+W*0.09, y0-H*0.06, x0+W*0.17, y0-H*0.10, x0+W*0.22, y0-H*0.18)
  ctx.stroke()
  // sub-branch right
  ctx.lineWidth = W*0.004; ctx.globalAlpha = 0.75
  ctx.beginPath()
  ctx.moveTo(x0+W*0.14, y0-H*0.12)
  ctx.bezierCurveTo(x0+W*0.19, y0-H*0.08, x0+W*0.26, y0-H*0.07, x0+W*0.30, y0-H*0.10)
  ctx.stroke()
  // sub-branch up
  ctx.lineWidth = W*0.003; ctx.globalAlpha = 0.65
  ctx.beginPath()
  ctx.moveTo(x0+W*0.10, y0-H*0.08)
  ctx.bezierCurveTo(x0+W*0.08, y0-H*0.14, x0+W*0.10, y0-H*0.20, x0+W*0.14, y0-H*0.24)
  ctx.stroke()
  ctx.restore()

  const bSize = W*0.030
  ;[
    [x0+W*0.23, y0-H*0.185, 1.00],
    [x0+W*0.30, y0-H*0.100, 0.90],
    [x0+W*0.14, y0-H*0.245, 0.85],
    [x0+W*0.19, y0-H*0.140, 0.80],
    [x0+W*0.08, y0-H*0.080, 0.65],
  ].forEach(([bx,by,a]) => drawBlossom(ctx, bx, by, bSize, a))
}

// Gold topographic/wave lines across lower portion
function drawWaves(ctx, W, H, yStart, yEnd, count=5) {
  for (let i=0; i<count; i++) {
    const yf = yStart + (yEnd-yStart)*(i/(count-1))
    ctx.save()
    ctx.globalAlpha = 0.50 - i*0.06
    ctx.strokeStyle = C.gold; ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let x=0; x<=W; x+=5) {
      const y = H*yf + Math.sin((x/W)*Math.PI*5 + i*0.9)*6
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
    }
    ctx.stroke(); ctx.restore()
  }
}

// Subtle mountain silhouette (dark on dark, for fabric texture feel)
function drawMountains(ctx, W, H) {
  ctx.save(); ctx.globalAlpha = 0.12
  ctx.fillStyle = '#1A3A6E'
  ctx.beginPath()
  ctx.moveTo(0, H*0.62)
  ctx.lineTo(W*0.10, H*0.48); ctx.lineTo(W*0.20, H*0.54)
  ctx.lineTo(W*0.30, H*0.42); ctx.lineTo(W*0.40, H*0.50)
  ctx.lineTo(W*0.50, H*0.38); ctx.lineTo(W*0.60, H*0.46)
  ctx.lineTo(W*0.70, H*0.40); ctx.lineTo(W*0.80, H*0.50)
  ctx.lineTo(W*0.90, H*0.44); ctx.lineTo(W, H*0.52)
  ctx.lineTo(W, H); ctx.lineTo(0, H)
  ctx.closePath(); ctx.fill(); ctx.restore()
}

// Reflective hem stripe at bottom
function drawHem(ctx, W, H) {
  ctx.save()
  ctx.fillStyle = 'rgba(210,228,248,0.55)'; ctx.fillRect(0, H*0.930, W, H*0.028)
  ctx.fillStyle = 'rgba(255,255,255,0.80)'; ctx.fillRect(0, H*0.930, W, H*0.007)
  ctx.fillStyle = C.gold; ctx.globalAlpha = 0.90; ctx.fillRect(0, H*0.956, W, H*0.008)
  ctx.restore()
}

// Waistband at top
function drawWaistband(ctx, W, H) {
  ctx.save()
  // slightly lighter band
  ctx.fillStyle = '#162D5A'; ctx.fillRect(0, 0, W, H*0.095)
  // gold line at bottom of waistband
  ctx.fillStyle = C.gold; ctx.globalAlpha = 0.70; ctx.fillRect(0, H*0.090, W, H*0.006)
  ctx.restore()
}

// ── FRONT SHORTS TEXTURE ──────────────────────────────────────────────────────
function paintShortsFront() {
  const W=1024, H=900
  const canvas = document.createElement('canvas')
  canvas.width=W; canvas.height=H
  const ctx = canvas.getContext('2d')

  // Base — solid deep navy
  ctx.fillStyle = C.deepNavy; ctx.fillRect(0,0,W,H)

  drawWaistband(ctx, W, H)
  drawMountains(ctx, W, H)
  drawWaves(ctx, W, H, 0.58, 0.90, 6)

  // Cherry blossom branch — bottom left corner
  drawShortsBranch(ctx, W*0.04, H*0.92, W, H)

  // Scattered falling petals
  ;[
    [0.28, 0.72, 14, -30, 0.55],
    [0.36, 0.65, 11,  45, 0.45],
    [0.20, 0.60, 13, -55, 0.40],
    [0.42, 0.75, 10,  20, 0.35],
    [0.15, 0.78, 12, -15, 0.30],
  ].forEach(([xf,yf,sz,rot,a]) => drawPetal(ctx, W*xf, H*yf, sz, rot, a))

  // Number "26" bottom-left
  ctx.save()
  ctx.font = 'bold 110px system-ui, sans-serif'
  ctx.fillStyle = C.gold; ctx.globalAlpha = 0.85
  ctx.textAlign = 'left'
  ctx.fillText('26', W*0.06, H*0.90)
  ctx.restore()

  drawHem(ctx, W, H)
  return canvas
}

// ── BACK SHORTS TEXTURE ───────────────────────────────────────────────────────
function paintShortsBack() {
  const W=1024, H=900
  const canvas = document.createElement('canvas')
  canvas.width=W; canvas.height=H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = C.deepNavy; ctx.fillRect(0,0,W,H)

  drawWaistband(ctx, W, H)
  drawMountains(ctx, W, H)
  drawWaves(ctx, W, H, 0.55, 0.90, 6)

  // Gold maple leaf — top centre
  drawMapleLeaf(ctx, W*0.50, H*0.055, 28)

  drawHem(ctx, W, H)

  // Mirror for back-face UV flip
  const m = document.createElement('canvas'); m.width=W; m.height=H
  const mCtx = m.getContext('2d')
  mCtx.translate(W,0); mCtx.scale(-1,1); mCtx.drawImage(canvas,0,0)
  return m
}

// ── Shorts geometry ───────────────────────────────────────────────────────────
// Two separate leg panels joined at the waist, with flat leg-hem bottoms and
// a smooth rounded crotch curve between them — no pointy triangle.
function buildShortsBodyGeo() {
  const SW = 48, SH = 40
  const pos = [], uv = [], idx = []

  const TOP_Y  =  0.52
  const BOT_Y  = -0.32
  const HEIGHT = TOP_Y - BOT_Y   // 0.84 units

  // Outer half-width at vertical fraction t (0=top,1=bottom)
  function hw(t) {
    if (t < 0.08) return 0.56 + t * 0.4
    if (t < 0.28) return 0.59 - (t - 0.08) * 0.05
    return 0.58 - (t - 0.28) * 0.03
  }

  // Z puff
  function dz(t) { return 0.040 * Math.sin(t * Math.PI) }

  // ── Bottom edge profile ────────────────────────────────────────────────────
  // s in [0,1] across the width.  Returns the t-fraction at which each column
  // hits the bottom edge.  Columns outside the leg openings are flat at t=1.
  // The centre gap (crotch) rises with a smooth cosine curve.
  //
  // Layout (s=0 left, s=1 right):
  //   left leg  : s ∈ [0,       legR ]   flat bottom at t=1
  //   crotch gap: s ∈ [legR,    legL2]   cosine arch up to crotchT
  //   right leg : s ∈ [legL2,   1    ]   flat bottom at t=1
  //
  const legR   = 0.36   // right edge of left leg opening  (s-fraction)
  const legL2  = 0.64   // left  edge of right leg opening (s-fraction)
  const crotchT = 0.50  // how far up (t-fraction) the crotch peak goes

  function bottomEdgeT(s) {
    if (s <= legR || s >= legL2) return 1.0   // flat leg hem
    // smooth cosine arch in the gap
    const frac = (s - legR) / (legL2 - legR)   // 0→1 across the gap
    const arch = 0.5 - 0.5 * Math.cos(frac * Math.PI)  // 0 at edges, 1 at centre
    return 1.0 - arch * (1.0 - crotchT)
  }

  // Build vertices
  for (let r = 0; r <= SH; r++) {
    const t = r / SH
    const y = TOP_Y - t * HEIGHT
    const w = hw(t)
    const z = dz(t)
    for (let c = 0; c <= SW; c++) {
      const s = c / SW
      const x = (s - 0.5) * w * 2
      const curve = -0.025 * (2 * s - 1) ** 2
      pos.push(x, y, z + curve + 0.04)
      uv.push(s, 1 - t)
    }
  }

  // Build triangles — skip any quad that crosses below the bottom-edge profile
  for (let r = 0; r < SH; r++) {
    for (let c = 0; c < SW; c++) {
      const tTop = r       / SH
      const tBot = (r + 1) / SH
      const sL   = c       / SW
      const sR   = (c + 1) / SW
      const sMid = (sL + sR) * 0.5

      // The bottom of this quad must stay above the profile at both columns
      const maxAllowedT = Math.min(bottomEdgeT(sL), bottomEdgeT(sR), bottomEdgeT(sMid))
      if (tBot > maxAllowedT + 0.001) continue   // fully below profile — skip

      const a  = r * (SW + 1) + c
      const b  = a + 1
      const cc = a + (SW + 1)
      const d  = cc + 1
      idx.push(a, cc, b, b, cc, d)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv',       new THREE.Float32BufferAttribute(uv,  2))
  g.setIndex(idx); g.computeVertexNormals(); return g
}

// ── Hotspots ──────────────────────────────────────────────────────────────────
const HOTSPOTS_SHORTS_FRONT = [
  { id: 'shorts_blossom', u: 0.18, v: 0.82 },
  { id: 'shorts_number',  u: 0.14, v: 0.88 },
  { id: 'shorts_waves',   u: 0.65, v: 0.72 },
  { id: 'shorts_hem',     u: 0.80, v: 0.94 },
]
const HOTSPOTS_SHORTS_BACK = [
  { id: 'shorts_maple',   u: 0.50, v: 0.08 },
  { id: 'shorts_hem',     u: 0.80, v: 0.94 },
]

function uvToWorldShorts(u, v) {
  function hw(t) {
    if (t < 0.08) return 0.54 + t*0.5
    if (t < 0.30) return 0.58 - (t-0.08)*0.06
    return 0.57 - (t-0.30)*0.04
  }
  return { wx: (u-0.5)*hw(v)*2, wy: 0.52 - v*0.82 }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ShortsViewer3D({ onHotspotClick, rotY, rotX, onGroupReady }) {
  const mountRef = useRef(null)
  const stateRef = useRef({
    renderer: null, scene: null, camera: null, shortsGroup: null,
    animFrameId: null, hotspotSprites: [],
  })

  // expose group-ready callback so parent can sync rotation
  const groupReadyFired = useRef(false)

  function addHotspots(s, list, isFrontSide) {
    list.forEach(h => {
      const sc = document.createElement('canvas'); sc.width=128; sc.height=128
      const c = sc.getContext('2d')
      c.fillStyle = C.gold
      c.beginPath(); c.arc(64,64,22,0,Math.PI*2); c.fill()
      c.fillStyle = '#fff'
      c.beginPath(); c.arc(64,64,13,0,Math.PI*2); c.fill()
      const mat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(sc),
        transparent: true, opacity: 0.92, depthTest: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(0.13,0.13,1)
      sprite.userData = { id: h.id, isFront: isFrontSide }
      const { wx, wy } = uvToWorldShorts(h.u, h.v)
      sprite.position.set(wx, wy, isFrontSide ? 0.18 : -0.18)
      s.shortsGroup.add(sprite)
      s.hotspotSprites.push(sprite)
    })
  }

  useEffect(() => {
    const mount = mountRef.current
    const s = stateRef.current
    const W = mount.clientWidth, H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    s.renderer = renderer

    const scene = new THREE.Scene(); s.scene = scene
    const camera = new THREE.PerspectiveCamera(38, W/H, 0.01, 100)
    camera.position.set(0, 0, 3.0); s.camera = camera

    scene.add(new THREE.AmbientLight(0xffffff, 0.80))
    const key = new THREE.DirectionalLight(0xFFFAF0, 1.2); key.position.set(-2,3,4); scene.add(key)
    const fill = new THREE.DirectionalLight(0xD8EEFF, 0.50); fill.position.set(3,0,2); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x5080B8, 0.30); rim.position.set(0,-1,-3); scene.add(rim)

    const shortsGroup = new THREE.Group()
    scene.add(shortsGroup); s.shortsGroup = shortsGroup

    const geo = buildShortsBodyGeo()

    // Front face
    const frontTex = new THREE.CanvasTexture(paintShortsFront())
    frontTex.colorSpace = THREE.SRGBColorSpace
    shortsGroup.add(new THREE.Mesh(geo,
      new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.80, metalness: 0.03, side: THREE.FrontSide })))

    // Back face — pre-mirrored, rotated 180° Y
    const backTex = new THREE.CanvasTexture(paintShortsBack())
    backTex.colorSpace = THREE.SRGBColorSpace
    const backMesh = new THREE.Mesh(geo,
      new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.80, metalness: 0.03, side: THREE.FrontSide }))
    backMesh.rotation.y = Math.PI
    shortsGroup.add(backMesh)

    addHotspots(s, HOTSPOTS_SHORTS_FRONT, true)
    addHotspots(s, HOTSPOTS_SHORTS_BACK, false)

    if (onGroupReady && !groupReadyFired.current) {
      groupReadyFired.current = true
      onGroupReady(shortsGroup)
    }

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()
    function onCanvasClick(e) {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse2D.x = ((e.clientX-rect.left)/rect.width)*2-1
      mouse2D.y = -((e.clientY-rect.top)/rect.height)*2+1
      raycaster.setFromCamera(mouse2D, camera)
      const hits = raycaster.intersectObjects(s.hotspotSprites)
      if (hits.length > 0) onHotspotClick(hits[0].object.userData.id)
    }
    renderer.domElement.addEventListener('click', onCanvasClick)

    function onResize() {
      const W=mount.clientWidth, H=mount.clientHeight
      camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      renderer.domElement.removeEventListener('click', onCanvasClick)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(s.animFrameId)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  // Sync rotation from parent every frame via a ref-based update
  useEffect(() => {
    const s = stateRef.current
    function loop() {
      s.animFrameId = requestAnimationFrame(loop)
      if (!s.shortsGroup || !s.renderer || !s.camera) return
      s.shortsGroup.rotation.y = rotY.current
      s.shortsGroup.rotation.x = rotX.current * 0.4
      const frontFacing = Math.cos(rotY.current) > 0
      s.hotspotSprites.forEach(sp => { sp.visible = sp.userData.isFront === frontFacing })
      s.renderer.render(s.scene, s.camera)
    }
    loop()
    return () => cancelAnimationFrame(s.animFrameId)
  }, [rotY, rotX])

  return <div ref={mountRef} style={{ width:'100%', height:'100%' }} />
}
