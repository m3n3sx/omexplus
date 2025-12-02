"use client";

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  currentStatus: string;
}

const statusIcons: Record<string, string> = {
  pending: "⏳",
  picked_up: "📦",
  in_transit: "🚚",
  out_for_delivery: "🚛",
  delivered: "✅",
  failed: "❌",
  cancelled: "🚫",
};

export function TrackingTimeline({ events, currentStatus }: TrackingTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="tracking-timeline">
      <div className="current-status">
        <span className="status-icon">{statusIcons[currentStatus] || "📍"}</span>
        <span className="status-text">{currentStatus.replace(/_/g, " ").toUpperCase()}</span>
      </div>

      <div className="timeline">
        {sortedEvents.map((event, index) => (
          <div key={index} className="timeline-event">
            <div className="event-marker">
              <div className="marker-dot"></div>
              {index < sortedEvents.length - 1 && <div className="marker-line"></div>}
            </div>
            <div className="event-content">
              <div className="event-header">
                <span className="event-status">{event.status.replace(/_/g, " ")}</span>
                <span className="event-time">{formatDate(event.timestamp)}</span>
              </div>
              {event.location && (
                <div className="event-location">📍 {event.location}</div>
              )}
              {event.description && (
                <div className="event-description">{event.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .tracking-timeline {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .current-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f0f8ff;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .status-icon {
          font-size: 32px;
        }

        .status-text {
          font-size: 18px;
          font-weight: 600;
          color: #0070f3;
        }

        .timeline {
          position: relative;
        }

        .timeline-event {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .timeline-event:last-child {
          margin-bottom: 0;
        }

        .event-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .marker-dot {
          width: 12px;
          height: 12px;
          background: #0070f3;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #0070f3;
          z-index: 1;
        }

        .marker-line {
          width: 2px;
          flex: 1;
          background: #e0e0e0;
          margin-top: 4px;
          min-height: 40px;
        }

        .event-content {
          flex: 1;
          padding-bottom: 8px;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .event-status {
          font-weight: 600;
          font-size: 16px;
          text-transform: capitalize;
        }

        .event-time {
          font-size: 14px;
          color: #666;
        }

        .event-location {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .event-description {
          font-size: 14px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
