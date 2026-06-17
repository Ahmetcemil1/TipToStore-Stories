// ─────────────────────────────────────────
//  Shared types for TipToStore Stories
// ─────────────────────────────────────────

export interface Story {
  id: string;
  title: string;
  content: string;           // Full markdown / plain text content
  coverImage?: string;       // URL or data-URL for cover photo
  author: string;            // Wallet address (short)
  authorFull: string;        // Full wallet address
  authorAvatar: string;      // Emoji avatar
  authorBio?: string;
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED';
  hoursRemaining: number;
  maxHours: number;
  likes: number;
  views: number;
  tipsReceived: number;      // Count of tips
  tipsUSDFC: number;         // Total USDFC tipped
  isLikedByUser?: boolean;
  filecoinCID: string;
  tags: string[];
  publishedAt: string;       // ISO date string
  wordCount: number;
  readMinutes: number;
  chapters?: { title: string; content: string }[];  // Multi-chapter support
}

export interface TipRecord {
  storyId: string;
  storyTitle: string;
  amount: number;
  timestamp: string;
  txHash: string;
  tipperAddress?: string;
  authorAddress?: string;
}

export interface AuthorProfile {
  address: string;
  shortAddress: string;
  avatar: string;
  bio: string;
  storiesCount: number;
  totalTipsReceived: number;
  totalLikes: number;
  joinedAt: string;
}

export type FilterType = 'all' | 'active' | 'expiring' | 'trending' | 'expired';
export type SortType = 'recent' | 'popular' | 'expiring' | 'mostTipped';
export type ViewType = 'feed' | 'story' | 'author' | 'about' | 'write';
