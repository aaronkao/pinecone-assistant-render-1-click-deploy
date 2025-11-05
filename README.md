# Pinecone Assistant 1-Click Deploy

Deploy a Pinecone Assistant chat interface to Vercel with one click.

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pinecone-io/pinecone-assistant-vercel-1-click-deploy&env=PINECONE_API_KEY,PINECONE_ASSISTANT_NAME,NEXT_PUBLIC_ASSISTANT_NAME,NEXT_PUBLIC_WELCOME_MESSAGE)

![Pinecone Assistant Chat Interface](./docs/screenshot.png)

## 🎨 Features

- 🚀 **Super Simple** - Deploy your Pinecone Assistant to Vercel with one click
- 💬 **Streaming Chat** - Real-time streaming responses from your Assistant
- 📁 **Files Panel** - View all files uploaded to your assistant
- 📱 **Responsive** - Works on all devices

### Deployment Steps

1. **Click the "Deploy" button above**
   - You'll be redirected to Vercel's deployment page
   - If you're not logged in, sign in with GitHub

2. **Configure your repository and set environment variables**
   - Vercel will automatically detect this repository to clone
   - Choose the Git account & enter the repository name you want to clone to (make the repository public if you have a personal Vercel account)
   - Choose a Vercel team to deploy your site to
   - Click the Create button
   - Add your environment variables (you'll have to set all of them in Vercel) \
   **Required:**
     - `PINECONE_API_KEY` - Your Pinecone API key
     - `PINECONE_ASSISTANT_NAME` - Your Pinecone Assistant name
     - `NEXT_PUBLIC_ASSISTANT_NAME` - The name you want to be displayed for your assistant
     - `NEXT_PUBLIC_WELCOME_MESSAGE` - Your custom welcome message
   **Optional (set after initial deploy and redploy):**
     - `MODEL` - The model to use for chat responses. Options: `gpt-4o` (default), `gpt-4.1`, `o4-mini`, `claude-3-5-sonnet`, `claude-3-7-sonnet`, `gemini-2.5-pro`
     - `NEXT_PUBLIC_HIDE_FILES` - Set to `true` to hide the files drawer panel completely (both desktop and mobile). Default: `false`
   - Click the Deploy button

3. **Your chat interface will be live!**
   - Once deployment completes, your chat interface will be ready to use

## 📋 Getting Your Pinecone Credentials

Before deploying, make sure you have:

1. **Pinecone API Key**
   - Visit [Pinecone Console](https://app.pinecone.io)
   - Go to **API Keys** section
   - Copy your API key

2. **Pinecone Assistant Name**
   - Visit [Pinecone Console](https://app.pinecone.io)
   - Go to **Assistants** section
   - Create a new assistant or select an existing one
   - Copy the Assistant name (this is the identifier you'll use)

## 🔄 Automatic UI Updates

## 🔧 Local Preview (Optional)

If you want to preview the app locally before deploying:

1. **Clone this repository:**
   ```bash
   git clone https://github.com/pinecone-io/pinecone-assistant-vercel-1-click-deploy.git
   cd pinecone-assistant-vercel-1-click-deploy
   ```

2. **Create `.env` file:**
   ```bash
   cp example.env .env
   ```

3. **Edit `.env` with your credentials:**
   ```env
   PINECONE_API_KEY=your-api-key-here
   PINECONE_ASSISTANT_NAME=your-assistant-name-here
   NEXT_PUBLIC_ASSISTANT_NAME=your-assistant-name-here
   NEXT_PUBLIC_WELCOME_MESSAGE=Your custom welcome message here
   # Optional
   MODEL=gpt-4o
   NEXT_PUBLIC_HIDE_FILES=false
   ```

4. **Install dependencies and run:**
   ```bash
   npm install
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** to see the app

## 📚 Resources

- [Pinecone Assistant Docs](https://docs.pinecone.io/guides/assistant/)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 📝 License

MIT

