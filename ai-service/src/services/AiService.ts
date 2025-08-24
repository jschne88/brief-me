import OpenAI from 'openai';

interface MeetingDataWithProfiles {
  title: string;
  description?: string;
  attendees: string[];
  startTime: string;
  endTime: string;
  location?: string;
  linkedinProfiles: any[];
}

export class AiService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateMeetingSummary(meetingData: MeetingDataWithProfiles): Promise<string> {
    console.log(meetingData);
    return '';
    const profileSummaries = meetingData.linkedinProfiles
      .map((profile) => `- ${profile.name}: ${profile.title} at ${profile.company}`)
      .join('\n');

    const prompt = `
Generate a concise meeting summary for the following meeting:

**Meeting Details:**
- Title: ${meetingData.title}
- Time: ${meetingData.startTime} - ${meetingData.endTime}
- Location: ${meetingData.location || 'Not specified'}
- Description: ${meetingData.description || 'No description provided'}

**Attendees:**
${meetingData.attendees.join(', ')}

**LinkedIn Profiles Found:**
${profileSummaries || 'No LinkedIn profiles found'}

Please provide:
1. A brief overview of what this meeting might be about based on the title and attendees
2. Key participants and their roles/companies (if LinkedIn data available)
3. Suggested talking points or preparation items
4. Any relevant context that might be helpful

Keep the summary concise but informative, around 2-3 paragraphs.

If any information is missing, don't point it out, just work with what you have.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that creates meeting summaries to help people prepare for their upcoming meetings. Be professional and concise.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
      console.error('Error generating AI summary:', error);
      throw new Error('Failed to generate AI summary');
    }
  }
}
