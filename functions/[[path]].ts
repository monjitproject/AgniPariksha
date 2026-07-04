interface Env {
  ASSETS: {
    fetch: (request: Request | string | URL) => Promise<Response>;
  };
}

export const onRequest: any = async (context: {
  request: Request;
  next: () => Promise<Response>;
  env: Env;
}) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. If the request is for a static file with an extension, let Cloudflare serve it directly
  if (
    pathname.includes(".") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/assets")
  ) {
    return next();
  }

  // 2. Fetch the base index.html from static assets
  const indexUrl = new URL("/index.html", request.url);
  const response = await context.env.ASSETS.fetch(indexUrl);
  
  if (!response.ok) {
    return response;
  }

  const html = await response.text();

  // 3. Inject our dynamic SEO metadata!
  try {
    const { checkPathValidity, getPageSeoData, injectMetadata } = await import("../src/utils/dynamicSeo");
    
    const isPathValid = checkPathValidity(pathname);
    const pageData = getPageSeoData(pathname);
    let modifiedHtml = injectMetadata(html, pageData);

    if (!isPathValid) {
      modifiedHtml = modifiedHtml.replace("<body>", "<body>\n<script>window.__INITIAL_STATE__ = { is404: true };</script>");
      return new Response(modifiedHtml, {
        status: 404,
        headers: {
          "content-type": "text/html;charset=UTF-8",
          "cache-control": "public, max-age=0, must-revalidate"
        }
      });
    } else {
      modifiedHtml = modifiedHtml.replace("<body>", "<body>\n<script>window.__INITIAL_STATE__ = { is404: false };</script>");
      return new Response(modifiedHtml, {
        status: 200,
        headers: {
          "content-type": "text/html;charset=UTF-8",
          "cache-control": "public, max-age=0, must-revalidate"
        }
      });
    }
  } catch (err: any) {
    // Fallback to original HTML if metadata injection fails
    console.error("SEO Metadata Injection Error:", err);
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    });
  }
};
