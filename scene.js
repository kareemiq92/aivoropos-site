// The 3D night behind the page: a lighter violet sky with drifting dust, the Earth at night brought close on Iraq
// (NASA Black Marble, 500 m there), its cities pulsing with their names and deliveries running out of them, and the
// real devices gliding between the parts of the page as it scrolls.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 300)
camera.position.set(0, 0, 9)
const loader = new THREE.TextureLoader()
const maxAniso = renderer.capabilities.getMaxAnisotropy()
// A phone gets every picture at about half its size (the -m copies): the same scene, a quarter of the weight.
const small = matchMedia('(max-width: 820px)').matches
const pic = (name) => `${name}${small ? '-m' : ''}.webp`
const sharp = (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t }

// ---- the sky: navy into violet, with faint clouds of light
{
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 1024
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 1024)
  base.addColorStop(0, '#2b2468'); base.addColorStop(0.5, '#1c1650'); base.addColorStop(1, '#120f36')
  g.fillStyle = base; g.fillRect(0, 0, 1024, 1024)
  for (const [x, y, r, col] of [[780, 180, 520, 'rgba(140, 90, 255, .28)'], [160, 620, 460, 'rgba(255, 90, 200, .12)'], [600, 900, 420, 'rgba(70, 140, 255, .15)']]) {
    const n = g.createRadialGradient(x, y, 0, x, y, r)
    n.addColorStop(0, col); n.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = n; g.fillRect(0, 0, 1024, 1024)
  }
  scene.background = sharp(new THREE.CanvasTexture(c))
}
const starGeo = new THREE.BufferGeometry()
const stars = new Float32Array(2600 * 3)
for (let i = 0; i < stars.length; i += 3) { const r = 70 + Math.random() * 60, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1); stars.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), -Math.abs(r * Math.cos(b)) - 30], i) }
starGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3))
const sky = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xf0eaff, size: 0.16, transparent: true, opacity: 0.9 }))
scene.add(sky)

// ---- the dust: fine motes of light near the camera, rising slowly, for depth
const DUST = 420
const dustGeo = new THREE.BufferGeometry()
const dust = new Float32Array(DUST * 3)
for (let i = 0; i < DUST; i++) dust.set([(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 11, -6 + Math.random() * 11], i * 3)
dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))
const motes = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xd9ccff, size: 0.022, transparent: true, opacity: 0.55, depthWrite: false }))
scene.add(motes)

// ---- the Earth at night: the whole world (3 km), our region (3 km, its own image) and Iraq (500 m), each where it lies
const R = 5
const facing = 'varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 p = modelViewMatrix * vec4(position, 1.0); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }'
const uv = (lon, lat) => [(lon + 180) / 360, (lat + 90) / 180]
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 384, 384), new THREE.ShaderMaterial({
  uniforms: {
    world: { value: sharp(loader.load(pic('earth-night'))) },
    region: { value: sharp(loader.load(pic('earth-region'))) },
    iraq: { value: sharp(loader.load(pic('earth-iraq'))) },
    regionRect: { value: new THREE.Vector4(7688 / 13500, 1 - 2813 / 6750, 9188 / 13500, 1 - 1688 / 6750) },
    iraqRect: { value: new THREE.Vector4(...uv(36, 26), ...uv(52, 40)) },
    // The daytime ground (Sentinel-2 cloudless, EOX): the region at 1.2 km, Iraq at 300 m. Both are Web Mercator tiles,
    // so each is placed by longitude and by Mercator latitude: [west, east, Mercator south, Mercator north].
    regionDay: { value: sharp(loader.load(pic('region-s2'))) },
    iraqDay: { value: sharp(loader.load(pic('iraq-s2'))) },
    regionDayRect: { value: new THREE.Vector4(19.6875, 70.3125, ...[11.18, 49.03].map(merc)) },
    iraqDayRect: { value: new THREE.Vector4(36.5625, 50.625, ...[27.68, 39.36].map(merc)) }
  },
  vertexShader: facing,
  fragmentShader: `uniform sampler2D world; uniform sampler2D region; uniform sampler2D iraq; uniform vec4 regionRect; uniform vec4 iraqRect;
    uniform sampler2D regionDay; uniform sampler2D iraqDay; uniform vec4 regionDayRect; uniform vec4 iraqDayRect;
    varying vec3 vN; varying vec3 vV; varying vec2 vUv;
    float fadeIn(vec2 r, float w) { return smoothstep(0.0, w, min(min(r.x, 1.0 - r.x), min(r.y, 1.0 - r.y))); }
    // The sharper image wherever it covers, fading into the coarser one over its last few percent so no seam shows.
    vec3 over(vec3 c, sampler2D t, vec4 rect) {
      vec2 r = (vUv - rect.xy) / (rect.zw - rect.xy);
      if (r.x <= 0.0 || r.x >= 1.0 || r.y <= 0.0 || r.y >= 1.0) return c;
      return mix(c, texture2D(t, r).rgb, fadeIn(r, 0.05));
    }
    // The same for a Mercator image, with how much of it shows (0 outside it).
    vec4 overDay(vec4 c, sampler2D t, vec4 rect, float w) {
      float lon = vUv.x * 360.0 - 180.0, lat = radians(vUv.y * 180.0 - 90.0);
      vec2 r = vec2((lon - rect.x) / (rect.y - rect.x), (log(tan(0.785398 + lat * 0.5)) - rect.z) / (rect.w - rect.z));
      if (r.x <= 0.0 || r.x >= 1.0 || r.y <= 0.0 || r.y >= 1.0) return c;
      float f = fadeIn(r, w);
      return vec4(mix(c.rgb, texture2D(t, r).rgb, f), max(c.a, f));
    }
    void main(){
      vec3 c = over(over(texture2D(world, vUv).rgb, region, regionRect), iraq, iraqRect);
      float l = max(max(c.r, c.g), c.b);
      // City lights kept under the glow's threshold so they stay sharp points.
      vec3 city = vec3(1.0, 0.82, 0.5) * smoothstep(0.16, 0.8, l);
      // Over the daytime ground only the brightest cores of the cities show, as small sharp points, never a haze.
      vec3 cityDay = vec3(1.0, 0.84, 0.55) * smoothstep(0.7, 1.0, l) * 0.45;
      vec3 night = c * vec3(0.55, 0.62, 1.0) * 0.85;
      // The daytime ground at dusk: its own detail, cooled toward violet, the lights coming on over it.
      vec4 day = overDay(overDay(vec4(0.0), regionDay, regionDayRect, 0.12), iraqDay, iraqDayRect, 0.04);
      // A soft shoulder holds the bright desert back from white, so the land keeps its texture under the dusk.
      vec3 d = day.rgb / (1.0 + 0.55 * day.rgb);
      vec3 dusk = pow(d * 1.55, vec3(1.45)) * vec3(0.52, 0.48, 0.76);
      vec3 ground = mix(night, dusk, day.a);
      float rim = pow(clamp(1.0 - dot(vN, vV), 0.0, 1.0), 3.5);
      gl_FragColor = vec4(ground + mix(city * 0.97, cityDay, day.a) + vec3(0.5, 0.4, 1.0) * rim * 0.5, 1.0);
    }`
}))
const air = new THREE.Mesh(new THREE.SphereGeometry(R * 1.035, 192, 192), new THREE.ShaderMaterial({
  transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: facing,
  // Seen from inside (its back faces), so only its edge, where the view grazes it, lights up.
  fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float i = pow(clamp(1.0 - abs(dot(vN, vV)), 0.0, 1.0), 6.0); gl_FragColor = vec4(0.55, 0.45, 1.0, 1.0) * i * 1.1; }'
}))
const toSphere = (lon, lat, r = R) => {
  const phi = ((lon + 180) / 360) * Math.PI * 2, theta = ((90 - lat) / 180) * Math.PI
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta))
}
const earth = new THREE.Group()
earth.add(globe, air)
// Iraq (43.7°E, 33.2°N) turned to face the camera; the globe sways a little either side of it, never away.
const IRAQ_TURN = Math.PI / 2 - ((43.7 + 180) / 360) * Math.PI * 2
earth.rotation.x = (33.2 / 180) * Math.PI
scene.add(earth)

// ---- Iraq's border: a very thin yellow line, faintly lit all round, with a bright light travelling it slowly
const borderTime = { value: 0 }
fetch('iraq.json').then((r) => r.json()).then((ring) => {
  // A closed ring repeats its first point, and a map repeats points: each is kept only when it moves on from the last,
  // since a zero-length step breaks the line's shading.
  const points = ring.map(([lon, lat]) => toSphere(lon, lat, R * 1.0012)).filter((p, i, all) => i === 0 || p.distanceTo(all[i - 1]) > 1e-4)
  if (points[0].distanceTo(points[points.length - 1]) < 1e-3) points.pop()
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal')
  const shade = (glow) => new THREE.ShaderMaterial({
    uniforms: { time: borderTime }, transparent: true, depthWrite: false, blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    // Two lights a half-turn apart, each taking about forty seconds to go round, each with a long fading tail.
    fragmentShader: `uniform float time; varying vec2 vUv;
      float comet(float s){ float d = fract(s); return pow(d, 26.0) + 0.35 * pow(d, 6.0); }
      void main(){ float s = vUv.x - time * 0.025; float k = comet(s) + comet(s + 0.5);
        vec3 c = vec3(1.0, 0.82, 0.22);
        ${glow ? 'gl_FragColor = vec4(c * (0.06 + 0.9 * k), 1.0);' : 'gl_FragColor = vec4(mix(c, vec3(1.0, 0.97, 0.85), k) * (0.75 + 1.8 * k), 0.55 + 0.45 * min(k * 3.0, 1.0));'} }`
  })
  globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 3000, 0.0055, 12, true), shade(true)))
  globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 3000, 0.0014, 8, true), shade(false)))
})

// ---- the cities: a soft gold pulse on each, its name beside it, drawn by the page (always crisp) over the canvas
const CITIES = [
  // name, English, longitude, latitude, a main city, its name on the far side of the point (so neighbours never overlap)
  ['بغداد', 'Baghdad', 44.37, 33.31, 1, 0], ['البصرة', 'Basra', 47.78, 30.51, 1, 0], ['الموصل', 'Mosul', 43.13, 36.34, 1, 0], ['أربيل', 'Erbil', 44.01, 36.19, 1, 1],
  ['السليمانية', 'Sulaymaniyah', 45.43, 35.56, 0, 0], ['النجف', 'Najaf', 44.33, 32.0, 0, 1], ['الناصرية', 'Nasiriyah', 46.26, 31.04, 0, 1], ['العمارة', 'Amarah', 47.15, 31.84, 0, 0]
]
const layer = document.createElement('div')
layer.className = 'cities'
document.body.append(layer)
const cities = CITIES.map(([ar, en, lon, lat, big, far]) => {
  const el = document.createElement('div')
  el.className = 'city' + (big ? ' big' : '') + (far ? ' far' : '')
  el.innerHTML = `<i></i><span data-ar="${ar}" data-en="${en}">${ar}</span>`
  el.style.setProperty('--d', `${(Math.random() * 2.4).toFixed(2)}s`)
  layer.append(el)
  return { el, label: el.querySelector('span'), at: toSphere(lon, lat, R * 1.001), lon, lat }
})
const nameCities = () => cities.forEach((c) => (c.label.textContent = c.label.dataset[document.documentElement.lang === 'ar' ? 'ar' : 'en']))
addEventListener('langchange', nameCities)
nameCities()

// ---- deliveries: thin lines of light leaving a city for a nearby street, lifting slightly off the ground, then fading
const routeMat = () => new THREE.ShaderMaterial({
  uniforms: { head: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: 'attribute float s; varying float vS; void main(){ vS = s; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform float head; varying float vS; void main(){ if (vS > head) discard; float tail = smoothstep(head - 0.45, head, vS); float tip = smoothstep(head - 0.04, head, vS); gl_FragColor = vec4(mix(vec3(1.0, 0.8, 0.45), vec3(1.0), tip) * (0.5 + 1.3 * tail), 1.0) * tail; }'
})
const routes = Array.from({ length: 34 }, () => {
  const steps = 48
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(steps * 3), 3))
  geo.setAttribute('s', new THREE.BufferAttribute(Float32Array.from({ length: steps }, (_, i) => i / (steps - 1)), 1))
  const line = new THREE.Line(geo, routeMat())
  line.frustumCulled = false
  globe.add(line)
  return { line, geo, steps, head: Math.random() * 1.5, speed: 0 }
})
function send(route) {
  // From one of the cities (the big ones more often) to a point a few kilometres away.
  const [, , lon, lat] = CITIES[Math.random() < 0.6 ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * CITIES.length)]
  const a = Math.random() * Math.PI * 2, d = 0.35 + Math.random() * 0.9
  const from = toSphere(lon + (Math.random() - 0.5) * 0.06, lat + (Math.random() - 0.5) * 0.06), to = toSphere(lon + Math.cos(a) * d, lat + Math.sin(a) * d * 0.8)
  const pos = route.geo.attributes.position
  for (let i = 0; i < route.steps; i++) {
    const s = i / (route.steps - 1)
    const p = from.clone().lerp(to, s).normalize().multiplyScalar(R * (1.0008 + 0.0035 * Math.sin(Math.PI * s) * (d / 0.4)))
    pos.setXYZ(i, p.x, p.y, p.z)
  }
  pos.needsUpdate = true
  route.head = 0
  route.speed = 0.35 + Math.random() * 0.35
}
routes.forEach((r) => (send(r), (r.head = Math.random() * 1.4)))

// ---- the devices: the approved renders, flat cards that turn and glide, at their own colours
function device(src, height) {
  // Drawn over everything: the Earth now comes so near that its surface would otherwise stand in front of them.
  const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat)
  mesh.userData = { height, aspect: 1 }
  loader.load(src, (tex) => { sharp(tex); mat.map = tex; mat.needsUpdate = true; mesh.userData.aspect = tex.image.width / tex.image.height })
  mesh.renderOrder = 10
  scene.add(mesh)
  return mesh
}
const D = { terminal: device(pic('terminal'), 3.4), tablet: device(pic('tablet'), 2.2), phone: device(pic('phone'), 2.6), driver: device(pic('driver'), 2.5), owner: device(pic('owner'), 3.1) }

// Where each thing stands in each part of the page: [x, y, z, turn or size, opacity]. x is for Arabic on a wide screen
// (the pictures on the left, the words on the right); English mirrors it, and a phone moves everything under the words.
// The first part is the Earth's alone: Iraq close and large; the devices come in from the second.
const _ = [0, 0, -6, 0, 0]
const K = {
  terminal: [[-3.6, -1.4, -3, 0.4, 0], [-2.2, -0.05, 1.2, 0.32, 1], [-5.5, 0.4, -1, 0.6, 0], _, _, _],
  tablet: [_, [-4, 1.6, -3, 0, 0], [-2.7, 0.75, 0.2, 0.22, 1], [-5, 1, -2, 0.4, 0], _, _],
  phone: [_, _, [-1.35, -0.85, 1, 0.12, 1], [-0.5, -1.2, -2, 0, 0], _, _],
  driver: [_, _, [-3.3, -0.7, 0.4, 0.3, 1], [-5, -1, -1, 0.5, 0], _, _],
  owner: [_, _, [-1.6, -0.4, -3, 0, 0], [-2.3, 0, 1, 0.16, 1], [-3, 0.4, -2, 0.4, 0], _],
  // The Earth never goes far: Iraq stays in view, the camera only drawing a little nearer or further and sliding aside.
  earth: [[-0.9, 0, -6.3, 2.2, 1], [-1.9, -0.25, -7.3, 2.2, 1], [-1.1, 0.25, -7.9, 2.2, 1], [-1.8, 0.1, -7.2, 2.2, 1], [-1.4, -0.1, -8.4, 2.2, 1], [-1.5, 0, -6.9, 2.2, 1]]
}
const smooth = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

const sections = [...document.querySelectorAll('main section')]
let wide = true, eased = 0, mx = 0, my = 0
const side = () => (document.documentElement.dir === 'rtl' ? 1 : -1)
addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5 }, { passive: true })

// A light glow pass where the machine can carry it, on a multisampled target so every edge stays smooth.
const strong = matchMedia('(min-width: 821px)').matches && !calm
const composer = strong ? new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })) : null
if (composer) {
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.25, 1.0))
  composer.addPass(new OutputPass())
}
function resize() {
  const w = innerWidth, h = innerHeight
  wide = w / h > 1.05 && w > 820
  renderer.setSize(w, h, false)
  composer?.setSize(w, h)
  camera.aspect = w / h
  camera.fov = wide ? 35 : 48
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

function where() {
  // Which part of the page is in the middle of the screen, as a number: 1.5 is halfway from the second part to the third.
  const mid = innerHeight / 2
  for (let i = 0; i < sections.length; i++) {
    const r = sections[i].getBoundingClientRect()
    if (r.bottom > mid) return Math.max(0, Math.min(sections.length - 1, i + Math.max(0, Math.min(1, (mid - r.top) / r.height)) - 0.5))
  }
  return sections.length - 1
}
function place(obj, keys, s, kind = 'device') {
  const i = Math.floor(s), t = smooth(s - i)
  let [x, y, z, k, op] = mix(keys[Math.min(i, keys.length - 1)], keys[Math.min(i + 1, keys.length - 1)], t)
  x *= side()
  if (!wide) {
    // On a phone Iraq sits in the middle of the screen, behind the words, always the same size.
    if (kind === 'earth') { x = 0; y = 0.15 - 1.75 * Math.max(0, 1 - s); z = z * 0.35 - 5.6 } else { x *= 0.15; y = y * 0.45 - 3.25; z -= 3.6 }
  }
  obj.position.set(x, y, z)
  return [k, op]
}

const clock = new THREE.Clock()
const v = new THREE.Vector3(), n = new THREE.Vector3(), toCam = new THREE.Vector3()
let last = 0
function frame() {
  const t = clock.getElapsedTime(), dt = Math.min(0.05, t - last)
  last = t
  eased += (where() - eased) * (calm ? 1 : 0.08)
  for (const [name, mesh] of Object.entries(D)) {
    const [turn, op] = place(mesh, K[name], eased)
    mesh.scale.set(mesh.userData.height * mesh.userData.aspect, mesh.userData.height, 1)
    mesh.rotation.y = side() * turn * (wide ? 1 : 0.4) + Math.sin(t * 0.6 + mesh.id) * 0.04
    mesh.rotation.x = Math.sin(t * 0.5 + mesh.id) * 0.03
    mesh.position.y += Math.sin(t * 0.8 + mesh.id) * 0.06
    // Out quickly between parts, so a device never lingers half-seen behind the next part's words.
    mesh.material.opacity = op * op * op
    mesh.visible = op > 0.01
  }
  const [es] = place(earth, K.earth, eased, 'earth')
  earth.scale.setScalar(es * (wide ? 1 : 1.05))
  globe.rotation.y = IRAQ_TURN + Math.sin(t * 0.1) * 0.04 + eased * 0.012
  borderTime.value = calm ? 0 : t
  for (const r of routes) {
    r.head += dt * r.speed * (calm ? 0 : 1)
    if (r.head > 1.5) send(r)
    r.line.material.uniforms.head.value = Math.min(r.head, 1.5)
  }
  const p = dustGeo.attributes.position
  for (let i = 0; i < DUST; i++) { let y = p.getY(i) + dt * 0.05; if (y > 5.5) y = -5.5; p.setY(i, y) }
  p.needsUpdate = true
  sky.rotation.y = t * 0.004 + eased * 0.03
  camera.position.x += (mx * 0.4 - camera.position.x) * 0.04
  camera.position.y += (-my * 0.25 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)
  earth.updateMatrixWorld()
  // Each city's mark follows its place on the turning Earth, shown only while the Earth is near and that side faces us.
  const near = Math.max(0, 1 - eased * 1.6)
  const W = innerWidth, H = innerHeight
  for (const c of cities) {
    v.copy(c.at).applyMatrix4(globe.matrixWorld)
    n.copy(v).sub(earth.position).normalize()
    toCam.copy(camera.position).sub(v).normalize()
    const facingUs = n.dot(toCam)
    const sp = v.clone().project(camera)
    const show = near * Math.min(1, Math.max(0, (facingUs - 0.25) * 4))
    c.el.style.opacity = show.toFixed(3)
    if (show > 0) c.el.style.transform = `translate(${((sp.x + 1) / 2) * W}px, ${((1 - sp.y) / 2) * H}px)`
  }
  composer ? composer.render() : renderer.render(scene, camera)
  requestAnimationFrame(frame)
}
frame()
