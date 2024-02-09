module.exports = {
    apps: [
        {
            name: 'backend-base-dev-api',
            script: 'npm',
            args: 'run start:prod',
            env: {
                NODE_ENV: 'development',
            },
        },
    ],
};
