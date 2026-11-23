# Deployment (Vercel + an id.vn domain)

Both sites deploy as **one Vercel project**. The examples below use `yourname.id.vn`.

## 1. Push and import

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository. The framework is detected as Next.js. Keep the default build settings.

## 2. Environment variables

In Vercel, go to **Project → Settings → Environment Variables**.

| Name | Production | Preview |
| --- | --- | --- |
| `NEXT_PUBLIC_MAIN_URL` | `https://yourname.id.vn` | leave unset (defaults to localhost) or use the preview URL |
| `NEXT_PUBLIC_IELTS_URL` | `https://ielts.yourname.id.vn` | **leave empty**, so previews use `/ielts` |

These variables are read when the site is built. After changing one, redeploy.

## 3. Add both domains to the project

In Vercel, go to **Project → Settings → Domains** and add:

- `yourname.id.vn`
- `ielts.yourname.id.vn`
- `www.yourname.id.vn` (optional; redirect it to the root domain)

## 4. DNS records with your id.vn provider

Use **one** of these two options.

**Option A: keep your provider's DNS.** Add these records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | the IP shown by Vercel for the root domain |
| CNAME | `ielts` | `cname.vercel-dns.com` (or the value Vercel shows) |
| CNAME | `www` | `cname.vercel-dns.com` |

**Option B: let Vercel manage DNS.** Change the domain's nameservers to the ones Vercel lists.
Vercel then creates the records itself. Choose this option if your provider's panel can't add CNAME records.

Free student id.vn domains are managed through the registrar's control panel. Check there that you can
edit DNS records or nameservers. HTTPS certificates are issued automatically once DNS resolves.

## 5. Verify

```bash
curl -I https://yourname.id.vn/ielts/vi        # expect 308 → https://ielts.yourname.id.vn/vi
curl -I https://ielts.yourname.id.vn           # expect 307 → /vi or /en
curl https://ielts.yourname.id.vn/robots.txt   # Sitemap: https://ielts.yourname.id.vn/sitemap.xml
curl https://yourname.id.vn/robots.txt         # Sitemap: https://yourname.id.vn/sitemap.xml
```

Then submit both sitemaps to Google Search Console. Add each host as its own property, or use one Domain property.

## Before you launch

- Replace every `[Placeholder]` in `src/config/profile.ts`, `src/config/site.ts` (`name`, `wordmark`,
  `description`) and `content/pages/**`.
- Rewrite or delete the sample drafts in `content/ielts/**` (they are marked `draft: true` and don't appear in
  production builds).
- Optional: add `src/app/opengraph-image.tsx` or set `coverImage` on articles so links show social preview images.
