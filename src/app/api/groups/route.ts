import { NextResponse } from 'next/server';
import db from '../conexion';

export async function GET() {
  const [rows] = await db.query('SELECT link FROM whatsapp_groups');
  return NextResponse.json(rows);
}
