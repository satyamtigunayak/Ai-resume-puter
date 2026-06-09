import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const badgeClass = (score: number) => {
    if (score >= 70) return "rz-badge rz-badge-pass";
    if (score >= 50) return "rz-badge rz-badge-mid";
    return "rz-badge rz-badge-fail";
};

const ThumbPlaceholder = () => (
    <div className="rz-thumb-sketch">
        <div className="rz-sk-line accent" />
        <div style={{ height: 5 }} />
        <div className="rz-sk-line w100" />
        <div className="rz-sk-line w75" />
        <div className="rz-sk-line w55" />
        <div style={{ height: 3 }} />
        <div className="rz-sk-line w100" />
        <div className="rz-sk-line w75" />
        <div style={{ height: 3 }} />
        <div className="rz-sk-line w100" />
        <div className="rz-sk-line w55" />
    </div>
);

const ResumeCard = ({
    resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
    resume: Resume;
}) => {
    const { fs } = usePuterStore();
    const [thumbUrl, setThumbUrl] = useState("");

    useEffect(() => {
        const load = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            setThumbUrl(URL.createObjectURL(blob));
        };
        load();
    }, [imagePath]);

    const score = feedback?.ATS?.score ?? feedback?.overallScore ?? 0;

    return (
        <Link to={`/resume/${id}`} className="rz-resume-card">
            <div className="rz-thumb">
                {thumbUrl ? (
                    <img src={thumbUrl} alt="résumé preview" />
                ) : (
                    <ThumbPlaceholder />
                )}
            </div>
            <div className="rz-card-body">
                <div>
                    <div className="rz-card-co">{companyName || "No company"}</div>
                    <div className="rz-card-role">{jobTitle || "Untitled resume"}</div>
                </div>
                <div className="rz-card-foot">
                    <span className={badgeClass(score)}>ATS {score}</span>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
