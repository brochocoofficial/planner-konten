/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_KEY?: string;
  readonly VITE_OWNER_KEY?: string;
  readonly VITE_USER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
