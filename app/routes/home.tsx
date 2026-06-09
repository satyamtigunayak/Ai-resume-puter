import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Rezoom" },
        { name: "description", content: "AI-powered resume analysis & ATS scoring" },
    ];
}

export default function Home() {
    const { auth, kv, puterReady } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (!puterReady) return;
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated, puterReady]);

    useEffect(() => {
        if (!puterReady || !auth.isAuthenticated) return;
        const load = async () => {
            setLoadingResumes(true);
            const items = (await kv.list("resume:*", true)) as KVItem[];
            const parsed = items?.map((r) => JSON.parse(r.value) as Resume) ?? [];
            setResumes(parsed);
            setLoadingResumes(false);
        };
        load();
    }, [puterReady, auth.isAuthenticated]);

    return (
        <main className="rz-page">
            <Navbar />
            <div className="rz-home-wrap">
                {loadingResumes ? (
                    <div className="rz-loading">
                        <img src="/images/resume-scan-2.gif" style={{ width: 96, opacity: 0.45 }} alt="loading" />
                        <span className="rz-loading-label">loading resume...</span>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="rz-empty">
                        <div className="rz-empty-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                    stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2v6h6M12 18v-6M9 15h6"
                                    stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="rz-empty-title">No resume yet</div>
                        <div className="rz-empty-sub">
                            Upload your first resume to receive an ATS score and tailored AI feedback for your target role.
                        </div>
                        <Link to="/upload" className="rz-btn rz-btn-primary">
                            Analyze your first resume →
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="rz-home-hd">
                            <div>
                                <div className="rz-home-title">Your Resume</div>
                                <div className="rz-home-sub">{resumes.length} analyzed</div>
                            </div>
                            <Link to="/upload" className="rz-btn rz-btn-primary">
                                + Analyze new
                            </Link>
                        </div>
                        <div className="rz-grid">
                            {resumes.map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
