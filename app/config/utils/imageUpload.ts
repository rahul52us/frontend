import { readFileAsBase64 } from "./utils";

type WebpConversionOptions = {
  quality?: number;
};

type ImageUploadFlags = {
  isAdd?: number;
  isDeleted?: number;
};

const NON_CONVERTIBLE_IMAGE_TYPES = new Set(["image/gif", "image/svg+xml"]);

const replaceFileExtension = (filename: string, nextExtension: string) => {
  const safeExtension = nextExtension.replace(/^\./, "");
  const baseName = filename.replace(/\.[^/.]+$/, "");
  return `${baseName}.${safeExtension}`;
};

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image for WebP conversion."));
    image.src = src;
  });

const shouldConvertToWebp = (file: File) =>
  Boolean(file?.type?.startsWith("image/")) &&
  !NON_CONVERTIBLE_IMAGE_TYPES.has(file.type) &&
  file.type !== "image/webp";

export const convertImageFileToWebp = async (
  file: File,
  { quality = 0.88 }: WebpConversionOptions = {}
): Promise<File> => {
  if (!file || typeof window === "undefined" || !shouldConvertToWebp(file)) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });

    if (!webpBlob) {
      return file;
    }

    return new File([webpBlob], replaceFileExtension(file.name, "webp"), {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const buildBase64ImageUpload = async (
  file: File,
  { isAdd = 1, isDeleted = 0 }: ImageUploadFlags = {}
) => {
  const normalizedFile = await convertImageFileToWebp(file);
  const buffer = (await readFileAsBase64(normalizedFile)) as unknown as string;

  return {
    buffer,
    filename: normalizedFile.name,
    type: normalizedFile.type || "image/webp",
    isAdd,
    isDeleted,
  };
};
