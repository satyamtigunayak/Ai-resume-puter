import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Rezoom | Review' },
    { name: 'description', content: 'Detailed overview of your application' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv, puterReady } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!puterReady) return;
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, puterReady]);

    useEffect(() => {
        if (!puterReady) return;
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;
            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            setResumeUrl(URL.createObjectURL(new Blob([resumeBlob], { type: 'application/pdf' })));

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            setImageUrl(URL.createObjectURL(imageBlob));

            setFeedback(data.feedback);
        }
        loadResume();
    }, [id, puterReady]);

    return (
        <main className="rz-page">
            {/* Top bar */}
            <nav className="rz-detail-nav">
                <Link to="/" className="rz-logo">
                    <span className="rz-logo-dot" />
                    Rezoom
                </Link>
                <Link to="/" className="rz-btn rz-btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>
                    ← Dashboard
                </Link>
            </nav>

            {!feedback ? (
                <div className="rz-scanning">
                    <img src="/images/resume-scan-2.gif" style={{ width: 150, opacity: 0.55 }} alt="scanning" />
                    <span className="rz-status-text">analyzing resume…</span>
                </div>
            ) : (
                <div className="rz-detail-body">
                    {/* Left — resume preview */}
                    <div className="rz-preview-col">
                        {imageUrl && resumeUrl ? (
                            <>
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%' }}>
                                    <div className="rz-preview-wrap">
                                        <img src={imageUrl} alt="résumé preview" />
                                    </div>
                                </a>
                                <span className="rz-preview-hint">click to open PDF</span>
                            </>
                        ) : (
                            <div style={{
                                width: '100%', height: 260,
                                background: 'var(--cream-deep)',
                                borderRadius: 8, border: '1px solid var(--rule)'
                            }} />
                        )}
                    </div>

                    {/* Right — analysis */}
                    <div className="rz-analysis-col">
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                        <Details feedback={feedback} />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Resume;
