# Nest Js + Typescript + MongoDB

This template provides a Nest Js application setup with MongoDB integration, including initial Auth
Setup and Middleware.

## Versions

-   **Node**: 22.x (use `nvm use` with `.nvmrc`)
-   **NestJS**: 11.1.x

## Swagger

-   Docs available at `GET /api` when the app is running.
-   Configured in `src/main.ts` using `SwaggerModule` and `DocumentBuilder`.

## Environments

1. **NODE_ENV -** Current Enviroment (development/production)
2. **PORT -** App Port
3. **JWT_SECRET -** Json Web Token Secret to generate sign token
4. **JWT_EXPIRATION -** Access token expiration time (default: 15m)
5. **JWT_REFRESH_EXPIRATION -** Refresh token expiration time (default: 1d)
6. **REFRESH_MAX_TTL -** Absolute max lifetime for refresh (default: 7d)
7. **BASE_DB_URI -** MongoDB Database URI

## Generate Secrets

To generate `JWT_SECRET` using OpenSSL and encode it in base64, run:

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

> To run mongo service with docker compose locally, you need to add `--profile local` to the
> command.

**Important:** If you want to run mongo service with docker compose locally, remember to change the
mongo URI in env file. To use the mongo service container.

> BASE_DB_URI=mongodb://localhost:27017/base **(Local)** to BASE_DB_URI=mongodb://mongo:27017/base
> **(Container)**

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

## Lint / Prettier / VSCode

To keep standardized formatting on save in VS Code, use the following files:

`\.vscode/settings.json`

```json
{
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "file",
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "eslint.run": "onSave",
    "eslint.validate": ["typescript", "javascript"],
    "eslint.packageManager": "yarn",
    "prettier.configPath": ".prettierrc"
}
```

`\.eslintrc.js`

```js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    env: {
        node: true,
        jest: true,
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
        'import/newline-after-import': ['warn', { count: 1 }],
        'import/order': 'off',
        'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 1 }],
        'no-trailing-spaces': 'warn',
        'object-curly-spacing': ['warn', 'always'],
        'array-bracket-spacing': ['warn', 'never'],
        'space-before-blocks': ['warn', 'always'],
        'keyword-spacing': ['warn', { before: true, after: true }],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
    },
};
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

Middleware is included to enforce authentication for routes using JSON Web Tokens (JWT) in the
NestJS application.

You can add any route to exclude the middleware here:

```js
// src/routerMiddlewares/authMiddleware.route.ts
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
-   **GET /users/verify-token**: Verify the provided JWT token.
-   **POST /users/deactivate-user**: Deactivate a user in the system (ADMIN)

### Refresh Token

-   **POST /refresh-token/**: Refresh access token using refresh token.
-   **POST /refresh-token/revoke**: Revoke current refresh token.
-   **POST /refresh-token/revoke-all**: Revoke all refresh tokens for current user.

## Authentication Flow

The system uses a dual-token approach for enhanced security:

1. **Access Token**: Short-lived (15 minutes by default) for API requests
2. **Refresh Token**: Stored in DB (sliding + rotation)
    - Duration per token: `JWT_REFRESH_EXPIRATION` (default 1d)
    - On each refresh: old token is revoked, a new one is issued
    - Absolute max lifetime: `REFRESH_MAX_TTL` (default 7d)

### Login Response

```json
{
    "message": "User signin",
    "data": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Token Refresh

When access token expires, use refresh token to get new tokens:

```json
POST /refresh-token/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 900
}
```

### Workspace

-   **POST /workspace/**: Create a new workspace in the system.
-   **GET /workspace/**: Get a workspace in the system (ADMIN)
