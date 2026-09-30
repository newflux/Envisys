import fs from 'fs';
import path from 'path';

export default {
  plugins: [
    {
      name: 'serve-nuxt-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          let url = req.url;
          if (url.includes('?')) {
            url = url.split('?')[0];
          }
          
          if (url.startsWith('/__webpack_hmr') || url.startsWith('/_loading/sse')) {
            res.statusCode = 404;
            res.end();
            return;
          }

          if (url.startsWith('/_nuxt/')) {
            const filePath = path.join(process.cwd(), 'public', url);
            if (fs.existsSync(filePath)) {
              if (url.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
              else if (url.endsWith('.otf')) res.setHeader('Content-Type', 'font/otf');
              else if (url.endsWith('.woff')) res.setHeader('Content-Type', 'font/woff');
              else if (url.endsWith('.woff2')) res.setHeader('Content-Type', 'font/woff2');
              else if (url.endsWith('.ttf')) res.setHeader('Content-Type', 'font/ttf');
              else if (url.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
              
              res.end(fs.readFileSync(filePath));
              return;
            } else {
              res.statusCode = 404;
              res.end();
              return;
            }
          }
          
          if (url.endsWith('.json') || url.endsWith('.js')) {
             const filePath = path.join(process.cwd(), 'public', url);
             if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.end();
                return;
             }
          }
          
          next();
        });
      }
    }
  ]
};
