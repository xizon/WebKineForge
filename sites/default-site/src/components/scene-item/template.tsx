import './style.css';

/**
 * coveredOpacity fades only the covered part of the previous SceneItem.
 * This SceneItem stays at opacity 1.
 * coverOffset is the travel of this covering layer (px, vh, or %).
 * Omit either prop to use the value set on Scenes.
 */
export function Template({
    children,
    coveredOpacity,
    coverOffset,
}: {
    children?: any;
    coveredOpacity?: number;
    coverOffset?: number | string;
}) {
    return (
        <div
            className="wkf-scene-item"
            data-scene-item=""
            data-covered-opacity={coveredOpacity}
            data-cover-offset={coverOffset}
        >
            <div className="wkf-scene-item__panel">
                {children}
            </div>
        </div>
    );
}
