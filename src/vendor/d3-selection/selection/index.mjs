import selection_select from "./select.mjs";
import selection_selectAll from "./selectAll.mjs";
import selection_selectChild from "./selectChild.mjs";
import selection_selectChildren from "./selectChildren.mjs";
import selection_filter from "./filter.mjs";
import selection_data from "./data.mjs";
import selection_enter from "./enter.mjs";
import selection_exit from "./exit.mjs";
import selection_join from "./join.mjs";
import selection_merge from "./merge.mjs";
import selection_order from "./order.mjs";
import selection_sort from "./sort.mjs";
import selection_call from "./call.mjs";
import selection_nodes from "./nodes.mjs";
import selection_node from "./node.mjs";
import selection_size from "./size.mjs";
import selection_empty from "./empty.mjs";
import selection_each from "./each.mjs";
import selection_attr from "./attr.mjs";
import selection_style from "./style.mjs";
import selection_property from "./property.mjs";
import selection_classed from "./classed.mjs";
import selection_text from "./text.mjs";
import selection_html from "./html.mjs";
import selection_raise from "./raise.mjs";
import selection_lower from "./lower.mjs";
import selection_append from "./append.mjs";
import selection_insert from "./insert.mjs";
import selection_remove from "./remove.mjs";
import selection_clone from "./clone.mjs";
import selection_datum from "./datum.mjs";
import selection_on from "./on.mjs";
import selection_dispatch from "./dispatch.mjs";
import selection_iterator from "./iterator.mjs";

export var root = [null];

export function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

export default selection;
