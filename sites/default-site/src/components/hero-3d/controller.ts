import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

gsap.registerPlugin(ScrollTrigger);

const RIPPLES = 6;

// Interaction tuning
const POINTER_SMOOTHING = 5;
const POSITION_SMOOTHING = 5;
const STRENGTH_SMOOTHING = 5;

const RIPPLE_INTERVAL = 120;
const RIPPLE_DISTANCE = 0.16;

const vertexShader = `
attribute float aSeed;

uniform float uTime;
uniform vec2 uMouse;
uniform float uStrength;
uniform vec2 uRipplePos[${RIPPLES}];
uniform float uRippleTime[${RIPPLES}];

varying float vSeed;
varying float vWave;

void main() {
    vec3 pos = position;

    vec2 cursor = pos.xy - uMouse;
    float cursorDist = length(cursor);

    float push = exp(-cursorDist * cursorDist * 0.85) * uStrength;

    vec2 pushDir = cursorDist > 0.0001
        ? cursor / cursorDist
        : vec2(0.0);

    float wave = 0.0;

    for (int i = 0; i < ${RIPPLES}; i++) {
        float age = uTime - uRippleTime[i];

        if (age < 0.0 || age > 2.6) continue;

        float dist = distance(pos.xy, uRipplePos[i]);
        float radius = age * 3.15;

        float ring = exp(-pow((dist - radius) * 1.7, 2.0));

        wave += ring * exp(-age * 1.05);
    }

    pos.xy += pushDir * (push * 0.3 + wave * 0.28);
    pos.z += push * 0.45 + wave * 0.55;

    vSeed = aSeed;
    vWave = clamp(wave * 1.0 + push * 0.65, 0.0, 0.65);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize =
        (1.2 + aSeed * 0.8 + vWave * 3.0)
        * (10.0 / max(1.0, -mv.z));
}
`;

const fragmentShader = `

uniform float uTime;

varying float vSeed;
varying float vWave;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);

    if (dot(coord, coord) > 0.25) discard;

    float hue = fract(vSeed * 3.1 + uTime * 0.035 + vWave * 0.2);

    // Softer, muted color palette
    vec3 cool = vec3(0.55, 0.72, 0.78);
    vec3 hot  = vec3(0.78, 0.52, 0.58);
    vec3 acid = vec3(0.75, 0.78, 0.58);

    vec3 color = mix(
        mix(cool, hot, smoothstep(0.0, 0.55, hue)),
        acid,
        smoothstep(0.45, 1.0, hue)
    );

    // Reduce saturation
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray), color, 0.55);

    // Softer neutral base
    color = mix(
        vec3(0.42, 0.43, 0.44),
        color,
        0.18 + vWave * 0.35
    );

    // Reduce brightness response to waves
    float alpha = 0.6 + vWave * 0.35;

    gl_FragColor = vec4(color, alpha);
}

`;

export function mount(
    element: HTMLElement | null
): (() => void) | void {

    if (!element) return;

    
    const canvas = element.querySelector<HTMLCanvasElement>(
        '.wkf-hero__canvas'
    );

    const nextButton = element.querySelector<HTMLButtonElement>(
        '[data-scroll-next]'
    );

    if (!canvas) return;

    const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // --------------------------------------------------
    // Scene
    // --------------------------------------------------

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.75)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --------------------------------------------------
    // Particle geometry
    // --------------------------------------------------

    const columns = 86;
    const rows = 50;
    const count = columns * rows;

    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
            const index = y * columns + x;

            positions[index * 3] =
                (x / (columns - 1) - 0.5) * 13.5;

            positions[index * 3 + 1] =
                (y / (rows - 1) - 0.5) * 7.6;

            positions[index * 3 + 2] = -0.35;

            seeds[index] = Math.random();
        }
    }

    const pointsGeometry = new THREE.BufferGeometry();

    pointsGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    pointsGeometry.setAttribute(
        'aSeed',
        new THREE.BufferAttribute(seeds, 1)
    );

    // --------------------------------------------------
    // Particle uniforms
    // --------------------------------------------------

    const ripplePos = Array.from(
        { length: RIPPLES },
        () => new THREE.Vector2(0, -20)
    );

    const rippleTime = new Float32Array(RIPPLES).fill(-20);

    const particleMouse = new THREE.Vector2(0, -20);
    const particleMouseTarget = new THREE.Vector2(0, -20);

    const pointsMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,

        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: particleMouse },
            uStrength: { value: 0 },
            uRipplePos: { value: ripplePos },
            uRippleTime: { value: rippleTime },
        },

        vertexShader,
        fragmentShader,
    });

    const points = new THREE.Points(
        pointsGeometry,
        pointsMaterial
    );

    scene.add(points);

    // --------------------------------------------------
    // WKF Logo 3D Model
    // --------------------------------------------------

    const logoGroup = new THREE.Group();

    const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1009 1009">

        <path fill="#595959"
            d="M463.086,107.621 L300.548,714.222 L0.365,880.184 L463.086,107.621 Z"/>

        <path fill="#2f2f2f"
            d="M463.086,107.621 L300.548,714.222 L477.533,1008.041 L463.086,107.621 Z"/>

        <path fill="#000000"
            d="M902.374,237.751 C900.361,237.913 741.979,399.758 741.979,399.758 L600.000,781.000 C600.000,781.000 904.388,237.589 902.374,237.751 Z"/>

        <path fill="#858585"
            d="M18.552,0.932 C20.215,2.078 162.190,546.704 162.190,546.704 L6.891,809.463 C6.891,809.463 16.889,-0.215 18.552,0.932 Z"/>

    </svg>
    `;

    const loader = new SVGLoader();
    const svgData = loader.parse(logoSvg);

    const logoMaterials: THREE.MeshPhysicalMaterial[] = [];

    svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 48,
                bevelEnabled: true,
                bevelSegments: 3,
                steps: 1,
                bevelSize: 5,
                bevelThickness: 5,
                curveSegments: 12,
            });

            // Center geometry
            geometry.computeBoundingBox();

            const material = new THREE.MeshPhysicalMaterial({
                color: path.color,
                metalness: 0.75,
                roughness: 0.28,
                clearcoat: 1,
                clearcoatRoughness: 0.15,
            });

            const mesh = new THREE.Mesh(geometry, material);

            logoGroup.add(mesh);
            logoMaterials.push(material);
        });
    });

    // --------------------------------------------------
    // Center and scale logo geometry
    // --------------------------------------------------
    const logoBox = new THREE.Box3().setFromObject(logoGroup);
    const logoCenter = logoBox.getCenter(new THREE.Vector3());

    // Move geometry itself to its center
    logoGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.translate(
                -logoCenter.x,
                -logoCenter.y,
                -logoCenter.z
            );

            child.geometry.computeVertexNormals();
        }
    });

    // Scale after centering
    logoGroup.scale.setScalar(0.0032);

    // Keep the model centered in the scene
    logoGroup.position.set(1.2, 0, 0.45);


    // Add logo to scene
    const logoWrapper = new THREE.Group();

    logoWrapper.add(logoGroup);

    // Flip the logo
    logoWrapper.rotation.z = Math.PI;
    logoWrapper.rotation.y = Math.PI;

    scene.add(logoWrapper);

    // --------------------------------------------------
    // Lighting
    // --------------------------------------------------

    scene.add(
        new THREE.AmbientLight(0xffffff, 0.55)
    );

    const keyLight = new THREE.PointLight(
        0x9ad7ff,
        80,
        30
    );

    keyLight.position.set(3.2, 3.4, 5);

    scene.add(keyLight);

    const rimLight = new THREE.PointLight(
        0xff4d8d,
        60,
        24
    );

    rimLight.position.set(-3.4, -1.6, 2.4);

    scene.add(rimLight);

    // --------------------------------------------------
    // Pointer interaction
    // --------------------------------------------------

    const raycaster = new THREE.Raycaster();

    const pointer = new THREE.Vector2();
    const hit = new THREE.Vector3();

    // Particle plane: Z = -0.35
    const plane = new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        -0.35
    );

    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };

    let strength = 0;
    let scrollProgress = 0;

    let rippleCursor = 0;
    let lastRipple = 0;

    const lastRipplePos = new THREE.Vector2(0, -20);

    // --------------------------------------------------
    // Resize
    // --------------------------------------------------

    const resize = () => {
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    resize();

    // --------------------------------------------------
    // GSAP animation
    // --------------------------------------------------

    const intro = reduce
        ? null
        : gsap.fromTo(
            element.querySelectorAll(
                '.wkf-hero__copy > *'
            ),
            {
                y: 28,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
            }
        );

    // --------------------------------------------------
    // ScrollTrigger
    // --------------------------------------------------

    const trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',

        onUpdate: (self) => {
            scrollProgress = self.progress;
        },
    });

    // --------------------------------------------------
    // Ripple throttle
    // --------------------------------------------------

    const spawnRipple = (now: number) => {
        const mouse = particleMouseTarget;

        if (now - lastRipple < RIPPLE_INTERVAL) {
            return;
        }

        if (mouse.distanceTo(lastRipplePos) < RIPPLE_DISTANCE) {
            return;
        }

        ripplePos[rippleCursor].copy(mouse);

        rippleTime[rippleCursor] =
            pointsMaterial.uniforms.uTime.value;

        lastRipplePos.copy(mouse);

        rippleCursor = (rippleCursor + 1) % RIPPLES;

        lastRipple = now;
    };

    // --------------------------------------------------
    // Pointer events
    // --------------------------------------------------

    const onPointer = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) return;

        pointerTarget.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        pointerTarget.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        pointer.set(
            pointerTarget.x,
            pointerTarget.y
        );

        raycaster.setFromCamera(pointer, camera);

        if (raycaster.ray.intersectPlane(plane, hit)) {
            particleMouseTarget.set(hit.x, hit.y);

            spawnRipple(performance.now());
        }
    };

    const onEnter = () => {
        strength = 0.65;
    };

    const onLeave = () => {
        strength = 0;

        pointerTarget.x = 0;
        pointerTarget.y = 0;

        particleMouseTarget.set(0, -20);
    };

    // --------------------------------------------------
    // Next section
    // --------------------------------------------------

    const onNext = () => {
        const selector = element.dataset.next;

        if (!selector) return;

        document.querySelector(selector)?.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    element.addEventListener('pointermove', onPointer);
    element.addEventListener('pointerenter', onEnter);
    element.addEventListener('pointerleave', onLeave);

    nextButton?.addEventListener('click', onNext);

    // --------------------------------------------------
    // Animation loop
    // --------------------------------------------------

    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.elapsedTime;

        // Frame-rate independent smoothing
        const pointerFactor =
            1 - Math.exp(-POINTER_SMOOTHING * delta);

        const positionFactor =
            1 - Math.exp(-POSITION_SMOOTHING * delta);

        const strengthFactor =
            1 - Math.exp(-STRENGTH_SMOOTHING * delta);

        // Smooth pointer movement
        pointerSmooth.x +=
            (pointerTarget.x - pointerSmooth.x) * pointerFactor;

        pointerSmooth.y +=
            (pointerTarget.y - pointerSmooth.y) * pointerFactor;

        // Smooth particle interaction position
        particleMouse.lerp(
            particleMouseTarget,
            pointerFactor
        );

        // Update uniforms
        pointsMaterial.uniforms.uTime.value = time;

        pointsMaterial.uniforms.uStrength.value +=
            (strength - pointsMaterial.uniforms.uStrength.value)
            * strengthFactor;

        // Mouse-controlled Logo rotation
        const targetRotationY = pointerSmooth.x * 0.55;
        const targetRotationX = -pointerSmooth.y * 0.2;

        logoGroup.rotation.y +=
            (targetRotationY - logoGroup.rotation.y)
            * positionFactor;

        logoGroup.rotation.x +=
            (targetRotationX - logoGroup.rotation.x)
            * positionFactor;

        renderer.render(scene, camera);
    });

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    return () => {
        trigger.kill();

        intro?.kill();

        resizeObserver.disconnect();

        element.removeEventListener('pointermove', onPointer);
        element.removeEventListener('pointerenter', onEnter);
        element.removeEventListener('pointerleave', onLeave);

        nextButton?.removeEventListener('click', onNext);

        renderer.setAnimationLoop(null);

        scene.remove(points);
        scene.remove(logoGroup);

        logoGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
            }
        });

        logoMaterials.forEach((material) => {
            material.dispose();
        });

        pointsGeometry.dispose();
        pointsMaterial.dispose();

        renderer.dispose();
    };
}
