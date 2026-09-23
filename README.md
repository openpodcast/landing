# Open Podcast

Welcome to our official homepage. Go [here](https://openpodcast.app/) for a rendered version.

## Build

Requires Node.js/npm.

```sh
npm ci
npm run build
```

Deploy the contents of `public/`, not `src/html/`. The build includes `_redirects`,
`robots.txt`, `sitemap.xml`, and a top-level `404.html`. Keep the sitemap in
`src/assets/sitemap.xml` in sync with canonical marketing URLs; do not include
login pages, private reports, or the error page.

## Routing checks

Cloudflare Pages [defaults to an SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/)
when `404.html` is absent. This is a static multi-page site: the top-level error
page must be deployed so unknown URLs return 404 instead of the homepage with 200.
The legacy URL rules live in `_redirects`, including aliases with and without
trailing slashes. The development watcher copies these rules too.

For a local Pages preview, run in a separate terminal:

```sh
npm exec --yes --package=wrangler@4.137.0 -- wrangler pages dev public --port 8788
```

The preview command may download Wrangler through npm; it does not deploy anything.
Check that `/sitemap.xml` serves XML, legacy URLs redirect, and unknown URLs return
404. Repeat these checks against production after deployment.

If production still ignores `_redirects` or serves stale pages, check the deployed
artifact, Cloudflare cache rules, and any Pages Functions/Workers intercepting
requests. [Pages redirect rules](https://developers.cloudflare.com/pages/configuration/redirects/)
do not apply to responses served by Pages Functions. Do not mask the issue with a
catch-all redirect.

The observed `www.openpodcast.app` duplicate requires a host-level redirect to
`https://openpodcast.app`, preserving the path and query string. Configure this in
the hosting/Cloudflare dashboard, not as a path-only `_redirects` rule. Deployment
credentials and domain configuration are not part of this repository.
