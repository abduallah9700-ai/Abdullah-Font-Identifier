export interface FontMatch {
  name: string;
  description: string;
}

export interface FontAnalysisResponse {
  primary_font_name: string;
  confidence_level: number;
  matches: FontMatch[];
}
