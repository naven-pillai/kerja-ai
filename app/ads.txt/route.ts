// app/ads.txt/route.ts
export function GET() {
    return new Response(
      `google.com, pub-7483313879152211, DIRECT, f08c47fec0942fa0`,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }
  