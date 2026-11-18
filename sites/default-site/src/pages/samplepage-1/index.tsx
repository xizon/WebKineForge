// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import Scenes from '@/components/scenes';
import SceneItem from '@/components/scene-item';

import PrimaryMenu from '@/components/primary-menu';
import Hero3D from '@/components/hero-3d';
import TextReveal from '@/components/text-reveal';
import Parallax from '@/components/parallax';
import PricingCards from '@/components/pricing-cards';
import ProductScroll from '@/components/product-scroll';
import PhotoScatter from '@/components/photo-scatter';
import Footer from '@/components/footer';
import Logo from '@/components/logo';


// Slides passed to TextReveal: three code cards rendered as SVG.
const codeSlides = [
    <svg xmlns="http://www.w3.org/2000/svg" width="495" height="390" viewBox="0 0 495 390">
        <rect width="495" height="410" fill="transparent" />

        <g transform="translate(20 20)">
            <rect
                width="450"
                height="370"
                rx="12"
                fill="#111827"
                stroke="#273449"
                strokeWidth="1"
            />
            <path
                d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z"
                fill="#1b2638"
            />
            <circle cx="20" cy="25" r="5" fill="#fb7185" />
            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
            <circle cx="56" cy="25" r="5" fill="#34d399" />
            <text
                x="82"
                y="30"
                fill="#e5e7eb"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="15px"
            >
                HTML
            </text>
            <text
                x="425"
                y="29"
                textAnchor="end"
                fill="#94a3b8"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="12px"
                letterSpacing="1px"
            >
                template.tsx
            </text>

            <g fontFamily="SFMono-Regular, Consolas, monospace" fontSize="12px" fill="#dbe4f0">
                <text x="20" y="82">
                    <tspan fill="#c792ea">export function</tspan> <tspan fill="#82aaff">Template</tspan>() {'{'}
                </text>
                <text x="38" y="104">
                    <tspan fill="#c792ea">return</tspan> (
                </text>
                <text x="56" y="126">
                    &lt;<tspan fill="#82aaff">div</tspan> <tspan fill="#f78c6c">className</tspan>=<tspan fill="#c3e88d">"wkf-card"</tspan>&gt;
                </text>
                <text x="74" y="148">
                    &lt;<tspan fill="#82aaff">img</tspan> <tspan fill="#f78c6c">src</tspan>=<tspan fill="#c3e88d">"/images/product.jpg"</tspan> <tspan fill="#f78c6c">alt</tspan>=<tspan fill="#c3e88d">""</tspan> /&gt;
                </text>
                <text x="74" y="170">
                    &lt;<tspan fill="#82aaff">h3</tspan>&gt;Product Name&lt;/<tspan fill="#82aaff">h3</tspan>&gt;
                </text>
                <text x="74" y="192">
                    &lt;<tspan fill="#82aaff">p</tspan>&gt;Hello World!&lt;/<tspan fill="#82aaff">p</tspan>&gt;
                </text>
                <text x="74" y="214">
                    &lt;<tspan fill="#82aaff">button</tspan> <tspan fill="#f78c6c">type</tspan>=<tspan fill="#c3e88d">"button"</tspan>
                </text>
                <text x="92" y="236">
                    <tspan fill="#f78c6c">id</tspan>=<tspan fill="#c3e88d">"wkf-card-btn"</tspan>&gt;Explore&lt;/<tspan fill="#82aaff">button</tspan>&gt;
                </text>
                <text x="56" y="258">
                    &lt;/<tspan fill="#82aaff">div</tspan>&gt;
                </text>
                <text x="38" y="280">);</text>
                <text x="20" y="302">{'}'}</text>
            </g>
        </g>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="495" height="390" viewBox="0 0 495 390">
        <rect width="495" height="410" fill="transparent" />

        <g transform="translate(20 20)">
            <rect
                width="450"
                height="370"
                rx="12"
                fill="#111827"
                stroke="#273449"
                strokeWidth="1"
            />
            <path
                d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z"
                fill="#1b2638"
            />
            <circle cx="20" cy="25" r="5" fill="#fb7185" />
            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
            <circle cx="56" cy="25" r="5" fill="#34d399" />
            <text
                x="82"
                y="30"
                fill="#e5e7eb"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="15px"
            >
                CSS
            </text>
            <text
                x="425"
                y="29"
                textAnchor="end"
                fill="#94a3b8"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="12px"
                letterSpacing="1px"
            >
                style.css
            </text>

            <g fontFamily="SFMono-Regular, Consolas, monospace" fontSize="12px" fill="#dbe4f0">
                <text x="20" y="82">
                    <tspan fill="#f78c6c">.wkf-card</tspan> {'{'}
                </text>
                <text x="38" y="104">
                    <tspan fill="#82aaff">padding</tspan>: <tspan fill="#c3e88d">24px</tspan>;
                </text>
                <text x="38" y="126">
                    <tspan fill="#82aaff">border-radius</tspan>: <tspan fill="#c3e88d">16px</tspan>;
                </text>
                <text x="38" y="148">
                    <tspan fill="#82aaff">background</tspan>: <tspan fill="#c3e88d">white</tspan>;
                </text>
                <text x="38" y="192">
                    <tspan fill="#82aaff">img</tspan> {'{'}
                </text>
                <text x="56" y="214">
                    <tspan fill="#82aaff">width</tspan>: <tspan fill="#c3e88d">100%</tspan>;
                </text>
                <text x="38" y="236">{'}'}</text>
                <text x="20" y="258">{'}'}</text>
            </g>
        </g>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="495" height="390" viewBox="0 0 495 390">
        <rect width="495" height="410" fill="transparent" />

        <g transform="translate(20 20)">
            <rect
                width="450"
                height="370"
                rx="12"
                fill="#111827"
                stroke="#273449"
                strokeWidth="1"
            />
            <path
                d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z"
                fill="#1b2638"
            />
            <circle cx="20" cy="25" r="5" fill="#fb7185" />
            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
            <circle cx="56" cy="25" r="5" fill="#34d399" />
            <text
                x="82"
                y="30"
                fill="#e5e7eb"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="15px"
            >
                JS
            </text>
            <text
                x="425"
                y="29"
                textAnchor="end"
                fill="#94a3b8"
                fontFamily="-apple-system, sans-serif"
                fontWeight="600"
                fontSize="12px"
                letterSpacing="1px"
            >
                controller.ts
            </text>

            <g fontFamily="SFMono-Regular, Consolas, monospace" fontSize="11px" fill="#dbe4f0">
                <text x="16" y="78">
                    <tspan fill="#c792ea">import</tspan> {'{'} gsap {'}'} <tspan fill="#c792ea">from</tspan> <tspan fill="#c3e88d">'gsap'</tspan>;
                </text>
                <text x="16" y="98">
                    <tspan fill="#c792ea">export function</tspan> <tspan fill="#82aaff">mount</tspan>(element: HTMLElement | <tspan fill="#c792ea">null</tspan>) {'{'}
                </text>
                <text x="34" y="118">
                    <tspan fill="#c792ea">if</tspan> (!element) <tspan fill="#c792ea">return</tspan>;
                </text>
                <text x="34" y="158">
                    <tspan fill="#c792ea">const</tspan> button = element.<tspan fill="#82aaff">querySelector</tspan>(<tspan fill="#c3e88d">'#wkf-card-btn'</tspan>);
                </text>
                <text x="34" y="178">
                    <tspan fill="#c792ea">const</tspan> onClick = () =&gt; {'{'}
                </text>
                <text x="52" y="198">
                    gsap.<tspan fill="#82aaff">to</tspan>(element, {'{'} <tspan fill="#f78c6c">scale</tspan>: <tspan fill="#c3e88d">1.03</tspan>, <tspan fill="#f78c6c">duration</tspan>: <tspan fill="#c3e88d">0.3</tspan>,
                </text>
                <text x="52" y="218">
                    <tspan fill="#f78c6c">yoyo</tspan>: <tspan fill="#c792ea">true</tspan>, <tspan fill="#f78c6c">repeat</tspan>: <tspan fill="#c3e88d">1</tspan>{'}'});
                </text>
                <text x="34" y="238">{'};'}</text>
                <text x="34" y="278">
                    button?.<tspan fill="#82aaff">addEventListener</tspan>(<tspan fill="#c3e88d">'click'</tspan>, onClick);
                </text>
                <text x="34" y="298">
                    <tspan fill="#c792ea">return</tspan> () =&gt; {'{'}
                </text>
                <text x="52" y="318">
                    button?.<tspan fill="#82aaff">removeEventListener</tspan>(<tspan fill="#c3e88d">'click'</tspan>, onClick);
                </text>
                <text x="34" y="338">{'};'}</text>
                <text x="16" y="358">{'}'}</text>
            </g>
        </g>
    </svg>,
];


export default function SamplePage() {
    return (
        <main className="wkf-page-main">
            <PrimaryMenu
                links={[
                    { href: './samplepage-1.html', page: 'samplepage-1', label: 'Sample Page 1' },
                    { href: './samplepage-2.html', page: 'samplepage-2', label: 'Sample Page 2' },
                    {
                        href: './samplepage-3--home.html',
                        page: 'samplepage-3',
                        label: 'Sample Page 3',
                        newWindow: true,
                    },
                ]}
            />

            <nav className="wkf-page-nav">
                <Logo link="./samplepage-1.html" />
            </nav>

            <Scenes coveredOpacity={1} coverOffset="50vh">
                <SceneItem>
                    <Hero3D
                        eyebrow="Full-stack developer"
                        title="I build the product"
                        accent="from the pixel to the process."
                        description="Interface, application, and infrastructure. Motion belongs to the work, not a coat of paint added at the end."
                        nextLabel="Scroll"
                        nextSelector="#next-section"
                    />
                </SceneItem>

                <SceneItem coveredOpacity={0.35}>
                    <Parallax
                        id="next-section"
                        image="./assets/images/parallax-bg.jpg"
                        imageAlt=""
                        eyebrow="01 — Portrait"
                        title="A long attention span for short, exact interfaces"
                        body="People arrive asking for a page. They leave with the system around it: templates, data, deployment, and the small interactions a visitor actually feels. I like work that is quiet in the hand and precise in the code."
                        figure="Fig. 01"
                    />
                </SceneItem>

                <SceneItem>
                    <TextReveal
                        headline="Using"
                        subline="HTML, TypeScript, Tailwind CSS, and vanilla CSS."
                        slides={codeSlides}
                        note="The build outputs standalone HTML pages and assets, ready for direct deployment or integration into any tech stack, including PHP, Java, WordPress, and Next.js."
                    />
                </SceneItem>

                <SceneItem>
                    <PricingCards
                        plans={[
                            {
                                name: 'Free',
                                price: '$0',
                                cadence: 'per month',
                                summary: 'A single published page for trying the motion set.',
                                features: [
                                    'One published page',
                                    'Core motion components',
                                    'Community notes',
                                ],
                                action: 'Start free',
                                href: '#',
                            },
                            {
                                name: 'Pro',
                                price: '$5',
                                cadence: 'per month',
                                summary: 'The working site: scroll scenes, 3D, and a shared library.',
                                features: [
                                    'Unlimited pages',
                                    'Scroll and 3D scenes',
                                    'Shared component library',
                                ],
                                action: 'Start Pro',
                                href: '#',
                                featured: true,
                            },
                            {
                                name: 'Ultra',
                                price: '$???',
                                cadence: 'per month',
                                summary: 'Any expansion you desire.',
                                features: [
                                    'Everything in Pro',
                                    'Custom Tools',
                                ],
                                action: 'Ultra',
                                href: '#',
                            },
                        ]}
                    />
                </SceneItem>

            </Scenes>

            <PhotoScatter
                title="Simple, enjoy it!"
                description="No React, Vue, or other front-end frameworks required at runtime, and no framework-specific syntax or APIs to learn."
                tiles={[
                    { color: '#241c18', depth: 0.55, shift: -0.7, label: 'Image 01' },
                    { color: '#102028', depth: 0.22, shift: 0.85, label: 'Image 02' },
                    { color: '#2a1822', depth: 0.86, shift: 0.4, label: 'Image 03' },
                ]}
            />
            <ProductScroll
                title="Every detail has a"
                accent="purpose."
                description="Bringing static website development back to the joy of creation."
            />
            <Footer
                eyebrow="Elsewhere"
                title="UI-First, Always"
                links={[
                    { label: 'GitHub', href: 'https://github.com/xizon/WebKineForge' },
                    { label: 'Website', href: 'https://uiux.cc' },
                ]}
                copyright="© 2026 WebKineForge."
            />
        </main>
    );
}