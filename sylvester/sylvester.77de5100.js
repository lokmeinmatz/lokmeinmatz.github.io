// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.ts":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ZERO = Date.now() + 1000 * 10;
var yearElements;

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;

    case 1:
      r = q, g = v, b = p;
      break;

    case 2:
      r = p, g = v, b = t;
      break;

    case 3:
      r = p, g = q, b = v;
      break;

    case 4:
      r = t, g = p, b = v;
      break;

    case 5:
      r = v, g = p, b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

window.onload = function () {
  console.log('loaded');
  var lastTimer = '00:00';
  yearElements = document.querySelectorAll('#fireworks #year h1');

  var updateTimer = function updateTimer() {
    var secsRemaining = ZERO - Date.now(); //console.log(secsRemaining)

    var ssecsRemaining = "".concat(Math.floor(secsRemaining / 60000).toString().padStart(2, '0'), ":").concat(Math.floor(secsRemaining / 1000 % 60).toString().padStart(2, '0'));
    var diffsMap = new Map();

    for (var i = 0; i < ssecsRemaining.length; i++) {
      if (ssecsRemaining[i] != lastTimer[i]) {
        diffsMap.set(i, ssecsRemaining[i]);
      }
    }

    var allDigits = document.querySelector('#countdown').getElementsByTagName('h1');

    var _iterator = _createForOfIteratorHelper(diffsMap),
        _step;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            idx = _step$value[0],
            nChar = _step$value[1];

        var time = 0.0;
        var el = allDigits[idx];
        if (!el) return "continue";
        var switched = false;

        var transAnim = function transAnim() {
          var y = (time < 0.5 ? time : time - 1.0) * 2.; //console.log(y)

          el.style.transform = "translateY(".concat(y, "em)");
          el.style.opacity = Math.abs(1 - time * 2).toString();

          if (time > 0.5 && !switched) {
            switched = true;
            el.textContent = nChar;
          }

          time += 0.05;
          if (time <= 1) requestAnimationFrame(transAnim);else {
            el.style.opacity = '1';
            el.style.transform = '';
          }
        };

        transAnim();
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      } //console.log(ssecsRemaining)
      //document.querySelector('#countdown > h1').textContent = 

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    lastTimer = ssecsRemaining;
    if (secsRemaining > 1000) requestAnimationFrame(updateTimer);else {
      document.querySelector('#countdown').style.transform = 'translateY(100vh)';
      startFireworks();
    }
  };

  requestAnimationFrame(updateTimer);
};

var yearDelays = [142, 1142, 412, 813];

var Particle = /*#__PURE__*/function () {
  function Particle(x, y) {
    _classCallCheck(this, Particle);

    this.x = x;
    this.y = y;
  }

  _createClass(Particle, [{
    key: "step",
    value: function step(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vx *= 1 - dt;
      this.vy *= 1 - dt;
    }
  }]);

  return Particle;
}();

var Rocket = /*#__PURE__*/function (_Particle) {
  _inherits(Rocket, _Particle);

  var _super = _createSuper(Rocket);

  function Rocket(x, y) {
    var _this;

    _classCallCheck(this, Rocket);

    _this = _super.call(this, x, y);
    _this.vx = 0;
    _this.vy = -100;
    _this.maxHeight = Math.random() * 100 + 200;
    return _this;
  }

  _createClass(Rocket, [{
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Rocket.prototype), "step", this).call(this, dt);

      this.vy -= 10;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.strokeStyle = 'rgb(255, 100, 70)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + 10);
      ctx.stroke();
    }
  }, {
    key: "shouldExplode",
    value: function shouldExplode() {
      return this.y < this.maxHeight;
    }
  }]);

  return Rocket;
}(Particle);

var Spark = /*#__PURE__*/function (_Particle2) {
  _inherits(Spark, _Particle2);

  var _super2 = _createSuper(Spark);

  function Spark(x, y, color) {
    var _this2;

    _classCallCheck(this, Spark);

    //console.log(color.toString(16))
    _this2 = _super2.call(this, x, y);
    _this2.age = 0;
    var angle = Math.random() * Math.PI * 2;
    var force = Math.pow(Math.random(), 2) * 200;
    _this2.vx = Math.sin(angle) * force;
    _this2.vy = Math.cos(angle) * force;
    _this2.color = color;
    _this2.lifetime = Math.pow(Math.random(), 1) * 3 + 1;
    return _this2;
  }

  _createClass(Spark, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = this.color.toString();
      ctx.fillRect(this.x, this.y, 2, 2);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Spark.prototype), "step", this).call(this, dt);

      this.vy += 1;
      this.age += dt;
      var alpha = 1 - this.age / this.lifetime;
      this.color.a = alpha;
    }
  }]);

  return Spark;
}(Particle);

var Color = /*#__PURE__*/function () {
  function Color(r, g, b, a) {
    _classCallCheck(this, Color);

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1.;
  }

  _createClass(Color, [{
    key: "toString",
    value: function toString() {
      return this.a == 1 ? "rgb(".concat(Math.round(this.r), ", ").concat(Math.round(this.g), ", ").concat(Math.round(this.b), ")") : "rgba(".concat(Math.round(this.r), ", ").concat(Math.round(this.g), ", ").concat(Math.round(this.b), ", ").concat(this.a, ")");
    }
  }]);

  return Color;
}();

function startFireworks() {
  console.log('fw');
  var canvas = document.querySelector('#fireworks canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');

  var _loop2 = function _loop2(i) {
    setTimeout(function () {
      yearElements[i].style.transform = '';
    }, yearDelays[i]);
  };

  for (var i = 0; i < yearDelays.length; i++) {
    _loop2(i);
  }

  var particles = [];
  var rockets = [];

  function spawnRocket(x) {
    rockets.push(new Rocket(x, canvas.height + 20));
  }

  for (var _i2 = 0; _i2 < 4; _i2++) {
    spawnRocket(Math.random() * canvas.width);
  }

  ctx.strokeStyle = 'red';
  ctx.fillRect(100, 100, 100, 100);
  console.log(rockets);
  var dt = 1 / 60;

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height); //debugger

    var _iterator2 = _createForOfIteratorHelper(rockets),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var r = _step2.value;
        //console.log(r.x, r.y)
        r.draw(ctx);
        r.step(dt);

        if (r.shouldExplode()) {
          var col = HSVtoRGB(Math.random(), 0.5, 1.);
          var bColor = new Color(col.r, col.g, col.b); //debugger

          for (var _i3 = 0; _i3 < 100; _i3++) {
            particles.push(new Spark(r.x, r.y, bColor));
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    rockets = rockets.filter(function (r) {
      return !r.shouldExplode();
    });

    if (Math.random() > 0.95) {
      spawnRocket(Math.random() * canvas.width);
    }

    var _iterator3 = _createForOfIteratorHelper(particles),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var sp = _step3.value;
        sp.draw(ctx);
        sp.step(dt);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    particles = particles.filter(function (p) {
      return p.age < p.lifetime;
    });
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
},{}],"../../Users/matki/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60745" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../Users/matki/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/sylvester.77de5100.js.map