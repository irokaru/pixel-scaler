import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { config } from "@vue/test-utils";

beforeEach(() => {
  config.global.components = {
    FontAwesomeIcon,
  };
});
