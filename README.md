# futurenxtai.org — FutureNxt AIverse Official Website

> **Democratizing AI Education for Bharat.** Equipping learners, educators, and enterprise innovators with practical capabilities, hands-on labs, and future-ready opportunities.
> Live Domain: [https://futurenxtai.org](https://futurenxtai.org)

---

## 🚀 Technology Stack
Built with clean, production-grade web technologies natively supported by **Hostinger** (LiteSpeed / Apache Web Server):

- **HTML5**: Semantic, accessible markup across all pages
- **CSS3**: Apptad-inspired enterprise design system, glassmorphism, responsive grid, flexbox, Ken Burns flag-safe animations
- **JavaScript (ES6+)**: Custom sliders, interactive in-view video autoplay & scroll-to-stop, audio unlock, AJAX forms
- **PHP 8.x**: Server-side contact and partnership form submission handler (`contact-handler.php`) with email delivery to `india.futurenxt@gmail.com` and `support@futurenxtai.org`
- **Apache / LiteSpeed (`.htaccess`)**: URL rewriting, SSL enforcement, Gzip compression, browser caching, and security headers

---

## 📁 Project Structure

```plaintext
futurenxtai.org/
├── .htaccess                 # Production LiteSpeed/Apache configuration for Hostinger
├── .gitignore                # Git ignore rules
├── 404.html                  # Branded 404 error page
├── contact-handler.php       # PHP backend for Contact & Partnership forms
├── contact.html              # Contact page
├── how.html                  # How We Do (5-Stage Learning Roadmap)
├── index.html                # Home page (Apptad slider, values strip, showcase video)
├── partner.html              # Partnership page
├── README.md                 # Project documentation
├── robots.txt                # SEO search crawler instructions
├── server.js                 # Lightweight local preview server
├── sitemap.xml               # SEO XML sitemap
├── what.html                 # What We Do (6 AI Industry Sectors)
├── who.html                  # Who We Are (Vision, Mission, Jharkhand video)
├── why.html                  # Why It Matters (Testimonials, Impact Pillars)
└── assets/
    ├── css/
    │   ├── apptad-theme.css  # Enterprise design system & components
    │   ├── components.css    # Cards, grids, and carousel modules
    │   └── style.css         # Base styles & variables
    ├── images/               # High-resolution optimized graphics & logos
    ├── js/
    │   └── main.js           # Interactive carousel, in-view video playback, AJAX
    └── videos/               # High-definition video assets
```

---

## 🌐 Deploying to Hostinger via GitHub

### 1. Push to GitHub
```bash
git init -b main
git add .
git commit -m "Production release for futurenxtai.org"
git remote add origin https://github.com/<YOUR_USERNAME>/futurenxtai.org.git
git push -u origin main
```

### 2. Connect with Hostinger hPanel
1. Open **Hostinger hPanel** > Go to **Websites** > Click **Manage** on `futurenxtai.org`.
2. In the search bar / left sidebar, click **Git** (under the *Advanced* menu).
3. Fill in the deployment details:
   - **Repository:** `https://github.com/<YOUR_USERNAME>/futurenxtai.org.git`
   - **Branch:** `main`
   - **Install Directory:** Leave blank (or select `public_html`)
4. Click **Create** / **Deploy**.
5. Enable **Auto-Deployment** by adding the Webhook URL from Hostinger into your GitHub Repo (`Settings > Webhooks`).

---

## 💻 Local Testing
To preview the website locally on your computer:
```bash
node server.js
```
Then open your browser at **`http://localhost:3000/`**.
