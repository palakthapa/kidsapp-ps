/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['react-drawing-board']);

const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  env: {
    MESSAGE: process.env.MESSAGE
  }
}

module.exports = withTM(nextConfig);
