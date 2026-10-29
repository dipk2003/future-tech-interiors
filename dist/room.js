import * as THREE from './vendor/three.module.js';

export function initRoom() {
  const container = document.querySelector('#room-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
  container.replaceChildren(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
  const group = new THREE.Group(); scene.add(group);
  const phases = { shell: [], floor: [], panels: [], sofa: [], rug: [], tables: [], chair: [], details: [], lights: [], greenery: [] };
  let phase = 'shell';
  function add(mesh) { group.add(mesh); phases[phase].push(mesh); return mesh; }
  const mat = (color, roughness = .85) => new THREE.MeshStandardMaterial({ color, roughness });
  const wallMat = mat('#ded7c5'), floorMat = mat('#b29370'), sofaMat = mat('#e6dfcf'), accentMat = mat('#a78c66'), woodMat = mat('#886948'), stoneMat = mat('#e5ddc8'), metalMat = mat('#65533d', .35);
  function box(w, h, d, material, x, y, z) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material); mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; return add(mesh); }
  function roundBox(w,h,d,material,x,y,z,r=.1) { const s = new THREE.Shape(), hw=w/2-r, hh=h/2-r; s.moveTo(-hw,-h/2); s.lineTo(hw,-h/2); s.quadraticCurveTo(w/2,-h/2,w/2,-hh); s.lineTo(w/2,hh); s.quadraticCurveTo(w/2,h/2,hw,h/2); s.lineTo(-hw,h/2); s.quadraticCurveTo(-w/2,h/2,-w/2,hh); s.lineTo(-w/2,-hh); s.quadraticCurveTo(-w/2,-h/2,-hw,-h/2); const geometry = new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:6}); geometry.center(); const mesh=new THREE.Mesh(geometry,material); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true;return add(mesh); }
  function cylinder(radiusTop,radiusBottom,height,material,x,y,z) { const m=new THREE.Mesh(new THREE.CylinderGeometry(radiusTop,radiusBottom,height,40),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return add(m); }
  // Open architectural model: floor, two walls and a window bay.
  box(6.2,.22,5.2,mat('#aaa79b'),0,-.18,0);
  phase='floor';
  for(let i=0;i<20;i++) box(.297,.035,5,floorMat,-2.85+i*.3,-.045,0);
  box(6,.06,.025,woodMat,0,-.015,2.51);
  phase='shell';
  box(6,3,.12,wallMat,0,1.43,-2.5);
  box(.12,3,5,wallMat,-3,1.43,0);
  phase='panels';
  for(let i=0;i<12;i++) box(.045,2.9,.05,woodMat,-2.8+i*.17,1.45,-2.4);
  box(.13,3,.14,woodMat,-3,1.43,2.5);
  const glass = new THREE.MeshStandardMaterial({color:'#dce5d9',roughness:.2,transparent:true,opacity:.55});
  box(.14,2.25,2.1,woodMat,-2.9,1.65,.55); box(.16,2.08,1.92,glass,-2.82,1.65,.55);
  box(.18,.035,1.94,woodMat,-2.7,1.65,.55);box(.18,2.08,.035,woodMat,-2.7,1.65,.55);
  const curtain = mat('#f1e8d8');for(let i=0;i<5;i++) cylinder(.045,.045,2.5,curtain,-2.64,1.65,1.53+i*.05);
  // A low, generously upholstered sofa.
  phase='sofa';
  roundBox(3,.45,1.08,sofaMat,.4,.48,-1.55,.12);
  roundBox(3,.85,.28,sofaMat,.4,.9,-2,.1);
  roundBox(.27,.64,1.12,sofaMat,-1.03,.72,-1.52,.09);roundBox(.27,.64,1.12,sofaMat,1.83,.72,-1.52,.09);
  for(let i=0;i<3;i++) {roundBox(.83,.19,.84,sofaMat,-.49+i*.88,.78,-1.45,.07);roundBox(.78,.49,.18,sofaMat,-.49+i*.88,1.03,-1.83,.07);}
  const pillow = roundBox(.43,.43,.2,accentMat,-.6,1.03,-1.63,.07);pillow.rotation.z=.22;
  const pillow2 = roundBox(.43,.43,.2,accentMat,1.35,1.03,-1.6,.07);pillow2.rotation.z=-.2;
  [-.8,1.6].forEach(x => [-1.9,-1.2].forEach(z => cylinder(.035,.035,.22,metalMat,x,.15,z)));
  // Rug and stone nesting tables.
  phase='rug';
  const rugMat=mat('#c9c5b2');roundBox(3.8,.025,2.65,rugMat,.3,.012,.35,.012);
  const rugLine=mat('#b5b09b');for(let i=0;i<20;i++) box(.018,.008,2.5,rugLine,-1.45+i*.18,.031,.35);
  phase='tables';
  cylinder(.71,.71,.12,stoneMat,.27,.63,.25);cylinder(.26,.32,.58,stoneMat,.27,.29,.25);
  cylinder(.42,.42,.08,woodMat,1.15,.43,.77);cylinder(.22,.25,.4,woodMat,1.15,.2,.77);
  box(.36,.045,.25,mat('#686e5c'),.21,.719,.3);box(.3,.035,.22,mat('#eae5d8'),.18,.757,.31);
  cylinder(.12,.08,.22,mat('#8a775e'),.5,.8,-.02);
  // Sculptural occasional chair.
  phase='chair';
  roundBox(.86,.2,.83,accentMat,-1.9,.61,.87,.09);
  const chairBack=roundBox(.89,.56,.16,accentMat,-1.9,.91,1.19,.07);chairBack.rotation.x=-.13;
  [-2.22,-1.58].forEach(x => [.58,1.15].forEach(z => box(.04,.52,.04,woodMat,x,.27,z)));
  // Artwork, console, lamps and greenery.
  phase='details';
  box(1.28,1.43,.065,woodMat,.6,1.98,-2.39);box(1.17,1.32,.07,mat('#eee8dc'),.6,1.98,-2.34);
  const art=new THREE.Mesh(new THREE.CircleGeometry(.39,48),mat('#a98c6c'));art.position.set(.6,2.03,-2.29);add(art);
  box(.08,.7,.03,mat('#65705d'),.82,1.96,-2.27);
  box(.85,.68,.42,woodMat,2.43,.34,-2.08);box(.9,.05,.48,stoneMat,2.43,.72,-2.08);
  cylinder(.1,.14,.3,mat('#d7cbb6'),2.43,.89,-2.08);
  phase='lights';
  const lampGlow = new THREE.MeshStandardMaterial({color:'#e7d4a6',emissive:'#e5ac4c',emissiveIntensity:.12,roughness:1});
  cylinder(.23,.34,.35,lampGlow,2.42,1.17,-2.08);
  cylinder(.2,.15,.07,metalMat,2.4,.04,-.73);cylinder(.018,.018,1.9,metalMat,2.4,.99,-.73);cylinder(.27,.4,.42,lampGlow,2.4,1.97,-.73);
  phase='greenery';
  cylinder(.27,.2,.5,mat('#b3a38d'),-2.25,.25,-1.6);
  const leafMat=mat('#65754b');for(let i=0;i<12;i++) { const a=i*2.4, y=.75+i*.065;const stem=cylinder(.012,.012,y-.25,woodMat,-2.25,.25+(y-.25)/2,-1.6);stem.rotation.z=Math.sin(a)*.15;const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),leafMat);leaf.scale.set(.12,.37,.055);leaf.position.set(-2.25+Math.cos(a)*.24,y,-1.6+Math.sin(a)*.22);leaf.rotation.set(Math.sin(a)*.6, a, Math.cos(a)*.7);leaf.castShadow=true;add(leaf); }
  const ambient=new THREE.HemisphereLight('#f2eddd','#555d40',2.5);scene.add(ambient);
  const sun=new THREE.DirectionalLight('#fff0ce',4.5);sun.position.set(-3,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;scene.add(sun);
  const warm=new THREE.PointLight('#ffbb65',0,9);warm.position.set(2.4,1.9,-.7);scene.add(warm);
  // Every installation keeps its finished transform, so the sequence is deterministic.
  Object.values(phases).flat().forEach(mesh => {
    mesh.userData.finishedPosition = mesh.position.clone();
    mesh.userData.finishedScale = mesh.scale.clone();
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.ShadowMaterial({ opacity:.22 }));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-.3;shadow.receiveShadow=true;scene.add(shadow);
  const grainCanvas=document.createElement('canvas');grainCanvas.width=128;grainCanvas.height=512;
  const grainContext=grainCanvas.getContext('2d');grainContext.fillStyle='#e6dcc9';grainContext.fillRect(0,0,128,512);
  let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<160;i++){grainContext.strokeStyle=`rgba(105,81,49,${.02+random()*.1})`;grainContext.lineWidth=.5+random();const x=random()*128;grainContext.beginPath();grainContext.moveTo(x,0);grainContext.bezierCurveTo(x+random()*8,160,x-random()*8,350,x+random()*4,512);grainContext.stroke();}
  const grain=new THREE.CanvasTexture(grainCanvas);grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=grain.wrapT=THREE.RepeatWrapping;floorMat.map=grain;woodMat.map=grain;
  const roughWall=new THREE.Color('#aaa99f'),finishedWall=new THREE.Color('#ded7c5');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const ease=value=>1-Math.pow(1-clamp(value),3);
  const schedule={floor:[.8,1.2,.07],panels:[3,1.6,.035],rug:[5.6,1.4,.012],sofa:[6.8,1.6,.035],chair:[8.8,1.4,.03],tables:[10,1.4,.035],details:[11.5,1.3,.04],greenery:[12.5,1.4,.018],lights:[14,1.3,.06]};
  const duration=18;
  let elapsed=reduced?duration:0,visible=false,frameId=0,lastTime=0,contextLost=false;
  function install(time){
    for(const [name,[start,length,stagger]] of Object.entries(schedule)){
      phases[name].forEach((mesh,index)=>{
        const progress=ease((time-start-index*stagger)/length);
        mesh.visible=progress>0;
        const position=mesh.userData.finishedPosition,scale=mesh.userData.finishedScale;
        mesh.position.copy(position);mesh.scale.copy(scale);
        if(name==='floor'){mesh.position.z-=(1-progress)*5.5;mesh.scale.z=Math.max(.001,progress)*scale.z;}
        else if(name==='panels'){mesh.scale.y=Math.max(.001,progress)*scale.y;mesh.position.y=position.y*progress;}
        else if(name==='rug'){mesh.scale.z=Math.max(.001,progress)*scale.z;}
        else{mesh.position.y+=(1-progress)*(name==='lights'?1.4:.9);mesh.scale.multiplyScalar(.65+.35*progress);}
      });
    }
    wallMat.color.copy(roughWall).lerp(finishedWall,ease((time-2)/3));
    const lighting=ease((time-14.6)/2);warm.intensity=lighting*13;lampGlow.emissiveIntensity=.12+lighting*.85;
    ambient.intensity=2.5-lighting*.5;sun.intensity=4.5-lighting*.9;
    const progress=clamp(time/duration),theta=.9-progress*.37,elevation=.63-progress*.09,radius=12.3-progress*.7;
    camera.position.set(Math.sin(theta)*radius,Math.sin(elevation)*radius,Math.cos(theta)*radius);camera.lookAt(0,1,0);
    const stage=time<3?'shell':time<6.8?'finishes':time<11.5?'furniture':time<15?'styling':'complete';
    if(container.dataset.buildStage!==stage)container.dataset.buildStage=stage;
    renderer.render(scene,camera);
  }
  function resize(){const width=container.clientWidth,height=container.clientHeight;if(!width||!height||contextLost)return;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<400?46:width<650?41:37;camera.updateProjectionMatrix();install(elapsed);}
  new ResizeObserver(resize).observe(container);resize();
  function tick(time){frameId=0;if(!visible||document.hidden||contextLost)return;const delta=lastTime?Math.min((time-lastTime)/1000,.06):0;lastTime=time;elapsed=Math.min(duration,elapsed+delta);install(elapsed);if(elapsed<duration)frameId=requestAnimationFrame(tick);}
  function play(){if(reduced||frameId||!visible||document.hidden||contextLost)return;lastTime=0;frameId=requestAnimationFrame(tick);}
  new IntersectionObserver(entries=>{const next=entries[0].isIntersecting;if(next&&!visible&&elapsed>=duration&&!reduced)elapsed=0;visible=next;if(!visible){cancelAnimationFrame(frameId);frameId=0;lastTime=0;}else play();},{threshold:.15}).observe(container);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0;lastTime=0;}else play();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;cancelAnimationFrame(frameId);const fallback=document.createElement('img');fallback.src='/assets/living.jpg';fallback.alt='A completed interior design concept with natural materials';container.replaceChildren(fallback);});
  install(elapsed);
}
