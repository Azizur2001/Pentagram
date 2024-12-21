// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this eslint configuration
  eslint: {
    ignoreDuringBuilds: true, // Ignores all ESLint warnings and errors during build
  },
};

export default nextConfig;
