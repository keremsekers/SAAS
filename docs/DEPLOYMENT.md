# Deployment

The storefront is a static site and is ready for Vercel or GitHub Pages.

## Vercel

Import `keremsekers/SAAS` into Vercel. Vercel supports zero-configuration deployment for static sites and Next.js projects.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. After GitHub Pages is configured to use GitHub Actions, pushes to `main` deploy the storefront.

## Current launch state

- 100 products/services
- DE/TR catalog
- Top 3 merchandising per category
- CTA/action flow
- Payment intentionally disabled for this launch
- Checkout and fulfillment can be added later without changing the catalog model
