import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'Rezoom | Sign In' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="rz-auth-page">
            <div className="rz-auth-card">
                {/* Logo */}
                <div className="rz-auth-logo">
                    <span className="rz-logo-dot" />
                    Rezoom
                </div>

                {/* Tagline */}
                <p className="rz-auth-tagline">
                    AI-powered resume analysis<br />& ATS scoring
                </p>

                <div className="rz-auth-rule" />

                {/* Sign-in */}
                {isLoading ? (
                    <div className="rz-auth-spinner-row">
                        <div className="rz-spinner" />
                        signing you in...
                    </div>
                ) : auth.isAuthenticated ? (
                    <button className="rz-auth-btn" onClick={auth.signOut}>
                        <div className="rz-puter-badge">P</div>
                        Sign Out
                    </button>
                ) : (
                    <button className="rz-auth-btn" onClick={auth.signIn}>
                        <div className="rz-puter-badge">P</div>
                        Continue with Puter
                    </button>
                )}

                {/* Trust note */}
                <div className="rz-auth-footnote">
                    Your resume data is stored privately in your Puter account.<br />
                    No passwords. No tracking. Only you can access it.
                </div>
            </div>
        </main>
    );
}

export default Auth;
