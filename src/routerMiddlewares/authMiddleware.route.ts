import { RequestMethod } from '@nestjs/common';

const excludedRoutes = [
    { path: 'users/signup', method: RequestMethod.POST },
    { path: 'users/signin', method: RequestMethod.POST },
    { path: '/users/find-by-param', method: RequestMethod.POST },
    { path: 'users/find-by-email', method: RequestMethod.POST },
    { path: 'users/desactivate-user', method: RequestMethod.POST },
];

const AuthMiddlewareRoutes = {
    excludedRoutes,
};

export { AuthMiddlewareRoutes };
