import sparse from "./sparse.mjs";
import {Selection} from "./index.mjs";

export default function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
