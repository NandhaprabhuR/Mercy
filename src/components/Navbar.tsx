import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-logo-text brand-font">PEAK</span>
        <span className="brand-subtext">SOCIAL</span>
      </div>
      <div className="nav-links">
        <a href="#feed" className="active">Feed</a>
        <a href="#explore">Explore</a>
        <a href="#profile">Profile</a>
      </div>
    </nav>
  );
}
