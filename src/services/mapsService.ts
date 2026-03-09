
import { GoogleGenAI } from "@google/genai";

export interface GroundedLocation {
  name: string;
  uri: string;
}

/**
 * Uses Gemini 2.5 Flash with Maps Grounding to find industry-specific facilities.
 * This is the primary method for getting real-world verified location data.
 */
export const searchServiceLocations = async (query: string): Promise<GroundedLocation[]> => {
  // Initializing AI client with environment key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Attempt to get high-accuracy coordinates for the tool config
  let latLng = undefined;
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    latLng = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (e) {
    console.warn("Grounding: Geolocation unavailable or denied, falling back to query context.");
  }

  try {
    // Requirements specify gemini-2.5-flash for maps grounding
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are the Cricket DCA Logistics Agent. 
                 Identify verified TWAIN conformance labs, authorized office equipment service centers, robotics parts distributors, or dealer support hubs near: ${query}. 
                 Provide the business names and direct Google Maps links.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: latLng
          }
        }
      },
    });

    const locations: GroundedLocation[] = [];
    
    // Safety check for candidates and grounding metadata
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const chunks = candidates[0].groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.maps) {
            locations.push({
              name: chunk.maps.title || "Authorized Facility",
              uri: chunk.maps.uri || "https://maps.google.com",
            });
          }
        });
      }
    }

    return locations;
  } catch (error) {
    console.error("❌ Maps Grounding Logic Failure:", error);
    return [];
  }
};
