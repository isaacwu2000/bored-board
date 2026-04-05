import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getMessages() {
  const data = await sql`
    SELECT id, created_at, name, text
    FROM messages
    ORDER BY created_at DESC
    LIMIT 30
   `;

 	return data;
}

async function addMessage(name: string, text: string) {
  await sql`
    INSERT INTO messages (created_at, name, text)
    VALUES (${new Date()}, ${name}, ${text})
    
  `
}

export async function GET() {
  try {
    return Response.json(await getMessages());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    await addMessage(body.name, body.text);
    return Response.json({ success: true },);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
