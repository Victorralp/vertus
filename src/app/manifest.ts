import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vertex Credit Union',
    short_name: 'Vertex CU',
    description: 'Modern digital banking platform for Vertex Credit Union',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    icons: [
      {
        src: '/vertex-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
