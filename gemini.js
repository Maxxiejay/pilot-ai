const axios = require('axios');

class GeminiAPI {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        
        if (!this.apiKey) {
            console.warn('Gemini API key not found. Please set GEMINI_API_KEY in your .env file');
        }
    }
    
    async generateResponse(prompt, imageData) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        try {
            // Prepare the request payload
            const payload = {
                contents: [{
                    parts: [
                        {
                            text: `You are a helpful AI assistant that can see the user's screen. The user is asking: "${prompt}". Please provide a helpful response based on what you can see in the image and the user's question. Be concise but informative.`
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
            
            // Add image if provided
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
