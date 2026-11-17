import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { generateDemoEntry } from './demo-entry.ts';

import type {
    WrittenDemoEntry,
    AnalyzedDemo
} from '../utils/types.ts';


/**
 * Convert a demo title into a filesystem-safe filename.
 */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Generate and write all demo entries for one component.
 */
export async function writeDemoEntries(
    componentDirectory: string,
    demos: AnalyzedDemo[],
    outputRoot: string
): Promise<WrittenDemoEntry[]> {
    const componentOutputDir = path.join(
        outputRoot,
        componentDirectory
    );

    await mkdir(componentOutputDir, {
        recursive: true,
    });

    const results: WrittenDemoEntry[] = [];

    for (const [index, demo] of demos.entries()) {

        // No TSX code means no entry file is required.
        if (!demo.code.trim()) {
            continue;
        }

        const rawDemoSlug = demo.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const demoSlug = rawDemoSlug ||
            `demo-${String(index + 1).padStart(2, '0')}`;


        const fileName = [
            String(index + 1).padStart(2, '0'),
            demoSlug,
        ].join('-') + '.tsx';

        const filePath = path.join(
            componentOutputDir,
            fileName
        );

        const source = generateDemoEntry(demo);

        await writeFile(filePath, source, 'utf8');

        results.push({
            title: demo.title,
            fileName,
            filePath,
        });
    }

    return results;
}