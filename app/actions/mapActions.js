"use server";

export async function getGoogleMapEmbedUrl(shortUrl) {
  try {
    const res = await fetch(shortUrl);
    const resolvedUrl = res.url;
    
    // Extract place name if present
    let match = resolvedUrl.match(/\/place\/([^\/]+)/);
    if (match) {
      return `https://maps.google.com/maps?q=${match[1]}&output=embed`;
    }
    
    // Extract coordinates if present
    match = resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return `https://maps.google.com/maps?q=${match[1]},${match[2]}&output=embed`;
    }
    
    // Extract 'q' query parameter if present
    const urlObj = new URL(resolvedUrl);
    if (urlObj.searchParams.has('q')) {
      return `https://maps.google.com/maps?q=${urlObj.searchParams.get('q')}&output=embed`;
    }
    
    return null; // Return null if unable to resolve an embed format
  } catch (error) {
    console.error("Error resolving map url:", error);
    return null;
  }
}
