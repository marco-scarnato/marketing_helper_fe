export interface ToneOfVoice {
  style: string;
  language: string;
  do_say: string[];
  dont_say: string[];
}

export interface VisualIdentity {
  color_palette: string[];
  typography: string;
  imagery_style: string;
  logo_usage_notes: string;
}

export interface CustomerProfile {
  demographics: string;
  psychographics: string;
  pain_points: string[];
  goals: string[];
  buying_triggers: string[];
}

export interface LogoAsset {
  path: string;
  variant: 'icon' | 'horizontal' | 'negative' | 'positive';
  uploaded_at?: string;
}

export interface BrandIdentity {
  id: string;
  client_id: string;
  business_description: string;
  mission: string;
  vision: string;
  unique_value_proposition: string;
  tone_of_voice: ToneOfVoice;
  visual_identity: VisualIdentity;
  target_audience: CustomerProfile;
  competitors: string[];
  differentiators: string[];
  products_services: string[];
  keywords_seo: string[];
  approved_claims: string[];
  restricted_topics: string[];
  legal_notes: string;
  cta_primary: string;
  cta_secondary: string;
  preferred_channels: string[];
  logos: LogoAsset[];
  ai_last_prompt?: string;
  ai_last_response?: string;
  created_at: string;
  updated_at: string;
}

export type BrandIdentityUpdate = Partial<Omit<BrandIdentity, 'id' | 'created_at' | 'updated_at'>> & { client_id?: string };

export interface AIBrandPromptRequest { client_id: string; prompt: string; section: string; }
export interface AIBrandPromptResponse { section: string; proposed: Record<string, any>; reasoning: string; }
