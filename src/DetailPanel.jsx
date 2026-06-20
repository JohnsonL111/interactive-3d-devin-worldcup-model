export default function DetailPanel({ data, onClose }) {
    if (!data) return null;
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: 300,
                background: "rgba(8,18,36,0.97)",
                borderLeft: "0.5px solid rgba(201,169,106,0.3)",
                padding: "28px 22px",
                overflowY: "auto",
                zIndex: 100,
                animation: "slideIn 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
        >
            <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "none",
                    border: "none",
                    color: "#C9A96A",
                    fontSize: 20,
                    cursor: "pointer",
                }}
            >
                ✕
            </button>
            <p
                style={{
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "#C9A96A",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                }}
            >
                {data.eyebrow}
            </p>
            <h2
                style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#fff",
                    margin: "0 0 14px",
                }}
            >
                {data.title}
            </h2>
            {data.imgPreview && (
                <img
                    src={data.imgPreview}
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        marginBottom: 16,
                        border: "0.5px solid rgba(255,255,255,0.08)",
                    }}
                />
            )}
            {data.svgPreview && (
                <div
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        marginBottom: 16,
                        overflow: "hidden",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                    }}
                    dangerouslySetInnerHTML={{ __html: data.svgPreview }}
                />
            )}
            <p
                style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.75,
                    margin: "0 0 20px",
                }}
            >
                {data.desc}
            </p>
            <div
                style={{
                    borderTop: "0.5px solid rgba(255,255,255,0.08)",
                    paddingTop: 12,
                }}
            >
                {data.specs.map(([key, val]) => (
                    <div
                        key={key}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "7px 0",
                            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                            fontSize: 12,
                        }}
                    >
                        <span style={{ color: "rgba(255,255,255,0.45)" }}>
                            {key}
                        </span>
                        <span style={{ color: "#fff", fontWeight: 500 }}>
                            {val}
                        </span>
                    </div>
                ))}
            </div>
            {data.swatches?.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 20,
                        flexWrap: "wrap",
                    }}
                >
                    {data.swatches.map((hex) => (
                        <div
                            key={hex}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: hex,
                                border: "1.5px solid rgba(255,255,255,0.18)",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
