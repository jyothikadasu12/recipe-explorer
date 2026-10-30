 
# 🍳 Recipe Explorer – Full Stack Application

A full-stack recipe discovery and management application built using **React, TypeScript, FastAPI, SQLAlchemy, and PostgreSQL**. Users can explore recipes from TheMealDB, search for meals, view detailed cooking instructions, create their own recipes, and manage their personal recipe collection.

---

## 📌 Project Overview

Recipe Explorer is designed to make discovering, organizing, and managing recipes simple.

The application integrates an external recipe API with a PostgreSQL database through a FastAPI backend. The React frontend communicates with the backend using REST APIs.

### Main Objectives

- Discover recipes from an external recipe provider.
- Search recipes by name.
- View recipe details, ingredients, and cooking instructions.
- Create and manage custom recipes.
- Store recipe information in PostgreSQL.
- Separate externally sourced recipes from custom recipes.
- Provide a responsive and user-friendly interface.

---

## ✨ Features

### 1. Home Page
- Recipe Explorer landing page.
- Navigation to Explore Recipes and My Recipes.
- Recently saved recipes section.
- Quick access to recipe discovery.

### 2. Explore Recipes
- Search recipes using TheMealDB API.
- Display recipe images and descriptions.
- Browse available recipes.
- View recipe categories and cuisine information.
- Pagination for recipe results.
- Open individual recipe details.

### 3. Recipe Details
- Display recipe title and image.
- Show ingredients and quantities.
- Display cooking instructions.
- Show preparation time and cooking time.
- Display serving information and difficulty.
- Edit saved recipes.

### 4. My Recipes
- View recipes stored in PostgreSQL.
- Manage custom recipes.
- Access saved and favorite recipes.
- Delete recipes from the collection.

### 5. Recipe Management
- Create custom recipes.
- Update existing recipes.
- Delete recipes.
- Store recipe information in PostgreSQL.
- Retrieve recipes using their database IDs.

### 6. External API Integration
- Integrate TheMealDB API.
- Search external recipes.
- Import recipes into PostgreSQL.
- Avoid duplicate external recipes using their external IDs.
- Track imported and custom recipes separately.

### 7. Backend and Database
- REST API development using FastAPI.
- Database integration using SQLAlchemy ORM.
- PostgreSQL for persistent storage.
- Pydantic schemas for request validation and response serialization.
- CORS configuration for frontend-backend communication.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI development |
| TypeScript | Type safety |
| Vite | Frontend development and build tool |
| React Router | Client-side routing |
| Lucide React | Icons |
| CSS3 | Styling and responsive design |
| Python | Backend programming |
| FastAPI | REST API development |
| SQLAlchemy | Database ORM |
| Pydantic | Data validation |
| PostgreSQL | Relational database |
| TheMealDB | External recipe data |
| HTTPX | External API requests |
| Uvicorn | ASGI server |

---

## 📂 Project Structure

```text
recipe-explorer/
│
├── recipe-explorer-frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── app/
│   │   │
│   │   ├── components/
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeForm.tsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   ├── MyRecipesPage.tsx
│   │   │   └── RecipeDetailsPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── recipeService.ts
│   │   │
│   │   ├── types/
│   │   │   └── recipe.ts
│   │   │
│   │   ├── styles/
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── recipe-explorer-backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── recipes.py
│   │   │       └── external.py
│   │   │
│   │   ├── core/
│   │   │   └── config.py
│   │   │
│   │   ├── db/
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │   └── recipe.py
│   │   │
│   │   ├── schemas/
│   │   │   └── recipe.py
│   │   │
│   │   ├── repositories/
│   │   │   └── recipe_repository.py
│   │   │
│   │   ├── services/
│   │   │   └── mealdb_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── .env
│   └── requirements.txt
│
└── README.md
```

*Note: The structure above represents the main application modules. Adjust filenames if your local project contains additional files.*

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10+
- PostgreSQL
- Git

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd recipe-explorer
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### Step 2: Set Up PostgreSQL

Open PostgreSQL or pgAdmin.

Create a database:

```sql
CREATE DATABASE recipe_explorer;
```

The application uses SQLAlchemy to create the configured database tables when the backend starts.

### Step 3: Set Up the Backend

Navigate to the backend directory:

```bash
cd recipe-explorer-backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Step 4: Configure Backend Environment Variables

Create a `.env` file inside `recipe-explorer-backend`.

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/recipe_explorer

FRONTEND_URL=http://localhost:5173

THEMEALDB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 5: Start the Backend Server

Run:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

### Step 6: Set Up the Frontend

Open another terminal.

Navigate to:

```bash
cd recipe-explorer-frontend
```

Install dependencies:

```bash
npm install
```

### Step 7: Configure Frontend Environment Variables

Create a `.env` file inside `recipe-explorer-frontend`.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Step 8: Start the Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🔗 API Endpoints

### Recipe Management APIs

Base URL:

```text
http://127.0.0.1:8000
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend welcome message |
| GET | `/health` | Check backend health |
| GET | `/api/recipes` | Retrieve all recipes |
| GET | `/api/recipes/my` | Retrieve personal recipes |
| GET | `/api/recipes/stats` | Retrieve recipe statistics |
| GET | `/api/recipes/{recipe_id}` | Retrieve a recipe by database ID |
| POST | `/api/recipes` | Create a custom recipe |
| PUT | `/api/recipes/{recipe_id}` | Update a recipe |
| DELETE | `/api/recipes/{recipe_id}` | Delete a recipe |

### External Recipe APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/external/search?q=pasta` | Search external recipes |
| POST | `/api/external/import-all` | Import recipes from TheMealDB |

---

## 🔄 Application Workflow

```text
                  USER
                    |
                    v
             REACT FRONTEND
                    |
          +---------+----------+
          |                    |
          v                    v
      Explore Page         My Recipes
          |                    |
          v                    v
      Search Recipe       Fetch Saved Data
          |
          v
       FASTAPI BACKEND
          |
     +----+----------+
     |               |
     v               v
 TheMealDB API   PostgreSQL
     |               |
     v               v
 External Data    Stored Recipes
     |               |
     +-------+-------+
             |
             v
       JSON RESPONSE
             |
             v
       REACT FRONTEND
             |
             v
       DISPLAY RESULTS
```

### Data Flow Explanation

1. The user interacts with the React frontend.
2. React Router navigates between application pages.
3. The frontend service sends HTTP requests to FastAPI.
4. FastAPI processes the request.
5. SQLAlchemy communicates with PostgreSQL.
6. For external searches, the backend communicates with TheMealDB using HTTPX.
7. External recipe information is validated and saved or updated in PostgreSQL.
8. FastAPI returns JSON responses.
9. React updates the UI with the returned data.

---

## 🗄️ Database Management

PostgreSQL stores the recipe information.

The recipe model contains fields such as:

| Field | Description |
|---|---|
| id | Primary key generated by the database |
| external_id | Identifier from TheMealDB |
| title | Recipe name |
| description | Recipe description |
| category | Recipe category |
| cuisine | Cuisine or area |
| image_url | Recipe image URL |
| ingredients | Recipe ingredients |
| instructions | Cooking instructions |
| prep_time_minutes | Preparation time |
| cook_time_minutes | Cooking time |
| servings | Number of servings |
| difficulty | Recipe difficulty |
| source | External or custom |
| is_favorite | Favorite status |
| created_at | Recipe creation timestamp |

*The exact fields depend on the current SQLAlchemy model and schema.*

### Check Database Records

Run these queries in pgAdmin:

```sql
SELECT * FROM recipes;
```

Count all recipes:

```sql
SELECT COUNT(*) FROM recipes;
```

Count recipes by source:

```sql
SELECT source, COUNT(*)
FROM recipes
GROUP BY source;
```

Check favorite recipes:

```sql
SELECT *
FROM recipes
WHERE is_favorite = TRUE;
```

---

## 🧪 Testing the Application

### Test Backend

Open:

```text
http://127.0.0.1:8000/docs
```

Test the available API endpoints using Swagger UI.

### Test Frontend

Open:

```text
http://localhost:5173
```

Verify the following:

- Home page loads successfully.
- Explore page displays recipes.
- External recipe search works.
- Recipe details open correctly.
- Custom recipes can be created.
- Recipes can be edited and deleted.
- My Recipes displays the intended saved recipes.
- Data persists after refreshing the application.

### Test Database Connection

Create a recipe through the frontend and verify that it appears in PostgreSQL.

---

## 🔐 Environment Variable Security

Never upload your actual `.env` files or database credentials to GitHub.

Add these entries to `.gitignore`:

```gitignore
.env
.env.*
!.env.example

.venv/
venv/

node_modules/
dist/

__pycache__/
*.pyc
.pytest_cache/
```

Create `.env.example` files containing placeholder values so other developers can configure the application.

---

## 🚀 Future Enhancements

- User authentication and authorization.
- Individual user recipe collections.
- Advanced filtering by cuisine and category.
- Recipe ratings and reviews.
- Meal planning and weekly schedules.
- Shopping list generation.
- Recipe image uploads.
- Automated backend and frontend testing.
- Docker-based deployment.
- Cloud deployment.

---

## 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

- React component-based development.
- TypeScript interfaces and type safety.
- React Router navigation.
- REST API integration.
- FastAPI backend development.
- Python application structure.
- SQLAlchemy ORM operations.
- PostgreSQL database connectivity.
- CRUD operations.
- External API integration.
- Environment variable management.
- Frontend-backend communication.
- Full-stack application architecture.

---

## 👩‍💻 Author

**Jyothika Dasu**

Full Stack Developer – Python & React

---

## 📄 License

This project is developed for learning and educational purposes.

External recipe data is provided by [TheMealDB](https://www.themealdb.com/). Please follow its applicable usage terms.
