import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.API_KEY });
const getSubtitle = (videoId: string) => {
  return new Promise((resolve, reject) => {
    fetch("https://savesubs.com/action/extract", {
      method: "POST",
      body: JSON.stringify({
        data: { url: "https://www.youtube.com/watch?v=" + videoId },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token":
          "qMbamaerxqtgnKTTmJSXbWjIbmRumspnZJmdapZvZ5tfXMqHrJivgK+63oCkgLyLgYuHv5J9pI13",
        "X-Requested-Domain": "savesubs.com",
        Origin: "https://savesubs.com",
        "X-Requested-With": "xmlhttprequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    }).then((response) => {
      // console.log(response);
      resolve(response.json());
    });
  });
};

const downloadSubtitle = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch("https://savesubs.com" + url + "?ext=srt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token":
          "qMbamaerxqtgnKTTmJSXbWjIbmRumspnZJmdapZvZ5tfXMqHrJivgK+63oCkgLyLgYuHv5J9pI13",
        "X-Requested-Domain": "savesubs.com",
        Origin: "https://savesubs.com",
        "X-Requested-With": "xmlhttprequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    }).then((response) => {
      resolve(response.text());
    });
  });
};
const translateSubtitle = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    url = url.replace("/save/0", "/save/translate");
    fetch("https://savesubs.com" + url + "?slang=hi&tlang=en&ext=srt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token":
          "qMbamaerxqtgnKTTmJSXbWjIbmRumspnZJmdapZvZ5tfXMqHrJivgK+63oCkgLyLgYuHv5J9pI13",
        "X-Requested-Domain": "savesubs.com",
        Origin: "https://savesubs.com",
        "X-Requested-With": "xmlhttprequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    }).then((response) => {
      resolve(response.text());
    });
  });
};
const defineSkip = async (transcript: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'Analyze the following video transcript and identify explicit instances of sponsored content, including their build-up. Return the results in JSON format, including the start and end times (in MM:SS format) and a description of the sponsored content. Strictly don\'t give any Note , additional information except json. Focus on clear, substantial promotions or product placements that are unmistakably separate from the main content, including their introductions and context-setting.\nStrict rules for identifying sponsored content:\n\nInclude segments that contain explicit sponsorship language such as "This video is sponsored by", "Thanks to [Brand] for sponsoring this video", or "Use promo code [X] for a discount".\nInclude the build-up to these explicit mentions, such as transitions like "Before we continue, I want to talk about..." or "Now, let\'s take a moment to discuss...".\nThe entire sponsored segment, including build-up, must be at least 30 seconds long to be included.\nProduct demonstrations or reviews must be clearly labeled as sponsored to be included.\nIgnore any mentions of products or services that are not explicitly identified as sponsored content.\nIf there\'s any doubt about whether a segment is sponsored, do not include it.\n\nTiming rules:\n\nThe start_time should be the moment the speaker begins transitioning to sponsored content or introducing a sponsored segment.\nThe end_time should be when the speaker clearly transitions back to non-sponsored content.\nInclude all relevant information about the sponsorship, including build-up, product information, and calls to action.\n\nExample output format:\n{\n"sponsored_segments": [\n{\n"start_time": "05:15",\n"end_time": "07:30",\n"description": "Transition to sponsored content, explicit sponsorship by [Brand], product demonstration, and discount code"\n}\n]\n}\nIf no sponsored segments meeting these criteria are found, return an empty list:\n{\n"sponsored_segments": []\n}\nTranscript:\n',
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.3,
    max_tokens: 8192,
    top_p: 0.8,
    stream: false,
    response_format: {
      type: "json_object",
    },
    stop: null,
  });
  console.log(chatCompletion.choices[0].message.content);
  return chatCompletion.choices[0].message.content;
};
async function stringToJson(transcript: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'You are tasked with converting information about sponsored content segments in a transcript into a structured JSON format. The input will provide details about each sponsored segment, including start times, end times, and descriptions. Your job is to extract this information, format it according to the specified JSON structure, and merge segments that are close together.\n\nInput Format:\nThe input will consist of numbered entries describing sponsored content segments. Each entry will include:\n- A timestamp for when the segment starts\n- A quote or description of the sponsored content\n- Additional details about the product or service being promoted\n- Start time\n- End time\n- Any other relevant information\n\nOutput Format:\nYou should produce a JSON object with a single key "sponsored_segments" containing an array of objects. Each object in the array should represent a sponsored segment and have the following structure:\n{\n  "start_time": "HH:MM:SS",\n  "end_time": "HH:MM:SS",\n  "description": "Brief description of the sponsored content"\n}\n\nRules:\n1. Convert all timestamps to the format "HH:MM:SS". Ensure that hours, minutes, and seconds are always two digits (e.g., "01:05:09" instead of "1:5:9"). This format is compatible with JavaScript\'s Date object when prefixed with a date.\n2. Provide a concise description for each segment, summarizing the key points.\n3. Include all identified sponsored segments in the output.\n4. Ensure the JSON is properly formatted and valid.\n5. Merge segments if the start time of a segment is within 10 seconds of the end time of the previous segment.\n   - When merging, use the earlier start time and the later end time.\n   - Combine the descriptions, removing any redundancy.\n\nExample Input:\n Now, process the following input and provide the output in the specified JSON format, remembering to merge segments that are within 10 seconds of each other:\n If no sponsored segments meeting these criteria are found, return an blank list Strictly :\n{\n"sponsored_segments": []\n}\n',
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 0.9,
    stream: false,
    response_format: {
      type: "json_object",
    },

    stop: null,
  });

  return chatCompletion.choices[0].message.content;
}

export { getSubtitle, downloadSubtitle, translateSubtitle, defineSkip };
