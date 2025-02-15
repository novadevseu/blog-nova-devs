import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";

type SessionData = {
  uid?: string;
};

export async function get(req: NextApiRequest, res: NextApiResponse) {
  console.log("naberrrr");
  const session = await getIronSession<SessionData>(req, res, {
    password: process.env.SESSION_SECRET || "",
    cookieName: "session_uid",
  });
  if (session?.uid) {
    res.status(200).json({ uid: session.uid });
  } else {
    res.status(404).json({ message: "No session found" });
  }
}

export async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  const session = await getIronSession<SessionData>(req, res, {
    password: process.env.SESSION_SECRET || "",
    cookieName: "session_uid",
  });

  session.uid = uid;

  await session.save();

  res.status(200).json({ message: "Session updated successfully" });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await post(req, res);
  } else if (req.method === "GET") {
    await get(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
