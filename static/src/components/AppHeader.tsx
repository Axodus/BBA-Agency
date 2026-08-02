import { NavLink, useNavigate } from "react-router-dom";
import { agencyProducts } from "../content/products/index.js";

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
        <div className="app-header-nav-group">
          <NavLink to="/services" className="app-header-nav-trigger">
            Services
          </NavLink>
          <div className="app-header-submenu" aria-label="Services submenu">
            <p className="app-header-submenu-kicker">Direct access</p>
            <ul>
              {agencyProducts.map((product) => (
                <li key={product.id}>
                  <NavLink to={product.route}>{product.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/deliveries">Deliveries</NavLink>
        <NavLink to="/ai-models">AI Models</NavLink>
      </nav>
      <div className="header-actions">
        <NavLink className="text-button" to="https://docs.axodus.country/bba-agency/overview">
          Docs
        </NavLink>
        <NavLink className="button primary" to="https://dev.bba.country">
          App dev preview
        </NavLink>
      </div>
    </header>
  );
}
