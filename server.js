const { serve } = require("bun");

serve({
    port: 3000,
    hostname: "0.0.0.0",
    fetch(req) {
        const url = new URL(req.url);
        let path = url.pathname;

        // Serve static assets from the dist directory
        if (path.startsWith('/assets/')) {
            const file = Bun.file(`./dist${path}`);
            return file.exists() ? new Response(file) : new Response("Not Found", { status: 404 });
        }

        // For all other routes, serve the index.html file
        return new Response(Bun.file('./dist/index.html'));
    },
});