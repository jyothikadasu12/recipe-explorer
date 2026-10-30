
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="page-container">
          Recipe Explorer · Discover, create, and save your favorites.
        </div>
      </footer>
    </div>
  );
}
