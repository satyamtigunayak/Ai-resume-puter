import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();
    const initials = auth.user?.username
  ? auth.user.username
      .trim()
      .split(" ")
      .filter(Boolean)
      .map(name => name[0].toUpperCase())
      .reduce((result, current, index, arr) => {
        if (arr.length === 1) return current;
        if (index === 0) return current;
        if (index === arr.length - 1) return result + current;
        return result;
      }, "")
  : "??";

    return (
        <nav className="rz-nav">
            <Link to="/" className="rz-logo">
                <span className="rz-logo-dot" />
                
                Rezoom
            </Link>
            

<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {auth.isAuthenticated && (
        <Link to="/auth" style={{ textDecoration: "none" }}>
            <div className="rz-avatar" title={auth.user?.username}>
                {initials}
            </div>
        </Link>
    )}
</div>
            
        </nav>
    );
};

export default Navbar;
