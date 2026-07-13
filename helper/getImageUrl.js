export const getImageUrl = (url) => {
  if (typeof url !== "string" || !url) return url;
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  
  if (url.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }
  
  if (!url.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  }
  
  return url;
};
