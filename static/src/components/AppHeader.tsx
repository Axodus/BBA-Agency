import { NavLink, useNavigate } from "react-router-dom";

export function AppHeader() {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <button
        className="wordmark button-reset"
        onClick={() => { void navigate("/"); }}
      >
        BBA Agency
      </button>
      <nav aria-label="Primary navigation">
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/deliveries">Deliveries</NavLink>
        <NavLink to="/ai-models">AI Models</NavLink>
      </nav>
      <div className="header-actions">
        <NavLink className="text-button" to="/projects">
          Sign in
        </NavLink>
        <NavLink className="button primary" to="/projects/new">
          Start a project
        </NavLink>
      </div>
    </header>
  );
}
