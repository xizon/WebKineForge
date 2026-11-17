import './style.css';

/**
 * Defaults apply to every SceneItem that does not set its own values.
 * coveredOpacity: the covered part of the layer underneath. The covering layer stays at opacity 1.
 * coverOffset: how far the covering layer travels. Use px, vh, or %.
 */
export function Template({
    children,
    coveredOpacity = 0.4,
    coverOffset = '50vh',
}: {
    children?: any;
    coveredOpacity?: number;
    coverOffset?: number | string;
}) {
    return (
        <div
            className="wkf-scenes"
            data-covered-opacity={coveredOpacity}
            data-cover-offset={coverOffset}
        >
            {children}
        </div>
    );
}
