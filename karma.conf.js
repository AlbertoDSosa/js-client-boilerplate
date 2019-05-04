module.exports = function(config) {
  config.set({
    files: [
      'app/**/*.spect.js'
    ],
    frameworks: ['jasmine'],
    autoWatch: true,
    browsers: ['Firefox'],
    plugins: ['karma-jasmine', 'karma-firefox-launcher']
 });
};