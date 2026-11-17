import { parseSync } from 'oxc-parser';
import type {
    AstRecord
} from '../utils/types.ts';


/**
 * Parse a JSX/TSX demo code string.
 */
export function parseDemoJSX(code: string) {
    const result = parseSync(
        'playground-demo.tsx',
        code
    );

    if (result.errors.length > 0) {
        const messages = result.errors
            .map((error) => error.message)
            .join('\n');

        throw new Error(
            `Failed to parse JSX demo:\n${messages}`
        );
    }

    return result.program;
}


/**
 * Check whether a value is an AST node object.
 */
function isAstRecord(value: unknown): value is AstRecord {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
}

/**
 * Get the name of a JSX tag.
 */
function getJSXTagName(value: unknown): string | null {
    if (!isAstRecord(value)) return null;

    if (
        value.type === 'JSXIdentifier' &&
        typeof value.name === 'string'
    ) {
        return value.name;
    }

    // Support member expressions such as <UI.Button />
    if (value.type === 'JSXMemberExpression') {
        const objectName = getJSXTagName(value.object);
        const propertyName = getJSXTagName(value.property);

        if (objectName && propertyName) {
            return `${objectName}.${propertyName}`;
        }
    }

    return null;
}

/**
 * Extract custom component names from a JSX AST.
 */
export function extractComponentNames(
    program: unknown
): string[] {
    const names = new Set<string>();

    function visit(value: unknown): void {
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (!isAstRecord(value)) return;

        if (value.type === 'JSXOpeningElement') {
            const tagName = getJSXTagName(value.name);

            if (tagName) {
                const rootName = tagName.split('.')[0];

                // Uppercase JSX names are treated as custom components.
                if (/^[A-Z]/.test(rootName)) {
                    names.add(tagName);
                }
            }
        }

        Object.values(value).forEach(visit);
    }

    visit(program);

    return [...names];
}