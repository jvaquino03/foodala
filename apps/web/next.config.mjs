/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Food photography is served from external CDNs (TheMealDB / TheCocktailDB),
  // mirroring the customer-mobile catalog. We skip the Next image optimizer so
  // the app runs with zero network/build coupling to those hosts.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.themealdb.com' },
      { protocol: 'https', hostname: 'www.thecocktaildb.com' },
    ],
  },
};

export default nextConfig;
