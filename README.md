# Nest Js + Typescript + MongoDB

This template provides a Nest Js application setup with MongoDB integration, including initial Auth Setup and Middleware.

## Cors Configuration

You can customize CORS settings in `src/main.ts`. By default, all requests are allowed.

```js
// src/main.ts
app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }),
);
```

## Authentication Middleware

Middleware is included to enforce authentication for routes using JSON Web Tokens (JWT) in the NestJS application.

You can add any route tu exclude the middleware here:

```js
// src/routerMiddleware/authMiddleware.route.ts
const excludedRoutes = [
    { path: 'users/signup', method: RequestMethod.POST },
    //...
];
```

## API Routes

-   **POST /users/signup**: Register a new user in the system.
-   **POST /users/signin**: Sign in to the system.
-   **GET /users/signout**: Sign out of the system.
-   **GET /users/verify-token**: Verify the provided access token.
-   **GET /users/find-from-admin/:id**: Retrieve user details by ID.
-   **POST /users/find-by-params**: Search for a user using multiple parameters.
-   **POST /users/find-by-email**: Search for a user by email address.
-   **POST /users/desactivate-user**: Deactivate a user in the system.

## Running the App

Create docker Image:

```bash
docker build -t [image-name] . -f DockerFile
```

Run the container:

```bash
docker run -p 3000:3000 -d [image-name]
```
