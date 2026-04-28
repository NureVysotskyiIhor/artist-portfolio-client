export interface NominatimFeature {
  displayName: string;
  lat: string;
  lon: string;
}

export const searchCityOrCountry = async (query: string): Promise<NominatimFeature[]> => {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/nominatim/search?${params.toString()}`);
  if (!response.ok) return [];
  return response.json() as Promise<NominatimFeature[]>;
};
