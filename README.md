# YelpCamp

A production-ready full-stack web application for discovering, creating, and reviewing campgrounds. This version has been **significantly redesigned, refactored, and optimised** for performance, usability, and deployment.

![YelpCamp Home Page](./screenshots/home.png)
---

## Live Demo

**Hosted on Render:** *https://yelpcamp-7bl3.onrender.com/*

---

## Screenshots

## Screenshots

![Campgrounds Index](./screenshots/index.png)
![Campground Detail](./screenshots/show-page.png)



---

## Tech Stack

### Frontend

* HTML5
* CSS3
* Bootstrap
* EJS templating

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Auth & Security

* Passport.js (local strategy)
* Express-session
* Authorization middleware

### Maps & Media

* **MapTiler SDK** (replacing Mapbox for optimised mapping)
* Cloudinary (image hosting & optimisation)

### Deployment

* Render (Node service)
* MongoDB Atlas

---

## Core Features

### Campgrounds

* Create, edit, and delete campgrounds
* Upload multiple images per campground
* View campground details with interactive map

![New Campground Form](./screenshots/new-campground.png)

### Reviews

* Add and delete reviews
* One-review-per-user restriction
* Average rating calculation

![Review Section](./screenshots/reviews.png)

### Authentication & Authorization

* User registration and login
* Session-based authentication
* Resource ownership enforcement

![Register Page](./screenshots/register.png)

### Maps

* Interactive maps with clustering and popups
* Optimised data handling for fast map load
* Auto-fit bounds with capped zoom to enhance usability

---

## Key Enhancements & Engineering Decisions

### UI / UX Overhaul

* Redesigned campground card layout for clarity and visual hierarchy
* Applied a **custom, cohesive color palette** for consistent styling
* Improved spacing, typography, and overall component consistency
* Reduced visual clutter while preserving full functionality

### Map Provider Migration & Performance Optimisation

* Replaced Mapbox with **MapTiler** for cost-effective, high-performance maps
* Preprocessed GeoJSON data to send only essential geometry and popup content
* Tuned cluster radius and zoom limits for smoother interaction with large datasets
* Implemented intelligent auto-fit bounds with max zoom to prevent over-zooming

### Codebase & Deployment Improvements

* Cleaned up unused middleware and legacy code paths
* Improved environment variable handling for production safety
* Hardened error handling to prevent silent failures
* Verified stable deployment on Render with MongoDB Atlas

---

## Environment Variables

```env
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
MAPTILER_API_KEY=
SESSION_SECRET=
```

---

## Local Setup

```bash
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## Roadmap / Future Enhancements

* Client-side form validation
* Lazy-loading images
* Pagination for campgrounds
* Role-based permissions (admin/moderator)
* UI refresh with modern component library

---

*Built, refactored, and deployed by Matthew Monaghan*
