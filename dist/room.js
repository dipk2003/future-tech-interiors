import * as THREE from './vendor/three.module.js';

export function initRoom() {
  const container = document.querySelector('#room-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { container.innerHTML = '<div class="room-loading">Your browser doesn’t support 3D. Our design gallery is ready to explore above.</div>'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
  container.replaceChildren(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
  const group = new THREE.Group(); scene.add(group);
  const mat = (color, roughness = .85) => new THREE.MeshStandardMaterial({ color, roughness });
  const wallMat = mat('#ded7c5'), floorMat = mat('#b29370'), sofaMat = mat('#e6dfcf'), accentMat = mat('#a78c66'), woodMat = mat('#886948'), stoneMat = mat('#e5ddc8'), metalMat = mat('#65533d', .35);
  const paletteMats = [wallMat, floorMat, sofaMat, accentMat, woodMat];
  function box(w, h, d, material, x, y, z) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material); mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh; }
  function roundBox(w,h,d,material,x,y,z,r=.1) { const s = new THREE.Shape(), hw=w/2-r, hh=h/2-r; s.moveTo(-hw,-h/2); s.lineTo(hw,-h/2); s.quadraticCurveTo(w/2,-h/2,w/2,-hh); s.lineTo(w/2,hh); s.quadraticCurveTo(w/2,h/2,hw,h/2); s.lineTo(-hw,h/2); s.quadraticCurveTo(-w/2,h/2,-w/2,hh); s.lineTo(-w/2,-hh); s.quadraticCurveTo(-w/2,-h/2,-hw,-h/2); const geometry = new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:6}); geometry.center(); const mesh=new THREE.Mesh(geometry,material); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true;group.add(mesh); return mesh; }
  function cylinder(radiusTop,radiusBottom,height,material,x,y,z) { const m=new THREE.Mesh(new THREE.CylinderGeometry(radiusTop,radiusBottom,height,40),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m; }
  // Open architectural model: floor, two walls and a window bay.
  box(6.2,.22,5.2,woodMat,0,-.18,0);
  for(let i=0;i<20;i++) box(.297,.035,5,floorMat,-2.85+i*.3,-.045,0);
  box(6,.06,.025,woodMat,0,-.015,2.51);
  box(6,3,.12,wallMat,0,1.43,-2.5);
  box(.12,3,5,wallMat,-3,1.43,0);
  for(let i=0;i<12;i++) box(.045,2.9,.05,woodMat,-2.8+i*.17,1.45,-2.4);
  box(.13,3,.14,woodMat,-3,1.43,2.5);
  const glass = new THREE.MeshStandardMaterial({color:'#dce5d9',roughness:.2,transparent:true,opacity:.55});
  box(.14,2.25,2.1,woodMat,-2.9,1.65,.55); box(.16,2.08,1.92,glass,-2.82,1.65,.55);
  box(.18,.035,1.94,woodMat,-2.7,1.65,.55);box(.18,2.08,.035,woodMat,-2.7,1.65,.55);
  const curtain = mat('#f1e8d8');for(let i=0;i<5;i++) cylinder(.045,.045,2.5,curtain,-2.64,1.65,1.53+i*.05);
  // A low, generously upholstered sofa.
  roundBox(3,.45,1.08,sofaMat,.4,.48,-1.55,.12);
  roundBox(3,.85,.28,sofaMat,.4,.9,-2,.1);
  roundBox(.27,.64,1.12,sofaMat,-1.03,.72,-1.52,.09);roundBox(.27,.64,1.12,sofaMat,1.83,.72,-1.52,.09);
  for(let i=0;i<3;i++) {roundBox(.83,.19,.84,sofaMat,-.49+i*.88,.78,-1.45,.07);roundBox(.78,.49,.18,sofaMat,-.49+i*.88,1.03,-1.83,.07);}
  const pillow = roundBox(.43,.43,.2,accentMat,-.6,1.03,-1.63,.07);pillow.rotation.z=.22;
  const pillow2 = roundBox(.43,.43,.2,accentMat,1.35,1.03,-1.6,.07);pillow2.rotation.z=-.2;
  [-.8,1.6].forEach(x => [-1.9,-1.2].forEach(z => cylinder(.035,.035,.22,metalMat,x,.15,z)));
  // Rug and stone nesting tables.
  const rugMat=mat('#c9c5b2');roundBox(3.8,.025,2.65,rugMat,.3,.012,.35,.012);
  const rugLine=mat('#b5b09b');for(let i=0;i<20;i++) box(.018,.008,2.5,rugLine,-1.45+i*.18,.031,.35);
  cylinder(.71,.71,.12,stoneMat,.27,.63,.25);cylinder(.26,.32,.58,stoneMat,.27,.29,.25);
  cylinder(.42,.42,.08,woodMat,1.15,.43,.77);cylinder(.22,.25,.4,woodMat,1.15,.2,.77);
  box(.36,.045,.25,mat('#686e5c'),.21,.719,.3);box(.3,.035,.22,mat('#eae5d8'),.18,.757,.31);
  cylinder(.12,.08,.22,mat('#8a775e'),.5,.8,-.02);
  // Sculptural occasional chair.
  roundBox(.86,.2,.83,accentMat,-1.9,.61,.87,.09);
  const chairBack=roundBox(.89,.56,.16,accentMat,-1.9,.91,1.19,.07);chairBack.rotation.x=-.13;
  [-2.22,-1.58].forEach(x => [.58,1.15].forEach(z => box(.04,.52,.04,woodMat,x,.27,z)));
  // Artwork, console, lamps and greenery.
  box(1.28,1.43,.065,woodMat,.6,1.98,-2.39);box(1.17,1.32,.07,mat('#eee8dc'),.6,1.98,-2.34);
  const art=new THREE.Mesh(new THREE.CircleGeometry(.39,48),mat('#a98c6c'));art.position.set(.6,2.03,-2.29);group.add(art);
  box(.08,.7,.03,mat('#65705d'),.82,1.96,-2.27);
  box(.85,.68,.42,woodMat,2.43,.34,-2.08);box(.9,.05,.48,stoneMat,2.43,.72,-2.08);
  cylinder(.1,.14,.3,mat('#d7cbb6'),2.43,.89,-2.08);
  const lampGlow = new THREE.MeshStandardMaterial({color:'#e7d4a6',emissive:'#e5ac4c',emissiveIntensity:.12,roughness:1});
  cylinder(.23,.34,.35,lampGlow,2.42,1.17,-2.08);
  cylinder(.2,.15,.07,metalMat,2.4,.04,-.73);cylinder(.018,.018,1.9,metalMat,2.4,.99,-.73);cylinder(.27,.4,.42,lampGlow,2.4,1.97,-.73);
  cylinder(.27,.2,.5,mat('#b3a38d'),-2.25,.25,-1.6);
  const leafMat=mat('#65754b');for(let i=0;i<12;i++) { const a=i*2.4, y=.75+i*.065;const stem=cylinder(.012,.012,y-.25,woodMat,-2.25,.25+(y-.25)/2,-1.6);stem.rotation.z=Math.sin(a)*.15;const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),leafMat);leaf.scale.set(.12,.37,.055);leaf.position.set(-2.25+Math.cos(a)*.24,y,-1.6+Math.sin(a)*.22);leaf.rotation.set(Math.sin(a)*.6, a, Math.cos(a)*.7);leaf.castShadow=true;group.add(leaf); }
  const ambient=new THREE.HemisphereLight('#f2eddd','#555d40',2.5);scene.add(ambient);
  const sun=new THREE.DirectionalLight('#fff0ce',4.5);sun.position.set(-3,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;scene.add(sun);
  const warm=new THREE.PointLight('#ffbb65',0,9);warm.position.set(2.4,1.9,-.7);scene.add(warm);
  let theta=.62,targetTheta=.62, elevation=.57,night=false,palette=0,visible=true,dragging=false,lastX=0;
  const palettes=[['#ded7c5','#b29370','#e6dfcf','#a78c66','#886948'],['#cbd0bc','#bdb59f','#e5e0d3','#818a72','#87816a'],['#cfbda4','#8c694e','#d4c3ad','#84624c','#5f4635']];
  const labels=['Warm oak','Sage & stone','Walnut'];
  function status(){document.querySelector('.room-status').textContent=`${labels[palette]} · ${night?'Evening':'Daylight'}`;}
  document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{palette=Number(button.dataset.palette);paletteMats.forEach((material,i)=>material.color.set(palettes[palette][i]));document.querySelectorAll('[data-palette]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});status();render();}));
  document.querySelector('#light-toggle').addEventListener('click',event=>{night=!night;event.currentTarget.setAttribute('aria-pressed',String(night));document.querySelector('#light-label').textContent=night?'Evening':'Daylight';ambient.intensity=night?.85:2.5;sun.intensity=night?.65:4.5;sun.color.set(night?'#94a2b5':'#fff0ce');warm.intensity=night?17:0;lampGlow.emissiveIntensity=night?1.5:.12;renderer.toneMappingExposure=night?1.05:1.2;status();render();});
  function rotate(delta){targetTheta=Math.max(-.4,Math.min(1.5,targetTheta+delta));if(reduced){theta=targetTheta;render();}}
  document.querySelector('#rotate-left').addEventListener('click',()=>rotate(-.25));document.querySelector('#rotate-right').addEventListener('click',()=>rotate(.25));document.querySelector('#reset-room').addEventListener('click',()=>{targetTheta=.62;if(reduced){theta=targetTheta;render();}});
  container.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;container.setPointerCapture(e.pointerId);});container.addEventListener('pointermove',e=>{if(!dragging)return;rotate((lastX-e.clientX)*.006);lastX=e.clientX;});container.addEventListener('pointerup',()=>dragging=false);container.addEventListener('pointercancel',()=>dragging=false);
  function render(){const radius=11.9;camera.position.set(Math.sin(theta)*radius,Math.sin(elevation)*radius,Math.cos(theta)*radius);camera.lookAt(0,.9,0);renderer.render(scene,camera);}
  function resize(){const width=container.clientWidth,height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<400?45:37;camera.updateProjectionMatrix();render();}new ResizeObserver(resize).observe(container);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(container);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();container.innerHTML='<div class="room-loading">3D paused on this device. Refresh the page to explore again.</div>';});
  function animate(){requestAnimationFrame(animate);if(!visible||document.hidden||reduced)return;if(Math.abs(targetTheta-theta)>.0001){theta+=(targetTheta-theta)*.07;render();}}
  animate();
}
