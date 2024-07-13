import { getTime, convertToTime } from "./Scrap";
const Marker = (start: string, end: string) => {
  //Getting Video MetaData
  let videoElement = document.querySelectorAll(
    ".video-stream.html5-main-video"
  )[0] as HTMLElement;
  let width_: string = videoElement.style.width.split("px")[0];
  let height_: string = videoElement.style.height.split("px")[0];
  let width = parseInt(width_);
  let height = parseInt(height_);
  console.log(width, height);

  const total_time = new Date(
    getTime(
      document.getElementsByClassName("ytp-time-duration")[0].textContent || ""
    )
  );
  let start_time, end_time;
  if (start.length > 6) start_time = new Date(convertToTime(start));
  else start_time = new Date(getTime(start));
  if (end.length > 6) end_time = new Date(convertToTime(end));
  else end_time = new Date(getTime(end));

  const left_index = (start_time.getTime() / total_time.getTime()) * width;
  const segmentWidth =
    (end_time.getTime() - start_time.getTime()) / total_time.getTime();
  const element1 = document.getElementsByClassName(
    "ytp-swatch-background-color"
  )[0];
  console.log(
    `<div class="ytp-play-progress ytp-swatch-background-color" style="left: ${left_index}px; transform: scaleX(${segmentWidth}); background-color:yellow"></div>`
  );
  element1.insertAdjacentHTML(
    "afterend",
    `<div class="ytp-play-progress ytp-swatch-background-color" style="left: ${left_index}px; transform: scaleX(${segmentWidth}); background-color:yellow"></div>`
  );
  console.log("Marker Added");
//   setInterval(() => {
    Skipper(start_time, end_time);
//   }, 1000);
};
const Skipper = (start_time: Date, end_time: Date) => {
  //Skips the youtube timeline when the current video time is either in the start or end time of the Start time of the sponsored segment
  const videoElement = document.querySelectorAll(".video-stream.html5-main-video")[0] as HTMLVideoElement;
  // console.log("Skipper Running");
  videoElement.ontimeupdate = () => {
  const current_time = new Date(videoElement.currentTime);
  if (
    current_time.getTime() >= start_time.getTime() &&
    current_time.getTime() < end_time.getTime()
  ) {
    videoElement.currentTime = end_time.getTime();
  }
}; 
 console.log("Skipper Added");
  
};
export { Marker, Skipper };
