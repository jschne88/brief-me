# Brief Me - AI-Powered Chrome Extension for Calendar Meeting Summaries

Brief Me is a Chrome extension that leverages AI to provide users with information to help them prepare for upcoming meetings. It integrates with Google Calendar and pulls in relevant information from LinkedIn and other internet sources to give users information about the event, including the host, important attendees, the host, and links and other information about the topic of the meeting.

## Features
- AI-generated calendar event summaries
- Integration with Google Calendar
- LinkedIn profile summaries for meeting participants and companies
- Other internet sourced information related to the event

## How It Works
1. Brief Me loads when the user is on their Google Calendar page.
2. When the user hovers on top of a meeting, a button appears that says "Brief Me"
3. Clicking the button opens a popup. In the background, the extension sends the event details to an AI service (like Claude) to generate a summary.
4. The AI service fetches additional information from LinkedIn and other internet sources to enrich the summary.
5. The generated summary is displayed in the popup for the user to read.

## Components

### AI Service
- Node.js server that handles requests from the Chrome extension.
- Uses the ChatGPT API to generate summaries.
- Fetches additional information from LinkedIn and other sources.
- Caches results to improve performance and reduce API calls.
- Environment variables for API keys and configuration.

### Chrome Extension
- Manifest file defining permissions and background scripts.
- Content script that interacts with the Google Calendar page.
- Popup HTML and JavaScript to display the summary.
- CSS for styling the popup.

## Other Info
- The extension should scrape LinkedIn profiles and company pages to gather relevant information.
- Both apps should use the following
    - Typescript
    - Prettier
    - ESLint
    - React (for the popup UI)
    - Tailwind CSS (for styling)



