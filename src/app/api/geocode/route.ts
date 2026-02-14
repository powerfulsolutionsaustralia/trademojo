import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Geocoding not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&result_type=locality|sublocality|postal_code`
    );
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const components = data.results[0].address_components;
      let suburb = '';
      let state = '';
      let postcode = '';

      for (const comp of components) {
        if (comp.types.includes('locality') || comp.types.includes('sublocality')) {
          suburb = comp.long_name;
        }
        if (comp.types.includes('administrative_area_level_1')) {
          state = comp.short_name;
        }
        if (comp.types.includes('postal_code')) {
          postcode = comp.long_name;
        }
      }

      return NextResponse.json({ suburb, state, postcode });
    }

    return NextResponse.json({ error: 'No results' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
