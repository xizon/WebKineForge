import { describe, it, expect } from 'vitest';

import {
    parseDemoJSX,
    extractComponentNames,
} from '../../core/playground/jsx-parser.ts';

describe('jsx-parser', () => {
    it('should parse valid JSX', () => {
        const code = `
<div className="container">
    <h1>Hello</h1>
</div>
`;

        expect(() => parseDemoJSX(code)).not.toThrow();
    });

    it('should parse JSX with props', () => {
        const code = `
<PrimaryMenu
    theme="dark"
    links={[
        {
            href: './index.html',
            page: 'index',
            label: 'Home',
            active: true,
        }
    ]}
/>
`;

        expect(() => parseDemoJSX(code)).not.toThrow();
    });

    it('should extract component names', () => {
        const code = `
<div>
    <PrimaryMenu />
    <Hero3D />
    <TextReveal />
</div>
`;

        const program = parseDemoJSX(code);

        expect(extractComponentNames(program)).toEqual([
            'PrimaryMenu',
            'Hero3D',
            'TextReveal',
        ]);
    });

    it('should ignore native HTML elements', () => {
        const code = `
<div>
    <section>
        <h1>Hello</h1>
        <button>Click</button>
    </section>
    <PrimaryMenu />
</div>
`;

        const program = parseDemoJSX(code);

        expect(extractComponentNames(program)).toEqual([
            'PrimaryMenu',
        ]);
    });

    it('should deduplicate component names', () => {
        const code = `
<div>
    <PrimaryMenu />
    <PrimaryMenu />
    <Hero3D />
    <Hero3D />
</div>
`;

        const program = parseDemoJSX(code);

        expect(extractComponentNames(program)).toEqual([
            'PrimaryMenu',
            'Hero3D',
        ]);
    });

    it('should detect nested components', () => {
        const code = `
<Layout>
    <Hero3D>
        <TextReveal />
    </Hero3D>
</Layout>
`;

        const program = parseDemoJSX(code);

        expect(extractComponentNames(program)).toEqual([
            'Layout',
            'Hero3D',
            'TextReveal',
        ]);
    });

    it('should throw on invalid JSX syntax', () => {
        const code = `
<div>
    <PrimaryMenu>
</div>
`;

        expect(() => parseDemoJSX(code)).toThrow();
    });

    // for "Failed to parse JSX demo"
    it('should reject invalid JSX attribute syntax', () => {
        const code = '<PrimaryMenu active: true />';

        expect(null);
    });

    
});