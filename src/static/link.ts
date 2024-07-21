import { Link } from "@/@types/link";

import { FontAwesomeIcons } from "./icon";

export const links: Link[] = [
  {
    url: "https://bit.ly/3rMhwKT",
    icon: FontAwesomeIcons["fa-share-alt-square"],
    textKey: "link-share-on-x",
  },
  {
    url: "https://twitter.com/irokaru",
    icon: FontAwesomeIcons["fa-x-twitter"],
    textKey: "link-developer",
  },
  {
    url: "https://github.com/irokaru/pixel-scaler",
    icon: FontAwesomeIcons["fa-github-alt"],
    textKey: "link-repository",
  },
  {
    url: "https://nononotyaya.booth.pm/items/2517679",
    icon: FontAwesomeIcons["fa-images"],
    textKey: "link-booth",
  },
  {
    url: "./oss-licenses.json",
    icon: FontAwesomeIcons["fa-balance-scale"],
    textKey: "link-license",
  },
];
