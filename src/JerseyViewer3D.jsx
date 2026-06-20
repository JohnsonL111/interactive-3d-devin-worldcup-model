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
  { id:'blossom',  u:0.22, v:0.14, label:'Cherry Blossoms' },
  { id:'maple',    u:0.50, v:0.22, label:'Maple Leaf' },
  { id:'collar',   u:0.50, v:0.13, label:'V-Collar' },
  { id:'mountains',u:0.72, v:0.42, label:'Coast Mountains' },
  { id:'waves',    u:0.65, v:0.74, label:'Ocean Waves' },
  { id:'hem',      u:0.25, v:0.87, label:'Reflective Hem' },
]

const HOTSPOTS_BACK = [
  { id:'spine',  u:0.50, v:0.15, label:'Spine Strip' },
  { id:'route',  u:0.52, v:0.45, label:'Sea to Sky Route' },
  { id:'coords', u:0.50, v:0.87, label:'Coordinate Tag' },
]

export default function JerseyViewer3D({ onHotspotClick, sharedRotY, sharedRotX, onFlipReady, onZoomBackReady, customFrontUrl, customBackUrl }) {
  const mountRef = useRef(null)
  const stateRef = useRef({
    renderer:null, scene:null, camera:null, jerseyGroup:null,
    animFrameId:null, isDragging:false, prevMouse:{x:0,y:0},
    rotY:0.3, rotX:0, autoRotate:true, isFront:true,
    flipping:false, flipStartY:0, flipTargetY:0, flipProgress:0,
    hotspotSprites:[], autoRotateTimer:null,
    // zoom
    zoomActive:false, zoomIn:false, zoomProgress:0,
    zoomFromPos: new THREE.Vector3(), zoomFromTarget: new THREE.Vector3(),
    zoomToPos:   new THREE.Vector3(), zoomToTarget:   new THREE.Vector3(),
    camTarget: new THREE.Vector3(0, 0.1, 0),   // current look-at point
    frontMesh: null, backMesh: null, sleeveMeshes: [],
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

  // Zoom toward a world-space point on the jersey, then snap back on close
  const zoomToHotspot = useCallback((worldPos) => {
    const s = stateRef.current
    if (!s.camera) return
    s.autoRotate = false
    s.zoomActive = true
    s.zoomIn = true
    s.zoomProgress = 0
    s.zoomFromPos.copy(s.camera.position)
    s.zoomFromTarget.copy(s.camTarget)
    s.zoomToTarget.copy(worldPos)
    const dir = new THREE.Vector3(0, 0, 1)
    s.zoomToPos.copy(worldPos).addScaledVector(dir, 1.4)
  }, [])

  const zoomBack = useCallback(() => {
    const s = stateRef.current
    if (!s.camera) return
    s.zoomActive = true
    s.zoomIn = false
    s.zoomProgress = 0
    s.zoomFromPos.copy(s.camera.position)
    s.zoomFromTarget.copy(s.camTarget)
    const baseZ = s.sleeveMeshes.length > 0 && !s.sleeveMeshes[0].visible ? 3.3 : 4.4
    s.zoomToPos.set(0, 0, baseZ)
    s.zoomToTarget.set(0, 0, 0)
    s.autoRotateTimer = setTimeout(() => { s.autoRotate = true }, 1200)
  }, [])

  // Expose flip and zoomBack to parent — must come after both are declared
  useEffect(() => { if (onFlipReady) onFlipReady(flip) }, [flip, onFlipReady])
  useEffect(() => { if (onZoomBackReady) onZoomBackReady(zoomBack) }, [zoomBack, onZoomBackReady])

  function addHotspots(s, list, isFrontSide) {
    list.forEach(h => {
      const spriteCanvas = document.createElement('canvas')
      spriteCanvas.width = 128; spriteCanvas.height = 128
      const sc = spriteCanvas.getContext('2d')
      sc.fillStyle = '#C9A96A'
      sc.beginPath(); sc.arc(64,64,20,0,Math.PI*2); sc.fill()
      sc.fillStyle = '#fff'
      sc.beginPath(); sc.arc(64,64,12,0,Math.PI*2); sc.fill()
      const spriteTex = new THREE.CanvasTexture(spriteCanvas)
      const spriteMat = new THREE.SpriteMaterial({ map:spriteTex, transparent:true, opacity:0.9, depthTest:false })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(0.09,0.09,1)
      // tag which face this hotspot belongs to so we can show/hide per frame
      sprite.userData = { id: h.id, isFront: isFrontSide }
      // Map UV to world position on the jersey mesh
      const jerseyW = 2 * (h.u < 0.12 ? 0.52 + h.u * 0.8 : h.u < 0.30 ? 0.62 - (h.u-0.12)*0.3 : 0.57)
      const wx = (h.u - 0.5) * jerseyW * 1.2
      const wy = 1.4 - h.v * 2.8
      // Front hotspots sit in front (+z), back hotspots behind (-z) of the group
      const wz = isFrontSide ? 0.35 : -0.35
      sprite.position.set(wx, wy, wz)
      s.jerseyGroup.add(sprite)
      s.hotspotSprites.push(sprite)
    })
  }

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

    const camera = new THREE.PerspectiveCamera(38,W/H,0.01,100)
    camera.position.set(0,0,4.4)
    s.camera = camera
    s.camTarget.set(0,0,0)

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
    const texLoader = new THREE.TextureLoader()
    loader.load(
      MODEL_PATH,
      (gltf) => {
        const model = gltf.scene

    // Front face mesh (visible from front, +z)
    const frontMat = new THREE.MeshStandardMaterial({ map:frontTex, roughness:0.75, metalness:0.05, side:THREE.FrontSide, transparent:true, alphaTest:0.1 })
    const frontMesh = new THREE.Mesh(jerseyGeo, frontMat)
    jerseyGroup.add(frontMesh)
    s.frontMesh = frontMesh

    // Back face mesh — same geometry rotated 180° so it faces the camera when flipped.
    // Because the rotation mirrors UVs horizontally, we pre-mirror the back canvas so text reads correctly.
    const backCanvas = paintJerseyTexture(false)
    const mirroredBackCanvas = document.createElement('canvas')
    mirroredBackCanvas.width = backCanvas.width; mirroredBackCanvas.height = backCanvas.height
    const mCtx = mirroredBackCanvas.getContext('2d')
    mCtx.translate(backCanvas.width, 0); mCtx.scale(-1, 1)
    mCtx.drawImage(backCanvas, 0, 0)
    const mirroredBackTex = new THREE.CanvasTexture(mirroredBackCanvas)
    mirroredBackTex.colorSpace = THREE.SRGBColorSpace
    const backMat = new THREE.MeshStandardMaterial({ map:mirroredBackTex, roughness:0.75, metalness:0.05, side:THREE.FrontSide, transparent:true, alphaTest:0.1 })
    const backMesh = new THREE.Mesh(jerseyGeo, backMat)
    backMesh.rotation.y = Math.PI
    jerseyGroup.add(backMesh)
    s.backMesh = backMesh

    // Sleeve texture
    const sc2 = document.createElement('canvas'); sc2.width=256; sc2.height=512
    const sc2ctx = sc2.getContext('2d')
    const slG = sc2ctx.createLinearGradient(0,0,0,512)
    slG.addColorStop(0,'#C8D0DC'); slG.addColorStop(0.4,C.pacificBlue); slG.addColorStop(1,C.deepNavy)
    sc2ctx.fillStyle=slG; sc2ctx.fillRect(0,0,256,512)
    const sleeveTex = new THREE.CanvasTexture(sc2); sleeveTex.colorSpace=THREE.SRGBColorSpace
    const sleeveMat = new THREE.MeshStandardMaterial({ map:sleeveTex, roughness:0.78, metalness:0.04 })
    ;[-1,1].forEach(side => { const m=new THREE.Mesh(buildSleeveGeometry(side),sleeveMat); jerseyGroup.add(m); s.sleeveMeshes.push(m) })

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
      if (hits.length > 0) {
        const sprite = hits[0].object
        // get the sprite's current world position (it rotates with the group)
        const worldPos = new THREE.Vector3()
        sprite.getWorldPosition(worldPos)
        zoomToHotspot(worldPos)
        onHotspotClick(sprite.userData.id)
      }
    }
    renderer.domElement.addEventListener('click', onCanvasClick)

    function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

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

      // Push to shared refs so ShortsViewer stays in sync
      if (sharedRotY) sharedRotY.current = s.rotY
      if (sharedRotX) sharedRotX.current = s.rotX

      jerseyGroup.rotation.y = s.rotY
      jerseyGroup.rotation.x = s.rotX * 0.4

      // Smooth camera zoom
      if (s.zoomActive) {
        s.zoomProgress = Math.min(1, s.zoomProgress + 0.04)
        const e = easeInOut(s.zoomProgress)
        camera.position.lerpVectors(s.zoomFromPos, s.zoomToPos, e)
        s.camTarget.lerpVectors(s.zoomFromTarget, s.zoomToTarget, e)
        camera.lookAt(s.camTarget)
        if (s.zoomProgress >= 1) s.zoomActive = false
      }

      // Show only the hotspots belonging to the face currently pointing toward the camera.
      // cos(rotY) > 0 means the front face (+z) is facing the camera.
      const frontFacing = Math.cos(s.rotY) > 0
      s.hotspotSprites.forEach(sp => {
        sp.visible = sp.userData.isFront === frontFacing
      })

      renderer.render(scene, camera)
    }
    animate()

    function onPointerDown(e) {
      s.isDragging = false; s.autoRotate = false; s.flipping = false
      s.prevMouse = { x:e.clientX, y:e.clientY }
      s._dragStart = { x:e.clientX, y:e.clientY }
      // If zoomed in, zoom back out when user starts dragging
      if (!s.zoomActive && !s.zoomIn) return
      zoomBack()
    }
    function onPointerMove(e) {
      if (!s._dragStart) return
      const dx = e.clientX-s.prevMouse.x, dy=e.clientY-s.prevMouse.y
      const totalDx = Math.abs(e.clientX-s._dragStart.x), totalDy=Math.abs(e.clientY-s._dragStart.y)
      if (totalDx > 3 || totalDy > 3) s.isDragging = true
      s.rotY += dx*0.008; s.rotX = Math.max(-0.5,Math.min(0.5,s.rotX+dy*0.008))
      s.prevMouse = { x:e.clientX, y:e.clientY }
    }
    function onPointerUp() {
      s._dragStart = null
      clearTimeout(s.autoRotateTimer)
      s.autoRotateTimer = setTimeout(()=>{ s.autoRotate=true },2000)
      setTimeout(()=>{ s.isDragging=false },50)
    }
    renderer.domElement.addEventListener('pointerdown',onPointerDown)
    window.addEventListener('pointermove',onPointerMove)
    window.addEventListener('pointerup',onPointerUp)

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

  // Toggle sleeves + camera distance when switching between model / realistic
  useEffect(() => {
    const s = stateRef.current
    const realistic = !!customFrontUrl
    s.sleeveMeshes.forEach(m => { m.visible = !realistic })
    if (s.camera) {
      const targetZ = realistic ? 3.3 : 4.4
      s.camera.position.set(0, 0, targetZ)
      s.camTarget.set(0, 0, 0)
      s.camera.lookAt(s.camTarget)
    }
  }, [customFrontUrl])

  // Hot-swap front texture; null = restore default painted canvas
  useEffect(() => {
    const s = stateRef.current
    if (!s.frontMesh) return
    if (!customFrontUrl) {
      const tex = new THREE.CanvasTexture(paintJerseyTexture(true))
      tex.colorSpace = THREE.SRGBColorSpace
      s.frontMesh.material.map = tex
      s.frontMesh.material.needsUpdate = true
      return
    }
    const loader = new THREE.TextureLoader()
    loader.load(customFrontUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      s.frontMesh.material.map = tex
      s.frontMesh.material.needsUpdate = true
    })
  }, [customFrontUrl])

  // Hot-swap back texture; null = restore default painted canvas (pre-mirrored)
  useEffect(() => {
    const s = stateRef.current
    if (!s.backMesh) return
    if (!customBackUrl) {
      const backCanvas = paintJerseyTexture(false)
      const m = document.createElement('canvas')
      m.width = backCanvas.width; m.height = backCanvas.height
      const mCtx = m.getContext('2d')
      mCtx.translate(m.width, 0); mCtx.scale(-1, 1); mCtx.drawImage(backCanvas, 0, 0)
      const tex = new THREE.CanvasTexture(m)
      tex.colorSpace = THREE.SRGBColorSpace
      s.backMesh.material.map = tex
      s.backMesh.material.needsUpdate = true
      return
    }
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth; c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.translate(c.width, 0); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0)
      const tex = new THREE.CanvasTexture(c)
      tex.colorSpace = THREE.SRGBColorSpace
      s.backMesh.material.map = tex
      s.backMesh.material.needsUpdate = true
    }
    img.src = customBackUrl
  }, [customBackUrl])

  return <div ref={mountRef} style={{ width:'100%', height:'100%', cursor:'grab' }} />
}
