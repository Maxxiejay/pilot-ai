const axios = require('axios');

class GeminiAPI {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        
        if (!this.apiKey) {
            console.warn('Gemini API key not found. Please set GEMINI_API_KEY in your .env file');
        }
    }    async generateResponse(prompt, imageData) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        try {
            // System prompt that defines the AI's role and behavior
            const systemPrompt = `You are Pilot AI, a helpful desktop assistant that can see and analyze the user's screen. Your role is to:

- Provide context-aware help based on what you can see on the user's screen
- Offer specific, actionable advice and solutions
- Help with software issues, UI navigation, coding problems, or any task visible on screen
- Be concise but thorough in your explanations
- Always reference what you can see in the screenshot when relevant
- Maintain a friendly, professional tone

When analyzing the screen, pay attention to:
- Application windows and their content
- Error messages or dialog boxes
- Code editors and their content
- Browser pages and their content
- System interfaces and settings
- Any visual elements that might be relevant to the user's question

User's question: ${prompt}`;

            // Prepare the request payload with combined system and user message
            const payload = {
                contents: [{
                    parts: [
                        {
                            text: systemPrompt
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };
            
            // Add image to the message if provided
            if (imageData) {
                // Convert data URL to base64
                const base64Data = imageData.split(',')[1];
                payload.contents[0].parts.push({
                    inlineData: {
                        mimeType: 'image/png',
                        data: base64Data
                    }
                });
            }
            
            const response = await axios.post(
                `${this.baseURL}?key=${this.apiKey}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000 // 30 second timeout
                }
            );
            
            if (response.data && response.data.candidates && response.data.candidates[0]) {
                const content = response.data.candidates[0].content;
                if (content && content.parts && content.parts[0]) {
                    return content.parts[0].text;
                }
            }
            
            throw new Error('Invalid response format from Gemini API');
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            
            if (error.response) {
                // API returned an error response
                const status = error.response.status;
                const message = error.response.data?.error?.message || 'Unknown API error';
                
                if (status === 401) {
                    throw new Error('Invalid Gemini API key. Please check your .env file.');
                } else if (status === 429) {
                    throw new Error('API rate limit exceeded. Please try again later.');
                } else if (status === 400) {
                    throw new Error('Invalid request format. Please try again.');
                } else {
                    throw new Error(`API Error (${status}): ${message}`);
                }
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Please check your internet connection.');
            } else {
                throw new Error('Failed to connect to Gemini API. Please check your internet connection.');
            }
        }
    }
}

module.exports = GeminiAPI;
