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

## Running with Docker Compose

Create docker Image with Docker Compose:

```bash
docker-compose up --build
```

> By default, the environment is `development`. You can change the env using the `ENV` variable.

```bash
ENV=production docker-compose up --build
```

> To run mongo service with docker compose locally, you need to add `--profile local` to the command.

**Important:** If you want to run mongo service with docker compose locally, remember to change the mongo URI in env file.
To use the mongo service container.

> BASE_DB_URI=mongodb://localhost:27017/base **(Local)** to BASE_DB_URI=mongodb://mongo:27017/base **(Container)**

```bash
docker-compose up --build --profile local
```

## Running with Yarn

Install dependencies:

```bash
yarn install
```

Run the app:

> You can change the environment changing the command:

```bash
yarn start:dev
```

```bash
yarn start:prod
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

### Users

-   **POST /users/sign-up**: Register a new user in the system.
-   **POST /users/sign-in**: Sign in to the system.
-   **GET /users/sign-out**: Sign out of the system.
-   **GET /users/find**: Find a user in the system (ADMIN)
-   **GET /users/find-many**: Find many users in the system (ADMIN)
-   **GET /users/verify-token**: Verify the provided access token.
-   **POST /users/deactivate-user**: Deactivate a user in the system (ADMIN)

### Workspace

-   **POST /workspace/**: Create a new workspace in the system.
-   **GET /workspace/**: Get a workspace in the system (ADMIN)
