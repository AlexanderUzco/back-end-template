module.exports = {
    apps: [
        {
            name: 'backend-base-api',
            script: 'npm',
            args: 'run start:prod',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
