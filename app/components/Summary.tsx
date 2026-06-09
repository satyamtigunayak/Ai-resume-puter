const cls = (score: number) => score >= 70 ? "pass" : score >= 50 ? "mid" : "fail";
const label = (score: number) => score >= 70 ? "Strong" : score >= 50 ? "Average" : "Needs work";

const CategoryRow = ({ title, score }: { title: string; score: number }) => {
    const c = cls(score);
    return (
        <div className="rz-cat-row">
            <div className="rz-cat-lbl">
                <span className="rz-cat-name">{title}</span>
                <span className={`rz-badge rz-badge-${c}`} style={{ fontSize: "10px", padding: "2px 8px" }}>
                    {score}
                </span>
            </div>
            <div className="rz-track">
                <div className={`rz-fill rz-fill-${c}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const c = cls(feedback.overallScore);
    return (
        <div className="rz-score-panel">
            <div className="rz-score-hd">
                <div>
                    <div className="rz-score-eyebrow">Overall Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                        <span className={`rz-score-num ${c}`}>{feedback.overallScore}</span>
                        <span className="rz-score-denom">/ 100</span>
                    </div>
                </div>
                <div className={`rz-score-pill ${c}`}>{label(feedback.overallScore)}</div>
            </div>

            <div className="rz-track">
                <div className={`rz-fill rz-fill-${c}`} style={{ width: `${feedback.overallScore}%` }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <CategoryRow title="Tone & Style" score={feedback.toneAndStyle.score} />
                <CategoryRow title="Content"      score={feedback.content.score}      />
                <CategoryRow title="Structure"    score={feedback.structure.score}    />
                <CategoryRow title="Skills"       score={feedback.skills.score}       />
            </div>
        </div>
    );
};

export default Summary;
