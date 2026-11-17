import './style.css';

type PhotoTile = {
    color: string;
    src?: string;
    alt?: string;
    depth?: number;
    shift?: number;
    label?: string;
};

type PhotoScatterProps = {
    tiles?: PhotoTile[];
};

const defaultTiles: PhotoTile[] = [
    { color: '#241c18', depth: 0.55, shift: -0.7, label: 'Image 01' },
    { color: '#102028', depth: 0.22, shift: 0.85, label: 'Image 02' },
    { color: '#2a1822', depth: 0.86, shift: 0.4, label: 'Image 03' },
];

const slots = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

export function Template({
    tiles = defaultTiles,
}: PhotoScatterProps) {
    return (
        <section className="wkf-photo-scatter">
            <header className="wkf-photo-scatter__header">
                <div>
                    <h2 className="wkf-photo-scatter__title">Simple, enjoy it!</h2>
                </div>
                <p className="wkf-photo-scatter__lede">No React, Vue, or other front-end frameworks required at runtime, and no framework-specific syntax or APIs to learn.</p>
                <span className="wkf-photo-scatter__mark" aria-hidden="true"></span>
            </header>

            <div className="wkf-photo-scatter__board">
                {tiles.map((tile, index) => {
                    const slot = slots[index] ?? 'x';
                    return (
                        <figure
                            key={`${tile.label ?? tile.color}-${index}`}
                            className={`wkf-photo-scatter__tile wkf-photo-scatter__tile--${slot}`}
                            data-parallax={tile.depth ?? 0.4}
                            data-shift={tile.shift ?? 0}
                        >
                            {tile.src ? (
                                <img src={tile.src} alt={tile.alt ?? ''} />
                            ) : (
                                <span
                                    className="wkf-photo-scatter__field"
                                    style={{ background: tile.color }}
                                ></span>
                            )}
                            <figcaption>{tile.label ?? `Image ${String(index + 1).padStart(2, '0')}`}</figcaption>
                        </figure>
                    );
                })}
            </div>
        </section>
    );
}
