
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MyRecipesPage from "./pages/MyRecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/my-recipes" element={<MyRecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        </Route>

        <Route
          path="*"
          element={
            <main className="page-container" style={{ paddingTop: 50 }}>
              <h1>Page not found</h1>
              <a className="text-link" href="/">Return home</a>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
