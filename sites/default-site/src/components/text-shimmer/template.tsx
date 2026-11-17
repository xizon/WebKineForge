
import './style.css';

type TextShimmerProps = {
    children?: any;
};

export function Template({
    children
}: TextShimmerProps) {
    return (
        <span className="wkf-text-shimmer">
            {children}
        </span>
    );
}
