import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

const C = {
  fogWhite: '#F2F3F0', coastGrey: '#8B9AB0', pacificBlue: '#0A2A5E',
  deepNavy: '#061830', gold: '#C9A96A', sakuraPink: '#F2B8C6',
  sakuraDark: '#EDA0B5', branchBrown: '#8B5A6B',
}

function paintJerseyTexture(front = true) {
  const W = 1024, H = 1400
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
  bgGrad.addColorStop(0, C.fogWhite)
  bgGrad.addColorStop(0.38, '#C8D0DC')
  bgGrad.addColorStop(0.55, '#5A7094')
  bgGrad.addColorStop(1, C.deepNavy)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Mountain layer 1
  ctx.save(); ctx.globalAlpha = 0.45
  const mGrad1 = ctx.createLinearGradient(0, 0, 0, H * 0.6)
  mGrad1.addColorStop(0, '#7B8FA8'); mGrad1.addColorStop(1, C.pacificBlue)
  ctx.fillStyle = mGrad1
  ctx.beginPath()
  ctx.moveTo(0, H*0.52); ctx.lineTo(W*0.09,H*0.38); ctx.lineTo(W*0.18,H*0.44)
  ctx.lineTo(W*0.28,H*0.32); ctx.lineTo(W*0.38,H*0.40); ctx.lineTo(W*0.48,H*0.28)
  ctx.lineTo(W*0.58,H*0.36); ctx.lineTo(W*0.68,H*0.30); ctx.lineTo(W*0.78,H*0.38)
  ctx.lineTo(W*0.88,H*0.34); ctx.lineTo(W,H*0.42); ctx.lineTo(W,H); ctx.lineTo(0,H)
  ctx.closePath(); ctx.fill(); ctx.restore()

  // Mountain layer 2
  const mGrad2 = ctx.createLinearGradient(0, H*0.5, 0, H)
  mGrad2.addColorStop(0, C.pacificBlue); mGrad2.addColorStop(1, C.deepNavy)
  ctx.fillStyle = mGrad2
  ctx.beginPath()
  ctx.moveTo(0,H*0.65); ctx.lineTo(W*0.12,H*0.52); ctx.lineTo(W*0.22,H*0.58)
  ctx.lineTo(W*0.33,H*0.46); ctx.lineTo(W*0.42,H*0.53); ctx.lineTo(W*0.50,H*0.42)
  ctx.lineTo(W*0.60,H*0.50); ctx.lineTo(W*0.70,H*0.44); ctx.lineTo(W*0.80,H*0.54)
  ctx.lineTo(W*0.90,H*0.47); ctx.lineTo(W,H*0.55); ctx.lineTo(W,H); ctx.lineTo(0,H)
  ctx.closePath(); ctx.fill()

  // Wave lines
  ;[0.72,0.76,0.80,0.84,0.88].forEach((yf,i) => {
    ctx.save(); ctx.globalAlpha = 0.5 - i*0.08
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let x=0;x<=W;x+=40) {
      const y = H*yf + Math.sin((x/W)*Math.PI*4+i)*8
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
    }
    ctx.stroke(); ctx.restore()
  })

  if (front) {
    // V-collar
    ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 6
    ctx.lineJoin='round'; ctx.lineCap='round'; ctx.beginPath()
    ctx.moveTo(W*0.35,H*0.02); ctx.lineTo(W*0.50,H*0.10); ctx.lineTo(W*0.65,H*0.02)
    ctx.stroke()
    ctx.fillStyle = C.fogWhite; ctx.globalAlpha = 0.9; ctx.beginPath()
    ctx.moveTo(W*0.35,H*0.02); ctx.quadraticCurveTo(W*0.50,-20,W*0.65,H*0.02)
    ctx.lineTo(W*0.63,0); ctx.quadraticCurveTo(W*0.50,-10,W*0.37,0); ctx.closePath(); ctx.fill()
    ctx.restore()

    // Maple leaf
    ctx.save(); ctx.translate(W*0.50,H*0.18); ctx.scale(2.8,2.8); ctx.fillStyle = C.gold
    ctx.beginPath()
    ;[[0,-18],[3,-8],[13,-10],[8,0],[16,8],[8,6],[10,16],[0,12],[-10,16],[-8,6],[-16,8],[-8,0],[-13,-10],[-3,-8]].forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y))
    ctx.closePath(); ctx.fill(); ctx.restore()

    // Text
    ctx.save(); ctx.fillStyle = C.pacificBlue; ctx.globalAlpha = 0.75
    ctx.font='500 28px sans-serif'; ctx.textAlign='center'
    ctx.fillText('VANCOUVER',W*0.50,H*0.245)
    ctx.font='300 24px sans-serif'; ctx.fillText('2026',W*0.50,H*0.27); ctx.restore()

    // Branch
    paintBranch(ctx, W*0.20, H*0.08, W, H)

    // Scattered petals
    ;[[0.45,0.12],[0.62,0.09],[0.72,0.14],[0.58,0.20],[0.30,0.22],[0.80,0.18]].forEach(([xf,yf]) => {
      paintPetal(ctx, W*xf, H*yf, 12, Math.random()*60-30, 0.4)
    })
  } else {
    // Spine strip
    ctx.save()
    ctx.fillStyle='rgba(220,230,245,0.45)'; ctx.fillRect(W*0.48,0,W*0.04,H*0.90)
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.fillRect(W*0.495,0,W*0.01,H*0.90)
    ctx.restore()

    // Sea to Sky route
    ctx.save(); ctx.strokeStyle=C.gold; ctx.lineWidth=4; ctx.setLineDash([14,10])
    ctx.globalAlpha=0.85; ctx.beginPath()
    ctx.moveTo(W*0.50,H*0.08)
    ctx.bezierCurveTo(W*0.52,H*0.25,W*0.48,H*0.45,W*0.50,H*0.60)
    ctx.bezierCurveTo(W*0.52,H*0.68,W*0.49,H*0.78,W*0.50,H*0.88)
    ctx.stroke(); ctx.restore()

    ;[{label:'WHISTLER',yf:0.10},{label:'SQUAMISH',yf:0.44},{label:'VANCOUVER',yf:0.86}].forEach(({label,yf}) => {
      const cx=W*0.50, cy=H*yf
      ctx.save(); ctx.fillStyle=C.gold; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#fff'; ctx.font='500 22px sans-serif'; ctx.textAlign='left'
      ctx.fillText(label, cx+18, cy+7); ctx.restore()
    })

    // Coordinate tag
    ctx.save(); ctx.fillStyle='rgba(0,0,0,0.6)'
    roundRect(ctx,W*0.34,H*0.90,W*0.32,H*0.07,16); ctx.fill()
    ctx.strokeStyle=C.gold; ctx.lineWidth=1.5
    roundRect(ctx,W*0.34,H*0.90,W*0.32,H*0.07,16); ctx.stroke()
    ctx.fillStyle='#fff'; ctx.font='400 20px monospace'; ctx.textAlign='center'
    ctx.fillText('49.2827° N',W*0.52,H*0.927)
    ctx.fillStyle=C.gold; ctx.font='400 20px monospace'
    ctx.fillText('123.1207° W',W*0.52,H*0.952); ctx.restore()
  }

  // Hem
  ctx.save()
  ctx.fillStyle='rgba(220,230,245,0.55)'; ctx.fillRect(0,H*0.935,W,H*0.02)
  ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fillRect(0,H*0.935,W,H*0.005)
  ctx.fillStyle=C.gold; ctx.globalAlpha=0.8; ctx.fillRect(0,H*0.955,W,H*0.006)
  ctx.restore()

  return canvas
}

function paintBranch(ctx,startX,startY,W,H) {
  ctx.save(); ctx.strokeStyle=C.branchBrown; ctx.lineWidth=4; ctx.lineCap='round'
  ctx.globalAlpha=0.8; ctx.beginPath()
  ctx.moveTo(startX,startY)
  ctx.bezierCurveTo(startX+W*0.12,startY+H*0.05,startX+W*0.18,startY+H*0.08,startX+W*0.22,startY+H*0.14)
  ctx.stroke()
  ctx.lineWidth=2.5; ctx.globalAlpha=0.65
  ctx.beginPath(); ctx.moveTo(startX+W*0.18,startY+H*0.10); ctx.lineTo(startX+W*0.26,startY+H*0.06); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(startX+W*0.18,startY+H*0.10); ctx.lineTo(startX+W*0.24,startY+H*0.16); ctx.stroke()
  ctx.lineWidth=1.5; ctx.globalAlpha=0.5
  ctx.beginPath(); ctx.moveTo(startX+W*0.08,startY+H*0.05); ctx.lineTo(startX+W*0.14,startY+H*0.01); ctx.stroke()
  ctx.restore()
  ;[[startX+W*0.27,startY+H*0.055,1.0],[startX+W*0.26,startY+H*0.165,0.9],[startX+W*0.22,startY+H*0.145,0.85],[startX+W*0.14,startY+H*0.008,0.65]].forEach(([x,y,a])=>paintBlossom(ctx,x,y,22,a))
}

function paintBlossom(ctx,cx,cy,size,alpha=1.0) {
  ctx.save(); ctx.globalAlpha=alpha
  for(let i=0;i<5;i++){
    const angle=(i/5)*Math.PI*2-Math.PI/2
    const px=cx+Math.cos(angle)*size*0.5, py=cy+Math.sin(angle)*size*0.5
    ctx.fillStyle=i%2===0?C.sakuraPink:C.sakuraDark
    ctx.beginPath(); ctx.ellipse(px,py,size*0.45,size*0.28,angle,0,Math.PI*2); ctx.fill()
  }
  ctx.fillStyle=C.gold; ctx.beginPath(); ctx.arc(cx,cy,size*0.18,0,Math.PI*2); ctx.fill()
  ctx.restore()
}

function paintPetal(ctx,cx,cy,size,rotDeg=0,alpha=1.0) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy); ctx.rotate(rotDeg*Math.PI/180)
  ctx.fillStyle=C.sakuraPink; ctx.beginPath(); ctx.ellipse(0,0,size,size*0.6,0,0,Math.PI*2); ctx.fill(); ctx.restore()
}

function roundRect(ctx,x,y,w,h,r) {
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h)
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath()
}

function buildJerseyGeometry() {
  const segsW=40, segsH=60
  const positions=[], uvs=[], indices=[]
  function jerseyWidth(t) {
    if(t<0.12) return 0.52+t*0.8
    if(t<0.30) return 0.62-(t-0.12)*0.3
    if(t<0.70) return 0.57-(t-0.30)*0.05
    return 0.55+(t-0.70)*0.15
  }
  function jerseyDepth(t) { return 0.06*Math.sin(t*Math.PI) }
  for(let row=0;row<=segsH;row++){
    const t=row/segsH, y=1.4-t*2.8, hw=jerseyWidth(t), dz=jerseyDepth(t)
    for(let col=0;col<=segsW;col++){
      const s=col/segsW, x=(s-0.5)*hw*2
      const edgeCurve=-0.08*Math.pow(2*s-1,2)
      positions.push(x,y,dz+edgeCurve+0.08); uvs.push(s,1-t)
    }
  }
  for(let row=0;row<segsH;row++){
    for(let col=0;col<segsW;col++){
      const a=row*(segsW+1)+col,b=a+1,c=a+(segsW+1),d=c+1
      indices.push(a,c,b); indices.push(b,c,d)
    }
  }
  const geo=new THREE.BufferGeometry()
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geo.setIndex(indices); geo.computeVertexNormals(); return geo
}

function buildSleeveGeometry(side=1) {
  const segsR=16, segsL=12
  const positions=[], uvs=[], indices=[]
  for(let row=0;row<=segsL;row++){
    const t=row/segsL, cx=side*(0.62+t*0.45), cy=1.1-t*0.55, r=0.18-t*0.07
    for(let seg=0;seg<=segsR;seg++){
      const angle=(seg/segsR)*Math.PI*2
      positions.push(cx+Math.cos(angle)*r, cy+Math.sin(angle)*r*0.7, 0.02+Math.sin(angle)*r*0.4)
      uvs.push(seg/segsR,1-t)
    }
  }
  for(let row=0;row<segsL;row++){
    for(let seg=0;seg<segsR;seg++){
      const a=row*(segsR+1)+seg,b=a+1,c=a+(segsR+1),d=c+1
      indices.push(a,c,b); indices.push(b,c,d)
    }
  }
  const geo=new THREE.BufferGeometry()
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geo.setIndex(indices); geo.computeVertexNormals(); return geo
}

// Hotspot UV positions [uFrac, vFrac] mapped to world positions on the mesh
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

  const flip = useCallback(() => {
    const s = stateRef.current
    if (s.flipping) return
    s.flipping = true
    s.flipStartY = s.rotY
    s.flipTargetY = s.rotY + Math.PI
    s.flipProgress = 0
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

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    s.renderer = renderer

    const scene = new THREE.Scene()
    s.scene = scene

    const camera = new THREE.PerspectiveCamera(38,W/H,0.01,100)
    camera.position.set(0,0,4.4)
    s.camera = camera
    s.camTarget.set(0,0,0)

    scene.add(new THREE.AmbientLight(0xffffff,0.7))
    const key = new THREE.DirectionalLight(0xFFF5E0,1.4); key.position.set(-2,3,4); scene.add(key)
    const fill = new THREE.DirectionalLight(0xD0E8FF,0.6); fill.position.set(3,0,2); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x4080C0,0.4); rim.position.set(0,-1,-3); scene.add(rim)

    const frontTex = new THREE.CanvasTexture(paintJerseyTexture(true))
    frontTex.colorSpace = THREE.SRGBColorSpace

    // Group holds all jersey parts so they rotate together
    const jerseyGroup = new THREE.Group()
    scene.add(jerseyGroup)
    s.jerseyGroup = jerseyGroup

    const jerseyGeo = buildJerseyGeometry()

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

    addHotspots(s, HOTSPOTS, true)
    addHotspots(s, HOTSPOTS_BACK, false)

    // Raycaster for hotspot clicks
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()

    function onCanvasClick(e) {
      if (s.isDragging) return
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

    function animate() {
      s.animFrameId = requestAnimationFrame(animate)

      if (s.flipping) {
        s.flipProgress = Math.min(1, s.flipProgress + 0.035)
        s.rotY = s.flipStartY + easeInOut(s.flipProgress) * (s.flipTargetY - s.flipStartY)
        if (s.flipProgress >= 1) {
          s.rotY = s.flipTargetY
          s.flipping = false
        }
      } else if (s.autoRotate) {
        s.rotY += 0.004
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
      const W=mount.clientWidth, H=mount.clientHeight
      camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H)
    }
    window.addEventListener('resize',onResize)

    return () => {
      cancelAnimationFrame(s.animFrameId)
      renderer.domElement.removeEventListener('click',onCanvasClick)
      renderer.domElement.removeEventListener('pointerdown',onPointerDown)
      window.removeEventListener('pointermove',onPointerMove)
      window.removeEventListener('pointerup',onPointerUp)
      window.removeEventListener('resize',onResize)
      renderer.dispose()
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
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
