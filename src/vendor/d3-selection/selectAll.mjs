import array from "./array.mjs";
import {Selection, root} from "./selection/index.mjs";

export default function(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([array(selector)], root);
}
