# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# HouseHunt Admin Dashboard

## Authentication (Updated)

- The admin dashboard now uses secure, HttpOnly cookies for authentication and session management.
- JWT tokens are set as cookies by the backend on login and are not stored in localStorage.
- All API requests use `withCredentials: true` (axios) to ensure cookies are sent with each request.
- Logging out clears the authentication cookie via the `/api/admin/logout` endpoint.
- This approach improves security and protects tokens from XSS attacks.
