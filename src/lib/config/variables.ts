export const META_TITLE: any = process.env.TITLE_WEB;
export const META_APP: any = process.env.APP_WEB;
export const META_DESCRIPTION: any = process.env.DESCRIPTION_WEB;

export const BASE_URL: any = process.env.NEXT_PUBLIC_URL;
export const API_BASE_URL: any = process.env.NEXT_PUBLIC_API_BASE_URL;

export const NODE_ENV: any = process.env.NODE_ENV || "development";

export const DATABASE_URL: any = process.env.DATABASE_URL || "";
export const DIRECT_URL: any = process.env.DIRECT_URL || "";

export const ACCESS_ADMIN: boolean = process.env.ACCESS_ADMIN === "true";

export const SUPABASE_URL: any = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ROLE_KEY: any =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const SUPABASE_ANON_KEY: any =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
