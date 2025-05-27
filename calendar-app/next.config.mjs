/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Кэширование API-запросов по дням
      urlPattern: /\/api\/events\/data\/\d{4}-\d{2}-\d{2}/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'daily-events-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 365,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 1 месяц
        },
        cacheableResponse: {
          statuses: [200], // кэшируем только успешные ответы
        },
      },
    },
    {
      // Кэш для статических ресурсов
      urlPattern: ({ request }) =>
        request.destination === 'image' ||
        request.destination === 'style' ||
        request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 неделя
        },
      },
    },
  ],
})(nextConfig);
