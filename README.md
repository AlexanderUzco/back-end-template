## Nest Js + Typescript + MongoDB

This is a template of the Nest Js aplication with MongoDB and initial Auth Setup and Middleware.

## Cors

You can update the CORS configuration, by default allow all request:

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

## Authentication Middleware:

The provided code includes middleware configuration to enforce authentication for routes using JSON Web Tokens (JWT) in a NestJS application.

Middleware Configuration:
The configure method applies the AuthMiddleware to all routes except those listed in the exclusion list.

Auth Middleware:
The AuthMiddleware intercepts incoming requests, extracting JWT tokens from the authorization header. If a valid token is found, it verifies the user's session and attaches user information to the request object.

Excluded Routes:
Certain routes, such as user signup, signin, and others, are excluded from authentication to allow unrestricted access. These routes are specified in the excludedRoutes array.

## API Routes

-   **POST /users/signup**: Registers a new user in the system. Uses the `CreateUserDto` to create a new user in the database and returns a JWT token for authentication.

-   **POST /users/signin**: Allows an existing user to sign in to the system. Utilizes the `SigninDto` to verify user credentials and returns a JWT token for authentication.

-   **GET /users/signout**: Enables a logged-in user to sign out of the system. Invalidates the associated access token.

-   **GET /users/verify-token**: Verifies if the provided access token is valid and associated with an authenticated user.

-   **GET /users/find-from-admin/:id**: Retrieves user details by their ID, primarily intended for use by administrators.

-   **POST /users/find-by-params**: Searches for a user using multiple search parameters, specified via the `FindOneByParamsDto`.

-   **POST /users/find-by-email**: Searches for a user by their email address, specified via the `FindByEmailDto`.

-   **POST /users/desactivate-user**: Deactivates a user in the system, identified by their ID. Optionally includes a reason for suspension via the `DesactivateUserDto`.

## Running the app
