import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

type SessionData = {
  uid?: string;
};

const sessionOptions = {
  password: process.env.SESSION_SECRET || '',
  cookieName: 'session_uid',
  
};

// GET /api/session
export async function GET(req: NextRequest) {
  // Creamos un objeto NextResponse inicial para poder inyectar las cookies de sesión
  const res = NextResponse.next();

  // Recuperamos la sesión desde la request y la response
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (session.uid) {
    return NextResponse.json({ uid: session.uid });
  } else {
    return NextResponse.json({ message: 'No session found' }, { status: 404 });
  }
}

// POST /api/session
export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const body = await req.json();
  const { uid } = body;

  if (!uid) {
    return NextResponse.json({ message: 'UID is required' }, { status: 400 });
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  // Guardamos el UID en la sesión y persistimos
  session.uid = uid;
  await session.save();

  // Devolvemos la response final (incluye la cookie de sesión actualizada)
  return NextResponse.json({ message: 'Session updated successfully' });
}
