# Architecture

## Core principles
1. Product content is decoupled from application code.
2. Every product can provide German and Turkish content.
3. One catalog supports digital products, services, bundles and subscriptions.
4. Payments, fulfillment, email, AI and analytics are provider adapters.
5. Adding a product should not require changing storefront code.

## Planned modules
- Storefront and localized product pages
- Categories, search and filters
- Checkout and customer accounts
- Digital fulfillment
- Service intake and booking
- Subscriptions and bundles
- Admin/product CRUD
- SEO/content engine
- Email and marketing automation
- Analytics

## Automation events
- product.viewed
- checkout.started
- order.paid
- digital_delivery.completed
- service.intake.created
- customer.created
- subscription.started
- subscription.cancelled
