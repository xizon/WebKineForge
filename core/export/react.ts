
/**
 * Automates the conversion of framework-agnostic components
 * located in the selected Site into React components.
 */

import fs from 'node:fs';
import path from 'node:path';

import type { SiteContext } from '../utils/types.ts';


export async function exportComponentsToReact(site: SiteContext) {

    // 1. Resolve component source and output directories
    const componentsDir = site.paths.components;
    const outDir = path.resolve(site.root, 'dist-react');

    if (!fs.existsSync(componentsDir)) {
        throw new Error(
            `[WKF] Components directory not found: ${componentsDir}`
        );
    }

    // 2. Prepare output directory
    fs.mkdirSync(outDir, { recursive: true });

    const entries = fs.readdirSync(componentsDir, {
        withFileTypes: true,
    });

    let count = 0;

    // 3. Export each component
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const compName = entry.name;

        const compSrcDir = path.join(
            componentsDir,
            compName
        );

        const compOutDir = path.join(
            outDir,
            compName
        );

        fs.mkdirSync(compOutDir, { recursive: true });

        // 0. Manifest
        const configPath = path.join(
            compSrcDir,
            'manifest.json'
        );

        if (fs.existsSync(configPath)) {
            fs.copyFileSync(
                configPath,
                path.join(compOutDir, 'manifest.json')
            );
        }
        
        // 0.1 Examples Documentation
        const examplesPath = path.join(
            compSrcDir,
            'examples.md'
        );

        if (fs.existsSync(examplesPath)) {
            fs.copyFileSync(
                examplesPath,
                path.join(compOutDir, 'examples.md')
            );
        }

        // 1. Style
        const stylePath = path.join(
            compSrcDir,
            'style.css'
        );

        if (fs.existsSync(stylePath)) {
            fs.copyFileSync(
                stylePath,
                path.join(compOutDir, 'style.css')
            );
        }

        // 2. Controller
        const controllerPath = path.join(
            compSrcDir,
            'controller.ts'
        );

        if (fs.existsSync(controllerPath)) {
            fs.copyFileSync(
                controllerPath,
                path.join(compOutDir, 'controller.ts')
            );
        }

        // 3. Template
        const templatePath = path.join(
            compSrcDir,
            'template.tsx'
        );

        if (fs.existsSync(templatePath)) {
            fs.copyFileSync(
                templatePath,
                path.join(compOutDir, 'template.tsx')
            );
        } else {
            const defaultTemplate = `
import './style.css';

export function Template({
    children,
    ...props
}: any) {
    return <div {...props}>{children}</div>;
}
`;

            fs.writeFileSync(
                path.join(compOutDir, 'template.tsx'),
                defaultTemplate.trimStart(),
                'utf8'
            );
        }

        // 4. Generate React wrapper entry point
        const pascalName = toPascalCase(compName);

        const reactComponentCode = `import React, { useEffect, useRef } from 'react';
import { mount } from './controller';
import { Template } from './template';
import './style.css';

export interface ${pascalName}Props extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}

export default function ${pascalName}({
    children,
    ...props
}: ${pascalName}Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cleanup = mount(ref.current);

        return () => {
            if (typeof cleanup === 'function') {
                cleanup();
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            {...props}
        >
            <Template {...props}>
                {children}
            </Template>
        </div>
    );
}
`;

        fs.writeFileSync(
            path.join(compOutDir, 'index.tsx'),
            reactComponentCode,
            'utf8'
        );

        console.log(
            `\x1b[32m[Export React] Successfully exported: ${compName} -> ${path.relative(site.root, compOutDir)}/\x1b[0m`
        );

        count++;
    }

    console.log(
        `\n\x1b[32m[Export React] Done! Total ${count} components exported to ${path.relative(site.root, outDir)}/\x1b[0m`
    );
}


/**
 * Convert kebab-case or snake_case to PascalCase.
 */
function toPascalCase(str: string): string {
    return str
        .split(/[-_]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
}
