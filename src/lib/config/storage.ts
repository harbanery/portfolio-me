import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_ROLE_KEY,
  SUPABASE_URL,
} from "./variables";

const supabaseUrl = SUPABASE_URL || "https://demo.supabase.co";
const supabaseKey = SUPABASE_ROLE_KEY || SUPABASE_ANON_KEY || "demo-key";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
