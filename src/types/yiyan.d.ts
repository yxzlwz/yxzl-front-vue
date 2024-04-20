interface Yiyan {
  id: number;
  content: string;
  provenance: string | null;
  author: string | null;
  url: string | null;
  creator: User | null;
  state?: number;

  from_show?: string | null;
}
