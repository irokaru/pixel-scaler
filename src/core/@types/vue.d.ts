import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

declare module "vue" {
  interface GlobalComponents {
    FontAwesomeIcon: typeof FontAwesomeIcon;
  }
}
