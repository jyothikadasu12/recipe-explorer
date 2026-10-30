
import { ChefHat, BookMarked, Compass, House } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner page-container">
        <Link to="/" className="navbar-brand" aria-label="Recipe Explorer home">
          <span className="navbar-logo">
            <ChefHat size={23} />
          </span>
          <span>
            Recipe<span className="brand-highlight">Explorer</span>
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/" end className="navbar-link">
            <House size={17} />
            Home
          </NavLink>
          <NavLink to="/explore" className="navbar-link">
            <Compass size={17} />
            Explore
          </NavLink>
          <NavLink to="/my-recipes" className="navbar-link">
            <BookMarked size={17} />
            My Recipes
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
