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
            <PrimaryMenu />

            <nav className="wkf-page-nav">
                <Logo />
            </nav>

            <Scenes coveredOpacity={0.35} coverOffset="50vh">
                <SceneItem>
                    <Hero3D nextSelector="#next-section" />
                </SceneItem>

                <SceneItem>
                    <Parallax />
                </SceneItem>

                <SceneItem>
                    <TextReveal />
                </SceneItem>

                <SceneItem>
                    <PricingCards />
                </SceneItem>

            </Scenes>

            <PhotoScatter />
            <ProductScroll />
            <Footer />
        </main>
    );
}