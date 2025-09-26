import type { Video } from "./video"
import type { File } from "./file"

export interface Issue {
  id: number;
  title: string;
  vignette?: string;
  introduction?: string;
  videoUrl?: string;
  videoDescription?: string;
  content?: string;
  solutions?: Video[];
  testimonies?: Video[];
  appendix?: File[];
  links?: {
    title: string;
    url: string;
  }[];
}