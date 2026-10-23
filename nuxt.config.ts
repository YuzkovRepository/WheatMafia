export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  
  // Удалите nitro.devProxy - это не работает для клиентских запросов
  nitro: {
    preset: 'node-server',
    devProxy: {
    '/ws': { target: 'http://localhost:8080/ws', ws: true, changeOrigin: true }
  }
  },
  
  vite: {
    server: {
      fs: {
        strict: false
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path, // Не изменяем путь
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxying request:', req.method, req.url, '->', 'http://localhost:8080' + req.url);
            });
          }
        }
      }
    }
  },
  
  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true
      }
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    public: {
      apiBase: '/api' // Добавьте это
    }
  },
  
  app: {
    head: {
      title: 'SkillSwap - Обмен услугами',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap', rel: 'stylesheet' },
        { href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&display=swap', rel: 'stylesheet' }
      ]
    }
  },
  
  devServer: {
    port: 3003
  }
})