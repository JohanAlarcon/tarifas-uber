import { NextResponse } from 'next/server';
import db from '../conexion';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
  const [rows] = await db.query('SELECT * FROM servicetype');
  return NextResponse.json(rows);
  }catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return NextResponse.json({ error: 'Error al ejecutar la consulta' }, { status: 500 });
  }
}
