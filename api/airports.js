export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.VITE_AIRLABS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing VITE_AIRLABS_API_KEY on server' })
  }

  const upstream = new URL('https://airlabs.co/api/v9/airports')
  upstream.searchParams.set('country_code', 'CH')
  upstream.searchParams.set('_fields', 'name,iata_code,icao_code,lat,lng')
  upstream.searchParams.set('api_key', apiKey)

  try {
    const response = await fetch(upstream)
    const payload = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(payload)
    }

    return res.status(200).json(payload)
  } catch {
    return res.status(502).json({ error: 'Failed to fetch Airlabs API' })
  }
}
