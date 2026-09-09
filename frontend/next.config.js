/** @type {import('next').NextType} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // <--- OBLIGATORIO: Fuerza a que cada página genere su propia carpeta con un index.html
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;