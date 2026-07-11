// lib/getLocation.ts

export async function getUserLocation(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data?.country_name || 'Unknown';
  } catch (error) {
    console.error('[🌍 Location Error]', error);
    return 'Unknown';
  }
}
