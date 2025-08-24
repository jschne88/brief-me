import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

interface MeetingSummary {
  title: string;
  attendees: string[];
  summary: string;
  linkedinProfiles: any[];
  loading: boolean;
  error?: string;
}

const Popup: React.FC = () => {
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary>({
    title: "",
    attendees: [],
    summary: "",
    linkedinProfiles: [],
    loading: true,
  });

  useEffect(() => {
    // Get meeting data from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { action: "getMeetingData" },
        (response) => {
          if (response && response.meetingData) {
            fetchMeetingSummary(response.meetingData);
          } else {
            setMeetingSummary((prev) => ({
              ...prev,
              loading: false,
              error: "No meeting data found",
            }));
          }
        },
      );
    });
  }, []);

  const fetchMeetingSummary = async (meetingData: any) => {
    try {
      const response = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      const data = await response.json();
      setMeetingSummary({
        title: meetingData.title,
        attendees: meetingData.attendees || [],
        summary: data.summary,
        linkedinProfiles: data.linkedinProfiles || [],
        loading: false,
      });
    } catch (error) {
      setMeetingSummary((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch meeting summary",
      }));
    }
  };

  if (meetingSummary.loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (meetingSummary.error) {
    return (
      <div className="text-red-500 text-center p-4">{meetingSummary.error}</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {meetingSummary.title}
        </h2>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">Summary</h3>
        <p className="text-sm text-gray-600">{meetingSummary.summary}</p>
      </div>

      {meetingSummary.attendees.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Attendees</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {meetingSummary.attendees.map((attendee, index) => (
              <li key={index}>{attendee}</li>
            ))}
          </ul>
        </div>
      )}

      {meetingSummary.linkedinProfiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">LinkedIn Profiles</h3>
          <div className="space-y-2">
            {meetingSummary.linkedinProfiles.map((profile, index) => (
              <div key={index} className="text-sm bg-white p-2 rounded border">
                <p className="font-medium">{profile.name}</p>
                <p className="text-gray-600">{profile.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Initialize React app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
