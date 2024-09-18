import { NextResponse } from 'next/server';
import db from '../conexion';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM servicetype');
  return NextResponse.json(rows);
}
