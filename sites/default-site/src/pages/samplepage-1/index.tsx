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
                <Logo />
            </nav>

            <Scenes coveredOpacity={1} coverOffset="50vh">
                <SceneItem>
                    <Hero3D nextSelector="#next-section" />
                </SceneItem>

                <SceneItem coveredOpacity={0.35}>
                    <Parallax />
                </SceneItem>

                <SceneItem>
                    <TextReveal />
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

            <PhotoScatter />
            <ProductScroll />
            <Footer />
        </main>
    );
}