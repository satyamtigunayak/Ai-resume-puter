const cls = (score: number) => score >= 70 ? "pass" : score >= 50 ? "mid" : "fail";

const atsLabel = (score: number) => {
    if (score >= 70) return "Strong match";
    if (score >= 50) return "Partial match";
    return "Weak match";
};

interface Suggestion { type: "good" | "improve"; tip: string; }
interface ATSProps    { score: number; suggestions: Suggestion[]; }

const ATS = ({ score, suggestions }: ATSProps) => {
    const c = cls(score);
    return (
        <div className="rz-score-panel">
            <div className="rz-score-hd">
                <div>
                    <div className="rz-score-eyebrow">ATS Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                        <span className={`rz-score-num ${c}`}>{score}</span>
                        <span className="rz-score-denom">/ 100</span>
                    </div>
                </div>
                <div className={`rz-score-pill ${c}`}>{atsLabel(score)}</div>
            </div>

            <div className="rz-track">
                <div className={`rz-fill rz-fill-${c}`} style={{ width: `${score}%` }} />
            </div>

            {suggestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {suggestions.map((s, i) => (
                        <div key={i} className="rz-tip">
                            <div className={`rz-tip-dot ${s.type === "good" ? "good" : "warn"}`} />
                            <p className="rz-tip-body">{s.tip}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ATS;
