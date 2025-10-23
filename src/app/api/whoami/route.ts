export async function GET(req: Request) {
  const url = new URL(req.url);
  return new Response(JSON.stringify({ host: url.host }), {
    headers: { 'content-type': 'application/json' },
  });
}
