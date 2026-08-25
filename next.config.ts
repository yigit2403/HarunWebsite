import type { NextConfig } from 'next'

/**
 * The site is built as a folder of static HTML and uploaded to Linux shared
 * hosting — cPanel or DirectAdmin, on Apache or LiteSpeed. There is no Node
 * process in production, which has three consequences worth knowing before
 * changing anything here:
 *
 *   1. No route handlers and no middleware. The contact form posts to
 *      public/inquiry.php, and the locale redirect that proxy.ts performs in
 *      `next dev` is performed by public/.htaccess on the server. The
 *      server-side code the site used to run is parked in server/ — see
 *      server/README.md.
 *
 *   2. No image optimiser. Web-sized WebP is generated ahead of the build by
 *      `npm run images`, from the masters in assets/. See PHOTOGRAPHY.md.
 *
 *   3. Environment variables are read at build time, not at request time. The
 *      canonical origin, and whether robots.txt lets crawlers in, are decided
 *      by the environment the build ran in. See lib/deployment.ts.
 */
const config: NextConfig = {
  output: 'export',

  // Emit /tr/urunler/index.html rather than /tr/urunler.html, so Apache serves
  // the page from its DirectoryIndex and the address keeps its trailing slash
  // instead of the server guessing at an extension.
  trailingSlash: true,

  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // There is no optimiser to resize on demand, so next/image emits the file
    // it is given. The files it is given are already web-sized WebP.
    unoptimized: true,
  },
}

export default config
