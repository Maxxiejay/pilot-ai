// Chat functionality
class ChatInterface {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.messageInput.focus();
    }
    
    setupEventListeners() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input validation
        this.messageInput.addEventListener('input', () => {
            this.validateInput();
        });
        
        // Window controls
        this.closeBtn.addEventListener('click', () => {
            window.electronAPI.closeChat();
        });
        
        this.minimizeBtn.addEventListener('click', () => {
            window.electronAPI.minimizeToTray();
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }
    
    validateInput() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText;
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.validateInput();
        this.autoResizeTextarea();
        
        // Show loading
        this.showLoading(true);
        
        try {
            // Capture screen
            const screenData = await window.electronAPI.captureScreen();
            
            // Send to Gemini API
            const response = await this.sendToGemini(message, screenData);
            
            // Add AI response to chat
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Sorry, I encountered an error while processing your request. Please try again.', 'ai');
        } finally {
            this.showLoading(false);
        }
    }
      addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Simple markdown parsing for AI messages
        if (type === 'ai') {
            messageContent.innerHTML = this.parseMarkdown(content);
        } else {
            messageContent.textContent = content;
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    parseMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>') // Links
            .replace(/\n/g, '<br>'); // Line breaks
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('active');
        } else {
            this.loadingOverlay.classList.remove('active');
        }
    }
      async sendToGemini(prompt, imageData) {
        try {
            const response = await window.electronAPI.sendToGemini(prompt, imageData);
            return response;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Return user-friendly error messages
            if (error.message.includes('API key')) {
                return "❌ **API Configuration Error**\n\nPlease configure your Gemini API key in the `.env` file. You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).";
            } else if (error.message.includes('rate limit')) {
                return "⏰ **Rate Limit Exceeded**\n\nToo many requests. Please wait a moment and try again.";
            } else if (error.message.includes('timeout')) {
                return "🌐 **Connection Timeout**\n\nThe request took too long. Please check your internet connection and try again.";
            } else {
                return `⚠️ **Error**\n\nSorry, I encountered an error: ${error.message}`;
            }
        }
    }
}

// Initialize the chat interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});

// Handle window focus events
window.addEventListener('focus', () => {
    document.getElementById('messageInput').focus();
});
