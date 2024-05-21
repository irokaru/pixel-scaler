/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_IS_STANDALONE: string;
  readonly VITE_IS_UNITE: string;
  readonly VITE_GIT_ORG: string;
  readonly VITE_GIT_REPO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
