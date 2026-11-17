
import './style.css';

export function Template() {
    return (
        <section className="wkf-product">
            <div className="wkf-product__sticky">
                <div className="wkf-product__text">
                    <h2 className="wkf-product__title">
                        Every detail has a&nbsp;
                        <em>purpose.</em>
                    </h2>

                    <p>
                        Bringing static website development back to the joy of creation.
                    </p>
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
