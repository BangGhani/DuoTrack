export type Gender = 1 | 2;

export type Profile = {
  id: string;
  name: string | null;
  gender: Gender | null;
  birth: string | null;
  couple_id: string | null;
  created_at: string;
};

export type Couple = {
  id: string;
  invite_code: string;
  created_at: string;
};