module.exports = function(config) {
    const configuration = {
        basePath: './',
        frameworks: [
            'jasmine',
            'jasmine-matchers'
        ],
        reporters: [
            'mocha'
        ],

        files: [
            'dist/*.js',
            'tests/spec/**/*.js'
        ],

        port: 9876,
        captureTimeout: 10 * 1000,
        browserNoActivityTimeout: 10 * 60 * 1000,
        colors: true,
        browsers: ['Chrome'],
        concurrency: Infinity,
        plugins: [
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-mocha-reporter',
            'karma-chrome-launcher'
        ]
    };

    config.set(configuration);
};
