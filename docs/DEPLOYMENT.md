# Deployment

## GitHub Pages — ücretsiz

Storefront tamamen statik çalışır; ödeme sunucusu veya secret gerektirmez. GitHub Free + public repository ile GitHub Pages kullanılabilir. GitHub Pages, repository'deki statik HTML/CSS/JS dosyalarını doğrudan yayınlayabilir.

Repository'de .github/workflows/deploy-pages.yml hazırdır. main branch'e yapılan her push sonrasında GitHub Actions üzerinden Pages deployment başlatılır.

## Mevcut durum

- 100 ürün
- 10 kategori
- 🇩🇪 Deutsch + 🇹🇷 Türkçe
- Tüm ürünler ücretsiz
- 100 doğrudan statik indirme dosyası
- Arama + kategori filtresi
- Ürün detay modalı
- Yerel kütüphane
- WhatsApp / Telegram / E-Mail / native share
- Checkout yok
- Stripe yok
- Secret / API key gerekmiyor

Ödeme sistemi ileride ayrıca eklenebilir; mevcut ücretsiz katalog ve statik indirme yapısının buna ihtiyacı yok.
