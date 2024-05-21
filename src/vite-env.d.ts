/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_IS_STANDALONE: string;
  readonly VITE_IS_UNITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
