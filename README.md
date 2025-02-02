# Roadmap: Zero to Hero 🚀

[![React](https://img.shields.io/badge/React-18.3.1-%2361DAFB?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.2-%23000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9.5-%2347A248?logo=mongodb)](https://www.mongodb.com/)

A comprehensive roadmap and guidance platform designed to help developers progress from beginner to expert with structured pathways, quizzes, and project recommendations.

---

## Features 🌟

- **Interactive Roadmaps**  
  Well-structured paths to guide developers at every stage of their journey (refer to `roadmapController.js` lines 4-51).

- **Adaptive Quiz System**  
  Quizzes tailored to skill levels, with detailed performance tracking (check `quizRoutes.js` lines 10-87).

- **Project Recommendations**  
  AI-generated project ideas to match your skill level and interests (see `Projects.jsx` lines 13-90).

- **Progress Analytics**  
  Visualized progress tracking for deeper insights (view `Overview.jsx` lines 89-137).

- **Authentication**  
  Secure authentication using Clerk and JWT tokens (refer to `authMiddleware.js` lines 3-30).

- **Dark Mode**  
  Customizable themes with light and dark modes (see `index.css` lines 3-57).

---

## Tech Stack 💻

### **Frontend**
- React 18 + Vite for fast development
- Tailwind CSS with a custom theme system
- Redux Toolkit for state management
- Shadcn UI components for modern design
- Framer Motion for animations

### **Backend**
- Express.js 4 for building APIs
- MongoDB with Mongoose ODM for database management
- Node Cache for optimizing API performance
- Clerk for seamless authentication
- MIME-type handling for static assets

### **DevOps**
- Render.com for deployment
- MongoDB Atlas for scalable cloud database
- Environment-based CORS configurations
- Automated build scripts for CI/CD

---

## Project Structure 📁

```
├── backend
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth and error handlers
│   └── index.js        # Server entry point
│
├── frontend
│   ├── src/
│   │   ├── pages/      # Route components
│   │   ├── slicers/    # Redux state management
│   │   ├── components/ # Reusable UI elements
│   │   ├── lib/        # API clients
│   │   └── index.css   # Global styles
│   └── vite.config.js  # Vite configuration
```

---

## Contribution Guidelines 🤝

We welcome contributions from developers of all skill levels. Please follow these steps to contribute:

1. **Fork the Repository**: Create your own copy of the repository.
2. **Clone the Repository**: Clone the forked repository to your local machine.
3. **Create a Branch**: Work on a feature or fix in a dedicated branch.
4. **Make Your Changes**: Follow the existing code style and structure.
5. **Test Your Changes**: Ensure everything works as expected.
6. **Submit a Pull Request**: Describe your changes clearly in the PR.

---

## License 📜

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Let us know if you have any questions or suggestions. Happy coding! 🚀
