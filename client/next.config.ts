import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:lng/sanctum/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/sanctum/:path*`,
      },
      {
        source: '/:lng/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },

      // sem idioma (se algum lugar chamar direto /api/...)
      {
        source: '/sanctum/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/sanctum/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
