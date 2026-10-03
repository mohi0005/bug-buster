export interface BugAnalysis {
  whatIsWrong: string;
  whyItIsHappening: string;
  howToFix: string[];
  immediateNextAction: string;
  errorType?: string;
  confidence?: 'High' | 'Medium' | 'Low';
}

export interface UploadedFileState {
  file: File;
  previewUrl: string;
  base64Data?: string;
  mimeType: string;
  name: string;
  sizeFormatted: string;
}
