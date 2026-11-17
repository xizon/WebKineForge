import * as THREE from 'three';

const TAU = Math.PI * 2;

/** Build a closed polygon shape from [x, y] pairs, optionally rotated. */
function polygon(points: Array<[number, number]>, rotate = 0): THREE.Shape {
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => {
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        if (i === 0) shape.moveTo(rx, ry);
        else shape.lineTo(rx, ry);
    });
    shape.closePath();
    return shape;
}

function circleHole(x: number, y: number, r: number): THREE.Path {
    const p = new THREE.Path();
    p.absarc(x, y, r, 0, TAU, true);
    return p;
}

function rectHole(x: number, y: number, w: number, h: number): THREE.Path {
    const p = new THREE.Path();
    p.moveTo(x, y);
    p.lineTo(x, y + h);
    p.lineTo(x + w, y + h);
    p.lineTo(x + w, y);
    p.closePath();
    return p;
}

function gear(): THREE.Shape {
    const teeth = 10;
    const outer = 0.74;
    const root = 0.55;
    const step = TAU / teeth;
    const pts: Array<[number, number]> = [];
    const add = (a: number, r: number) => pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    for (let i = 0; i < teeth; i++) {
        const a = i * step;
        add(a - step * 0.34, root);
        add(a - step * 0.2, outer);
        add(a + step * 0.2, outer);
        add(a + step * 0.34, root);
        add(a + step * 0.5, root);
    }
    const shape = polygon(pts);
    shape.holes.push(circleHole(0, 0, 0.23));
    return shape;
}

function hammer(): THREE.Shape {
    const pts: Array<[number, number]> = [
        [-0.075, -0.78],
        [0.075, -0.78],
        [0.085, 0.3],
        [0.44, 0.3],
        [0.44, 0.68],
        [-0.22, 0.68],
        [-0.46, 0.5],
        [-0.46, 0.3],
        [-0.085, 0.3],
    ];
    return polygon(pts, -0.62);
}

function skull(): THREE.Shape {
    const s = new THREE.Shape();
    s.moveTo(-0.3, -0.66);
    s.lineTo(-0.3, -0.4);
    s.bezierCurveTo(-0.62, -0.32, -0.74, 0.12, -0.56, 0.42);
    s.bezierCurveTo(-0.4, 0.8, 0.4, 0.8, 0.56, 0.42);
    s.bezierCurveTo(0.74, 0.12, 0.62, -0.32, 0.3, -0.4);
    s.lineTo(0.3, -0.66);
    s.lineTo(0.17, -0.66);
    s.lineTo(0.17, -0.52);
    s.lineTo(0.06, -0.52);
    s.lineTo(0.06, -0.66);
    s.lineTo(-0.06, -0.66);
    s.lineTo(-0.06, -0.52);
    s.lineTo(-0.17, -0.52);
    s.lineTo(-0.17, -0.66);
    s.closePath();
    s.holes.push(circleHole(-0.25, 0.1, 0.15));
    s.holes.push(circleHole(0.25, 0.1, 0.15));
    const nose = new THREE.Path();
    nose.moveTo(0, -0.02);
    nose.lineTo(-0.085, -0.22);
    nose.lineTo(0.085, -0.22);
    nose.closePath();
    s.holes.push(nose);
    return s;
}

function book(): THREE.Shape {
    const pts: Array<[number, number]> = [
        [0, -0.34],
        [-0.8, -0.52],
        [-0.8, 0.42],
        [-0.4, 0.52],
        [0, 0.34],
        [0.4, 0.52],
        [0.8, 0.42],
        [0.8, -0.52],
    ];
    const shape = polygon(pts);
    for (const y of [-0.26, -0.1, 0.06]) {
        shape.holes.push(rectHole(-0.62, y, 0.46, 0.04));
        shape.holes.push(rectHole(0.16, y, 0.46, 0.04));
    }
    return shape;
}

function bolt(): THREE.Shape {
    return polygon([
        [0.16, 0.8],
        [-0.36, -0.04],
        [-0.03, -0.04],
        [-0.16, -0.8],
        [0.38, 0.1],
        [0.05, 0.1],
    ]);
}

/** The five figures the loose glass reassembles into. */
export const ICON_SHAPES: Array<() => THREE.Shape> = [gear, hammer, skull, book, bolt];
export const ICON_COUNT = ICON_SHAPES.length;

/** A random, sharp-edged glass shard (3 to 5 corners, stretched). */
export function makeShardShape(rand: () => number, size: number): THREE.Shape {
    const n = 3 + Math.floor(rand() * 3);
    const gaps: number[] = [];
    for (let i = 0; i < n; i++) gaps.push(0.55 + rand() * 1.05);
    const total = gaps.reduce((a, b) => a + b, 0);
    let angle = rand() * TAU;
    const stretch = 0.85 + rand() * 0.7;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
        angle += (gaps[i] / total) * TAU;
        const r = (0.62 + rand() * 0.38) * size;
        pts.push([Math.cos(angle) * r * stretch, Math.sin(angle) * r]);
    }
    return polygon(pts, rand() * TAU);
}
