/** @type {import('jest').Config} */
const config = {
    verbose: true,
    transformIgnorePatterns: ['/node_modules/(?!(foo|bar)/)', '/bar/'],
};

module.exports = config;