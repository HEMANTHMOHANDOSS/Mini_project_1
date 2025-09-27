# Z Flow - AI-Powered Full-Stack Development Platform

**Powered by Hemanth M | MCA GENERATIVE AI | SRMIST RAMAPURAM**

Z Flow is a modern, AI-powered development platform that allows you to build, edit, and deploy full-stack web applications using natural language prompts. Built with Next.js, React, and powered by Google's Gemini AI.

## 🚀 Features

- **AI-Powered Code Generation**: Generate complete React applications using natural language
- **Real-time Code Editor**: Live code editing with Sandpack integration
- **Instant Preview**: See your changes in real-time
- **User Authentication**: Secure Google OAuth integration
- **Workspace Management**: Save and manage multiple projects
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Convex (Real-time database)
- **AI**: Google Gemini 2.0 Flash
- **Authentication**: Google OAuth
- **Code Editor**: Sandpack (CodeSandbox)
- **UI Components**: Radix UI, Lucide Icons
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud Console account (for OAuth)
- Convex account
- Google AI Studio account (for Gemini API)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd zflow-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY=your_google_oauth_client_id

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# PayPal (Optional)
NEXT_PUBLIC_PAYPAL_CLIENT_Id=your_paypal_client_id
```

### 4. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Add your domain to authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain
6. Copy the Client ID to your `.env.local` file

### 5. Setup Convex Database

1. Install Convex CLI:
```bash
npm install -g convex
```

2. Login to Convex:
```bash
npx convex login
```

3. Initialize Convex in your project:
```bash
npx convex init
```

4. Deploy your Convex functions:
```bash
npx convex deploy
```

### 6. Setup Google Gemini AI

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env.local` file

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Deploy Convex

```bash
npx convex deploy --prod
```

## 📁 Project Structure

```
zflow-app/
├── app/                          # Next.js app directory
│   ├── (main)/                   # Main application routes
│   │   └── workspace/[id]/       # Dynamic workspace pages
│   ├── api/                      # API routes
│   │   ├── ai-chat/              # Chat API endpoint
│   │   └── gen-ai-code/          # Code generation API
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   └── provider.jsx              # Context providers
├── components/                   # React components
│   ├── custom/                   # Custom components
│   │   ├── AppSideBar.jsx        # Application sidebar
│   │   ├── ChatView.jsx          # Chat interface
│   │   ├── CodeView.jsx          # Code editor view
│   │   ├── Header.jsx            # Application header
│   │   ├── Hero.jsx              # Landing page hero
│   │   └── SignInDialog.jsx      # Authentication dialog
│   └── ui/                       # UI components
├── configs/                      # Configuration files
│   └── AiModel.jsx               # AI model configuration
├── context/                      # React contexts
├── convex/                       # Convex backend
│   ├── schema.js                 # Database schema
│   ├── users.js                  # User functions
│   └── workspace.js              # Workspace functions
├── data/                         # Static data
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── public/                       # Static assets
```

## 🎯 Usage

1. **Sign In**: Click "Get Started" and sign in with Google
2. **Create Project**: Enter a description of what you want to build
3. **AI Generation**: Watch as AI generates your complete application
4. **Edit Code**: Use the built-in editor to modify your code
5. **Preview**: See changes in real-time in the preview pane
6. **Save**: Your projects are automatically saved to your workspace

## 🔧 Configuration

### Customizing AI Prompts

Edit `data/Prompt.jsx` to customize AI behavior:

```javascript
export default {
  CHAT_PROMPT: `Your custom chat prompt here`,
  CODE_GEN_PROMPT: `Your custom code generation prompt here`
}
```

### Adding New Features

1. Create new components in `components/custom/`
2. Add new API routes in `app/api/`
3. Update Convex schema if needed in `convex/schema.js`
4. Add new context providers in `context/`

## 🐛 Troubleshooting

### Common Issues

1. **OAuth Error**: Make sure your Google OAuth credentials are correct and domains are whitelisted
2. **Convex Connection**: Ensure Convex is deployed and URL is correct
3. **AI Generation Fails**: Check your Gemini API key and quota
4. **Build Errors**: Clear `.next` folder and reinstall dependencies

### Performance Issues

1. **Slow Loading**: Check network requests in browser dev tools
2. **Memory Issues**: Monitor React component re-renders
3. **API Timeouts**: Increase timeout limits in API routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hemanth M**
- MCA GENERATIVE AI
- SRMIST RAMAPURAM
- Email: [your-email@example.com]
- LinkedIn: [your-linkedin-profile]

## 🙏 Acknowledgments

- Google Gemini AI for powerful code generation
- Convex for real-time database
- Sandpack for code editing capabilities
- Next.js team for the amazing framework

---

**Z Flow** - Building the future of AI-powered development 🚀