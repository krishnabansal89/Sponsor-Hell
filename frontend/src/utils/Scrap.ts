const getTime = (video_time:string)=>{
    // const video_time = document.getElementsByClassName("ytp-time-duration")[0].textContent;
    const video_time_split = video_time?.split(":");
    const total_time = parseInt(video_time_split?video_time_split[0]:"")*60 + parseInt(video_time_split?video_time_split[1]:"");
    return total_time;
}

const convertToTime = (time: string) => {
    const time_split = time.split(":");
    const total_time = parseInt(time_split[0])*3600 + parseInt(time_split[1])*60 + parseInt(time_split[2]);
    return total_time;
}

export {getTime, convertToTime};