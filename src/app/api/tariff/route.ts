import { NextResponse } from 'next/server';
import db from '../conexion';

//http://localhost:3000/api/tariff?service_type_id=2

export async function GET(request: Request) {
  try {
  const { searchParams } = new URL(request.url); 
  const service_type_id = searchParams.get('service_type_id');

  if (!service_type_id) {
    return NextResponse.json({ error: 'Missing service_type_id parameter' }, { status: 400 });
  }

   
    const [rows] = await db.query('SELECT * FROM tariff WHERE service_type_id = ?', [service_type_id]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return NextResponse.json({ error: 'Error al ejecutar la consulta' }, { status: 500 });
  }
}
