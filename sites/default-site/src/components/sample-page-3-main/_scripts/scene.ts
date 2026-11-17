import * as THREE from 'three';
import { gsap } from 'gsap';
import { ICON_COUNT, ICON_SHAPES, makeShardShape } from './shapes';
import type { ViewKey } from './data';

/**
 * The persistent WebGL stage.
 *
 *  - A shader backdrop (slow aurora + light shafts) lives behind every page.
 *  - Home adds the glass shards: they assemble from all directions, float,
 *    and when the pointer touches one, the rest gather on it as small glass figures.
 */

export interface Stage {
    /** Shards assemble from nothing and start floating. */
    showShards(): void;
    /** Shards burst outward and vanish. Resolves when they are gone. */
    hideShards(): Promise<void>;
    /** Re-tint and re-light the backdrop for a page. */
    setView(key: ViewKey): void;
    destroy(): void;
}

interface Variant {
    geo: THREE.BufferGeometry;
    edges: THREE.BufferGeometry;
}

interface Shard {
    mesh: THREE.Mesh;
    line: THREE.LineSegments;
    mat: THREE.MeshPhysicalMaterial;
    shard: Variant;
    isIcon: boolean;
    // layout in normalised screen space
    u: number;
    v: number;
    z: number;
    // motion
    ph: number;
    fx: number;
    fy: number;
    fz: number;
    rx: number;
    ry: number;
    rz: number;
    dir: THREE.Vector3;
    spin: THREE.Vector3;
    // tweened state
    far: number; // 1 = far away / invisible, 0 = home
    att: number; // 0 = free, 1 = attached to the anchor
    hov: number; // anchor emphasis
    flip: number; // extra Y rotation used when swapping geometry
    flipTween: gsap.core.Tween | null;
    // gather
    slot: number;
    icon: number;
    // computed each frame
    pos: THREE.Vector3;
}

const TAU = Math.PI * 2;
const CAM_Z = 12;
const FOV = 38;

const MOODS: Record<ViewKey, { mood: number; a: [number, number, number]; b: [number, number, number] }> = {
    home: { mood: 1, a: [0.1, 0.3, 0.4], b: [0.42, 0.29, 0.12] },
    works: { mood: 0.55, a: [0.06, 0.13, 0.3], b: [0.3, 0.1, 0.2] },
    about: { mood: 0.5, a: [0.03, 0.26, 0.2], b: [0.05, 0.12, 0.18] },
    contact: { mood: 0.65, a: [0.34, 0.2, 0.08], b: [0.08, 0.16, 0.34] },
};

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const BG_FRAG = /* glsl */ `
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
}`;

function randomUnit(out: THREE.Vector3): THREE.Vector3 {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * TAU;
    const r = Math.sqrt(1 - u * u);
    return out.set(Math.cos(a) * r, Math.sin(a) * r * 0.8, u * 0.6 + 0.25).normalize();
}

function makeEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    env.add(
        new THREE.Mesh(
            new THREE.BoxGeometry(40, 40, 40),
            new THREE.MeshBasicMaterial({ color: 0x04060a, side: THREE.BackSide })
        )
    );
    const panel = (
        w: number,
        h: number,
        color: number,
        power: number,
        pos: [number, number, number]
    ) => {
        const m = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(color).multiplyScalar(power),
                side: THREE.DoubleSide,
            })
        );
        m.position.set(pos[0], pos[1], pos[2]);
        m.lookAt(0, 0, 0);
        env.add(m);
    };
    panel(26, 3, 0xdcefff, 7, [0, 15, 4]); // overhead strip
    panel(4, 22, 0xffe0b0, 5, [-16, 0, 2]); // warm tall window, left
    panel(3, 22, 0xb8e4ff, 6, [15, 1, -3]); // cool tall window, right
    panel(14, 2, 0x9ab8ff, 2.2, [0, -14, 6]); // faint floor bounce
    panel(5, 5, 0xffffff, 3, [3, 4, 18]); // soft front fill



    
    const tex = pmrem.fromScene(env, 0.03).texture;
    pmrem.dispose();
    return tex;
}

export async function createStage(host: HTMLElement, reduce: boolean): Promise<Stage | null> {
    const coarse =
        window.matchMedia('(pointer: coarse)').matches || Math.min(window.innerWidth, window.innerHeight) < 560;
    const COUNT = coarse ? 9 : 15;

    let renderer: THREE.WebGLRenderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: !coarse,
            alpha: false,
            powerPreference: 'high-performance',
        });
    } catch {
        return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
    renderer.setClearColor(0x07080b, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    (renderer as unknown as { transmissionResolutionScale: number }).transmissionResolutionScale = 0.7;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 90);
    camera.position.set(0, 0, CAM_Z);

    const envTex = makeEnvironment(renderer);

    // ---- backdrop ---------------------------------------------------------
    const bgMat = new THREE.ShaderMaterial({
        vertexShader: BG_VERT,
        fragmentShader: BG_FRAG,
        depthWrite: false,
        uniforms: {
            uTime: { value: 0 },
            uAspect: { value: 1 },
            uMood: { value: MOODS.home.mood },
            uMouse: { value: new THREE.Vector2() },
            uTintA: { value: new THREE.Color(...MOODS.home.a) },
            uTintB: { value: new THREE.Color(...MOODS.home.b) },
        },
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bgMat);
    bg.position.z = -10;
    bg.renderOrder = -10;
    scene.add(bg);

    // ---- light ---------------------------------------------------------

    // Next to the other scene setup
    const glint = new THREE.PointLight(0xdff4ff, 90, 40, 2);
    glint.position.set(0, 0, 6);
    scene.add(glint);

    // ---- shared geometry ---------------------------------------------------
    const extrude = (shape: THREE.Shape, depth: number, curve = 8) => {
        const g = new THREE.ExtrudeGeometry(shape, {
            depth,
            bevelEnabled: true,
            bevelThickness: 0.012,   // was 0.035, smaller bevel = thinner edge
            bevelSize: 0.08,        // was 0.035
            bevelSegments: 1,        // was 2
            curveSegments: curve,
        });
        g.center();
        return g;
    };

    const icons: Variant[] = [];
    for (let i = 0; i < ICON_COUNT; i++) {

        // was: 0.12 + Math.random() * 0.2
        //const geo = extrude(makeShardShape(Math.random, 0.5), 0.03 + Math.random() * 0.04);

        const geo = extrude(ICON_SHAPES[i](), 0.01, 12);

        icons.push({ geo, edges: new THREE.EdgesGeometry(geo, 24) });
    }

    // ---- shards ------------------------------------------------------------
    const tints = [0xbfe6f2, 0xbfe6f2, 0xe9d6a8, 0xc9c4f2, 0xbfe6f2, 0xa9eedd];
    const lineMat = new THREE.LineBasicMaterial({
        color: 0xdff4ff,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    function makeCrackTexture(size = 512): THREE.CanvasTexture {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const g = c.getContext('2d')!;
        g.fillStyle = '#000';
        g.fillRect(0, 0, size, size);
        g.strokeStyle = '#fff';
        g.lineCap = 'round';
        g.filter = 'blur(0.6px)';

        // A crack walks forward in segments and sometimes forks
        const crack = (x: number, y: number, a: number, len: number, w: number, depth: number) => {
            if (len < 6 || depth > 4) return;
            g.lineWidth = w;
            g.beginPath();
            g.moveTo(x, y);
            let cx = x;
            let cy = y;
            for (let i = 0; i < 6; i++) {
                a += (Math.random() - 0.5) * 0.7;
                cx += (Math.cos(a) * len) / 6;
                cy += (Math.sin(a) * len) / 6;
                g.lineTo(cx, cy);
                if (Math.random() < 0.25) {
                    const side = Math.random() < 0.5 ? -1 : 1;
                    crack(cx, cy, a + side * (0.5 + Math.random() * 0.6), len * 0.5, w * 0.6, depth + 1);
                }
            }
            g.stroke();
        };

        for (let i = 0; i < 7; i++) {
            crack(Math.random() * size, Math.random() * size, Math.random() * Math.PI * 2, size * (0.25 + Math.random() * 0.35), 1.6, 0);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(0.45, 0.45); // shard UVs are in world units, so a small repeat keeps cracks large
        tex.colorSpace = THREE.NoColorSpace;
        return tex;
    }
    const crackTex = makeCrackTexture(100);

    const makeMaterial = (tint: number): THREE.MeshPhysicalMaterial => {
        const common = {
            roughness: 0.02,            // was 0.05
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0,      // was 0.04, a perfectly sharp coat
            envMap: envTex,
            envMapIntensity: 3.2,       // was 2.2
            specularIntensity: 1,
            specularColor: new THREE.Color(0xffffff),
            emissive: new THREE.Color(0x2a5568),
            emissiveIntensity: 0,
            bumpMap: crackTex,          // crack texture, see section 4
            bumpScale: 4,
        };
        if (coarse) {
            return new THREE.MeshPhysicalMaterial({
                ...common,
                color: tint,
                metalness: 0.15,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                depthWrite: false,
                envMapIntensity: 2,
            });
        }
        return new THREE.MeshPhysicalMaterial({
            ...common,
            color: 0xffffff,
            transmission: 1,
            thickness: 0.25 + Math.random() * 0.25,   // was 0.9 + Math.random() * 0.7
            attenuationDistance: 5,                    // was 3.2, tint fades less through thin glass
            ior: 1.55,
            dispersion: 0.6,
            iridescence: 0.35,
            iridescenceIOR: 1.3,
            iridescenceThicknessRange: [120, 380],
            specularIntensity: 1,
            attenuationColor: new THREE.Color(tint),
        });
    };

    const shards: Shard[] = [];
    const aspect0 = Math.max(0.4, host.clientWidth / Math.max(1, host.clientHeight));
    const narrow = aspect0 < 1;

    const spots: Array<[number, number]> = [];
    const pickSpot = (): [number, number] => {
        let best: [number, number] = [0, 0];
        let bestScore = -1;
        for (let k = 0; k < 24; k++) {
            const u = Math.random() * 1.9 - 0.95;
            const v = Math.random() * 1.5 - 0.8;
            // keep the headline corner calmer
            if (narrow ? v < -0.4 : u < -0.05 && v < -0.22) continue;
            let min = 9;
            for (const [pu, pv] of spots) {
                min = Math.min(min, Math.hypot((u - pu) * aspect0, v - pv));
            }
            if (min > bestScore) {
                bestScore = min;
                best = [u, v];
            }
        }
        spots.push(best);
        return best;
    };

    for (let i = 0; i < COUNT; i++) {
        const size = 0.95 + Math.random() * 0.95;
        const geo = extrude(makeShardShape(Math.random, size), 0.02 + Math.random() * 0.24); // geo depth
        const variant: Variant = { geo, edges: new THREE.EdgesGeometry(geo, 24) };
        const mat = makeMaterial(tints[i % tints.length]);
        const mesh = new THREE.Mesh(geo, mat);
        const line = new THREE.LineSegments(variant.edges, lineMat);
        mesh.add(line);
        mesh.visible = false;
        scene.add(mesh);
        const [u, v] = pickSpot();
        const s: Shard = {
            mesh,
            line,
            mat,
            shard: variant,
            isIcon: false,
            u,
            v,
            z: -1.2 + Math.random() * 2.4,
            ph: Math.random() * TAU,
            fx: 0.25 + Math.random() * 0.35,
            fy: 0.2 + Math.random() * 0.35,
            fz: 0.2 + Math.random() * 0.3,
            rx: (Math.random() - 0.5) * 1.2,
            ry: (Math.random() - 0.5) * 1.2,
            rz: Math.random() * TAU,
            dir: randomUnit(new THREE.Vector3()),
            spin: new THREE.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9),
            far: 1,
            att: 0,
            hov: 0,
            flip: 0,
            flipTween: null,
            slot: 0,
            icon: 0,
            pos: new THREE.Vector3(),
        };
        mesh.userData.shard = s;
        shards.push(s);
    }

    // ---- state -------------------------------------------------------------
    let hw = 7;
    let hh = 4;
    let W = 1;
    let H = 1;
    let fit = 1;
    let clusterScale = 1;

    let showing = false;
    let hiding = false;
    let mode: 'idle' | 'gathered' | 'releasing' = 'idle';
    let anchor: Shard | null = null;
    let lockUntil = 0;
    let lastTouch = 0;

    const pointer = { x: 0, y: 0, ndcX: 0, ndcY: 0, inside: false, touch: false };
    const camTarget = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const meshes = shards.map((s) => s.mesh);
    const tmpV = new THREE.Vector3();
    const target = new THREE.Vector3();

    const resize = () => {
        W = Math.max(1, host.clientWidth);
        H = Math.max(1, host.clientHeight);
        renderer.setSize(W, H, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        hh = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
        hw = hh * camera.aspect;
        const bgH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * (CAM_Z + 10) * 2 * 1.25;
        bg.scale.set(bgH * camera.aspect, bgH, 1);
        bgMat.uniforms.uAspect.value = camera.aspect;
        fit = THREE.MathUtils.clamp(camera.aspect * 0.78, 0.5, 1);
        clusterScale = THREE.MathUtils.clamp(hw / 6.2, 0.42, 1);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---- gather / release ---------------------------------------------------
    const applyVariant = (s: Shard, toIcon: boolean) => {
        const v = toIcon ? icons[s.icon] : s.shard;
        s.mesh.geometry = v.geo;
        s.line.geometry = v.edges;
        s.isIcon = toIcon;
    };

    /** Spin the piece half a turn edge-on, swap its geometry, finish the turn. */
    const flipTo = (s: Shard, toIcon: boolean, delay: number) => {
        s.flipTween?.kill();
        if (reduce) {
            applyVariant(s, toIcon);
            return;
        }
        const start = s.flip;
        const end = Math.ceil((start + Math.PI) / TAU) * TAU;
        const mid = (start + end) / 2;
        let swapped = false;
        s.flipTween = gsap.to(s, {
            flip: end,
            duration: 0.95,
            delay,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (!swapped && s.flip >= mid) {
                    swapped = true;
                    applyVariant(s, toIcon);
                }
            },
            onComplete: () => {
                if (!swapped) applyVariant(s, toIcon);
                s.flip = end % TAU;
                s.flipTween = null;
            },
        });
    };

    const gather = (a: Shard) => {
        mode = 'gathered';
        host.dataset.mode = mode;
        anchor = a;
        lockUntil = performance.now() + 1300;
        gsap.to(a, { hov: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        let slot = 0;
        for (const s of shards) {
            if (s === a) continue;
            s.slot = slot;
            s.icon = slot % ICON_COUNT; // more than 5 pieces: the figures repeat
            const delay = reduce ? 0 : slot * 0.035;
            gsap.to(s, {
                att: 1,
                duration: reduce ? 0.3 : 1.15,
                delay,
                ease: 'power3.inOut',
                overwrite: 'auto',
            });
            flipTo(s, true, delay);
            slot++;
        }
    };

    const release = () => {
        if (mode !== 'gathered' || !anchor) return;
        mode = 'releasing';
        host.dataset.mode = mode;
        const a = anchor;
        gsap.to(a, { hov: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        let done = 0;
        const total = shards.length - 1;
        let i = 0;
        for (const s of shards) {
            if (s === a) continue;
            const delay = reduce ? 0 : i * 0.025;
            gsap.to(s, {
                att: 0,
                duration: reduce ? 0.3 : 1.0,
                delay,
                ease: 'power3.inOut',
                overwrite: 'auto',
                onComplete: () => {
                    if (++done >= total) {
                        mode = 'idle';
                        host.dataset.mode = mode;
                        anchor = null;
                    }
                },
            });
            flipTo(s, false, delay);
            i++;
        }
    };

    /** Drop any gather state immediately (used before hiding). */
    const resetGather = () => {
        for (const s of shards) {
            gsap.killTweensOf(s);
            s.flipTween?.kill();
            s.flipTween = null;
            s.att = 0;
            s.hov = 0;
            if (s.isIcon) applyVariant(s, false);
        }
        anchor = null;
        mode = 'idle';
        host.dataset.mode = mode;
    };

    // ---- pointer -----------------------------------------------------------
    const setPointer = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.ndcX = (pointer.x / rect.width) * 2 - 1;
        pointer.ndcY = -(pointer.y / rect.height) * 2 + 1;
        pointer.inside = true;
        pointer.touch = e.pointerType === 'touch';
        if (pointer.touch) lastTouch = performance.now();
        camTarget.set(pointer.ndcX, pointer.ndcY);
    };
    const onMove = (e: PointerEvent) => setPointer(e);
    const onDown = (e: PointerEvent) => setPointer(e);
    const onLeave = () => {
        pointer.inside = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    // ---- frame -------------------------------------------------------------
    const amp = reduce ? 0 : 1;
    const FAR = 26;
    let last = performance.now();
    let time = 0;
    let frame = 0;

    const place = (s: Shard, t: number) => {
        const fl = amp;
        s.pos.set(
            s.u * hw * 0.95 + Math.sin(t * s.fx + s.ph) * 0.24 * fl + s.dir.x * s.far * FAR,
            s.v * hh * 0.92 + Math.cos(t * s.fy + s.ph * 1.3) * 0.28 * fl + s.dir.y * s.far * FAR,
            s.z + Math.sin(t * s.fz + s.ph * 0.7) * 0.3 * fl + s.dir.z * s.far * FAR
        );
    };

    const tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        time += dt;
        frame++;

        const homeActive = showing && !hiding;
        // idle pages render at half rate: the backdrop is slow anyway
        if (!homeActive && !showing && (frame & 1) === 1) return;

        // camera parallax + backdrop
        camera.position.x += (camTarget.x * 0.5 * amp - camera.position.x) * 0.04;
        camera.position.y += (camTarget.y * 0.3 * amp - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        bgMat.uniforms.uTime.value = time;
        const um = bgMat.uniforms.uMouse.value as THREE.Vector2;
        um.x += (camTarget.x - um.x) * 0.03;
        um.y += (camTarget.y - um.y) * 0.03;

        if (showing) {
            // 1. positions (anchor first, the others depend on it)
            for (const s of shards) place(s, time);

            if (anchor) {
                // the gathering point drifts inward, so the figures never spill off-screen
                const k = anchor.hov;
                anchor.pos.x = THREE.MathUtils.lerp(anchor.pos.x, THREE.MathUtils.clamp(anchor.pos.x, -hw * 0.5, hw * 0.5), k);
                anchor.pos.y = THREE.MathUtils.lerp(anchor.pos.y, THREE.MathUtils.clamp(anchor.pos.y, -hh * 0.4, hh * 0.4), k);
                for (const s of shards) {
                    if (s === anchor || s.att <= 0.0001) continue;
                    const ang = s.slot * 2.39996 + time * 0.3 * (s.slot % 2 ? 1 : -1) * amp;
                    const rad = (0.85 + Math.sqrt(s.slot + 1) * 0.6) * clusterScale;
                    target.set(
                        anchor.pos.x + Math.cos(ang) * rad,
                        anchor.pos.y + Math.sin(ang) * rad * 0.86,
                        anchor.pos.z + 0.6 + (s.slot % 4) * 0.14
                    );
                    s.pos.lerp(target, s.att);
                }
            }

            // 2. orientation + scale
            for (const s of shards) {
                const m = s.mesh;
                const appear = 1 - s.far * s.far;
                if (appear < 0.002) {
                    m.visible = false;
                    continue;
                }
                m.visible = true;
                m.position.copy(s.pos);

                let rx = s.rx + Math.sin(time * 0.31 + s.ph) * 0.25 * amp;
                let ry = s.ry + Math.cos(time * 0.27 + s.ph) * 0.3 * amp;
                let rz = s.rz + time * 0.05 * amp;
                if (s.far > 0.001) {
                    rx += s.spin.x * s.far;
                    ry += s.spin.y * s.far;
                    rz += s.spin.z * s.far;
                }
                let sc = appear * fit;
                if (s.att > 0.0001) {
                    const k = s.att;
                    // figures face the viewer, each with its own small gesture
                    let figZ = 0;
                    if (s.icon === 0) figZ = time * 0.7 * amp;
                    else if (s.icon === 1) figZ = (Math.sin(time * 1.6 + s.slot) * 0.35 - 0.25) * amp;
                    else figZ = Math.sin(time * 0.8 + s.slot) * 0.12 * amp;
                    rx = THREE.MathUtils.lerp(rx, 0.12 * Math.sin(s.slot), k);
                    ry = THREE.MathUtils.lerp(ry, 0.18 * Math.cos(s.slot * 1.7), k);
                    rz = THREE.MathUtils.lerp(rz, figZ, k);
                    sc *= THREE.MathUtils.lerp(1, 0.78 * clusterScale, k);
                }
                if (s === anchor) sc *= 1 + 0.1 * s.hov;
                m.rotation.set(rx, ry + s.flip, rz);
                m.scale.setScalar(Math.max(0.0001, sc));
                s.mat.emissiveIntensity = s.hov * 0.9;
            }

            // 3. pointer interaction
            if (homeActive) {
                if (mode === 'idle' && pointer.inside) {
                    ray.setFromCamera(ndc.set(pointer.ndcX, pointer.ndcY), camera);
                    const hits = ray.intersectObjects(meshes, false);
                    for (const h of hits) {
                        const s = h.object.userData.shard as Shard;
                        if (s.far < 0.08 && s.att < 0.01) {
                            gather(s);
                            break;
                        }
                    }
                } else if (mode === 'gathered' && anchor && performance.now() > lockUntil) {
                    tmpV.copy(anchor.pos).project(camera);
                    const ax = (tmpV.x * 0.5 + 0.5) * W;
                    const ay = (-tmpV.y * 0.5 + 0.5) * H;
                    const pxPerUnit = H / (2 * hh);
                    const reach = (0.85 + Math.sqrt(shards.length) * 0.6 + 0.9) * clusterScale * pxPerUnit;
                    const away = Math.hypot(pointer.x - ax, pointer.y - ay) > reach;
                    const touchIdle = pointer.touch && performance.now() - lastTouch > 2400;
                    if (!pointer.inside || away || touchIdle) release();
                }
            }
        }

        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(tick);

    // ---- public api ----------------------------------------------------------
    const api: Stage = {
        showShards() {
            if (showing && !hiding) return;
            gsap.killTweensOf(shards);
            resetGather();
            showing = true;
            hiding = false;
            for (const s of shards) {
                randomUnit(s.dir);
                s.far = 1;
                const dur = (reduce ? 0.4 : 2.1) + (reduce ? 0 : Math.random() * 1.1);
                gsap.to(s, {
                    far: 0,
                    duration: dur,
                    delay: reduce ? 0 : 0.1 + Math.random() * 0.8,
                    ease: 'expo.out',
                });
            }
        },
        hideShards() {
            if (!showing) return Promise.resolve();
            hiding = true;
            gsap.killTweensOf(shards);
            resetGather();
            return new Promise<void>((resolve) => {
                for (const s of shards) randomUnit(s.dir);
                gsap.to(shards, {
                    far: 1,
                    duration: reduce ? 0.25 : 0.85,
                    ease: 'power3.in',
                    stagger: { each: reduce ? 0 : 0.025, from: 'random' },
                    onComplete: () => {
                        showing = false;
                        hiding = false;
                        for (const s of shards) s.mesh.visible = false;
                        resolve();
                    },
                });
            });
        },
        setView(key) {
            const m = MOODS[key];
            const d = reduce ? 0.2 : 1.4;
            gsap.to(bgMat.uniforms.uMood, { value: m.mood, duration: d, ease: 'power2.inOut' });
            const ta = bgMat.uniforms.uTintA.value as THREE.Color;
            const tb = bgMat.uniforms.uTintB.value as THREE.Color;
            gsap.to(ta, { r: m.a[0], g: m.a[1], b: m.a[2], duration: d, ease: 'power2.inOut' });
            gsap.to(tb, { r: m.b[0], g: m.b[1], b: m.b[2], duration: d, ease: 'power2.inOut' });
        },
        destroy() {
            renderer.setAnimationLoop(null);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerdown', onDown);
            document.documentElement.removeEventListener('pointerleave', onLeave);
            ro.disconnect();
            gsap.killTweensOf(shards);
            gsap.killTweensOf(bgMat.uniforms.uMood);
            for (const s of shards) {
                s.flipTween?.kill();
                s.shard.geo.dispose();
                s.shard.edges.dispose();
                s.mat.dispose();
            }
            for (const i of icons) {
                i.geo.dispose();
                i.edges.dispose();
            }
            lineMat.dispose();
            bg.geometry.dispose();
            bgMat.dispose();
            envTex.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
    return api;
}
