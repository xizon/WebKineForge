/**
 * Inject Component Attribute
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { parseSync } from 'oxc-parser';
import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import type { AstNode, ComponentRoot } from '../utils/types.ts';


function isNode(value: unknown): value is AstNode {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as AstNode).type === 'string' &&
        typeof (value as AstNode).start === 'number' &&
        typeof (value as AstNode).end === 'number'
    );
}

/**
 * Read the component slug from the sibling manifest.json.
 */
function getComponentSlug(filePath: string): string {
    const manifestPath = resolve(dirname(filePath), 'manifest.json');

    if (!existsSync(manifestPath)) {
        throw new Error(
            `[WebKineForge] manifest.json not found: ${manifestPath}`
        );
    }

    const manifest = JSON.parse(
        readFileSync(manifestPath, 'utf-8')
    ) as { name?: string };

    if (
        !manifest.name ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name)
    ) {
        throw new Error(
            `[WebKineForge] Invalid or missing "slug" in ${manifestPath}`
        );
    }

    return manifest.name;
}

/**
 * Oxc AST offsets are UTF-8 byte offsets.
 * MagicString expects JavaScript string (UTF-16) offsets.
 *
 * Convert an Oxc offset to a JavaScript string index.
 */
function toStringOffset(
    source: string,
    byteOffset: number
): number {
    return Buffer
        .from(source, 'utf-8')
        .subarray(0, byteOffset)
        .toString('utf-8')
        .length;
}

/**
 * Walk AST nodes recursively.
 */
function walk(
    node: AstNode,
    callback: (node: AstNode) => void
): void {
    callback(node);

    for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                if (isNode(item)) {
                    walk(item, callback);
                }
            }
        } else if (isNode(value)) {
            walk(value, callback);
        }
    }
}

/**
 * Remove TypeScript and parenthesis wrappers.
 *
 * Example:
 * return (
 *     <section />
 * ) as JSX.Element;
 */
function unwrapExpression(node: AstNode): AstNode {
    let current = node;

    const wrappers = new Set([
        'ParenthesizedExpression',
        'TSAsExpression',
        'TSSatisfiesExpression',
        'TSNonNullExpression',
        'TypeCastExpression',
        'ChainExpression',
    ]);

    while (
        wrappers.has(current.type) &&
        isNode(current.expression)
    ) {
        current = current.expression;
    }

    return current;
}

/**
 * Find JSX roots in a returned expression.
 *
 * Supports:
 * - Direct JSXElement
 * - Conditional expressions
 * - TypeScript expression wrappers
 *
 * Does not treat nested JSX children as component roots.
 */
function collectRootsFromExpression(
    expression: AstNode,
    roots: AstNode[]
): void {
    const node = unwrapExpression(expression);

    if (node.type === 'JSXElement') {
        roots.push(node);
        return;
    }

    if (node.type === 'JSXFragment') {
        throw new Error(
            '[WebKineForge] Fragment cannot be used as a component root. ' +
            'Please use a single HTML element.'
        );
    }

    if (node.type === 'ConditionalExpression') {
        if (isNode(node.consequent)) {
            collectRootsFromExpression(node.consequent, roots);
        }

        if (isNode(node.alternate)) {
            collectRootsFromExpression(node.alternate, roots);
        }

        return;
    }

    throw new Error(
        `[WebKineForge] Unsupported component root expression: ${node.type}`
    );
}

/**
 * Collect return statements from a function.
 * Nested functions are skipped.
 */
function collectReturnStatements(
    root: AstNode,
    returns: AstNode[]
): void {
    function visit(node: AstNode, isRoot: boolean): void {
        if (
            !isRoot &&
            (
                node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression' ||
                node.type === 'ArrowFunctionExpression'
            )
        ) {
            return;
        }

        if (node.type === 'ReturnStatement') {
            returns.push(node);
            return;
        }

        for (const value of Object.values(node)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (isNode(item)) {
                        visit(item, false);
                    }
                }
            } else if (isNode(value)) {
                visit(value, false);
            }
        }
    }

    visit(root, true);
}

/**
 * Get JSX roots returned by a component function.
 */
function getComponentRoots(
    component: AstNode
): AstNode[] {
    const roots: AstNode[] = [];

    // Arrow function with an expression body:
    // const Template = () => <section />;
    if (
        component.type === 'ArrowFunctionExpression' &&
        isNode(component.body) &&
        component.body.type !== 'BlockStatement'
    ) {
        collectRootsFromExpression(component.body, roots);
        return roots;
    }

    // Function with a block body:
    // function Template() {
    //     return <section />;
    // }
    const returns: AstNode[] = [];

    if (isNode(component.body)) {
        collectReturnStatements(component.body, returns);
    }

    for (const statement of returns) {
        if (!isNode(statement.argument)) {
            throw new Error(
                '[WebKineForge] Component return statement has no JSX element.'
            );
        }

        collectRootsFromExpression(statement.argument, roots);
    }

    return roots;
}

/**
 * Get exported component functions from the module.
 */
function getExportedComponents(program: AstNode): AstNode[] {
    const components: AstNode[] = [];

    const addVariableComponents = (declaration: AstNode) => {
        if (!Array.isArray(declaration.declarations)) {
            return;
        }

        for (const item of declaration.declarations) {
            if (!isNode(item) || !isNode(item.init)) {
                continue;
            }

            if (
                item.init.type === 'ArrowFunctionExpression' ||
                item.init.type === 'FunctionExpression'
            ) {
                components.push(item.init);
            }
        }
    };

    for (const statement of program.body as AstNode[]) {
        if (statement.type === 'ExportNamedDeclaration') {
            const declaration = statement.declaration;

            if (!isNode(declaration)) {
                continue;
            }

            if (declaration.type === 'FunctionDeclaration') {
                components.push(declaration);
            } else if (declaration.type === 'VariableDeclaration') {
                addVariableComponents(declaration);
            }
        }

        if (statement.type === 'ExportDefaultDeclaration') {
            const declaration = statement.declaration;

            if (
                isNode(declaration) &&
                (
                    declaration.type === 'FunctionDeclaration' ||
                    declaration.type === 'FunctionExpression' ||
                    declaration.type === 'ArrowFunctionExpression'
                )
            ) {
                components.push(declaration);
            }
        }
    }

    return components;
}

/**
 * Validate the component root and return its opening element.
 */
function getComponentRoot(
    jsxElement: AstNode
): AstNode {
    const openingElement = jsxElement.openingElement;

    if (!isNode(openingElement)) {
        throw new Error(
            '[WebKineForge] Invalid JSXElement: openingElement not found.'
        );
    }

    const name = openingElement.name;

    if (!isNode(name) || name.type !== 'JSXIdentifier') {
        throw new Error(
            '[WebKineForge] Component root must be a native HTML element.'
        );
    }

    const tagName = name.name;

    if (
        typeof tagName !== 'string' ||
        !/^[a-z]/.test(tagName)
    ) {
        throw new Error(
            `[WebKineForge] Invalid component root: <${String(tagName)}>. ` +
            'The root must be a native HTML element, not a component.'
        );
    }

    const attributes = openingElement.attributes;

    if (Array.isArray(attributes)) {
        const hasAttribute = attributes.some((attribute) => {
            return (
                isNode(attribute) &&
                attribute.type === 'JSXAttribute' &&
                isNode(attribute.name) &&
                attribute.name.name === 'data-component'
            );
        });

        if (hasAttribute) {
            throw new Error(
                '[WebKineForge] Do not manually add data-component. ' +
                'It is injected automatically.'
            );
        }
    }

    return openingElement;
}

/**
 * Inject data-component into exported component root elements.
 */
export function injectComponentAttribute(
    source: string,
    filePath: string
): string {
    const slug = getComponentSlug(filePath);

    const result = parseSync(filePath, source, {
        lang: 'tsx',
        sourceType: 'module',
        astType: 'ts',
    });

    if (result.errors.length > 0) {
        const messages = result.errors
            .map((error) => error.message)
            .join('\n');

        throw new Error(
            `[WebKineForge] Failed to parse ${filePath}:\n${messages}`
        );
    }

    const program = result.program as unknown as AstNode;
    const components = getExportedComponents(program);

    if (components.length === 0) {
        throw new Error(
            `[WebKineForge] No exported component function found in ${filePath}`
        );
    }

    const roots = new Set<AstNode>();

    for (const component of components) {
        const componentRoots = getComponentRoots(component);

        for (const root of componentRoots) {
            roots.add(root);
        }
    }

    if (roots.size === 0) {
        throw new Error(
            `[WebKineForge] No JSX root found in ${filePath}`
        );
    }

    const magicString = new MagicString(source);

    for (const root of roots) {
        const openingElement = getComponentRoot(root);
        const name = openingElement.name as AstNode;

        const insertPosition = toStringOffset(
            source,
            name.end
        );

        magicString.appendLeft(
            insertPosition,
            ` data-component="${slug}"`
        );
    }

    return magicString.toString();
}

/**
 * Vite plugin.
 */
export function injectComponentAttributePlugin(): Plugin {
    return {
        name: 'inject-component-attribute',
        enforce: 'pre',

        transform(source, id) {
            const filePath = id.split('?')[0];

            if (
                !filePath.endsWith('.tsx') ||
                filePath.includes('/node_modules/')
            ) {
                return null;
            }

            // Only transform component templates.
            if (!filePath.endsWith('/template.tsx')) {
                return null;
            }

            const transformed = injectComponentAttribute(
                source,
                filePath
            );

            const magicString = new MagicString(source);

            // Reuse the transformed source and generate a sourcemap.
            // The actual source transformation is performed above.
            magicString.overwrite(
                0,
                source.length,
                transformed
            );

            return {
                code: transformed,
                map: magicString.generateMap({
                    source: filePath,
                    includeContent: true,
                    hires: true,
                }),
            };
        },
    };
}