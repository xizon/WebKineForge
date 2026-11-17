
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
    mkdtempSync,
    writeFileSync,
    rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { injectComponentAttribute } from '../../core/plugins/inject-com.ts';

describe('Component Attribute Auto-Injection (AST Transform)', () => {
    let fixtureDir: string;
    let componentFile: string;

    beforeAll(() => {
        fixtureDir = mkdtempSync(
            join(tmpdir(), 'wkf-inject-com-')
        );

        componentFile = join(fixtureDir, 'template.tsx');

        writeFileSync(
            join(fixtureDir, 'manifest.json'),
            JSON.stringify({
                name: 'hero-section',
            }),
            'utf-8'
        );
    });

    afterAll(() => {
        rmSync(fixtureDir, {
            recursive: true,
            force: true,
        });
    });

    it('should inject data-component attribute onto valid root HTML elements', () => {
        const input = `
            export function HeroSection() {
                return <section className="wkf-hero"><h1>Hello</h1></section>;
            }
        `;

        const output = injectComponentAttribute(
            input,
            componentFile
        );

        expect(output).toContain(
            '<section data-component="hero-section" className="wkf-hero">'
        );
    });

    it('should reject manually defined data-component attributes', () => {
        const input = `
            export const Card = () => (
                <div id="featured" data-component="CustomCard" className="card">
                    Content
                </div>
            );
        `;

        expect(() => {
            injectComponentAttribute(input, componentFile);
        }).toThrow('Do not manually add data-component');
    });
});
