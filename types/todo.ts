export type Todo = {
  id: string;
  title: string;
  done: boolean;
  created_at: string; // ISO timestamp from Supabase
};
