# Nest Js + Typescript + MongoDB

This template provides a Nest Js application setup with MongoDB integration, including initial Auth Setup and Middleware.

## Enviroments

1. **NODE_ENV -** Current Enviroment (development/production)
2. **PORT -** App Port
3. **JWT_SECRET -** Json Web Token Secret to generate sign token
4. **BASE_DB_URI -** MongoDB Database URI

## Generar Secrets

To generate `JWT_SECRET` using OpenSSL and condify it in base64, you can execute the follow command:

```bash
openssl rand -base64 32
```

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

-   **POST /users/sign-up**: Register a new user in the system.
-   **POST /users/sign-in**: Sign in to the system.
-   **GET /users/sign-out**: Sign out of the system.
-   **GET /users/find**: Find a user in the system (ADMIN)
-   **GET /users/find-many**: Find many users in the system (ADMIN)
-   **GET /users/verify-token**: Verify the provided access token.
-   **POST /users/deactivate-user**: Deactivate a user in the system (ADMIN)

## Running the App

Create docker Image:

```bash
docker build -t [image-name] . -f DockerFile
```

Run the container:

```bash
docker run -p 3000:3000 -d [image-name]
```
