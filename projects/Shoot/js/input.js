/**
 * @namespace 
 */
const Keyboard = {
  /**@type {Map<number, boolean>}*/
  _currentKeys: new Map(),
  /**@type {Map<number, boolean>}*/
  _lastKeys: new Map(),
  init() {
    document.onkeydown = e => this._currentKeys.set(e.keyCode, true)
    document.onkeyup = e => this._currentKeys.set(e.keyCode, false)
  },
  getDown(keyCode) {
    return this._currentKeys.get(keyCode) || false
  } 
}