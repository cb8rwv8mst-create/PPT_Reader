export interface Slide {
  index: number;
  title: string;
  content: string;
  notes: string;
}

export interface UploadResponse {
  id: string;
  slides: Slide[];
}

export interface NarrateResponse {
  fullScript: string;
  slideScripts: string[];
}