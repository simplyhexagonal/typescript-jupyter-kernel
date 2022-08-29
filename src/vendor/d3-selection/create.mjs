import creator from "./creator.mjs";
import select from "./select.mjs";

export default function(name) {
  return select(creator(name).call(document.documentElement));
}
