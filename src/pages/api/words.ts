// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

export type Word = { id: string; english: string; spanish: string };
export type Response = {
  data?: Array<Word> | any;
  error?: boolean;
  message?: string;
  status?: boolean;
};

const uui4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const filePath = path.join(process.cwd(), "src", "db");
  if (req.method === "GET") {
    try {
      const jsonFile = await fs.readFile(filePath + "/words.json", "utf-8");
      const data: Array<Word> = JSON.parse(jsonFile);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(200).json({ error: true, message: "File not found" });
    }
  }
  if (req.method === "POST") {
    try {
      const { english, spanish } = req.body;
      const jsonFile = await fs.readFile(filePath + "/words.json", "utf-8");
      const data: Array<Word> = JSON.parse(jsonFile);
      data.push({ id: uui4(), english, spanish });
      await fs.writeFile(filePath + "/words.json", JSON.stringify(data));
      res.status(201).json({ error: false });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: "No se pudo agregar la palabra" + error,
      });
    }
  }
}
