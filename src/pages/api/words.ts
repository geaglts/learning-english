// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export type Word = { id: string; english: string; spanish: string };
export type Response = {
  data?: Array<Word>;
  error?: boolean;
  message?: string;
  status?: boolean;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "GET") {
    try {
      const data = await prisma.word.findMany();
      res.status(200).json({ data });
    } catch (error) {
      res.status(200).json({
        error: true,
        message: "We can't get your information, sorry, we're working on that.",
      });
    }
  }
  if (req.method === "POST") {
    try {
      const { english, spanish } = req.body;
      const status = await prisma.word.create({ data: { english, spanish } });
      if (status.id) {
        return res.json({ error: false });
      }
      res.json({ error: true });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: "No se pudo agregar la palabra",
      });
    }
  }
}
