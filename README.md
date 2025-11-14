# 24Toolkit - Your Complete Online Toolkit

🚀 **Live at:** [https://24toolkit.com](https://24toolkit.com)

80+ free, fast, and AI-powered tools for developers, creators, and everyday users.

## ✨ Features

- 🤖 **AI-Powered Tools** - Text summarizer, translator, email writer, hashtag generator, and more
- 🔐 **Security Tools** - Hash generator, password strength checker, SSL checker, encryption tools
- 🧮 **Calculators** - BMI, age, percentage, tip, discount, and currency converters
- 🛠️ **Developer Tools** - Regex tester, JWT decoder, Base64 encoder, JSON/CSV converter
- 🎨 **Image Tools** - Compressor, resizer, cropper, filter editor, background remover
- 📝 **Text Utilities** - Case converter, word counter, diff checker, markdown previewer
- 🎯 **Fun & Productivity** - Pomodoro timer, notepad, daily planner, quote generator

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- GitHub Personal Access Token (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/TheDXBNightsTeam/24toolkit.git
cd 24toolkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN

# Start development server
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Required: GitHub Token for AI features
GITHUB_TOKEN=your_github_token_here

# Optional: Domain configuration
VITE_DOMAIN=https://24toolkit.com
```

Get your GitHub token from: [https://github.com/settings/tokens](https://github.com/settings/tokens)

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure custom domain in Vercel dashboard:
   - Go to Project Settings → Domains
   - Add `24toolkit.com` and `www.24toolkit.com`
   - Update DNS records as instructed

4. Set environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your token value

## 🏗️ Project Structure

```
24toolkit/
├── api/                    # Serverless API functions
│   └── _spark/            # Spark AI API endpoints
├── public/                # Static assets
│   ├── robots.txt        # SEO crawling rules
│   └── sitemap.xml       # Sitemap for search engines
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components & tools
│   ├── lib/             # Utilities & helpers
│   └── hooks/           # Custom React hooks
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies & scripts
```

## 🛡️ Security & Privacy

- ✅ All tools run **client-side** (no data sent to servers except AI features)
- ✅ AI features use **GitHub Models API** with encrypted connections
- ✅ No user accounts or tracking
- ✅ Open source and transparent

## 📄 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run api        # Start local API server (development)
npm run dev:full   # Start both frontend and API server
```

## 📚 Documentation

- **[Production Guide](PRODUCTION.md)** - Complete production deployment guide
- **[API Documentation](API.md)** - Full API reference and examples
- **[Environment Setup](.env.example)** - Environment variable configuration

## 🌐 Domain Configuration

The project is configured for `24toolkit.com`:

- Meta tags and OpenGraph configured in `index.html`
- Sitemap available at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Security headers configured in `vercel.json`

## 🔐 Production Features

- ✅ **Rate Limiting**: Protection against abuse (10 req/min for AI, 100 req/min for KV)
- ✅ **Input Validation**: Comprehensive validation on all endpoints
- ✅ **Structured Logging**: JSON logging in production for better monitoring
- ✅ **Error Sanitization**: Safe error messages without sensitive data leaks
- ✅ **Request Timeouts**: 30-second timeouts for external API calls
- ✅ **Security Headers**: CSP, XSS protection, frame options, etc.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

See [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website:** [https://24toolkit.com](https://24toolkit.com)
- **Repository:** [https://github.com/TheDXBNightsTeam/24toolkit](https://github.com/TheDXBNightsTeam/24toolkit)
- **Issues:** [https://github.com/TheDXBNightsTeam/24toolkit/issues](https://github.com/TheDXBNightsTeam/24toolkit/issues)

---

Made with ❤️ by TheDXBNightsTeam
