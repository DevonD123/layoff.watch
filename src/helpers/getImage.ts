interface IImageProps {
  url?: string;
  fallbackUrl?: string;
  size?: number;
}
const getImage = ({ url, fallbackUrl, size }: IImageProps) => {
  return getURl(url || fallbackUrl, size);
};

const getURl = (url?: string, size?: number) => {
  if (!url) {
    return "";
  }
  if (url.includes("clearbit.com")) {
    if (size) {
      return `${url}?size=${size}&format=png`;
    }
    return `${url}?format=png`;
  }
  return getSavedImage(url);
};

const getSavedImage = (path: string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
};

export default getImage;
