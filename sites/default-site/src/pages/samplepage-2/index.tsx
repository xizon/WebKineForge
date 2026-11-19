// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import PrimaryMenu from '@/components/primary-menu';
import Logo from '@/components/logo';

//
import SmplePage2Main from '@/components/sample-page-2-main';


export default function SamplePage() {
    return (
        <main className="wkf:relative wkf:min-h-screen wkf:overflow-hidden wkf:bg-[#f8f9ff] wkf:font-sans wkf:text-[#25264a] wkf:selection:bg-violet-200">
            
            <SmplePage2Main />

            {/* Ambient background decoration */}
            <div className="wkf:bg-[radial-gradient(rgba(99,102,241,0.16)_1px,transparent_1px)] wkf:bg-[length:28px_28px] wkf:[mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_40%,transparent_100%)] wkf:[-webkit-mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_40%,transparent_100%)] wkf:pointer-events-none wkf:fixed wkf:inset-0 wkf:z-0" />
            <div
                data-wkf-parallax="25"
                className="wkf:animate-[wkf-float-slow_14s_ease-in-out_infinite] wkf:pointer-events-none wkf:fixed wkf:-right-32 wkf:-top-32 wkf:z-0 wkf:h-[540px] wkf:w-[540px] wkf:rounded-full wkf:bg-violet-400/20 wkf:blur-[120px] wkf:transition-[margin] wkf:duration-700 wkf:ease-out"
            />
            <div
                data-wkf-parallax="-20"
                className="wkf:animate-[wkf-float-reverse_18s_ease-in-out_infinite] wkf:pointer-events-none wkf:fixed wkf:-bottom-40 wkf:-left-32 wkf:z-0 wkf:h-[520px] wkf:w-[520px] wkf:rounded-full wkf:bg-blue-400/20 wkf:blur-[120px] wkf:transition-[margin] wkf:duration-700 wkf:ease-out"
            />
            <div
                data-wkf-parallax="15"
                className="wkf:animate-[wkf-float-slow_14s_ease-in-out_infinite] wkf:pointer-events-none wkf:fixed wkf:left-1/2 wkf:top-1/3 wkf:z-0 wkf:h-[360px] wkf:w-[360px] wkf:-translate-x-1/2 wkf:rounded-full wkf:bg-fuchsia-300/15 wkf:blur-[110px]"
            />

            {/* Navigation - Restored to your exact original structure */}
            <header className="wkf:sticky wkf:top-0 wkf:z-50 wkf:border-b wkf:border-white/70 wkf:bg-white/75 wkf:backdrop-blur-xl">
                {`<!-- Primary Menu -->`}
                <PrimaryMenu
                    theme="light"
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
                <nav className="wkf:bg-gradient-to-r wkf:from-blue-600 wkf:to-violet-600 wkf:font-serif wkf:text-gray-400 wkf:fixed wkf:left-0 wkf:top-0 wkf:z-[100] wkf:m-0 wkf:block wkf:w-screen wkf:bg-[rgba(255,255,255,0.1)] wkf:p-5 wkf:text-[1.2rem] wkf:backdrop-blur-[12px]">
                    <Logo theme="light" link="./samplepage-1.html" />
                </nav>
            </header>

{/* Hero */}

{/* Hero */}
<section
    id="wkf-home"
    className="wkf:relative wkf:z-10 wkf:mx-auto wkf:grid wkf:max-w-[1200px] wkf:grid-cols-1 wkf:items-center wkf:gap-14 wkf:px-6 wkf:pb-24 wkf:pt-24 wkf:lg:grid-cols-[0.85fr_1.15fr] wkf:lg:gap-20 wkf:lg:pb-32 wkf:lg:pt-32"
>
    {/* Left: Profile Card */}
    <div
        data-wkf-reveal
        data-wkf-delay="150"
        className="wkf:relative wkf:mx-auto wkf:w-full wkf:max-w-[420px]"
    >
        <div className="wkf:animate-[wkf-float-slow_14s_ease-in-out_infinite] wkf:absolute wkf:-inset-5 wkf:rounded-[3rem] wkf:bg-gradient-to-br wkf:from-blue-200/70 wkf:via-violet-200/60 wkf:to-fuchsia-200/70 wkf:blur-2xl" />

        <div
            data-wkf-tilt="8"
            className="wkf:relative wkf:overflow-hidden wkf:rounded-[2rem] wkf:border wkf:border-white wkf:bg-gradient-to-br wkf:from-[#dfe8ff] wkf:via-[#e9e3ff] wkf:to-[#f4e5ff] wkf:p-6 wkf:shadow-2xl wkf:shadow-violet-200/50"
        >
            <div className="wkf:flex wkf:items-center wkf:justify-between">
                <span className="wkf:text-xs wkf:font-bold wkf:tracking-widest wkf:text-violet-500">
                    PROFILE / 001
                </span>
                <span className="wkf:rounded-full wkf:bg-white/70 wkf:px-3 wkf:py-1 wkf:text-[10px] wkf:font-semibold wkf:text-violet-700">
                    CREATIVE MIND
                </span>
            </div>

            <div className="wkf:relative wkf:mx-auto wkf:mt-10 wkf:flex wkf:aspect-square wkf:max-w-[290px] wkf:items-center wkf:justify-center wkf:overflow-hidden wkf:rounded-full wkf:bg-gradient-to-br wkf:from-blue-500 wkf:via-violet-500 wkf:to-fuchsia-500 wkf:shadow-xl wkf:shadow-violet-300/50">
                <div className="wkf:animate-[wkf-spin-slow_24s_linear_infinite] wkf:absolute wkf:inset-4 wkf:rounded-full wkf:border wkf:border-dashed wkf:border-white/40" />
                <div className="wkf:absolute wkf:inset-10 wkf:rounded-full wkf:border wkf:border-white/20" />

                <span className="wkf:relative wkf:select-none wkf:text-[120px] wkf:font-black wkf:tracking-tighter wkf:text-white/90">
                    AM
                </span>

                <div className="wkf:absolute wkf:bottom-7 wkf:right-7 wkf:flex wkf:h-14 wkf:w-14 wkf:items-center wkf:justify-center wkf:rounded-2xl wkf:border wkf:border-white/50 wkf:bg-white/20 wkf:text-2xl wkf:text-white wkf:backdrop-blur-lg">
                    #
                </div>
            </div>

            <div className="wkf:mt-8 wkf:text-center">
                <h2 className="wkf:text-2xl wkf:font-extrabold wkf:tracking-tight">
                    WebKineForge
                </h2>
                <p className="wkf:mt-1 wkf:text-sm wkf:text-violet-700">
                    Creative Developer & UI Engineer
                </p>
            </div>

            <div className="wkf:mt-7 wkf:grid wkf:grid-cols-3 wkf:gap-2 wkf:border-t wkf:border-violet-200/70 wkf:pt-5">
                <div className="wkf:text-center">
                    <p
                        data-wkf-count="8"
                        data-wkf-pad="true"
                        data-wkf-suffix="+"
                        className="wkf:text-xl wkf:font-extrabold"
                    >
                        08+
                    </p>
                    <p className="wkf:mt-1 wkf:text-[10px] wkf:text-slate-500">
                        YEARS EXP.
                    </p>
                </div>

                <div className="wkf:border-x wkf:border-violet-200/70 wkf:text-center">
                    <p data-wkf-count="42" className="wkf:text-xl wkf:font-extrabold">
                        42
                    </p>
                    <p className="wkf:mt-1 wkf:text-[10px] wkf:text-slate-500">
                        PROJECTS
                    </p>
                </div>

                <div className="wkf:text-center">
                    <p data-wkf-count="18" className="wkf:text-xl wkf:font-extrabold">
                        18
                    </p>
                    <p className="wkf:mt-1 wkf:text-[10px] wkf:text-slate-500">
                        CLIENTS
                    </p>
                </div>
            </div>
        </div>

        {/* Floating Badge: Left */}
        <div className="wkf:animate-[wkf-float-slow_14s_ease-in-out_infinite] wkf:absolute wkf:-left-8 wkf:top-24 wkf:hidden wkf:rounded-2xl wkf:border wkf:border-white wkf:bg-white/90 wkf:px-4 wkf:py-3 wkf:shadow-xl wkf:shadow-violet-100 wkf:backdrop-blur-md wkf:sm:block">
            <span className="wkf:text-xl">✦</span>
        </div>

        {/* Floating Badge: Right */}
        <div className="wkf:animate-[wkf-float-reverse_18s_ease-in-out_infinite] wkf:absolute wkf:-right-5 wkf:bottom-24 wkf:hidden wkf:rounded-2xl wkf:border wkf:border-white wkf:bg-white/90 wkf:px-4 wkf:py-3 wkf:shadow-xl wkf:shadow-violet-100 wkf:backdrop-blur-md wkf:sm:block">
            <p className="wkf:mt-1 wkf:text-[10px] wkf:text-slate-500">
                ✦
            </p>
        </div>
    </div>

    {/* Right: Hero Content */}
    <div data-wkf-reveal>
        <div className="wkf:mb-7 wkf:inline-flex wkf:items-center wkf:gap-2 wkf:rounded-full wkf:border wkf:border-emerald-200 wkf:bg-emerald-50/90 wkf:px-4 wkf:py-2 wkf:text-xs wkf:font-semibold wkf:text-emerald-700 wkf:shadow-sm wkf:backdrop-blur-md">
            <span className="wkf:relative wkf:flex wkf:h-2 wkf:w-2">
                <span className="wkf:absolute wkf:inline-flex wkf:h-full wkf:w-full wkf:animate-ping wkf:rounded-full wkf:bg-emerald-400 wkf:opacity-60" />
                <span className="wkf:relative wkf:inline-flex wkf:h-2 wkf:w-2 wkf:rounded-full wkf:bg-emerald-500" />
            </span>
            AVAILABLE FOR SELECT PROJECTS
        </div>

        <p className="wkf:mb-5 wkf:text-sm wkf:font-semibold wkf:uppercase wkf:tracking-[0.2em] wkf:text-violet-600">
            Hello, I'm WebKineForge
        </p>

        <h1 className="wkf:max-w-[760px] wkf:text-5xl wkf:font-extrabold wkf:leading-[1.12] wkf:tracking-[-0.055em] wkf:sm:text-6xl wkf:lg:text-7xl">
            I build digital
            <span className="wkf:block wkf:bg-gradient-to-r wkf:from-blue-600 wkf:via-violet-600 wkf:to-fuchsia-500 wkf:bg-clip-text wkf:text-transparent">
                experiences.
            </span>
        </h1>

        <p className="wkf:mt-7 wkf:max-w-[570px] wkf:text-base wkf:leading-8 wkf:text-slate-500 wkf:sm:text-lg">
            Creative developer and UI engineer focused on crafting thoughtful interfaces, interactive websites, and digital products that make technology feel human.
        </p>

        <div className="wkf:mt-9 wkf:flex wkf:flex-wrap wkf:items-center wkf:gap-4">
            <a
                href="#wkf-projects"
                data-wkf-magnetic="0.28"
                className="wkf:group wkf:inline-flex wkf:items-center wkf:rounded-full wkf:bg-gradient-to-r wkf:from-blue-600 wkf:to-violet-600 wkf:px-7 wkf:py-3.5 wkf:text-sm wkf:font-bold wkf:text-white wkf:shadow-lg wkf:shadow-violet-200 wkf:transition-all wkf:hover:-translate-y-1 wkf:hover:shadow-xl"
            >
                Explore My Work
                <span className="wkf:ml-2 wkf:inline-block wkf:transition-transform wkf:duration-300 wkf:group-hover:translate-x-1 wkf:group-hover:-translate-y-0.5">
                    ↗
                </span>
            </a>

            <a
                href="#wkf-about"
                data-wkf-magnetic="0.2"
                className="wkf:inline-flex wkf:items-center wkf:rounded-full wkf:border wkf:border-slate-200 wkf:bg-white/90 wkf:px-7 wkf:py-3.5 wkf:text-sm wkf:font-bold wkf:text-slate-700 wkf:backdrop-blur-md wkf:transition-all wkf:hover:border-violet-300 wkf:hover:text-violet-700"
            >
                More About Me
            </a>
        </div>

        <div className="wkf:mt-12 wkf:flex wkf:items-center wkf:gap-5">
            <div className="wkf:flex wkf:-space-x-2">
                <div className="wkf:flex wkf:h-9 wkf:w-9 wkf:items-center wkf:justify-center wkf:rounded-full wkf:border-2 wkf:border-[#f8f9ff] wkf:bg-blue-100 wkf:text-xs wkf:font-bold wkf:text-blue-700 wkf:transition-transform wkf:hover:-translate-y-1">
                    UI
                </div>
                <div className="wkf:flex wkf:h-9 wkf:w-9 wkf:items-center wkf:justify-center wkf:rounded-full wkf:border-2 wkf:border-[#f8f9ff] wkf:bg-violet-100 wkf:text-xs wkf:font-bold wkf:text-violet-700 wkf:transition-transform wkf:hover:-translate-y-1">
                    UX
                </div>
                <div className="wkf:flex wkf:h-9 wkf:w-9 wkf:items-center wkf:justify-center wkf:rounded-full wkf:border-2 wkf:border-[#f8f9ff] wkf:bg-fuchsia-100 wkf:text-xs wkf:font-bold wkf:text-fuchsia-700 wkf:transition-transform wkf:hover:-translate-y-1">
                    DEV
                </div>
            </div>

            <p className="wkf:text-xs wkf:leading-5 wkf:text-slate-500">
                Design-minded developer<br />
                <span className="wkf:font-semibold wkf:text-slate-700">
                    Based in London, UK
                </span>
            </p>
        </div>
    </div>
</section>


            {/* About */}
            <section id="wkf-about" className="wkf:relative wkf:z-10 wkf:bg-white/90 wkf:py-24 wkf:backdrop-blur-sm">
                <div data-wkf-reveal className="wkf:mx-auto wkf:grid wkf:max-w-[1200px] wkf:gap-12 wkf:px-6 wkf:md:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-[0.2em] wkf:text-violet-600">01 / About Me</p>
                        <h2 className="wkf:mt-5 wkf:text-4xl wkf:font-extrabold wkf:leading-tight wkf:tracking-tight wkf:sm:text-5xl">
                            A little bit<br />
                            <span className="wkf:text-violet-600">about myself.</span>
                        </h2>
                    </div>

                    <div>
                        <p className="wkf:text-lg wkf:leading-9 wkf:text-slate-600">
                            I’m a multidisciplinary developer who enjoys bringing ideas to life through design and technology. I care about the details — from the first sketch to the final interaction.
                        </p>
                        <p className="wkf:mt-5 wkf:text-base wkf:leading-8 wkf:text-slate-500">
                            My work sits at the intersection of user experience, visual design, and front-end engineering. I enjoy solving complex problems, exploring emerging technologies, and building products that are both useful and delightful.
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects with interactive category filters */}
            <section id="wkf-projects" className="wkf:relative wkf:z-10 wkf:py-24">
                <div className="wkf:mx-auto wkf:max-w-[1200px] wkf:px-6">
                    <div data-wkf-reveal className="wkf:flex wkf:flex-col wkf:justify-between wkf:gap-5 wkf:sm:flex-row wkf:sm:items-end">
                        <div>
                            <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-[0.2em] wkf:text-violet-600">02 / Selected Work</p>
                            <h2 className="wkf:mt-4 wkf:text-4xl wkf:font-extrabold wkf:tracking-tight wkf:sm:text-5xl">Featured Projects<span className="wkf:text-violet-600">.</span></h2>
                            <p className="wkf:mt-4 wkf:text-sm wkf:text-slate-500">A selection of things I've designed and built.</p>
                        </div>

                        {/* Category filter tabs */}
                        <div className="wkf:flex wkf:flex-wrap wkf:items-center wkf:gap-2">
                            <button type="button" data-wkf-filter="all" className="wkf:cursor-pointer wkf:rounded-full wkf:bg-violet-600 wkf:px-4 wkf:py-2 wkf:text-xs wkf:font-bold wkf:text-white wkf:shadow-md wkf:transition-all">
                                All
                            </button>
                            <button type="button" data-wkf-filter="product" className="wkf:cursor-pointer wkf:rounded-full wkf:bg-white wkf:px-4 wkf:py-2 wkf:text-xs wkf:font-bold wkf:text-slate-600 wkf:transition-all wkf:hover:text-violet-600">
                                Product
                            </button>
                            <button type="button" data-wkf-filter="creative" className="wkf:cursor-pointer wkf:rounded-full wkf:bg-white wkf:px-4 wkf:py-2 wkf:text-xs wkf:font-bold wkf:text-slate-600 wkf:transition-all wkf:hover:text-violet-600">
                                Creative
                            </button>
                            <button type="button" data-wkf-filter="experiment" className="wkf:cursor-pointer wkf:rounded-full wkf:bg-white wkf:px-4 wkf:py-2 wkf:text-xs wkf:font-bold wkf:text-slate-600 wkf:transition-all wkf:hover:text-violet-600">
                                Experiment
                            </button>
                        </div>
                    </div>

                    <div className="wkf:mt-12 wkf:grid wkf:grid-cols-1 wkf:gap-6 wkf:sm:grid-cols-2 wkf:lg:grid-cols-3">
                        {/* Project 01 */}
                        <article
                            data-wkf-reveal
                            data-wkf-delay="0"
                            data-wkf-tilt="5"
                            data-wkf-category="product"
                            className="wkf:group wkf:overflow-hidden wkf:rounded-[2rem] wkf:border wkf:border-slate-100 wkf:bg-white wkf:shadow-sm wkf:transition-all wkf:duration-300 wkf:hover:shadow-xl wkf:hover:shadow-violet-100"
                        >
                            <div className="wkf:relative wkf:flex wkf:aspect-[16/10] wkf:items-center wkf:justify-center wkf:overflow-hidden wkf:bg-gradient-to-br wkf:from-blue-100 wkf:to-violet-200 wkf:p-5">
                                <div className="wkf:w-full wkf:max-w-[330px] wkf:rounded-2xl wkf:border wkf:border-white/80 wkf:bg-white/80 wkf:p-5 wkf:shadow-2xl wkf:backdrop-blur-xl wkf:transition-transform wkf:duration-500 wkf:group-hover:scale-105">
                                    <div className="wkf:flex wkf:gap-1.5"><span className="wkf:h-2 wkf:w-2 wkf:rounded-full wkf:bg-rose-400" /><span className="wkf:h-2 wkf:w-2 wkf:rounded-full wkf:bg-amber-400" /><span className="wkf:h-2 wkf:w-2 wkf:rounded-full wkf:bg-emerald-400" /></div>
                                    <div className="wkf:mt-5 wkf:h-3 wkf:w-2/3 wkf:rounded-full wkf:bg-violet-200" />
                                    <div className="wkf:mt-3 wkf:h-2 wkf:w-full wkf:rounded-full wkf:bg-slate-100" />
                                    <div className="wkf:mt-2 wkf:h-2 wkf:w-4/5 wkf:rounded-full wkf:bg-slate-100" />
                                    <div className="wkf:mt-6 wkf:grid wkf:grid-cols-3 wkf:gap-2"><div className="wkf:h-16 wkf:rounded-lg wkf:bg-blue-100" /><div className="wkf:h-16 wkf:rounded-lg wkf:bg-violet-100" /><div className="wkf:h-16 wkf:rounded-lg wkf:bg-fuchsia-100" /></div>
                                </div>
                                <span className="wkf:absolute wkf:right-5 wkf:top-5 wkf:rounded-full wkf:bg-white/70 wkf:px-3 wkf:py-1 wkf:text-[10px] wkf:font-bold wkf:text-violet-700">UI Design</span>
                            </div>
                            <div className="wkf:p-6">
                                <div className="wkf:flex wkf:items-center wkf:justify-between wkf:gap-2">
                                    <h3 className="wkf:text-xl wkf:font-extrabold">Product 1</h3>
                                    <span className="wkf:text-xl wkf:text-violet-600 wkf:transition-transform wkf:group-hover:translate-x-1 wkf:group-hover:-translate-y-1">↗</span>
                                </div>
                                <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">This is the description text for the work; feel free to express yourself as you wish..</p>
                                <div className="wkf:mt-5 wkf:flex wkf:flex-wrap wkf:gap-2">
                                    <span className="wkf:rounded-full wkf:bg-blue-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-blue-700">UI Design</span>
                                    <span className="wkf:rounded-full wkf:bg-violet-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-violet-700">React</span>
                                    <span className="wkf:rounded-full wkf:bg-fuchsia-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-fuchsia-700">Dashboard</span>
                                </div>
                            </div>
                        </article>

                        {/* Project 02 */}
                        <article
                            data-wkf-reveal
                            data-wkf-delay="100"
                            data-wkf-tilt="5"
                            data-wkf-category="creative"
                            className="wkf:group wkf:overflow-hidden wkf:rounded-[2rem] wkf:border wkf:border-slate-100 wkf:bg-white wkf:shadow-sm wkf:transition-all wkf:duration-300 wkf:hover:shadow-xl wkf:hover:shadow-violet-100"
                        >
                            <div className="wkf:relative wkf:flex wkf:aspect-[16/10] wkf:items-center wkf:justify-center wkf:overflow-hidden wkf:bg-gradient-to-br wkf:from-fuchsia-100 wkf:to-purple-200 wkf:p-5">
                                <div className="wkf:relative wkf:flex wkf:h-40 wkf:w-40 wkf:items-center wkf:justify-center wkf:rounded-full wkf:bg-gradient-to-br wkf:from-fuchsia-500 wkf:to-violet-700 wkf:shadow-2xl wkf:shadow-violet-400/40 wkf:transition-transform wkf:duration-500 wkf:group-hover:rotate-12 wkf:group-hover:scale-110">
                                    <div className="wkf:absolute wkf:inset-5 wkf:rounded-full wkf:border wkf:border-white/30" />
                                    <span className="wkf:text-6xl wkf:font-black wkf:text-white">S.</span>
                                </div>
                                <span className="wkf:absolute wkf:right-5 wkf:top-5 wkf:rounded-full wkf:bg-white/70 wkf:px-3 wkf:py-1 wkf:text-[10px] wkf:font-bold wkf:text-fuchsia-700">Software</span>
                            </div>
                            <div className="wkf:p-6">
                                <div className="wkf:flex wkf:items-center wkf:justify-between wkf:gap-2">
                                    <h3 className="wkf:text-xl wkf:font-extrabold">Product 2</h3>
                                    <span className="wkf:text-xl wkf:text-violet-600 wkf:transition-transform wkf:group-hover:translate-x-1 wkf:group-hover:-translate-y-1">↗</span>
                                </div>
                                <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">This is the description text for the work; feel free to express yourself as you wish..</p>
                                <div className="wkf:mt-5 wkf:flex wkf:flex-wrap wkf:gap-2">
                                    <span className="wkf:rounded-full wkf:bg-blue-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-blue-700">Branding</span>
                                    <span className="wkf:rounded-full wkf:bg-violet-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-violet-700">Three.js</span>
                                    <span className="wkf:rounded-full wkf:bg-fuchsia-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-fuchsia-700">Animation</span>
                                </div>
                            </div>
                        </article>

                        {/* Project 03 */}
                        <article
                            data-wkf-reveal
                            data-wkf-delay="200"
                            data-wkf-tilt="5"
                            data-wkf-category="product"
                            className="wkf:group wkf:overflow-hidden wkf:rounded-[2rem] wkf:border wkf:border-slate-100 wkf:bg-white wkf:shadow-sm wkf:transition-all wkf:duration-300 wkf:hover:shadow-xl wkf:hover:shadow-violet-100"
                        >
                            <div className="wkf:relative wkf:flex wkf:aspect-[16/10] wkf:items-center wkf:justify-center wkf:overflow-hidden wkf:bg-gradient-to-br wkf:from-cyan-100 wkf:to-blue-200 wkf:p-5">
                                <div className="wkf:w-full wkf:max-w-[300px] wkf:rounded-2xl wkf:bg-white wkf:p-5 wkf:shadow-2xl wkf:transition-transform wkf:duration-500 wkf:group-hover:-rotate-2">
                                    <div className="wkf:flex wkf:items-center wkf:justify-between"><span className="wkf:text-sm wkf:font-extrabold">TaskFlow</span><span className="wkf:rounded-full wkf:bg-blue-100 wkf:px-2 wkf:py-1 wkf:text-[9px] wkf:font-bold wkf:text-blue-700">MY WORKSPACE</span></div>
                                    <div className="wkf:mt-5 wkf:space-y-3">
                                        <div className="wkf:flex wkf:items-center wkf:gap-3"><span className="wkf:h-4 wkf:w-4 wkf:rounded-md wkf:border-2 wkf:border-blue-400" /><span className="wkf:h-2 wkf:flex-1 wkf:rounded-full wkf:bg-slate-200" /></div>
                                        <div className="wkf:flex wkf:items-center wkf:gap-3"><span className="wkf:flex wkf:h-4 wkf:w-4 wkf:items-center wkf:justify-center wkf:rounded-md wkf:bg-violet-500 wkf:text-[9px] wkf:text-white">✓</span><span className="wkf:h-2 wkf:w-3/4 wkf:rounded-full wkf:bg-slate-100" /></div>
                                        <div className="wkf:flex wkf:items-center wkf:gap-3"><span className="wkf:h-4 wkf:w-4 wkf:rounded-md wkf:border-2 wkf:border-blue-400" /><span className="wkf:h-2 wkf:w-5/6 wkf:rounded-full wkf:bg-slate-200" /></div>
                                    </div>
                                </div>
                                <span className="wkf:absolute wkf:right-5 wkf:top-5 wkf:rounded-full wkf:bg-white/70 wkf:px-3 wkf:py-1 wkf:text-[10px] wkf:font-bold wkf:text-blue-700">UI Design</span>
                            </div>
                            <div className="wkf:p-6">
                                <div className="wkf:flex wkf:items-center wkf:justify-between wkf:gap-2">
                                    <h3 className="wkf:text-xl wkf:font-extrabold">Product 3</h3>
                                    <span className="wkf:text-xl wkf:text-violet-600 wkf:transition-transform wkf:group-hover:translate-x-1 wkf:group-hover:-translate-y-1">↗</span>
                                </div>
                                <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">This is the description text for the work; feel free to express yourself as you wish..</p>
                                <div className="wkf:mt-5 wkf:flex wkf:flex-wrap wkf:gap-2">
                                    <span className="wkf:rounded-full wkf:bg-blue-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-blue-700">TypeScript</span>
                                    <span className="wkf:rounded-full wkf:bg-violet-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-violet-700">Next.js</span>
                                    <span className="wkf:rounded-full wkf:bg-fuchsia-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-fuchsia-700">UX</span>
                                </div>
                            </div>
                        </article>

                        {/* Project 04 */}
                        <article
                            data-wkf-reveal
                            data-wkf-delay="300"
                            data-wkf-tilt="5"
                            data-wkf-category="experiment"
                            className="wkf:group wkf:overflow-hidden wkf:rounded-[2rem] wkf:border wkf:border-slate-100 wkf:bg-white wkf:shadow-sm wkf:transition-all wkf:duration-300 wkf:hover:shadow-xl wkf:hover:shadow-violet-100"
                        >
                            <div className="wkf:relative wkf:flex wkf:aspect-[16/10] wkf:items-center wkf:justify-center wkf:overflow-hidden wkf:bg-gradient-to-br wkf:from-indigo-100 wkf:to-purple-200 wkf:p-5">
                                <div className="wkf:relative wkf:flex wkf:h-40 wkf:w-40 wkf:items-center wkf:justify-center wkf:rounded-[2.5rem] wkf:bg-gradient-to-br wkf:from-indigo-500 wkf:to-purple-700 wkf:shadow-2xl wkf:shadow-indigo-400/40 wkf:transition-transform wkf:duration-500 wkf:group-hover:rotate-6">
                                    <span className="wkf:text-6xl wkf:font-black wkf:text-white">AI</span>
                                    <span className="wkf:absolute wkf:-right-3 wkf:-top-3 wkf:flex wkf:h-12 wkf:w-12 wkf:items-center wkf:justify-center wkf:rounded-2xl wkf:bg-white wkf:text-xl wkf:shadow-lg">✧</span>
                                </div>
                                <span className="wkf:absolute wkf:right-5 wkf:top-5 wkf:rounded-full wkf:bg-white/70 wkf:px-3 wkf:py-1 wkf:text-[10px] wkf:font-bold wkf:text-indigo-700">Web Development</span>
                            </div>
                            <div className="wkf:p-6">
                                <div className="wkf:flex wkf:items-center wkf:justify-between wkf:gap-2">
                                    <h3 className="wkf:text-xl wkf:font-extrabold">Product</h3>
                                    <span className="wkf:text-xl wkf:text-violet-600 wkf:transition-transform wkf:group-hover:translate-x-1 wkf:group-hover:-translate-y-1">↗</span>
                                </div>
                                <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">This is the description text for the work; feel free to express yourself as you wish..</p>
                                <div className="wkf:mt-5 wkf:flex wkf:flex-wrap wkf:gap-2">
                                    <span className="wkf:rounded-full wkf:bg-blue-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-blue-700">AI</span>
                                    <span className="wkf:rounded-full wkf:bg-violet-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-violet-700">RAG</span>
                                    <span className="wkf:rounded-full wkf:bg-fuchsia-50 wkf:px-3 wkf:py-1.5 wkf:text-[10px] wkf:font-semibold wkf:text-fuchsia-700">Node.js</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section id="wkf-experience" className="wkf:relative wkf:z-10 wkf:bg-white/90 wkf:py-24 wkf:backdrop-blur-sm">
                <div data-wkf-reveal className="wkf:mx-auto wkf:max-w-[1200px] wkf:px-6">
                    <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-[0.2em] wkf:text-violet-600">03 / Career Journey</p>
                    <h2 className="wkf:mt-4 wkf:text-4xl wkf:font-extrabold wkf:tracking-tight wkf:sm:text-5xl">Experience & Education<span className="wkf:text-violet-600">.</span></h2>

                    <div className="wkf:mt-14 wkf:grid wkf:gap-12 wkf:md:grid-cols-2">
                        <div>
                            <h3 className="wkf:mb-7 wkf:flex wkf:items-center wkf:gap-3 wkf:text-lg wkf:font-extrabold"><span className="wkf:flex wkf:h-9 wkf:w-9 wkf:items-center wkf:justify-center wkf:rounded-xl wkf:bg-violet-100 wkf:text-violet-700">↗</span> Work Experience</h3>
                            <div className="wkf:space-y-8 wkf:border-l-2 wkf:border-violet-100 wkf:pl-6">
                                <div className="wkf:group wkf:relative">
                                    <span className="wkf:absolute wkf:-left-[31px] wkf:top-1 wkf:h-3 wkf:w-3 wkf:rounded-full wkf:border-2 wkf:border-violet-500 wkf:bg-white wkf:transition-transform wkf:group-hover:scale-150 wkf:group-hover:bg-violet-500" />
                                    <p className="wkf:text-xs wkf:font-bold wkf:text-violet-600">2022 — PRESENT</p>
                                    <h4 className="wkf:mt-2 wkf:text-base wkf:font-extrabold">Senior Frontend Developer</h4>
                                    <p className="wkf:mt-1 wkf:text-sm wkf:text-slate-500">Digital Studio · London</p>
                                    <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">Leading front-end development, building reusable interfaces, and collaborating with designers to deliver polished digital products.</p>
                                </div>
                                <div className="wkf:group wkf:relative">
                                    <span className="wkf:absolute wkf:-left-[31px] wkf:top-1 wkf:h-3 wkf:w-3 wkf:rounded-full wkf:border-2 wkf:border-violet-300 wkf:bg-white wkf:transition-transform wkf:group-hover:scale-150 wkf:group-hover:border-violet-500 wkf:group-hover:bg-violet-500" />
                                    <p className="wkf:text-xs wkf:font-bold wkf:text-violet-600">2019 — 2022</p>
                                    <h4 className="wkf:mt-2 wkf:text-base wkf:font-extrabold">UI / UX Developer</h4>
                                    <p className="wkf:mt-1 wkf:text-sm wkf:text-slate-500">PixelWorks · Remote</p>
                                    <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">Designed and developed responsive web experiences, design systems, and interactive prototypes for international clients.</p>
                                </div>
                                <div className="wkf:group wkf:relative">
                                    <span className="wkf:absolute wkf:-left-[31px] wkf:top-1 wkf:h-3 wkf:w-3 wkf:rounded-full wkf:border-2 wkf:border-violet-300 wkf:bg-white wkf:transition-transform wkf:group-hover:scale-150 wkf:group-hover:border-violet-500 wkf:group-hover:bg-violet-500" />
                                    <p className="wkf:text-xs wkf:font-bold wkf:text-violet-600">2017 — 2019</p>
                                    <h4 className="wkf:mt-2 wkf:text-base wkf:font-extrabold">Junior Web Designer</h4>
                                    <p className="wkf:mt-1 wkf:text-sm wkf:text-slate-500">Creative Lab · Manchester</p>
                                    <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">Created visual concepts, landing pages, and marketing websites while developing a strong foundation in front-end technologies.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="wkf:mb-7 wkf:flex wkf:items-center wkf:gap-3 wkf:text-lg wkf:font-extrabold"><span className="wkf:flex wkf:h-9 wkf:w-9 wkf:items-center wkf:justify-center wkf:rounded-xl wkf:bg-blue-100 wkf:text-blue-700">✧</span> Education</h3>
                            <div className="wkf:space-y-8 wkf:border-l-2 wkf:border-blue-100 wkf:pl-6">
                                <div className="wkf:group wkf:relative">
                                    <span className="wkf:absolute wkf:-left-[31px] wkf:top-1 wkf:h-3 wkf:w-3 wkf:rounded-full wkf:border-2 wkf:border-blue-500 wkf:bg-white wkf:transition-transform wkf:group-hover:scale-150 wkf:group-hover:bg-blue-500" />
                                    <p className="wkf:text-xs wkf:font-bold wkf:text-blue-600">2014 — 2017</p>
                                    <h4 className="wkf:mt-2 wkf:text-base wkf:font-extrabold">BSc in Computer Science</h4>
                                    <p className="wkf:mt-1 wkf:text-sm wkf:text-slate-500">University of Manchester</p>
                                    <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">Focused on software engineering, human-computer interaction, and web technologies.</p>
                                </div>
                                <div className="wkf:group wkf:relative">
                                    <span className="wkf:absolute wkf:-left-[31px] wkf:top-1 wkf:h-3 wkf:w-3 wkf:rounded-full wkf:border-2 wkf:border-blue-300 wkf:bg-white wkf:transition-transform wkf:group-hover:scale-150 wkf:group-hover:border-blue-500 wkf:group-hover:bg-blue-500" />
                                    <p className="wkf:text-xs wkf:font-bold wkf:text-blue-600">2020</p>
                                    <h4 className="wkf:mt-2 wkf:text-base wkf:font-extrabold">Advanced UI Design</h4>
                                    <p className="wkf:mt-1 wkf:text-sm wkf:text-slate-500">Online Professional Program</p>
                                    <p className="wkf:mt-3 wkf:text-sm wkf:leading-7 wkf:text-slate-500">Further study in interface systems, prototyping, accessibility, and design thinking.</p>
                                </div>
                            </div>

                            <div data-wkf-tilt="4" className="wkf:mt-10 wkf:rounded-2xl wkf:bg-gradient-to-br wkf:from-blue-50 wkf:to-violet-50 wkf:p-6">
                                <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-widest wkf:text-violet-600">My Philosophy</p>
                                <p className="wkf:mt-3 wkf:text-lg wkf:font-bold wkf:leading-8 wkf:text-[#34345f]">"Great digital products happen when thoughtful design meets purposeful engineering."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills */}
            <section id="wkf-skills" className="wkf:relative wkf:z-10 wkf:py-14">
                <div className="wkf:mx-auto wkf:max-w-[1200px] wkf:px-6">
                    <div data-wkf-reveal>
                        <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-[0.2em] wkf:text-violet-600">04 / My Toolkit</p>
                        <h2 className="wkf:mt-4 wkf:text-4xl wkf:font-extrabold wkf:tracking-tight wkf:sm:text-5xl">Skills<span className="wkf:text-violet-600">.</span></h2>
                        <p className="wkf:mt-4 wkf:max-w-xl wkf:text-sm wkf:leading-7 wkf:text-slate-500">A combination of creative thinking, technical knowledge, and a passion for continuous learning.</p>
                    </div>

                    <div className="wkf:mt-12 wkf:grid wkf:gap-5 wkf:sm:grid-cols-2 wkf:lg:grid-cols-3">
                        <div data-wkf-reveal data-wkf-delay="0" data-wkf-tilt="5" className="wkf:rounded-2xl wkf:border wkf:border-slate-100 wkf:bg-white wkf:p-6 wkf:shadow-sm wkf:hover:shadow-lg">
                            <div className="wkf:flex wkf:h-11 wkf:w-11 wkf:items-center wkf:justify-center wkf:rounded-xl wkf:bg-blue-100 wkf:text-xl wkf:text-blue-700">◈</div>
                            <h3 className="wkf:mt-5 wkf:font-extrabold">Frontend</h3>
                            <div className="wkf:mt-4 wkf:flex wkf:flex-wrap wkf:gap-2">
                                {['HTML / CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js'].map((skill) => (
                                    <span key={skill} className="wkf:rounded-lg wkf:bg-slate-50 wkf:px-2.5 wkf:py-2 wkf:text-xs wkf:text-slate-600 wkf:transition-colors wkf:hover:bg-blue-50 wkf:hover:text-blue-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div data-wkf-reveal data-wkf-delay="100" data-wkf-tilt="5" className="wkf:rounded-2xl wkf:border wkf:border-slate-100 wkf:bg-white wkf:p-6 wkf:shadow-sm wkf:hover:shadow-lg">
                            <div className="wkf:flex wkf:h-11 wkf:w-11 wkf:items-center wkf:justify-center wkf:rounded-xl wkf:bg-violet-100 wkf:text-xl wkf:text-violet-700">✧</div>
                            <h3 className="wkf:mt-5 wkf:font-extrabold">Design</h3>
                            <div className="wkf:mt-4 wkf:flex wkf:flex-wrap wkf:gap-2">
                                {['UI / UX', 'Figma', 'Prototyping', 'Design Systems'].map((skill) => (
                                    <span key={skill} className="wkf:rounded-lg wkf:bg-slate-50 wkf:px-2.5 wkf:py-2 wkf:text-xs wkf:text-slate-600 wkf:transition-colors wkf:hover:bg-violet-50 wkf:hover:text-violet-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="wkf-contact" className="wkf:relative wkf:z-10 wkf:px-6 wkf:pb-24 wkf:pt-12">
                <div data-wkf-reveal className="wkf:relative wkf:mx-auto wkf:max-w-[1200px] wkf:overflow-hidden wkf:rounded-[2rem] wkf:bg-gradient-to-br wkf:from-[#3447b8] wkf:via-[#6546c9] wkf:to-[#923fd0] wkf:px-8 wkf:py-16 wkf:text-center wkf:shadow-2xl wkf:shadow-violet-200/70 wkf:sm:px-16 wkf:sm:py-20">
                    <div className="wkf:animate-[wkf-spin-slow_24s_linear_infinite] wkf:absolute wkf:-right-20 wkf:-top-32 wkf:h-72 wkf:w-72 wkf:rounded-full wkf:border wkf:border-dashed wkf:border-white/20" />
                    <div className="wkf:animate-[wkf-spin-slow_24s_linear_infinite] wkf:absolute wkf:-bottom-40 wkf:-left-20 wkf:h-80 wkf:w-80 wkf:rounded-full wkf:border wkf:border-white/15" />
                    <div className="wkf:relative">
                        <p className="wkf:text-xs wkf:font-bold wkf:uppercase wkf:tracking-[0.25em] wkf:text-violet-200">05 / Get In Touch</p>
                        <h2 className="wkf:mx-auto wkf:mt-5 wkf:max-w-2xl wkf:text-4xl wkf:font-extrabold wkf:leading-tight wkf:tracking-tight wkf:text-white wkf:sm:text-6xl">Have a project in mind?</h2>
                        <p className="wkf:mx-auto wkf:mt-5 wkf:max-w-xl wkf:text-sm wkf:leading-7 wkf:text-violet-100 wkf:sm:text-base">I'm always open to discussing new ideas, creative collaborations, and interesting opportunities.</p>
                        <a
                            href="mailto:hello@example.com"
                            data-wkf-magnetic="0.3"
                            className="wkf:mt-9 wkf:inline-flex wkf:items-center wkf:gap-3 wkf:rounded-full wkf:bg-white wkf:px-8 wkf:py-4 wkf:text-sm wkf:font-extrabold wkf:text-violet-700 wkf:shadow-lg wkf:hover:bg-violet-50"
                        >
                            Say Hello <span className="wkf:text-lg">↗</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="wkf:relative wkf:z-10 wkf:border-t wkf:border-slate-200/80 wkf:bg-white/70 wkf:backdrop-blur-md">
                <div className="wkf:mx-auto wkf:flex wkf:max-w-[1200px] wkf:flex-col wkf:items-center wkf:justify-between wkf:gap-5 wkf:px-6 wkf:py-8 wkf:sm:flex-row">
                    <a href="#wkf-home" className="wkf:text-lg wkf:font-extrabold wkf:tracking-tight">A web creation toolkit for developers<span className="wkf:text-violet-600">.</span></a>
                    <p className="wkf:text-xs wkf:text-slate-400">&copy; 2026 WebKineForge.</p>
                    <div className="wkf:flex wkf:gap-5 wkf:text-xs wkf:font-semibold wkf:text-slate-500">
                        <a href="#" target="_blank" rel="noreferrer" className="wkf:transition-colors wkf:hover:text-violet-600">GitHub ↗</a>
                        <a href="#" target="_blank" rel="noreferrer" className="wkf:transition-colors wkf:hover:text-violet-600">LinkedIn ↗</a>
                        <a href="#" className="wkf:transition-colors wkf:hover:text-violet-600">Email ↗</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}