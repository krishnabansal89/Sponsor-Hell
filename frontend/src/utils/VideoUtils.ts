import { getTime, convertToTime } from "./Scrap";



const Marker = (start: string, end: string) => {
  let markerElement: HTMLElement | null = null;

  const createMarker = () => {
    const videoElement = document.querySelector(".video-stream.html5-main-video") as HTMLVideoElement;
    if (!videoElement) return;

    const durationElement = document.querySelector(".ytp-time-duration");
    if (!durationElement) return;

    const total_time = new Date(getTime(durationElement.textContent || ""));
    const start_time = new Date(start.length > 6 ? convertToTime(start) : getTime(start));
    const end_time = new Date(end.length > 6 ? convertToTime(end) : getTime(end));

    const youtube_timeline = document.querySelector(".ytp-progress-bar");
    if (!youtube_timeline) return;

    const timelineWidth = youtube_timeline.clientWidth;
    const left_index = (start_time.getTime() / total_time.getTime()) * timelineWidth;
    const segmentWidth = ((end_time.getTime() - start_time.getTime()) / total_time.getTime()) * timelineWidth;

    if (!markerElement) {
      markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      youtube_timeline.appendChild(markerElement);
    }

    markerElement.style.cssText = `
      position: absolute;
      left: ${left_index}px;
      top: 0;
      width: ${segmentWidth}px;
      height: 100%;
      background-color: rgba(255, 255, 0, 0.5);
      pointer-events: none;
      z-index: 1000;
    `;

    console.log("Marker Updated");
  };

  // Create and update marker when player size changes
  const resizeObserver = new ResizeObserver(() => {
    createMarker();
  });

  // Observe the video player container
  const playerContainer = document.querySelector("#movie_player");
  if (playerContainer) {
    resizeObserver.observe(playerContainer);
  }

  // Create and update marker when player mode changes
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        createMarker();
      }
    });
  });

  // Observe the body element for class changes (which indicate mode changes)
  mutationObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Initial creation of the marker
  createMarker();
  Skipper(new Date(start.length > 6 ? convertToTime(start) : getTime(start)) , new Date(end.length > 6 ? convertToTime(end) : getTime(end)))

  // Clean up function to remove observers when needed
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    if (markerElement && markerElement.parentNode) {
      markerElement.parentNode.removeChild(markerElement);
    }
  };
};


const Skipper = (start_time: Date, end_time: Date) => {
  //Skips the youtube timeline when the current video time is either in the start or end time of the Start time of the sponsored segment
  const videoElement = document.querySelectorAll(".video-stream.html5-main-video")[0] as HTMLVideoElement;
  // console.log("Skipper Running");
  videoElement.addEventListener("timeupdate", () => {
    const current_time = new Date(videoElement.currentTime);
    if (
      current_time.getTime() >= start_time.getTime() &&
      current_time.getTime() < end_time.getTime()
    ) {
      videoElement.currentTime = end_time.getTime();
    }
  });
 console.log("Skipper Added");
  
};


export { Marker, Skipper };
