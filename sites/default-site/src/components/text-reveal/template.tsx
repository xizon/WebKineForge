
import './style.css';

import TextShimmer from '@/components/text-shimmer';

export function Template() {
    return (
        <section className="wkf-text-reveal">

            {/* Main Content */}
            <div className="wkf-text-reveal__body">

                {/* Left Content */}
                <aside className="wkf-text-reveal__aside">
                    <h2 className="wkf-text-reveal__headline">
                        <span>
                            Using
                        </span>
                        <span className="wkf-text-reveal__subline">
                            HTML, TypeScript, Tailwind CSS, and vanilla CSS.
                        </span>
                    </h2>
                </aside>

                {/* Right Content */}
                <main className="wkf-text-reveal__content">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 390" className="wkf-text-reveal__svg">
                        <rect width="1440" height="410" fill="transparent" />

                        <g transform="translate(20 20)">
                            <rect width="450" height="370" rx="12" style={{ fill: '#111827', stroke: '#273449', strokeWidth: 1 }} />
                            <path d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z" fill="#1b2638" />
                            <circle cx="20" cy="25" r="5" fill="#fb7185" />
                            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
                            <circle cx="56" cy="25" r="5" fill="#34d399" />
                            <text x="82" y="30" style={{ font: '600 15px -apple-system,sans-serif', fill: '#e5e7eb' }}>HTML</text>
                            <text x="425" y="29" textAnchor="end" style={{ font: '600 12px -apple-system,sans-serif', fill: '#94a3b8', letterSpacing: 1 }}>template.tsx</text>

                            <g style={{ font: '12px SFMono-Regular,Consolas,monospace', fill: '#dbe4f0' }}>
                                <text x="20" y="82"><tspan fill="#c792ea">export function</tspan> <tspan fill="#82aaff">Temp</tspan>() {'{'}</text>
                                <text x="38" y="104"><tspan fill="#c792ea">return</tspan> (</text>
                                <text x="56" y="126">&lt;<tspan fill="#82aaff">div</tspan> <tspan fill="#f78c6c">className</tspan>=<tspan fill="#c3e88d">"wkf:card"</tspan>&gt;</text>
                                <text x="74" y="148">&lt;<tspan fill="#82aaff">img</tspan> <tspan fill="#f78c6c">src</tspan>=<tspan fill="#c3e88d">"/images/product.jpg"</tspan> <tspan fill="#f78c6c">alt</tspan>=<tspan fill="#c3e88d">""</tspan> /&gt;</text>
                                <text x="74" y="170">&lt;<tspan fill="#82aaff">h3</tspan>&gt;Product Name&lt;/<tspan fill="#82aaff">h3</tspan>&gt;</text>
                                <text x="74" y="192">&lt;<tspan fill="#82aaff">p</tspan>&gt;Hello World!&lt;/<tspan fill="#82aaff">p</tspan>&gt;</text>
                                <text x="74" y="214">&lt;<tspan fill="#82aaff">button</tspan> <tspan fill="#f78c6c">type</tspan>=<tspan fill="#c3e88d">"button"</tspan></text>
                                <text x="92" y="236"><tspan fill="#f78c6c">id</tspan>=<tspan fill="#c3e88d">"btn"</tspan>&gt;Explore&lt;/<tspan fill="#82aaff">button</tspan>&gt;</text>
                                <text x="56" y="258">&lt;/<tspan fill="#82aaff">div</tspan>&gt;</text>
                                <text x="38" y="280">);</text>
                                <text x="20" y="302">{'}'}</text>
                            </g>
                        </g>

                        <g transform="translate(495 20)">
                            <rect width="450" height="370" rx="12" style={{ fill: '#111827', stroke: '#273449', strokeWidth: 1 }} />
                            <path d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z" fill="#1b2638" />
                            <circle cx="20" cy="25" r="5" fill="#fb7185" />
                            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
                            <circle cx="56" cy="25" r="5" fill="#34d399" />
                            <text x="82" y="30" style={{ font: '600 15px -apple-system,sans-serif', fill: '#e5e7eb' }}>CSS</text>
                            <text x="425" y="29" textAnchor="end" style={{ font: '600 12px -apple-system,sans-serif', fill: '#94a3b8', letterSpacing: 1 }}>style.css</text>

                            <g style={{ font: '12px SFMono-Regular,Consolas,monospace', fill: '#dbe4f0' }}>
                                <text x="20" y="82"><tspan fill="#f78c6c">.wkf-card</tspan> {'{'}</text>
                                <text x="38" y="104"><tspan fill="#82aaff">padding</tspan>: <tspan fill="#c3e88d">24px</tspan>;</text>
                                <text x="38" y="126"><tspan fill="#82aaff">border-radius</tspan>: <tspan fill="#c3e88d">16px</tspan>;</text>
                                <text x="38" y="148"><tspan fill="#82aaff">background</tspan>: <tspan fill="#c3e88d">white</tspan>;</text>
                                <text x="38" y="192"><tspan fill="#82aaff">img</tspan> {'{'}</text>
                                <text x="56" y="214"><tspan fill="#82aaff">width</tspan>: <tspan fill="#c3e88d">100%</tspan>;</text>
                                <text x="38" y="236">{'}'}</text>
                                <text x="20" y="258">{'}'}</text>
                            </g>
                        </g>

                        <g transform="translate(970 20)">
                            <rect width="450" height="370" rx="12" style={{ fill: '#111827', stroke: '#273449', strokeWidth: 1 }} />
                            <path d="M12 0h426a12 12 0 0 1 12 12v38H0V12A12 12 0 0 1 12 0z" fill="#1b2638" />
                            <circle cx="20" cy="25" r="5" fill="#fb7185" />
                            <circle cx="38" cy="25" r="5" fill="#fbbf24" />
                            <circle cx="56" cy="25" r="5" fill="#34d399" />
                            <text x="82" y="30" style={{ font: '600 15px -apple-system,sans-serif', fill: '#e5e7eb' }}>JS</text>
                            <text x="425" y="29" textAnchor="end" style={{ font: '600 12px -apple-system,sans-serif', fill: '#94a3b8', letterSpacing: 1 }}>controller.ts</text>

                            <g style={{ font: '11px SFMono-Regular,Consolas,monospace', fill: '#dbe4f0' }}>
                                <text x="16" y="78"><tspan fill="#c792ea">import</tspan> {'{'} gsap {'}'} <tspan fill="#c792ea">from</tspan> <tspan fill="#c3e88d">'gsap'</tspan>;</text>
                                <text x="16" y="98"><tspan fill="#c792ea">export function</tspan> <tspan fill="#82aaff">mount</tspan>(element: HTMLElement | <tspan fill="#c792ea">null</tspan>) {'{'}</text>
                                <text x="34" y="118"><tspan fill="#c792ea">if</tspan> (!element) <tspan fill="#c792ea">return</tspan>;</text>
                                <text x="34" y="158"><tspan fill="#c792ea">const</tspan> button = element.<tspan fill="#82aaff">querySelector</tspan>(<tspan fill="#c3e88d">'#btn'</tspan>);</text>
                                <text x="34" y="178"><tspan fill="#c792ea">const</tspan> onClick = () =&gt; {'{'}</text>
                                <text x="52" y="198">gsap.<tspan fill="#82aaff">to</tspan>(element, {'{'} <tspan fill="#f78c6c">scale</tspan>: <tspan fill="#c3e88d">1.03</tspan>, <tspan fill="#f78c6c">duration</tspan>: <tspan fill="#c3e88d">0.3</tspan>,</text>
                                <text x="52" y="218"><tspan fill="#f78c6c">yoyo</tspan>: <tspan fill="#c792ea">true</tspan>, <tspan fill="#f78c6c">repeat</tspan>: <tspan fill="#c3e88d">1</tspan>{'}'});</text>
                                <text x="34" y="238">{'}'};</text>
                                <text x="34" y="278">button?.<tspan fill="#82aaff">addEventListener</tspan>(<tspan fill="#c3e88d">'click'</tspan>, onClick);</text>
                                <text x="34" y="298"><tspan fill="#c792ea">return</tspan> () =&gt; {'{'}</text>
                                <text x="52" y="318">button?.<tspan fill="#82aaff">removeEventListener</tspan>(<tspan fill="#c3e88d">'click'</tspan>, onClick);</text>
                                <text x="34" y="338">{'}'};</text>
                                <text x="16" y="358">{'}'}</text>
                            </g>
                        </g>
                    </svg>
                </main>

            </div>

            {/* Footer */}
            <footer className="wkf-text-reveal__footer">
                <div className="wkf-text-reveal__footer-note">
                    <TextShimmer>The build outputs standalone HTML pages and assets, ready for direct deployment or integration into any tech stack, including PHP, Java, WordPress, and Next.js.</TextShimmer>
                </div>
            </footer>

        </section>
    );
}
