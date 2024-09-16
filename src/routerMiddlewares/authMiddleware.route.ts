import { RequestMethod } from '@nestjs/common';

const excludedRoutes = [
    { path: '/', method: RequestMethod.GET },
    { path: 'users/sign-up', method: RequestMethod.POST },
    { path: 'users/sign-in', method: RequestMethod.POST },
    { path: '/users/find-by-param', method: RequestMethod.POST },
    { path: 'users/find-by-email', method: RequestMethod.POST },
    { path: 'users/desactivate-user', method: RequestMethod.POST },
];

const AuthMiddlewareRoutes = {
    excludedRoutes,
};

export { AuthMiddlewareRoutes };
