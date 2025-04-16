/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Database {
	public: {
		Tables: {
			audits: {
				Row: {
          id: string,
          type: string,
          description: string,
          icon: string,
          status: string,
          created_at: string,
          updated_at: string
				},
			},
		},
	};
}