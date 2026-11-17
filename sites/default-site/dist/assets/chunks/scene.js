import{B as e,C as t,E as n,F as r,I as i,M as a,O as o,P as s,S as c,T as l,_ as u,b as d,d as f,f as p,j as ee,k as te,l as ne,n as re,o as ie,p as ae,t as m,v as oe,w as h,z as g}from"./three.module.js";import{r as _}from"./preload-helper.js";var v=Math.PI*2;function y(e,t=0){let n=Math.cos(t),r=Math.sin(t),a=new i;return e.forEach(([e,t],i)=>{let o=e*n-t*r,s=e*r+t*n;i===0?a.moveTo(o,s):a.lineTo(o,s)}),a.closePath(),a}function b(e,t,n){let r=new l;return r.absarc(e,t,n,0,v,!0),r}function x(e,t,n,r){let i=new l;return i.moveTo(e,t),i.lineTo(e,t+r),i.lineTo(e+n,t+r),i.lineTo(e+n,t),i.closePath(),i}function S(){let e=.74,t=.55,n=v/10,r=[],i=(e,t)=>r.push([Math.cos(e)*t,Math.sin(e)*t]);for(let r=0;r<10;r++){let a=r*n;i(a-n*.34,t),i(a-n*.2,e),i(a+n*.2,e),i(a+n*.34,t),i(a+n*.5,t)}let a=y(r);return a.holes.push(b(0,0,.23)),a}function C(){return y([[-.075,-.78],[.075,-.78],[.085,.3],[.44,.3],[.44,.68],[-.22,.68],[-.46,.5],[-.46,.3],[-.085,.3]],-.62)}function w(){let e=new i;e.moveTo(-.3,-.66),e.lineTo(-.3,-.4),e.bezierCurveTo(-.62,-.32,-.74,.12,-.56,.42),e.bezierCurveTo(-.4,.8,.4,.8,.56,.42),e.bezierCurveTo(.74,.12,.62,-.32,.3,-.4),e.lineTo(.3,-.66),e.lineTo(.17,-.66),e.lineTo(.17,-.52),e.lineTo(.06,-.52),e.lineTo(.06,-.66),e.lineTo(-.06,-.66),e.lineTo(-.06,-.52),e.lineTo(-.17,-.52),e.lineTo(-.17,-.66),e.closePath(),e.holes.push(b(-.25,.1,.15)),e.holes.push(b(.25,.1,.15));let t=new l;return t.moveTo(0,-.02),t.lineTo(-.085,-.22),t.lineTo(.085,-.22),t.closePath(),e.holes.push(t),e}function T(){let e=y([[0,-.34],[-.8,-.52],[-.8,.42],[-.4,.52],[0,.34],[.4,.52],[.8,.42],[.8,-.52]]);for(let t of[-.26,-.1,.06])e.holes.push(x(-.62,t,.46,.04)),e.holes.push(x(.16,t,.46,.04));return e}function E(){return y([[.16,.8],[-.36,-.04],[-.03,-.04],[-.16,-.8],[.38,.1],[.05,.1]])}var D=[S,C,w,T,E],se=D.length;function ce(e,t){let n=3+Math.floor(e()*3),r=[];for(let t=0;t<n;t++)r.push(.55+e()*1.05);let i=r.reduce((e,t)=>e+t,0),a=e()*v,o=.85+e()*.7,s=[];for(let c=0;c<n;c++){a+=r[c]/i*v;let n=(.62+e()*.38)*t;s.push([Math.cos(a)*n*o,Math.sin(a)*n])}return y(s,e()*v)}var O=Math.PI*2,le=12,k=38,A={home:{mood:1,a:[.1,.3,.4],b:[.42,.29,.12]},works:{mood:.55,a:[.06,.13,.3],b:[.3,.1,.2]},about:{mood:.5,a:[.03,.26,.2],b:[.05,.12,.18]},contact:{mood:.65,a:[.34,.2,.08],b:[.08,.16,.34]}},ue=`
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,de=`
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uMood;
uniform vec2 uMouse;
uniform vec3 uTintA;
uniform vec3 uTintB;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    p += uMouse * 0.06;
    float t = uTime * 0.045;

    float n = fbm(p * 1.5 + vec2(t, -t * 0.7));
    float m = fbm(p * 2.6 - vec2(t * 1.3, t) + n * 1.6);

    vec3 col = vec3(0.014, 0.017, 0.026);
    col += uTintA * smoothstep(0.32, 0.85, n) * 0.62;
    col += uTintB * smoothstep(0.42, 0.95, m) * 0.4;

    // light shafts, like light through a tall window; crisp edges give the glass something to bend
    float shaft = abs(sin((p.x * 2.6 + n * 0.7 + t * 2.2) * 3.14159));
    float fall = smoothstep(-0.7, 0.45, p.y + 0.15);
    col += vec3(0.62, 0.78, 0.9) * (pow(shaft, 22.0) * 0.14 + pow(shaft, 90.0) * 0.5) * fall;

    // a few small, hot lights drifting behind the glass
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        vec2 c = vec2(
            sin(uTime * (0.07 + fi * 0.021) + fi * 2.1) * 0.78 * uAspect * 0.5,
            cos(uTime * (0.05 + fi * 0.017) + fi * 1.3) * 0.34
        );
        float d = length(p - c);
        vec3 tint = mix(vec3(0.75, 0.92, 1.0), vec3(1.0, 0.82, 0.55), mod(fi, 2.0));
        float quiet = mix(0.4, 1.0, smoothstep(-0.36, -0.04, p.y)); // keep the headline area calm
        col += tint * (exp(-d * d * 760.0) * 1.35 + exp(-d * d * 30.0) * 0.06) * quiet;
    }

    // a faint horizon glow
    col += uTintB * 0.5 * exp(-pow((p.y + 0.34) * 3.2, 2.0));

    float vig = smoothstep(1.35, 0.1, length(p * vec2(0.82, 1.0)));
    col *= vig;
    col *= uMood;

    // dither to avoid banding in the dark
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
}`;function j(e){let t=Math.random()*2-1,n=Math.random()*O,r=Math.sqrt(1-t*t);return e.set(Math.cos(n)*r,Math.sin(n)*r*.8,t*.6+.25).normalize()}function fe(e){let n=new m(e),r=new s;r.add(new c(new ie(40,40,40),new t({color:263690,side:1})));let i=(e,n,i,a,s)=>{let l=new c(new o(e,n),new t({color:new f(i).multiplyScalar(a),side:2}));l.position.set(s[0],s[1],s[2]),l.lookAt(0,0,0),r.add(l)};i(26,3,14479359,7,[0,15,4]),i(4,22,16769200,5,[-16,0,2]),i(3,22,12117247,6,[15,1,-3]),i(14,2,10139903,2.2,[0,-14,6]),i(5,5,16777215,3,[3,4,18]);let a=n.fromScene(r,.03).texture;return n.dispose(),a}async function M(t,i){let l=window.matchMedia(`(pointer: coarse)`).matches||Math.min(window.innerWidth,window.innerHeight)<560,ie=l?9:15,m;try{m=new re({antialias:!l,alpha:!1,powerPreference:`high-performance`})}catch{return null}m.setPixelRatio(Math.min(window.devicePixelRatio||1,l?1.5:2)),m.setClearColor(460811,1),m.toneMapping=4,m.toneMappingExposure=1.05,m.transmissionResolutionScale=.7,m.domElement.setAttribute(`aria-hidden`,`true`),t.appendChild(m.domElement);let v=new s,y=new n(k,1,.1,90);y.position.set(0,0,le);let b=fe(m),x=new r({vertexShader:ue,fragmentShader:de,depthWrite:!1,uniforms:{uTime:{value:0},uAspect:{value:1},uMood:{value:A.home.mood},uMouse:{value:new g},uTintA:{value:new f(...A.home.a)},uTintB:{value:new f(...A.home.b)}}}),S=new c(new o(1,1),x);S.position.z=-10,S.renderOrder=-10,v.add(S);let C=new te(14677247,90,40,2);C.position.set(0,0,6),v.add(C);let w=(e,t,n=8)=>{let r=new ae(e,{depth:t,bevelEnabled:!0,bevelThickness:.012,bevelSize:.08,bevelSegments:1,curveSegments:n});return r.center(),r},T=[];for(let e=0;e<se;e++){let t=w(D[e](),.01,12);T.push({geo:t,edges:new p(t,24)})}let E=[12576498,12576498,15324840,13223154,12576498,11136733],M=new u({color:14677247,transparent:!0,opacity:.55,blending:2,depthWrite:!1});function pe(e=512){let t=document.createElement(`canvas`);t.width=t.height=e;let n=t.getContext(`2d`);n.fillStyle=`#000`,n.fillRect(0,0,e,e),n.strokeStyle=`#fff`,n.lineCap=`round`,n.filter=`blur(0.6px)`;let r=(e,t,i,a,o,s)=>{if(a<6||s>4)return;n.lineWidth=o,n.beginPath(),n.moveTo(e,t);let c=e,l=t;for(let e=0;e<6;e++)i+=(Math.random()-.5)*.7,c+=Math.cos(i)*a/6,l+=Math.sin(i)*a/6,n.lineTo(c,l),Math.random()<.25&&r(c,l,i+(Math.random()<.5?-1:1)*(.5+Math.random()*.6),a*.5,o*.6,s+1);n.stroke()};for(let t=0;t<7;t++)r(Math.random()*e,Math.random()*e,Math.random()*Math.PI*2,e*(.25+Math.random()*.35),1.6,0);let i=new ne(t);return i.wrapS=i.wrapT=a,i.repeat.set(.45,.45),i.colorSpace=``,i}let me=pe(100),he=e=>{let t={roughness:.02,metalness:0,clearcoat:1,clearcoatRoughness:0,envMap:b,envMapIntensity:3.2,specularIntensity:1,specularColor:new f(16777215),emissive:new f(2774376),emissiveIntensity:0,bumpMap:me,bumpScale:4};return l?new h({...t,color:e,metalness:.15,transparent:!0,opacity:.5,side:2,depthWrite:!1,envMapIntensity:2}):new h({...t,color:16777215,transmission:1,thickness:.25+Math.random()*.25,attenuationDistance:5,ior:1.55,dispersion:.6,iridescence:.35,iridescenceIOR:1.3,iridescenceThicknessRange:[120,380],specularIntensity:1,attenuationColor:new f(e)})},N=[],P=Math.max(.4,t.clientWidth/Math.max(1,t.clientHeight)),ge=P<1,F=[],_e=()=>{let e=[0,0],t=-1;for(let n=0;n<24;n++){let n=Math.random()*1.9-.95,r=Math.random()*1.5-.8;if(ge?r<-.4:n<-.05&&r<-.22)continue;let i=9;for(let[e,t]of F)i=Math.min(i,Math.hypot((n-e)*P,r-t));i>t&&(t=i,e=[n,r])}return F.push(e),e};for(let t=0;t<ie;t++){let n=.95+Math.random()*.95,r=w(ce(Math.random,n),.02+Math.random()*.24),i={geo:r,edges:new p(r,24)},a=he(E[t%E.length]),o=new c(r,a),s=new oe(i.edges,M);o.add(s),o.visible=!1,v.add(o);let[l,u]=_e(),d={mesh:o,line:s,mat:a,shard:i,isIcon:!1,u:l,v:u,z:-1.2+Math.random()*2.4,ph:Math.random()*O,fx:.25+Math.random()*.35,fy:.2+Math.random()*.35,fz:.2+Math.random()*.3,rx:(Math.random()-.5)*1.2,ry:(Math.random()-.5)*1.2,rz:Math.random()*O,dir:j(new e),spin:new e((Math.random()-.5)*9,(Math.random()-.5)*9,(Math.random()-.5)*9),far:1,att:0,hov:0,flip:0,flipTween:null,slot:0,icon:0,pos:new e};o.userData.shard=d,N.push(d)}let I=7,L=4,R=1,z=1,B=1,V=1,H=!1,U=!1,W=`idle`,G=null,ve=0,ye=0,K={x:0,y:0,ndcX:0,ndcY:0,inside:!1,touch:!1},q=new g,be=new ee,xe=new g,Se=N.map(e=>e.mesh),J=new e,Ce=new e,we=()=>{R=Math.max(1,t.clientWidth),z=Math.max(1,t.clientHeight),m.setSize(R,z,!1),m.domElement.style.width=`100%`,m.domElement.style.height=`100%`,y.aspect=R/z,y.updateProjectionMatrix(),L=Math.tan(d.degToRad(k/2))*le,I=L*y.aspect;let e=Math.tan(d.degToRad(k/2))*22*2*1.25;S.scale.set(e*y.aspect,e,1),x.uniforms.uAspect.value=y.aspect,B=d.clamp(y.aspect*.78,.5,1),V=d.clamp(I/6.2,.42,1)};we();let Te=new ResizeObserver(we);Te.observe(t);let Y=(e,t)=>{let n=t?T[e.icon]:e.shard;e.mesh.geometry=n.geo,e.line.geometry=n.edges,e.isIcon=t},Ee=(e,t,n)=>{if(e.flipTween?.kill(),i){Y(e,t);return}let r=e.flip,a=Math.ceil((r+Math.PI)/O)*O,o=(r+a)/2,s=!1;e.flipTween=_.to(e,{flip:a,duration:.95,delay:n,ease:`power2.inOut`,onUpdate:()=>{!s&&e.flip>=o&&(s=!0,Y(e,t))},onComplete:()=>{s||Y(e,t),e.flip=a%O,e.flipTween=null}})},De=e=>{W=`gathered`,t.dataset.mode=W,G=e,ve=performance.now()+1300,_.to(e,{hov:1,duration:.5,ease:`power2.out`,overwrite:`auto`});let n=0;for(let t of N){if(t===e)continue;t.slot=n,t.icon=n%se;let r=i?0:n*.035;_.to(t,{att:1,duration:i?.3:1.15,delay:r,ease:`power3.inOut`,overwrite:`auto`}),Ee(t,!0,r),n++}},Oe=()=>{if(W!==`gathered`||!G)return;W=`releasing`,t.dataset.mode=W;let e=G;_.to(e,{hov:0,duration:.6,ease:`power2.out`,overwrite:`auto`});let n=0,r=N.length-1,a=0;for(let o of N){if(o===e)continue;let s=i?0:a*.025;_.to(o,{att:0,duration:i?.3:1,delay:s,ease:`power3.inOut`,overwrite:`auto`,onComplete:()=>{++n>=r&&(W=`idle`,t.dataset.mode=W,G=null)}}),Ee(o,!1,s),a++}},ke=()=>{for(let e of N)_.killTweensOf(e),e.flipTween?.kill(),e.flipTween=null,e.att=0,e.hov=0,e.isIcon&&Y(e,!1);G=null,W=`idle`,t.dataset.mode=W},Ae=e=>{let n=t.getBoundingClientRect();K.x=e.clientX-n.left,K.y=e.clientY-n.top,K.ndcX=K.x/n.width*2-1,K.ndcY=-(K.y/n.height)*2+1,K.inside=!0,K.touch=e.pointerType===`touch`,K.touch&&(ye=performance.now()),q.set(K.ndcX,K.ndcY)},X=e=>Ae(e),je=e=>Ae(e),Me=()=>{K.inside=!1};window.addEventListener(`pointermove`,X,{passive:!0}),window.addEventListener(`pointerdown`,je,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Me);let Z=+!i,Ne=performance.now(),Q=0,$=0,Pe=(e,t)=>{let n=Z;e.pos.set(e.u*I*.95+Math.sin(t*e.fx+e.ph)*.24*n+e.dir.x*e.far*26,e.v*L*.92+Math.cos(t*e.fy+e.ph*1.3)*.28*n+e.dir.y*e.far*26,e.z+Math.sin(t*e.fz+e.ph*.7)*.3*n+e.dir.z*e.far*26)};return m.setAnimationLoop(()=>{let e=performance.now(),t=Math.min(.05,(e-Ne)/1e3);Ne=e,Q+=t,$++;let n=H&&!U;if(!n&&!H&&($&1)==1)return;y.position.x+=(q.x*.5*Z-y.position.x)*.04,y.position.y+=(q.y*.3*Z-y.position.y)*.04,y.lookAt(0,0,0),x.uniforms.uTime.value=Q;let r=x.uniforms.uMouse.value;if(r.x+=(q.x-r.x)*.03,r.y+=(q.y-r.y)*.03,H){for(let e of N)Pe(e,Q);if(G){let e=G.hov;G.pos.x=d.lerp(G.pos.x,d.clamp(G.pos.x,-I*.5,I*.5),e),G.pos.y=d.lerp(G.pos.y,d.clamp(G.pos.y,-L*.4,L*.4),e);for(let e of N){if(e===G||e.att<=1e-4)continue;let t=e.slot*2.39996+Q*.3*(e.slot%2?1:-1)*Z,n=(.85+Math.sqrt(e.slot+1)*.6)*V;Ce.set(G.pos.x+Math.cos(t)*n,G.pos.y+Math.sin(t)*n*.86,G.pos.z+.6+e.slot%4*.14),e.pos.lerp(Ce,e.att)}}for(let e of N){let t=e.mesh,n=1-e.far*e.far;if(n<.002){t.visible=!1;continue}t.visible=!0,t.position.copy(e.pos);let r=e.rx+Math.sin(Q*.31+e.ph)*.25*Z,i=e.ry+Math.cos(Q*.27+e.ph)*.3*Z,a=e.rz+Q*.05*Z;e.far>.001&&(r+=e.spin.x*e.far,i+=e.spin.y*e.far,a+=e.spin.z*e.far);let o=n*B;if(e.att>1e-4){let t=e.att,n=0;n=e.icon===0?Q*.7*Z:e.icon===1?(Math.sin(Q*1.6+e.slot)*.35-.25)*Z:Math.sin(Q*.8+e.slot)*.12*Z,r=d.lerp(r,.12*Math.sin(e.slot),t),i=d.lerp(i,.18*Math.cos(e.slot*1.7),t),a=d.lerp(a,n,t),o*=d.lerp(1,.78*V,t)}e===G&&(o*=1+.1*e.hov),t.rotation.set(r,i+e.flip,a),t.scale.setScalar(Math.max(1e-4,o)),e.mat.emissiveIntensity=e.hov*.9}if(n){if(W===`idle`&&K.inside){be.setFromCamera(xe.set(K.ndcX,K.ndcY),y);let e=be.intersectObjects(Se,!1);for(let t of e){let e=t.object.userData.shard;if(e.far<.08&&e.att<.01){De(e);break}}}else if(W===`gathered`&&G&&performance.now()>ve){J.copy(G.pos).project(y);let e=(J.x*.5+.5)*R,t=(-J.y*.5+.5)*z,n=z/(2*L),r=(.85+Math.sqrt(N.length)*.6+.9)*V*n,i=Math.hypot(K.x-e,K.y-t)>r,a=K.touch&&performance.now()-ye>2400;(!K.inside||i||a)&&Oe()}}}m.render(v,y)}),{showShards(){if(!H||U){_.killTweensOf(N),ke(),H=!0,U=!1;for(let e of N){j(e.dir),e.far=1;let t=(i?.4:2.1)+(i?0:Math.random()*1.1);_.to(e,{far:0,duration:t,delay:i?0:.1+Math.random()*.8,ease:`expo.out`})}}},hideShards(){return H?(U=!0,_.killTweensOf(N),ke(),new Promise(e=>{for(let e of N)j(e.dir);_.to(N,{far:1,duration:i?.25:.85,ease:`power3.in`,stagger:{each:i?0:.025,from:`random`},onComplete:()=>{H=!1,U=!1;for(let e of N)e.mesh.visible=!1;e()}})})):Promise.resolve()},setView(e){let t=A[e],n=i?.2:1.4;_.to(x.uniforms.uMood,{value:t.mood,duration:n,ease:`power2.inOut`});let r=x.uniforms.uTintA.value,a=x.uniforms.uTintB.value;_.to(r,{r:t.a[0],g:t.a[1],b:t.a[2],duration:n,ease:`power2.inOut`}),_.to(a,{r:t.b[0],g:t.b[1],b:t.b[2],duration:n,ease:`power2.inOut`})},destroy(){m.setAnimationLoop(null),window.removeEventListener(`pointermove`,X),window.removeEventListener(`pointerdown`,je),document.documentElement.removeEventListener(`pointerleave`,Me),Te.disconnect(),_.killTweensOf(N),_.killTweensOf(x.uniforms.uMood);for(let e of N)e.flipTween?.kill(),e.shard.geo.dispose(),e.shard.edges.dispose(),e.mat.dispose();for(let e of T)e.geo.dispose(),e.edges.dispose();M.dispose(),S.geometry.dispose(),x.dispose(),b.dispose(),m.dispose(),m.domElement.remove()}}}export{M as createStage};