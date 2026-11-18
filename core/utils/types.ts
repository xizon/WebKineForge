/**
 * For Sites
 */
export interface SiteInfo {
    name: string;
    root: string;
    components: string[];
}
export interface SiteAuthor {
    name?: string;
    website?: string;
    email?: string;
}
export interface SitePaths {
    src: string;
    public: string;
    dist: string;
    pages: string;
    components: string;
    styles: string;
    template?: string;
}


export interface SiteContext {
    name: string;
    title: string;
    root: string;
    config: SiteConfig;
    paths: SitePaths;
};

export type SiteConfig = {
    name: string;
    version: string;
    lang: string;
    title: string;
    description?: string;
    author?: SiteAuthor;
    template?: string;
    paths?: {
        src?: string;
        public?: string;
        dist?: string;
    };
    entries?: {
        pages?: string;
        components?: string;
        styles?: string;
    };
};

/**
 * For Components
 */
export type ComponentManifest = {
    name?: string;
    version?: string;
    type?: 'component';
    description?: string;
    dependencies?: Record<string, string>;
    assets?: unknown[];
};

export type AstNode = {
    type: string;
    start: number;
    end: number;
    [key: string]: unknown;
};

export type ComponentRoot = {
    name: string;
    openingElement: AstNode;
};


/**
 * For Pages
 */
export type PageSeo = {
    lang: string;
    title: string;
    description?: string | null;
    keywords?: string[] | null;
    author?: string | null;
    canonical?: string | null;

    // Supports fully customizable SEO extended attributes (such as twitterCard, og:image, etc.)
    [key: string]: any;
};

export type PageDefinition = {
    slug: string;
    dir: string;
    bodyClass: string;
    templatePath: string;
    clientPath: string;
    clientFile: string;
    clientRel: string;
    htmlFileName: string;
    seo: PageSeo;
};

export type PageManifest = {
    name?: string;
    version?: string;
    type?: 'page';
    output?: string;
    bodyClass?: string;
    seo?: Partial<PageSeo>;
};

export type RenderDocumentOptions = {
    seo: PageSeo;
    bodyClass?: string;
    body: string;
    extraHead?: string;
    cssHrefs?: string[];
    jsHrefs?: string[];
    viteClient?: boolean;
    beautify?: boolean;
    siteTitle?: string;
    isIndex?: boolean;
};


/**
 * For Agent
 */
export type IndexConfig = {
    type: 'component' | 'page';
    sourceDir: string;
    outputFile: string;
};

export type IndexEntry = {
    name: string;
    title?: string;
    description: string;
    type: string;
    output?: string;
};

export type IndexData = {
    _meta: {
        generated: boolean;
        notice: string;
    };
    [key: string]: unknown;
};


/**
 * For CLI
 */
export interface DiscoveredSite {
    name: string;
    root: string;
    configPath: string;
}


/**
 * For Builder
 */

export type ExternalMap = Record<string, string>;
export interface SiteBuildConfig {
    externals?: Record<string, string>;
}

export interface SitePackageJson {
    name?: string;
    version?: string;

    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;

    build?: SiteBuildConfig;
}

/**
 * For Server-side
 */
export type ViteManifestChunk = {
    file: string;
    css?: string[];
    imports?: string[];
};

export type ViteManifest = Record<string, ViteManifestChunk>;

export interface AutoMountOptions {
    componentsDir?: string; // src/components
    registryEntry?: string;  // src/runtime/bridge/register.ts
    runtimeEntry?: string;
    entryFiles?: string[];
    autoMount?: boolean;
    
}


export interface AssetInfo {
    filePath: string;
    devUrl: string;
}

export interface DependencyManifest {
    name: string;
    dependencies?: Record<string, string>;
}

export interface DependencyUsage {
    source: string;
    version: string;
}

export interface DependencyMismatch {
    name: string;
    usages: DependencyUsage[];
}

export interface DependencyCheckerOptions {
    /**
     * Directory containing all sites.
     * Defaults to the parent directory of Vite root.
     */
    sitesDir?: string;

    /**
     * Component directory inside each site.
     * Defaults to src/components.
     */
    componentsDir?: string;
}

export interface DependencyUsage {
    source: string;
    version: string;
}

export interface DependencyMismatch {
    name: string;
    usages: DependencyUsage[];
}



/**
 * For CLI
 */
export type CliCommand = "dev" | "build" | "preview" | "export:react";


/**
 * For Playground
 */
export type MarkdownNode = {
    type: string;
    depth?: number;
    value?: string;
    lang?: string;
    children?: MarkdownNode[];

    // for "marked"
    // Record the position of each Markdown node within the original Markdown text, 
    // so that we can accurately extract the original content.
    position?: {
        start: {
            offset: number;
        };
        end: {
            offset: number;
        };
    };
};

export interface PlaygroundMarkdownTable {
    headers: string[];
    rows: string[][];
}

export interface PlaygroundMarkdownSection {
    markdown?: string; // for "marked"
    title: string;
    paragraphs: string[];
    lists: string[];
    tables: PlaygroundMarkdownTable[];
}

export interface ComponentInfo {
    componentName: string;
    overview: string;

    apiReference: PlaygroundMarkdownSection;
    dependencies: PlaygroundMarkdownSection;
}

export interface ComponentDemo {
    title: string;
    description: string;
    code: string;
}



export type AstRecord = Record<string, unknown> & {
    type?: string;
};


export type ComponentRegistry = Map<string, string>;

export interface ResolvedComponent {
    name: string;
    directory: string;
}

export interface AnalyzedDemo extends ComponentDemo {
    components: ResolvedComponent[];
}

export interface AnalyzedComponent extends ComponentInfo {
    demos: AnalyzedDemo[];
}

export interface WrittenDemoEntry {
    title: string;
    fileName: string;
    filePath: string;
}

export type PlaygroundEntries = Record<string, string>;

export interface PlaygroundManifestEntry {
    file: string;
    name?: string;
    isEntry?: boolean;
    imports?: string[];
    dynamicImports?: string[];
    css?: string[];
    assets?: string[];
}

export type PlaygroundManifest = Record<
    string,
    PlaygroundManifestEntry
>;

export interface PlaygroundDocumentOptions {
    componentName: string;
    overview: string;

    demoTitle: string;
    demoDescription: string;

    previewHtml: string;

    assets: PlaygroundAssets;
    demoCode: string;

    apiReference: PlaygroundMarkdownSection;
    dependencies: PlaygroundMarkdownSection;

    viteClient?: boolean;
}

export interface PlaygroundAssets {
    js: string[];
    css: string[];
}


export interface PlaygroundIndexDemo {
    title: string;
    description: string;
    href: string;
}

export interface PlaygroundIndexComponent {
    name: string;
    slug: string;
    overview: string;
    demos: PlaygroundIndexDemo[];
}

export interface PlaygroundDemoRoute {
    componentName: string;
    overview: string;

    demoTitle: string;
    demoDescription: string;
    demoCode: string;

    apiReference: PlaygroundMarkdownSection;
    dependencies: PlaygroundMarkdownSection; 

    entryPath?: string; 
}

export interface PlaygroundDevData {
    components: PlaygroundIndexComponent[];
    demos: Map<string, PlaygroundDemoRoute>;
}

export type PlaygroundSectionKey =
    | 'overview'
    | 'examples'
    | 'apiReference'
    | 'dependencies';
