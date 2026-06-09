import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";

const cls = (score: number) => score >= 70 ? "pass" : score >= 50 ? "mid" : "fail";

const CatHeader = ({ title, score }: { title: string; score: number }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "8px" }}>
        <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ink)" }}>{title}</span>
        <span className={`rz-badge rz-badge-${cls(score)}`} style={{ fontSize: "10.5px" }}>
            {score}/100
        </span>
    </div>
);

const CatContent = ({ tips }: { tips: { type: "good" | "improve"; tip: string; explanation: string }[] }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
        {tips.map((t, i) => (
            <div key={i} className="rz-tip" style={{ alignItems: "flex-start" }}>
                <div className={`rz-tip-dot ${t.type === "good" ? "good" : "warn"}`} style={{ marginTop: "6px" }} />
                <div>
                    <p className="rz-tip-title">{t.tip}</p>
                    <p className="rz-tip-explain">{t.explanation}</p>
                </div>
            </div>
        ))}
    </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => (
    <div className="rz-score-panel" style={{ padding: 0, gap: 0, overflow: "hidden" }}>
        <Accordion>
            {[
                { id: "tone",      title: "Tone & Style", score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips },
                { id: "content",   title: "Content",      score: feedback.content.score,      tips: feedback.content.tips      },
                { id: "structure", title: "Structure",    score: feedback.structure.score,    tips: feedback.structure.tips    },
                { id: "skills",    title: "Skills",       score: feedback.skills.score,       tips: feedback.skills.tips       },
            ].map(({ id, title, score, tips }) => (
                <AccordionItem key={id} id={id}>
                    <AccordionHeader itemId={id}>
                        <CatHeader title={title} score={score} />
                    </AccordionHeader>
                    <AccordionContent itemId={id}>
                        <CatContent tips={tips} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
);

export default Details;
