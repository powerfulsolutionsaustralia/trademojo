export type ConversationStep = 'idle' | 'trade' | 'location' | 'problem' | 'searching' | 'results';

export interface MojoMessage {
  role: 'user' | 'mojo';
  content: string;
  tradies?: MojoTradieResult[];
  quickReplies?: string[];
}

export interface MojoTradieResult {
  id: string;
  business_name: string;
  slug: string;
  trade_category: string;
  short_description: string;
  average_rating: number;
  review_count: number;
  suburb: string;
  state: string;
  phone?: string;
  website?: string;
  place_id?: string;
}
