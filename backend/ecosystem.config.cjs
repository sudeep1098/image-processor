module.exports = {
    apps: [
        {
            name: "image-backend-dev",
            script: "server.js",
            watch: true,
            ignore_watch: ["node_modules", "logs"],
            env: {
                NODE_ENV: "development",
                PORT: 3000,
            }
        },
        {
            name: "image-backend",
            script: "server.js",
            watch: false,
            ignore_watch: ["node_modules", "logs"],
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            }
        }
    ]
};