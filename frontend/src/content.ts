console.log("Background script running");
import { Marker, Skipper } from "./utils/VideoUtils";

const Initiater = async () => {
  const videoId = new URLSearchParams(window.location.search).get("v");
  console.log(videoId);
  let data;
  if (videoId) {
    chrome.runtime.sendMessage(
      { action: "getTimings", videoId },
      (response) => {
        data = response;
        data.forEach((element: any) => {
          console.log(element);
          if (element.length <= 1) return;
          let elementJson = JSON.parse(element);
          console.log(elementJson);
          console.log(elementJson["sponsored_segments"].length);
          elementJson["sponsored_segments"].forEach((element: any) => {
            // Passing to Start and End time to the function
            Marker(element.start_time, element.end_time);
            // ResizeListener(element);
            // Skipper(element.start_time, element.end_time);
          });
        });
      }
    );
  }
};




window.addEventListener("yt-navigate-finish", Initiater);
// ResizeObserver
