Here's a clear and structured **app description** for the system-wide AI assistant using **Electron + vanilla HTML/CSS/JavaScript + Gemini AI + screen capture**:

---

### 🔧 Project: System-Wide Context-Aware AI Assistant

#### 📌 Overview

This is a desktop AI assistant application built with **Electron**. It runs in the background and allows users to interact via a **floating chat bubble** overlaid on top of all applications. When clicked, the bubble opens a **popup chat interface** where users can describe their issue or ask questions.

The assistant captures the **current screen** as an image and sends it **along with the user’s prompt** to the **Gemini API** (Google AI), allowing the AI to understand both the **visual context** and the **textual query** before replying.

---

### 🧠 Core Features

1. **Floating Chat Bubble**

   * Always-on-top button visible across all applications.
   * Click to open the assistant.

2. **Popup Chat Interface**

   * Opens a lightweight chat window (HTML/CSS/JS).
   * User enters a query.
   * Automatically captures the current screen.

3. **Screen Capture**

   * Uses Electron's `desktopCapturer` to get a screenshot of the active screen/window.

4. **AI Integration**

   * Sends image and query to **Gemini Vision API** (or text+image multimodal endpoint).
   * Receives helpful, contextual response.

5. **Response Display**

   * AI reply shown in the chat interface.
   * Option to copy solution, expand, or ask follow-up.

---

### 🏗️ Architecture

#### 📁 App Folder Structure

```bash
ai-assistant/
├── main.js              # Electron main process
├── preload.js           # Bridge between renderer and Node
├── index.html           # Chat popup interface
├── style.css            # UI styles (basic Tailwind-like if needed)
├── renderer.js          # Frontend logic
├── screen.js            # Screen capture logic
├── gemini.js            # Gemini API integration
├── assets/
│   └── icon.png         # Floating bubble icon
├── package.json         # App metadata and scripts
└── README.md
```

---

### 🔄 Data Flow Summary

1. User clicks floating icon → opens popup window.
2. User types question → submits.
3. App captures screen using `desktopCapturer`.
4. Both screen image + text prompt sent to Gemini API.
5. Gemini responds → response shown in chat UI.

---

### 🧩 Key Electron APIs Used

* `desktopCapturer` – for screenshot of user's screen.
* `BrowserWindow` – for popup and bubble.
* `ipcMain` / `ipcRenderer` – for communication between main and renderer.
* `node-fetch` or `axios` – for API requests to Gemini.

---

### 🔐 Notes on Permissions & Privacy

* The app will **prompt the user on first run** to allow screen capture.
* Future versions should add a **notification or consent mechanism** before capturing.

---

### 🚀 MVP Goals

* Electron app with floating icon.
* Chat window that sends text + screenshot.
* Gemini API integration for multimodal query.
* Simple UI (vanilla HTML/CSS/JS).
* Response displayed in chat box.

