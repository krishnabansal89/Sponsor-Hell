// Desc: This file contains the routing for the application
import express, { Request, Response } from "express";
import {
  getSubtitle,
  downloadSubtitle,
  translateSubtitle,
  defineSkip,
} from "./utils";
const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

router.post("/caption", (req: Request, res: Response) => {
  console.log(req.body);
  const id = req.body["videoId"];
  if (!id) return res.status(400).send("videoId is required");
  getSubtitle(id)
    .then((data: any) => {
      console.log(data);
      // console.log(data.length);
      // console.log(data[0]);
      console.log(data["response"]["formats"]);
      if (data["response"]["formats"]) console.log(data["response"]["formats"]);
      {
        for (const item of data["response"]["formats"]) {
          if (item["code"] === "en" || item["code"] === "en-IN") {
            console.log(item["url"]);
            // res.send(data);
            downloadSubtitle(item["url"]).then(async (data) => {
              var dataArr = data.split("\n");
              let timeStamps: any = [];
              for (let i = 0; i < dataArr.length; i = i + 500) {
                let temp = dataArr.slice(i, i + 500).join("\n");
                let json_Res = await defineSkip(temp);
                timeStamps.push(json_Res);
                timeStamps.push("\n");
              }
              res.send(timeStamps);
            });
            break;
          } else if (item["code"] === "hi") {
            console.log(item["url"]);
            translateSubtitle(item["url"]).then(async (data) => {
              var dataArr = data.split("\n");
              let timeStamps: any = [];
              for (let i = 0; i < dataArr.length; i = i + 500) {
                let temp = dataArr.slice(i, i + 500).join("\n");
                let json_Res = await defineSkip(temp);
                timeStamps.push(json_Res);
                timeStamps.push("\n");
              }
              res.send(timeStamps);
            });
          }
        }
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

export default router;
