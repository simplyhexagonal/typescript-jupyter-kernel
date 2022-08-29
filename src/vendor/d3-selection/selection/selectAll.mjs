import {Selection} from "./index.mjs";
import array from "../array.mjs";
import selectorAll from "../selectorAll.mjs";

function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}

export default function(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}
