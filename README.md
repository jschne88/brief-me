# Brief Me - AI-Powered Chrome Extension for Calendar Meeting Summaries

Brief Me is a Chrome extension that leverages AI to provide users with information to help them prepare for upcoming meetings. It integrates with Google Calendar and pulls in relevant information from LinkedIn and other internet sources to give users information about the event, including the host, important attendees, and links and other information about the topic of the meeting.

## 🚀 Features

- **AI-generated calendar event summaries** - Get intelligent briefings for your meetings
- **Google Calendar integration** - Seamlessly works within your existing calendar workflow
- **LinkedIn profile summaries** - Automatic lookup of meeting participants and companies
- **Internet-sourced information** - Additional context about meeting topics and attendees

## 🏗️ Architecture

### Chrome Extension (`/chrome-extension`)
- **Content Script**: Interacts with Google Calendar, adds "Brief Me" buttons to events
- **Popup**: React-based UI displaying meeting summaries and attendee information
- **Background Script**: Handles communication between content script and AI service
- **Tech Stack**: TypeScript, React, Tailwind CSS

### AI Service (`/ai-service`)
- **Node.js server** that processes meeting data and generates summaries
- **OpenAI integration** for intelligent summary generation
- **LinkedIn service** for profile and company information retrieval
- **Caching system** to optimize performance and reduce API calls
- **Tech Stack**: TypeScript, Express, OpenAI API

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- OpenAI API key

### Chrome Extension Setup

```bash
cd chrome-extension
yarn install
yarn dev  # Start webpack in watch mode
```

Load the extension in Chrome:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension/build` folder

### AI Service Setup

```bash
cd ai-service
yarn install

# Copy environment variables and add your API keys
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

yarn dev  # Start development server
```

## 📝 Usage

1. Navigate to Google Calendar in Chrome
2. Hover over any meeting event
3. Click the "Brief Me" button that appears
4. Wait for the AI-generated summary to load in the popup

## 🧪 Development Commands

### Chrome Extension
- `yarn build` - Build for production
- `yarn dev` - Development build with watch mode
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn type-check` - TypeScript type checking

### AI Service
- `yarn start` - Start production server
- `yarn dev` - Start development server with hot reload
- `yarn build` - Build TypeScript to JavaScript
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn test` - Run tests

## 🔧 Configuration

### Environment Variables (AI Service)
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## 📁 Project Structure

```
brief-me/
├── chrome-extension/          # Chrome extension code
│   ├── src/
│   │   ├── popup/            # React popup UI
│   │   ├── content/          # Content script for Calendar
│   │   └── background/       # Background service worker
│   ├── public/               # Extension assets
│   └── manifest.json         # Extension manifest
├── ai-service/               # Node.js AI service
│   ├── src/
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   └── tests/               # Test files
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details