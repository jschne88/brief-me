// Content script for Google Calendar integration

interface MeetingData {
  title: string;
  description?: string;
  attendees: string[];
  startTime: string;
  endTime: string;
  location?: string;
}

class CalendarIntegration {
  private briefMeButtons: Set<HTMLElement> = new Set();
  private currentMeetingData: MeetingData | null = null;

  init() {
    this.observeCalendarChanges();
    this.setupMessageListener();
  }

  private observeCalendarChanges() {
    const observer = new MutationObserver(() => {
      this.addBriefMeButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial setup
    setTimeout(() => this.addBriefMeButtons(), 1000);
  }

  private addBriefMeButtons() {
    // Look for calendar event elements
    const eventElements = document.querySelectorAll("[data-eventid]");

    eventElements.forEach((eventElement) => {
      const htmlElement = eventElement as HTMLElement;

      // Skip if button already exists
      if (htmlElement.querySelector(".brief-me-button")) {
        return;
      }

      // Create Brief Me button
      const button = document.createElement("button");
      button.className = "brief-me-button";
      button.textContent = "Brief Me";
      button.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        z-index: 1000;
        display: none;
      `;

      // Show button on hover
      htmlElement.addEventListener("mouseenter", () => {
        button.style.display = "block";
      });

      htmlElement.addEventListener("mouseleave", () => {
        button.style.display = "none";
      });

      // Handle button click
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.handleBriefMeClick(htmlElement);
      });

      htmlElement.style.position = "relative";
      htmlElement.appendChild(button);
      this.briefMeButtons.add(button);
    });
  }

  private handleBriefMeClick(eventElement: HTMLElement) {
    const meetingData = this.extractMeetingData(eventElement);
    this.currentMeetingData = meetingData;

    // Open popup or send message to background script
    chrome.runtime.sendMessage({
      action: "openPopup",
      meetingData: meetingData,
    });
  }

  private extractMeetingData(eventElement: HTMLElement): MeetingData {
    // Extract meeting information from the calendar event element
    const titleElement = eventElement.querySelector('[data-text="true"]');
    const title = titleElement?.textContent || "Unknown Meeting";

    // Try to extract attendees (this may need adjustment based on Google Calendar's DOM structure)
    const attendeesElements = eventElement.querySelectorAll("[data-email]");
    const attendees = Array.from(attendeesElements)
      .map((el) => el.getAttribute("data-email") || el.textContent || "")
      .filter((email) => email.includes("@"));

    // Extract time information
    const timeElement =
      eventElement.querySelector("[data-start-time]") ||
      eventElement.querySelector("time");
    const startTime =
      timeElement?.getAttribute("data-start-time") ||
      timeElement?.getAttribute("datetime") ||
      "";

    const endTimeElement = eventElement.querySelector("[data-end-time]");
    const endTime = endTimeElement?.getAttribute("data-end-time") || "";

    return {
      title,
      attendees,
      startTime,
      endTime,
      description: "", // Would need more complex extraction
      location: "", // Would need more complex extraction
    };
  }

  private setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getMeetingData") {
        sendResponse({ meetingData: this.currentMeetingData });
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const integration = new CalendarIntegration();
    integration.init();
  });
} else {
  const integration = new CalendarIntegration();
  integration.init();
}
