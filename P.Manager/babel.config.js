module.exports = function(api) {
    api.cache(true);
    return {
        presets: [
            ['babel-preset-expo', {
                // Ensure that the platform environment variable is inlined
                inlineEnvironmentVariables: {
                    "EXPO_OS": true
                }
            }]
        ],
    };
};