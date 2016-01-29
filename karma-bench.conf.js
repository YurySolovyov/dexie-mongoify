module.exports = function(config) {
    const configuration = {
        basePath: './',
        frameworks: [
            'benchmark'
        ],
        reporters: [
            'benchmark'
        ],

        files: [
          'src/*.js',
          'benchmarks/*.js'
        ],
        port: 9876,
        captureTimeout: 10 * 1000,
        browserNoActivityTimeout: 10 * 60 * 1000,
        colors: true,
        browsers: ['Chrome'],
        concurrency: Infinity,
        plugins: [
            'karma-benchmark',
            'karma-benchmark-reporter',
            'karma-chrome-launcher'
        ]
    };

    config.set(configuration);
};
