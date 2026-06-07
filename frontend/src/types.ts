export interface SlideImage {
  imageId: string;
  mimeType: string;
  description: string;
}

export interface Slide {
  index: number;
  title: string;
  content: string;
  notes: string;
  images?: SlideImage[];
}

export interface UploadResponse {
  id: string;
  slides: Slide[];
}

export interface NarrateResponse {
  fullScript: string;
  slideScripts: string[];
}