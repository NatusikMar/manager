// next.config.js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // отключаем в dev
});

const nextConfig = {
  reactStrictMode: true,
  // другие опции
};

module.exports = withPWA(nextConfig);
