# GameRank - Games Ranking & Reviews Platform

A full-stack web application for browsing games, writing reviews, ranking games via community votes, and discussing games with comments and threaded replies. Built with React, Tailwind CSS, Node.js/Express, PostgreSQL, and the RAWG Video Games Database API.

## Features

- User registration/login with JWT authentication
- Browse and search games via RAWG API
- Filter games by genre, platform, and release year
- Game details page with screenshots, description, platforms, genres
- 1-5 star reviews with text
- Threaded comments with upvote/downvote
- Recommend / Not Recommend community voting
- Community rankings page (top games by net recommend score)
- User profiles with stats and review history
- Fully responsive UI with dark mode
- Pagination throughout
- Centralized error handling

## Tech Stack

**Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Axios, React Icons
**Backend:** Node.js, Express.js, PostgreSQL (pg), JWT, bcryptjs, express-validator
**External API:** RAWG Video Games Database API

## Project Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 13
- RAWG API key (free at https://rawg.io/apidocs)

### 1. Database Setup

```bash
createdb games_app
psql -d games_app -f backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and RAWG_API_KEY
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env if backend URL differs
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## API Endpoints

### Auth

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user (auth required)

### Games

- `GET /api/games` — List/search/filter games (query: page, pageSize, search, genres, platforms, year, ordering)
- `GET /api/games/:id` — Game details + community data
- `GET /api/games/genres` — List genres
- `GET /api/games/platforms` — List platforms
- `GET /api/games/top-ranked` — Community rankings

### Reviews

- `POST /api/reviews` — Create/update review (auth required)
- `GET /api/reviews/game/:gameId` — Get reviews for a game
- `DELETE /api/reviews/:id` — Delete review (auth required)

### Comments

- `POST /api/comments` — Create comment/reply (auth required)
- `GET /api/comments/game/:gameId` — Get comments for a game
- `PUT /api/comments/:id` — Update comment (auth required)
- `DELETE /api/comments/:id` — Delete comment (auth required)

### Votes

- `POST /api/votes/comments` — Upvote/downvote comment (auth required)
- `POST /api/votes/games` — Recommend/not recommend game (auth required)

### Users

- `GET /api/users/:username` — User profile + stats
- `GET /api/users/:username/reviews` — User's reviews
- `PUT /api/users/me` — Update own profile (auth required)

## Database Schema

See `backend/schema.sql` — includes `users`, `reviews`, `comments`, `comment_votes`, `game_votes` tables with proper foreign keys, constraints, and indexes.

## Folder Structure
