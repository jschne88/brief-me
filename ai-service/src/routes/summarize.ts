import express from 'express';
import { AiService } from '../services/AiService';
import { LinkedInService } from '../services/LinkedInService';
import { CacheService } from '../services/CacheService';

const router = express.Router();
let aiService: AiService;
let linkedinService: LinkedInService;
let cacheService: CacheService;

// Initialize services lazily
function initializeServices() {
  if (!aiService) {
    aiService = new AiService();
    linkedinService = new LinkedInService();
    cacheService = new CacheService();
  }
}

interface MeetingData {
  title: string;
  description?: string;
  attendees: string[];
  startTime: string;
  endTime: string;
  location?: string;
}

router.post('/summarize', async (req, res) => {
  try {
    // Initialize services on first request
    initializeServices();
    
    const meetingData: MeetingData = req.body;
    
    if (!meetingData.title) {
      return res.status(400).json({ error: 'Meeting title is required' });
    }

    // Generate cache key
    const cacheKey = `meeting-${Buffer.from(JSON.stringify(meetingData)).toString('base64')}`;
    
    // Check cache first
    const cachedResult = await cacheService.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Fetch LinkedIn profiles for attendees
    const linkedinProfiles = await Promise.allSettled(
      meetingData.attendees.map(email => linkedinService.getProfileByEmail(email))
    );

    const profiles = linkedinProfiles
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(profile => profile !== null);

    // Generate AI summary
    const summary = await aiService.generateMeetingSummary({
      ...meetingData,
      linkedinProfiles: profiles
    });

    const result = {
      summary,
      linkedinProfiles: profiles,
      timestamp: new Date().toISOString()
    };

    // Cache the result
    await cacheService.set(cacheKey, result, 3600); // Cache for 1 hour

    res.json(result);
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to generate meeting summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as summarizeRoute };