const { desktopCapturer } = require('electron');

class ScreenCapture {
    constructor() {
        this.captureConfig = {
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 }
        };
    }
    
    async captureScreen() {
        try {
            const sources = await desktopCapturer.getSources(this.captureConfig);
            
            if (sources.length === 0) {
                throw new Error('No screen sources available');
            }
            
            // Get the primary screen (first source)
            const primaryScreen = sources[0];
            
            // Return the thumbnail as a data URL
            return primaryScreen.thumbnail.toDataURL();
            
        } catch (error) {
            console.error('Screen capture error:', error);
            throw new Error(`Failed to capture screen: ${error.message}`);
        }
    }
    
    async captureSpecificDisplay(displayId) {
        try {
            const sources = await desktopCapturer.getSources(this.captureConfig);
            
            const targetSource = sources.find(source => source.display_id === displayId);
            
            if (!targetSource) {
                throw new Error(`Display with ID ${displayId} not found`);
            }
            
            return targetSource.thumbnail.toDataURL();
            
        } catch (error) {
            console.error('Specific display capture error:', error);
            throw new Error(`Failed to capture display ${displayId}: ${error.message}`);
        }
    }
    
    async getAvailableDisplays() {
        try {
            const sources = await desktopCapturer.getSources(this.captureConfig);
            
            return sources.map(source => ({
                id: source.id,
                name: source.name,
                displayId: source.display_id,
                thumbnail: source.thumbnail.toDataURL()
            }));
            
        } catch (error) {
            console.error('Get displays error:', error);
            throw new Error(`Failed to get available displays: ${error.message}`);
        }
    }
}

module.exports = ScreenCapture;
