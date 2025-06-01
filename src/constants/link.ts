import { Link } from "@/@types/link";

import { FontAwesomeIcons } from "./icon";

export const links: Link[] = [
  {
    url: "https://x.com/intent/post?text=%E3%81%B4%E3%81%8F%E3%81%9B%E3%82%8B%20%E3%81%99%E3%81%91%E3%82%90%E3%82%89%E3%81%81&hashtags=%E3%81%B4%E3%81%8F%E3%81%9B%E3%82%8B%E3%81%99%E3%81%91%E3%82%90%E3%82%89%E3%81%81&hashtags=PiXelScaLer&url=https%3A%2F%2Firokaru.github.io%2Fpixel-scaler",
    icon: FontAwesomeIcons["fa-share-nodes"],
    textKey: "link.share-on-x",
  },
  {
    url: "https://twitter.com/irokaru",
    icon: FontAwesomeIcons["fa-x-twitter"],
    textKey: "link.developer",
  },
  {
    url: "https://github.com/irokaru/pixel-scaler",
    icon: FontAwesomeIcons["fa-github-alt"],
    textKey: "link.repository",
  },
  {
    url: "https://nononotyaya.booth.pm/items/2517679",
    icon: FontAwesomeIcons["fa-images"],
    textKey: "link.booth",
  },
  {
    url: "./THIRD_PARTY_LICENSES",
    icon: FontAwesomeIcons["fa-balance-scale"],
    textKey: "link.license",
  },
] as const;
