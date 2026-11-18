import './style.css';

type PricingPlan = {
    name: string;
    price: string;
    cadence: string;
    summary: string;
    features: string[];
    action: string;
    href: string;
    featured?: boolean;
};

type PricingCardsProps = {
    kicker?: string;
    title?: string;
    description?: string;
    plans?: PricingPlan[];
};

const defaultPlans: PricingPlan[] = [];

export function Template({
    plans = defaultPlans,
}: PricingCardsProps) {
    return (
        <section className="wkf-pricing-cards">
            <div className="wkf-pricing-cards__inner">

                <header className="wkf-pricing-cards__header">
                    <p className="wkf-pricing-cards__kicker">
                        Plans
                    </p>
                    <h2 className="wkf-pricing-cards__title">
                        Choose a pace
                    </h2>
                    <p className="wkf-pricing-cards__description">
                        Three ways to publish interactive pages. The cards arrive in order once they enter view.
                    </p>
                </header>

                <div className="wkf-pricing-cards__grid">
                    {plans.map((plan) => {
                        const cardClass = plan.featured
                            ? 'wkf-pricing-cards__card wkf-pricing-cards__card--featured'
                            : 'wkf-pricing-cards__card';

                        return (
                            <article
                                key={plan.name}
                                className={cardClass}
                            >
                                <div className="wkf-pricing-cards__meta">
                                    <h3 className="wkf-pricing-cards__name">
                                        {plan.name}
                                    </h3>
                                    {plan.featured ? (
                                        <span className="wkf-pricing-cards__badge">
                                            Featured
                                        </span>
                                    ) : null}
                                </div>

                                <p className="wkf-pricing-cards__price">
                                    {plan.price}
                                    <span className="wkf-pricing-cards__cadence">
                                        {plan.cadence}
                                    </span>
                                </p>

                                <p className="wkf-pricing-cards__summary">
                                    {plan.summary}
                                </p>

                                <ul className="wkf-pricing-cards__features">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="wkf-pricing-cards__feature"
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={plan.href}
                                    className="wkf-pricing-cards__action"
                                >
                                    {plan.action}
                                </a>
                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
