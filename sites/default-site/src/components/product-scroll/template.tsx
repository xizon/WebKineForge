
import './style.css';

type ProductScrollProps = {
    title?: string;
    accent?: string;
    description?: string;
};

export function Template({
    title = '',
    accent = '',
    description = '',
}: ProductScrollProps) {
    return (
        <section className="wkf-product">
            <div className="wkf-product__sticky">
                <div className="wkf-product__text">
                    {title || accent ? (
                        <h2 className="wkf-product__title">
                            {title}
                            {title && accent ? '\u00a0' : ''}
                            {accent ? <em>{accent}</em> : null}
                        </h2>
                    ) : null}

                    {description ? (
                        <p>
                            {description}
                        </p>
                    ) : null}
                </div>

                <div
                    className="wkf-product__object"
                    aria-hidden="true"
                >
                    <div className="wkf-product__ring wkf-product__ring--a"></div>

                    <div className="wkf-product__ring wkf-product__ring--b"></div>

                    <div className="wkf-product__main"></div>
                </div>
            </div>
        </section>
    );
}
