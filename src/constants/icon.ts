import { faGithubAlt, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faAngleDown,
  faBalanceScale,
  faCircleQuestion,
  faDownload,
  faFolderOpen,
  faGrip,
  faImages,
  faList,
  faMagnifyingGlass,
  faMaximize,
  faRotate,
  faShareNodes,
  faSliders,
  faTerminal,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const FontAwesomeIcons = {
  // NOTE: for form
  "fa-folder-open": faFolderOpen,
  "fa-angle-down": faAngleDown,
  "fa-maximize": faMaximize,
  "fa-terminal": faTerminal,
  "fa-magnifying-glass": faMagnifyingGlass,
  "fa-sliders": faSliders,
  // NOTE: for link
  "fa-share-nodes": faShareNodes,
  "fa-x-twitter": faXTwitter,
  "fa-github-alt": faGithubAlt,
  "fa-images": faImages,
  "fa-balance-scale": faBalanceScale,
  // NOTE: for closable component
  "fa-times-circle": faTimesCircle,
  // NOTE: for file list item
  "fa-rotate": faRotate,
  "fa-trash": faTrash,
  // NOTE: for convert list item
  "fa-grid": faGrip,
  "fa-list": faList,
  "fa-download": faDownload,
  // NOTE: for balloon
  "fa-circle-question": faCircleQuestion,
} as const satisfies Record<string, IconDefinition>;
