import { faGithubAlt, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faBalanceScale,
  faCircleQuestion,
  faImages,
  faMagnifyingGlass,
  faMaximize,
  faRotate,
  faShareNodes,
  faTerminal,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const FontAwesomeIcons = {
  // NOTE: for form
  "fa-terminal": faTerminal,
  "fa-maximize": faMaximize,
  "fa-magnifying-glass": faMagnifyingGlass,
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
  // NOTE: for balloon
  "fa-circle-question": faCircleQuestion,
} as const satisfies Record<string, IconDefinition>;
