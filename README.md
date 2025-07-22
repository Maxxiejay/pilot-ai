# Pilot AI Assistant

A system-wide context-aware AI assistant built with Electron that can see your screen and provide helpful assistance through a floating chat interface.

## Features

- 🤖 **Floating AI Assistant**: Always-on-top bubble that provides instant access to AI help
- 📸 **Screen Capture**: Automatically captures your screen to provide visual context to the AI
- 🧠 **Gemini AI Integration**: Powered by Google's Gemini API for intelligent responses
- 💬 **Clean Chat Interface**: Modern, responsive chat UI with smooth animations
- 🔒 **Privacy Focused**: Screen capture only happens when you ask a question
- 🎯 **System Tray Integration**: Runs quietly in the background

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Configure Environment

1. Open the `.env` file
2. Replace `your_gemini_api_key_here` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Add App Icon (Optional)

Place an icon file named `icon.png` in the `assets/` folder. The icon should be:
- 256x256 pixels or larger
- PNG format
- Square aspect ratio

### 5. Run the Application

```bash
npm start
```

## How to Use

1. **Start the App**: Run `npm start` - you'll see a floating bubble in the bottom-right corner
2. **Open Chat**: Click the floating bubble to open the chat interface
3. **Ask Questions**: Type your question and press Enter
4. **Get Context-Aware Help**: The AI can see your screen and provide relevant assistance
5. **Minimize**: Click the minimize button or click outside the chat to hide it
6. **System Tray**: The app runs in your system tray - right-click for options

## Development

### Project Structure

```
ai-assistant/
├── main.js              # Electron main process
├── preload.js           # Bridge between renderer and Node
├── index.html           # Chat popup interface
├── bubble.html          # Floating bubble interface
├── style.css            # UI styles
├── renderer.js          # Frontend chat logic
├── screen.js            # Screen capture functionality
├── gemini.js            # Gemini API integration
├── assets/
│   └── icon.png         # App icon
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md           # This file
```

### Available Scripts

- `npm start` - Run the application
- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build the application for distribution

### API Integration

The app uses Google's Gemini API for AI responses. The integration supports:
- Text-only queries
- Image + text queries (screen capture)
- Configurable response parameters
- Error handling and retry logic

## Privacy & Security

- Screen capture only occurs when you submit a question
- No data is stored locally
- API communication is encrypted
- The app requests screen capture permissions on first use

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Make sure you've added your Gemini API key to the `.env` file
   - Restart the application after adding the key

2. **Screen capture not working**
   - On macOS: Grant screen recording permissions in System Preferences > Security & Privacy
   - On Windows: Make sure the app is running with appropriate permissions

3. **App won't start**
   - Run `npm install` to ensure all dependencies are installed
   - Check that you're using Node.js version 16 or higher

4. **Floating bubble not visible**
   - Check your system tray for the app icon
   - Right-click the tray icon and select "Toggle Floating Bubble"

### Support

If you encounter issues:
1. Check the console for error messages
2. Ensure your Gemini API key is valid and has sufficient quota
3. Verify your internet connection
4. Try restarting the application

## License

MIT License - See LICENSE file for details
