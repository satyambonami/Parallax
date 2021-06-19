(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: __getOwnPropDesc(module, key).enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defProp(__create(__getProtoOf(module)), "default", {value: module, enumerable: true}), module);
  };

  // node_modules/splitting/dist/splitting.js
  var require_splitting = __commonJS((exports, module) => {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.Splitting = factory();
    })(exports, function() {
      "use strict";
      var root4 = document;
      var createText = root4.createTextNode.bind(root4);
      function setProperty(el, varName, value) {
        el.style.setProperty(varName, value);
      }
      function appendChild(el, child) {
        return el.appendChild(child);
      }
      function createElement(parent, key, text, whitespace) {
        var el = root4.createElement("span");
        key && (el.className = key);
        if (text) {
          !whitespace && el.setAttribute("data-" + key, text);
          el.textContent = text;
        }
        return parent && appendChild(parent, el) || el;
      }
      function getData(el, key) {
        return el.getAttribute("data-" + key);
      }
      function $(e, parent) {
        return !e || e.length == 0 ? [] : e.nodeName ? [e] : [].slice.call(e[0].nodeName ? e : (parent || root4).querySelectorAll(e));
      }
      function Array2D(len) {
        var a = [];
        for (; len--; ) {
          a[len] = [];
        }
        return a;
      }
      function each(items, fn) {
        items && items.some(fn);
      }
      function selectFrom(obj) {
        return function(key) {
          return obj[key];
        };
      }
      function index(element, key, items) {
        var prefix = "--" + key;
        var cssVar = prefix + "-index";
        each(items, function(items2, i) {
          if (Array.isArray(items2)) {
            each(items2, function(item) {
              setProperty(item, cssVar, i);
            });
          } else {
            setProperty(items2, cssVar, i);
          }
        });
        setProperty(element, prefix + "-total", items.length);
      }
      var plugins = {};
      function resolvePlugins(by, parent, deps) {
        var index2 = deps.indexOf(by);
        if (index2 == -1) {
          deps.unshift(by);
          each(plugins[by].depends, function(p) {
            resolvePlugins(p, by, deps);
          });
        } else {
          var indexOfParent = deps.indexOf(parent);
          deps.splice(index2, 1);
          deps.splice(indexOfParent, 0, by);
        }
        return deps;
      }
      function createPlugin(by, depends, key, split) {
        return {
          by,
          depends,
          key,
          split
        };
      }
      function resolve(by) {
        return resolvePlugins(by, 0, []).map(selectFrom(plugins));
      }
      function add(opts) {
        plugins[opts.by] = opts;
      }
      function splitText(el, key, splitOn, includePrevious, preserveWhitespace) {
        el.normalize();
        var elements = [];
        var F = document.createDocumentFragment();
        if (includePrevious) {
          elements.push(el.previousSibling);
        }
        var allElements = [];
        $(el.childNodes).some(function(next) {
          if (next.tagName && !next.hasChildNodes()) {
            allElements.push(next);
            return;
          }
          if (next.childNodes && next.childNodes.length) {
            allElements.push(next);
            elements.push.apply(elements, splitText(next, key, splitOn, includePrevious, preserveWhitespace));
            return;
          }
          var wholeText = next.wholeText || "";
          var contents = wholeText.trim();
          if (contents.length) {
            if (wholeText[0] === " ") {
              allElements.push(createText(" "));
            }
            each(contents.split(splitOn), function(splitText2, i) {
              if (i && preserveWhitespace) {
                allElements.push(createElement(F, "whitespace", " ", preserveWhitespace));
              }
              var splitEl = createElement(F, key, splitText2);
              elements.push(splitEl);
              allElements.push(splitEl);
            });
            if (wholeText[wholeText.length - 1] === " ") {
              allElements.push(createText(" "));
            }
          }
        });
        each(allElements, function(el2) {
          appendChild(F, el2);
        });
        el.innerHTML = "";
        appendChild(el, F);
        return elements;
      }
      var _ = 0;
      function copy(dest, src) {
        for (var k in src) {
          dest[k] = src[k];
        }
        return dest;
      }
      var WORDS = "words";
      var wordPlugin = createPlugin(WORDS, _, "word", function(el) {
        return splitText(el, "word", /\s+/, 0, 1);
      });
      var CHARS = "chars";
      var charPlugin = createPlugin(CHARS, [WORDS], "char", function(el, options2, ctx) {
        var results = [];
        each(ctx[WORDS], function(word, i) {
          results.push.apply(results, splitText(word, "char", "", options2.whitespace && i));
        });
        return results;
      });
      function Splitting(opts) {
        opts = opts || {};
        var key = opts.key;
        return $(opts.target || "[data-splitting]").map(function(el) {
          var ctx = el["\u{1F34C}"];
          if (!opts.force && ctx) {
            return ctx;
          }
          ctx = el["\u{1F34C}"] = {el};
          var items = resolve(opts.by || getData(el, "splitting") || CHARS);
          var opts2 = copy({}, opts);
          each(items, function(plugin3) {
            if (plugin3.split) {
              var pluginBy = plugin3.by;
              var key2 = (key ? "-" + key : "") + plugin3.key;
              var results = plugin3.split(el, opts2, ctx);
              key2 && index(el, key2, results);
              ctx[pluginBy] = results;
              el.classList.add(pluginBy);
            }
          });
          el.classList.add("splitting");
          return ctx;
        });
      }
      function html(opts) {
        opts = opts || {};
        var parent = opts.target = createElement();
        parent.innerHTML = opts.content;
        Splitting(opts);
        return parent.outerHTML;
      }
      Splitting.html = html;
      Splitting.add = add;
      function detectGrid(el, options2, side) {
        var items = $(options2.matching || el.children, el);
        var c = {};
        each(items, function(w) {
          var val = Math.round(w[side]);
          (c[val] || (c[val] = [])).push(w);
        });
        return Object.keys(c).map(Number).sort(byNumber).map(selectFrom(c));
      }
      function byNumber(a, b) {
        return a - b;
      }
      var linePlugin = createPlugin("lines", [WORDS], "line", function(el, options2, ctx) {
        return detectGrid(el, {matching: ctx[WORDS]}, "offsetTop");
      });
      var itemPlugin = createPlugin("items", _, "item", function(el, options2) {
        return $(options2.matching || el.children, el);
      });
      var rowPlugin = createPlugin("rows", _, "row", function(el, options2) {
        return detectGrid(el, options2, "offsetTop");
      });
      var columnPlugin = createPlugin("cols", _, "col", function(el, options2) {
        return detectGrid(el, options2, "offsetLeft");
      });
      var gridPlugin = createPlugin("grid", ["rows", "cols"]);
      var LAYOUT = "layout";
      var layoutPlugin = createPlugin(LAYOUT, _, _, function(el, opts) {
        var rows = opts.rows = +(opts.rows || getData(el, "rows") || 1);
        var columns = opts.columns = +(opts.columns || getData(el, "columns") || 1);
        opts.image = opts.image || getData(el, "image") || el.currentSrc || el.src;
        if (opts.image) {
          var img = $("img", el)[0];
          opts.image = img && (img.currentSrc || img.src);
        }
        if (opts.image) {
          setProperty(el, "background-image", "url(" + opts.image + ")");
        }
        var totalCells = rows * columns;
        var elements = [];
        var container = createElement(_, "cell-grid");
        while (totalCells--) {
          var cell = createElement(container, "cell");
          createElement(cell, "cell-inner");
          elements.push(cell);
        }
        appendChild(el, container);
        return elements;
      });
      var cellRowPlugin = createPlugin("cellRows", [LAYOUT], "row", function(el, opts, ctx) {
        var rowCount = opts.rows;
        var result = Array2D(rowCount);
        each(ctx[LAYOUT], function(cell, i, src) {
          result[Math.floor(i / (src.length / rowCount))].push(cell);
        });
        return result;
      });
      var cellColumnPlugin = createPlugin("cellColumns", [LAYOUT], "col", function(el, opts, ctx) {
        var columnCount = opts.columns;
        var result = Array2D(columnCount);
        each(ctx[LAYOUT], function(cell, i) {
          result[i % columnCount].push(cell);
        });
        return result;
      });
      var cellPlugin = createPlugin("cells", ["cellRows", "cellColumns"], "cell", function(el, opt, ctx) {
        return ctx[LAYOUT];
      });
      add(wordPlugin);
      add(charPlugin);
      add(linePlugin);
      add(itemPlugin);
      add(rowPlugin);
      add(columnPlugin);
      add(gridPlugin);
      add(layoutPlugin);
      add(cellRowPlugin);
      add(cellColumnPlugin);
      add(cellPlugin);
      return Splitting;
    });
  });

  // node_modules/core-js/modules/_cof.js
  var require_cof = __commonJS((exports, module) => {
    var toString = {}.toString;
    module.exports = function(it) {
      return toString.call(it).slice(8, -1);
    };
  });

  // node_modules/core-js/modules/_core.js
  var require_core = __commonJS((exports, module) => {
    var core = module.exports = {version: "2.6.11"};
    if (typeof __e == "number")
      __e = core;
  });

  // node_modules/core-js/modules/_global.js
  var require_global = __commonJS((exports, module) => {
    var global2 = module.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
    if (typeof __g == "number")
      __g = global2;
  });

  // node_modules/core-js/modules/_library.js
  var require_library = __commonJS((exports, module) => {
    module.exports = false;
  });

  // node_modules/core-js/modules/_shared.js
  var require_shared = __commonJS((exports, module) => {
    var core = require_core();
    var global2 = require_global();
    var SHARED = "__core-js_shared__";
    var store = global2[SHARED] || (global2[SHARED] = {});
    (module.exports = function(key, value) {
      return store[key] || (store[key] = value !== void 0 ? value : {});
    })("versions", []).push({
      version: core.version,
      mode: require_library() ? "pure" : "global",
      copyright: "\xA9 2019 Denis Pushkarev (zloirock.ru)"
    });
  });

  // node_modules/core-js/modules/_uid.js
  var require_uid = __commonJS((exports, module) => {
    var id = 0;
    var px = Math.random();
    module.exports = function(key) {
      return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
    };
  });

  // node_modules/core-js/modules/_wks.js
  var require_wks = __commonJS((exports, module) => {
    var store = require_shared()("wks");
    var uid = require_uid();
    var Symbol5 = require_global().Symbol;
    var USE_SYMBOL = typeof Symbol5 == "function";
    var $exports = module.exports = function(name) {
      return store[name] || (store[name] = USE_SYMBOL && Symbol5[name] || (USE_SYMBOL ? Symbol5 : uid)("Symbol." + name));
    };
    $exports.store = store;
  });

  // node_modules/core-js/modules/_classof.js
  var require_classof = __commonJS((exports, module) => {
    var cof = require_cof();
    var TAG = require_wks()("toStringTag");
    var ARG = cof(function() {
      return arguments;
    }()) == "Arguments";
    var tryGet = function(it, key) {
      try {
        return it[key];
      } catch (e) {
      }
    };
    module.exports = function(it) {
      var O, T, B;
      return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = tryGet(O = Object(it), TAG)) == "string" ? T : ARG ? cof(O) : (B = cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
    };
  });

  // node_modules/core-js/modules/_is-object.js
  var require_is_object = __commonJS((exports, module) => {
    module.exports = function(it) {
      return typeof it === "object" ? it !== null : typeof it === "function";
    };
  });

  // node_modules/core-js/modules/_an-object.js
  var require_an_object = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    module.exports = function(it) {
      if (!isObject4(it))
        throw TypeError(it + " is not an object!");
      return it;
    };
  });

  // node_modules/core-js/modules/_fails.js
  var require_fails = __commonJS((exports, module) => {
    module.exports = function(exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };
  });

  // node_modules/core-js/modules/_descriptors.js
  var require_descriptors = __commonJS((exports, module) => {
    module.exports = !require_fails()(function() {
      return Object.defineProperty({}, "a", {get: function() {
        return 7;
      }}).a != 7;
    });
  });

  // node_modules/core-js/modules/_dom-create.js
  var require_dom_create = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    var document2 = require_global().document;
    var is = isObject4(document2) && isObject4(document2.createElement);
    module.exports = function(it) {
      return is ? document2.createElement(it) : {};
    };
  });

  // node_modules/core-js/modules/_ie8-dom-define.js
  var require_ie8_dom_define = __commonJS((exports, module) => {
    module.exports = !require_descriptors() && !require_fails()(function() {
      return Object.defineProperty(require_dom_create()("div"), "a", {get: function() {
        return 7;
      }}).a != 7;
    });
  });

  // node_modules/core-js/modules/_to-primitive.js
  var require_to_primitive = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    module.exports = function(it, S) {
      if (!isObject4(it))
        return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == "function" && !isObject4(val = fn.call(it)))
        return val;
      if (typeof (fn = it.valueOf) == "function" && !isObject4(val = fn.call(it)))
        return val;
      if (!S && typeof (fn = it.toString) == "function" && !isObject4(val = fn.call(it)))
        return val;
      throw TypeError("Can't convert object to primitive value");
    };
  });

  // node_modules/core-js/modules/_object-dp.js
  var require_object_dp = __commonJS((exports) => {
    var anObject = require_an_object();
    var IE8_DOM_DEFINE = require_ie8_dom_define();
    var toPrimitive = require_to_primitive();
    var dP = Object.defineProperty;
    exports.f = require_descriptors() ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if (IE8_DOM_DEFINE)
        try {
          return dP(O, P, Attributes);
        } catch (e) {
        }
      if ("get" in Attributes || "set" in Attributes)
        throw TypeError("Accessors not supported!");
      if ("value" in Attributes)
        O[P] = Attributes.value;
      return O;
    };
  });

  // node_modules/core-js/modules/_property-desc.js
  var require_property_desc = __commonJS((exports, module) => {
    module.exports = function(bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value
      };
    };
  });

  // node_modules/core-js/modules/_hide.js
  var require_hide = __commonJS((exports, module) => {
    var dP = require_object_dp();
    var createDesc = require_property_desc();
    module.exports = require_descriptors() ? function(object, key, value) {
      return dP.f(object, key, createDesc(1, value));
    } : function(object, key, value) {
      object[key] = value;
      return object;
    };
  });

  // node_modules/core-js/modules/_has.js
  var require_has = __commonJS((exports, module) => {
    var hasOwnProperty2 = {}.hasOwnProperty;
    module.exports = function(it, key) {
      return hasOwnProperty2.call(it, key);
    };
  });

  // node_modules/core-js/modules/_function-to-string.js
  var require_function_to_string = __commonJS((exports, module) => {
    module.exports = require_shared()("native-function-to-string", Function.toString);
  });

  // node_modules/core-js/modules/_redefine.js
  var require_redefine = __commonJS((exports, module) => {
    var global2 = require_global();
    var hide = require_hide();
    var has = require_has();
    var SRC = require_uid()("src");
    var $toString = require_function_to_string();
    var TO_STRING = "toString";
    var TPL = ("" + $toString).split(TO_STRING);
    require_core().inspectSource = function(it) {
      return $toString.call(it);
    };
    (module.exports = function(O, key, val, safe) {
      var isFunction = typeof val == "function";
      if (isFunction)
        has(val, "name") || hide(val, "name", key);
      if (O[key] === val)
        return;
      if (isFunction)
        has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
      if (O === global2) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        hide(O, key, val);
      }
    })(Function.prototype, TO_STRING, function toString() {
      return typeof this == "function" && this[SRC] || $toString.call(this);
    });
  });

  // node_modules/core-js/modules/es6.object.to-string.js
  var require_es6_object_to_string = __commonJS(() => {
    "use strict";
    var classof = require_classof();
    var test = {};
    test[require_wks()("toStringTag")] = "z";
    if (test + "" != "[object z]") {
      require_redefine()(Object.prototype, "toString", function toString() {
        return "[object " + classof(this) + "]";
      }, true);
    }
  });

  // node_modules/core-js/modules/_to-integer.js
  var require_to_integer = __commonJS((exports, module) => {
    var ceil = Math.ceil;
    var floor = Math.floor;
    module.exports = function(it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
  });

  // node_modules/core-js/modules/_defined.js
  var require_defined = __commonJS((exports, module) => {
    module.exports = function(it) {
      if (it == void 0)
        throw TypeError("Can't call method on  " + it);
      return it;
    };
  });

  // node_modules/core-js/modules/_string-at.js
  var require_string_at = __commonJS((exports, module) => {
    var toInteger = require_to_integer();
    var defined = require_defined();
    module.exports = function(TO_STRING) {
      return function(that, pos) {
        var s = String(defined(that));
        var i = toInteger(pos);
        var l = s.length;
        var a, b;
        if (i < 0 || i >= l)
          return TO_STRING ? "" : void 0;
        a = s.charCodeAt(i);
        return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
      };
    };
  });

  // node_modules/core-js/modules/_a-function.js
  var require_a_function = __commonJS((exports, module) => {
    module.exports = function(it) {
      if (typeof it != "function")
        throw TypeError(it + " is not a function!");
      return it;
    };
  });

  // node_modules/core-js/modules/_ctx.js
  var require_ctx = __commonJS((exports, module) => {
    var aFunction = require_a_function();
    module.exports = function(fn, that, length) {
      aFunction(fn);
      if (that === void 0)
        return fn;
      switch (length) {
        case 1:
          return function(a) {
            return fn.call(that, a);
          };
        case 2:
          return function(a, b) {
            return fn.call(that, a, b);
          };
        case 3:
          return function(a, b, c) {
            return fn.call(that, a, b, c);
          };
      }
      return function() {
        return fn.apply(that, arguments);
      };
    };
  });

  // node_modules/core-js/modules/_export.js
  var require_export = __commonJS((exports, module) => {
    var global2 = require_global();
    var core = require_core();
    var hide = require_hide();
    var redefine = require_redefine();
    var ctx = require_ctx();
    var PROTOTYPE = "prototype";
    var $export = function(type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var target = IS_GLOBAL ? global2 : IS_STATIC ? global2[name] || (global2[name] = {}) : (global2[name] || {})[PROTOTYPE];
      var exports2 = IS_GLOBAL ? core : core[name] || (core[name] = {});
      var expProto = exports2[PROTOTYPE] || (exports2[PROTOTYPE] = {});
      var key, own, out, exp;
      if (IS_GLOBAL)
        source = name;
      for (key in source) {
        own = !IS_FORCED && target && target[key] !== void 0;
        out = (own ? target : source)[key];
        exp = IS_BIND && own ? ctx(out, global2) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
        if (target)
          redefine(target, key, out, type & $export.U);
        if (exports2[key] != out)
          hide(exports2, key, exp);
        if (IS_PROTO && expProto[key] != out)
          expProto[key] = out;
      }
    };
    global2.core = core;
    $export.F = 1;
    $export.G = 2;
    $export.S = 4;
    $export.P = 8;
    $export.B = 16;
    $export.W = 32;
    $export.U = 64;
    $export.R = 128;
    module.exports = $export;
  });

  // node_modules/core-js/modules/_iterators.js
  var require_iterators = __commonJS((exports, module) => {
    module.exports = {};
  });

  // node_modules/core-js/modules/_iobject.js
  var require_iobject = __commonJS((exports, module) => {
    var cof = require_cof();
    module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
      return cof(it) == "String" ? it.split("") : Object(it);
    };
  });

  // node_modules/core-js/modules/_to-iobject.js
  var require_to_iobject = __commonJS((exports, module) => {
    var IObject = require_iobject();
    var defined = require_defined();
    module.exports = function(it) {
      return IObject(defined(it));
    };
  });

  // node_modules/core-js/modules/_to-length.js
  var require_to_length = __commonJS((exports, module) => {
    var toInteger = require_to_integer();
    var min = Math.min;
    module.exports = function(it) {
      return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
    };
  });

  // node_modules/core-js/modules/_to-absolute-index.js
  var require_to_absolute_index = __commonJS((exports, module) => {
    var toInteger = require_to_integer();
    var max = Math.max;
    var min = Math.min;
    module.exports = function(index, length) {
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    };
  });

  // node_modules/core-js/modules/_array-includes.js
  var require_array_includes = __commonJS((exports, module) => {
    var toIObject = require_to_iobject();
    var toLength = require_to_length();
    var toAbsoluteIndex = require_to_absolute_index();
    module.exports = function(IS_INCLUDES) {
      return function($this, el, fromIndex) {
        var O = toIObject($this);
        var length = toLength(O.length);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        if (IS_INCLUDES && el != el)
          while (length > index) {
            value = O[index++];
            if (value != value)
              return true;
          }
        else
          for (; length > index; index++)
            if (IS_INCLUDES || index in O) {
              if (O[index] === el)
                return IS_INCLUDES || index || 0;
            }
        return !IS_INCLUDES && -1;
      };
    };
  });

  // node_modules/core-js/modules/_shared-key.js
  var require_shared_key = __commonJS((exports, module) => {
    var shared = require_shared()("keys");
    var uid = require_uid();
    module.exports = function(key) {
      return shared[key] || (shared[key] = uid(key));
    };
  });

  // node_modules/core-js/modules/_object-keys-internal.js
  var require_object_keys_internal = __commonJS((exports, module) => {
    var has = require_has();
    var toIObject = require_to_iobject();
    var arrayIndexOf = require_array_includes()(false);
    var IE_PROTO = require_shared_key()("IE_PROTO");
    module.exports = function(object, names) {
      var O = toIObject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O)
        if (key != IE_PROTO)
          has(O, key) && result.push(key);
      while (names.length > i)
        if (has(O, key = names[i++])) {
          ~arrayIndexOf(result, key) || result.push(key);
        }
      return result;
    };
  });

  // node_modules/core-js/modules/_enum-bug-keys.js
  var require_enum_bug_keys = __commonJS((exports, module) => {
    module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
  });

  // node_modules/core-js/modules/_object-keys.js
  var require_object_keys = __commonJS((exports, module) => {
    var $keys = require_object_keys_internal();
    var enumBugKeys = require_enum_bug_keys();
    module.exports = Object.keys || function keys(O) {
      return $keys(O, enumBugKeys);
    };
  });

  // node_modules/core-js/modules/_object-dps.js
  var require_object_dps = __commonJS((exports, module) => {
    var dP = require_object_dp();
    var anObject = require_an_object();
    var getKeys = require_object_keys();
    module.exports = require_descriptors() ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject(O);
      var keys = getKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;
      while (length > i)
        dP.f(O, P = keys[i++], Properties[P]);
      return O;
    };
  });

  // node_modules/core-js/modules/_html.js
  var require_html = __commonJS((exports, module) => {
    var document2 = require_global().document;
    module.exports = document2 && document2.documentElement;
  });

  // node_modules/core-js/modules/_object-create.js
  var require_object_create = __commonJS((exports, module) => {
    var anObject = require_an_object();
    var dPs = require_object_dps();
    var enumBugKeys = require_enum_bug_keys();
    var IE_PROTO = require_shared_key()("IE_PROTO");
    var Empty = function() {
    };
    var PROTOTYPE = "prototype";
    var createDict = function() {
      var iframe = require_dom_create()("iframe");
      var i = enumBugKeys.length;
      var lt = "<";
      var gt = ">";
      var iframeDocument;
      iframe.style.display = "none";
      require_html().appendChild(iframe);
      iframe.src = "javascript:";
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
      iframeDocument.close();
      createDict = iframeDocument.F;
      while (i--)
        delete createDict[PROTOTYPE][enumBugKeys[i]];
      return createDict();
    };
    module.exports = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        Empty[PROTOTYPE] = anObject(O);
        result = new Empty();
        Empty[PROTOTYPE] = null;
        result[IE_PROTO] = O;
      } else
        result = createDict();
      return Properties === void 0 ? result : dPs(result, Properties);
    };
  });

  // node_modules/core-js/modules/_set-to-string-tag.js
  var require_set_to_string_tag = __commonJS((exports, module) => {
    var def = require_object_dp().f;
    var has = require_has();
    var TAG = require_wks()("toStringTag");
    module.exports = function(it, tag, stat) {
      if (it && !has(it = stat ? it : it.prototype, TAG))
        def(it, TAG, {configurable: true, value: tag});
    };
  });

  // node_modules/core-js/modules/_iter-create.js
  var require_iter_create = __commonJS((exports, module) => {
    "use strict";
    var create = require_object_create();
    var descriptor = require_property_desc();
    var setToStringTag = require_set_to_string_tag();
    var IteratorPrototype = {};
    require_hide()(IteratorPrototype, require_wks()("iterator"), function() {
      return this;
    });
    module.exports = function(Constructor, NAME, next) {
      Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
      setToStringTag(Constructor, NAME + " Iterator");
    };
  });

  // node_modules/core-js/modules/_to-object.js
  var require_to_object = __commonJS((exports, module) => {
    var defined = require_defined();
    module.exports = function(it) {
      return Object(defined(it));
    };
  });

  // node_modules/core-js/modules/_object-gpo.js
  var require_object_gpo = __commonJS((exports, module) => {
    var has = require_has();
    var toObject = require_to_object();
    var IE_PROTO = require_shared_key()("IE_PROTO");
    var ObjectProto = Object.prototype;
    module.exports = Object.getPrototypeOf || function(O) {
      O = toObject(O);
      if (has(O, IE_PROTO))
        return O[IE_PROTO];
      if (typeof O.constructor == "function" && O instanceof O.constructor) {
        return O.constructor.prototype;
      }
      return O instanceof Object ? ObjectProto : null;
    };
  });

  // node_modules/core-js/modules/_iter-define.js
  var require_iter_define = __commonJS((exports, module) => {
    "use strict";
    var LIBRARY = require_library();
    var $export = require_export();
    var redefine = require_redefine();
    var hide = require_hide();
    var Iterators = require_iterators();
    var $iterCreate = require_iter_create();
    var setToStringTag = require_set_to_string_tag();
    var getPrototypeOf = require_object_gpo();
    var ITERATOR = require_wks()("iterator");
    var BUGGY = !([].keys && "next" in [].keys());
    var FF_ITERATOR = "@@iterator";
    var KEYS = "keys";
    var VALUES = "values";
    var returnThis = function() {
      return this;
    };
    module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
      $iterCreate(Constructor, NAME, next);
      var getMethod = function(kind) {
        if (!BUGGY && kind in proto)
          return proto[kind];
        switch (kind) {
          case KEYS:
            return function keys() {
              return new Constructor(this, kind);
            };
          case VALUES:
            return function values() {
              return new Constructor(this, kind);
            };
        }
        return function entries() {
          return new Constructor(this, kind);
        };
      };
      var TAG = NAME + " Iterator";
      var DEF_VALUES = DEFAULT == VALUES;
      var VALUES_BUG = false;
      var proto = Base.prototype;
      var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
      var $default = $native || getMethod(DEFAULT);
      var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : void 0;
      var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
      var methods, key, IteratorPrototype;
      if ($anyNative) {
        IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
        if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
          setToStringTag(IteratorPrototype, TAG, true);
          if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function")
            hide(IteratorPrototype, ITERATOR, returnThis);
        }
      }
      if (DEF_VALUES && $native && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
      if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
        hide(proto, ITERATOR, $default);
      }
      Iterators[NAME] = $default;
      Iterators[TAG] = returnThis;
      if (DEFAULT) {
        methods = {
          values: DEF_VALUES ? $default : getMethod(VALUES),
          keys: IS_SET ? $default : getMethod(KEYS),
          entries: $entries
        };
        if (FORCED)
          for (key in methods) {
            if (!(key in proto))
              redefine(proto, key, methods[key]);
          }
        else
          $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
      }
      return methods;
    };
  });

  // node_modules/core-js/modules/es6.string.iterator.js
  var require_es6_string_iterator = __commonJS(() => {
    "use strict";
    var $at = require_string_at()(true);
    require_iter_define()(String, "String", function(iterated) {
      this._t = String(iterated);
      this._i = 0;
    }, function() {
      var O = this._t;
      var index = this._i;
      var point;
      if (index >= O.length)
        return {value: void 0, done: true};
      point = $at(O, index);
      this._i += point.length;
      return {value: point, done: false};
    });
  });

  // node_modules/core-js/modules/_add-to-unscopables.js
  var require_add_to_unscopables = __commonJS((exports, module) => {
    var UNSCOPABLES = require_wks()("unscopables");
    var ArrayProto = Array.prototype;
    if (ArrayProto[UNSCOPABLES] == void 0)
      require_hide()(ArrayProto, UNSCOPABLES, {});
    module.exports = function(key) {
      ArrayProto[UNSCOPABLES][key] = true;
    };
  });

  // node_modules/core-js/modules/_iter-step.js
  var require_iter_step = __commonJS((exports, module) => {
    module.exports = function(done, value) {
      return {value, done: !!done};
    };
  });

  // node_modules/core-js/modules/es6.array.iterator.js
  var require_es6_array_iterator = __commonJS((exports, module) => {
    "use strict";
    var addToUnscopables = require_add_to_unscopables();
    var step = require_iter_step();
    var Iterators = require_iterators();
    var toIObject = require_to_iobject();
    module.exports = require_iter_define()(Array, "Array", function(iterated, kind) {
      this._t = toIObject(iterated);
      this._i = 0;
      this._k = kind;
    }, function() {
      var O = this._t;
      var kind = this._k;
      var index = this._i++;
      if (!O || index >= O.length) {
        this._t = void 0;
        return step(1);
      }
      if (kind == "keys")
        return step(0, index);
      if (kind == "values")
        return step(0, O[index]);
      return step(0, [index, O[index]]);
    }, "values");
    Iterators.Arguments = Iterators.Array;
    addToUnscopables("keys");
    addToUnscopables("values");
    addToUnscopables("entries");
  });

  // node_modules/core-js/modules/web.dom.iterable.js
  var require_web_dom_iterable = __commonJS(() => {
    var $iterators = require_es6_array_iterator();
    var getKeys = require_object_keys();
    var redefine = require_redefine();
    var global2 = require_global();
    var hide = require_hide();
    var Iterators = require_iterators();
    var wks = require_wks();
    var ITERATOR = wks("iterator");
    var TO_STRING_TAG = wks("toStringTag");
    var ArrayValues = Iterators.Array;
    var DOMIterables = {
      CSSRuleList: true,
      CSSStyleDeclaration: false,
      CSSValueList: false,
      ClientRectList: false,
      DOMRectList: false,
      DOMStringList: false,
      DOMTokenList: true,
      DataTransferItemList: false,
      FileList: false,
      HTMLAllCollection: false,
      HTMLCollection: false,
      HTMLFormElement: false,
      HTMLSelectElement: false,
      MediaList: true,
      MimeTypeArray: false,
      NamedNodeMap: false,
      NodeList: true,
      PaintRequestList: false,
      Plugin: false,
      PluginArray: false,
      SVGLengthList: false,
      SVGNumberList: false,
      SVGPathSegList: false,
      SVGPointList: false,
      SVGStringList: false,
      SVGTransformList: false,
      SourceBufferList: false,
      StyleSheetList: true,
      TextTrackCueList: false,
      TextTrackList: false,
      TouchList: false
    };
    for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
      var NAME = collections[i];
      var explicit = DOMIterables[NAME];
      var Collection = global2[NAME];
      var proto = Collection && Collection.prototype;
      var key;
      if (proto) {
        if (!proto[ITERATOR])
          hide(proto, ITERATOR, ArrayValues);
        if (!proto[TO_STRING_TAG])
          hide(proto, TO_STRING_TAG, NAME);
        Iterators[NAME] = ArrayValues;
        if (explicit) {
          for (key in $iterators)
            if (!proto[key])
              redefine(proto, key, $iterators[key], true);
        }
      }
    }
  });

  // node_modules/core-js/modules/_redefine-all.js
  var require_redefine_all = __commonJS((exports, module) => {
    var redefine = require_redefine();
    module.exports = function(target, src, safe) {
      for (var key in src)
        redefine(target, key, src[key], safe);
      return target;
    };
  });

  // node_modules/core-js/modules/_an-instance.js
  var require_an_instance = __commonJS((exports, module) => {
    module.exports = function(it, Constructor, name, forbiddenField) {
      if (!(it instanceof Constructor) || forbiddenField !== void 0 && forbiddenField in it) {
        throw TypeError(name + ": incorrect invocation!");
      }
      return it;
    };
  });

  // node_modules/core-js/modules/_iter-call.js
  var require_iter_call = __commonJS((exports, module) => {
    var anObject = require_an_object();
    module.exports = function(iterator, fn, value, entries) {
      try {
        return entries ? fn(anObject(value)[0], value[1]) : fn(value);
      } catch (e) {
        var ret = iterator["return"];
        if (ret !== void 0)
          anObject(ret.call(iterator));
        throw e;
      }
    };
  });

  // node_modules/core-js/modules/_is-array-iter.js
  var require_is_array_iter = __commonJS((exports, module) => {
    var Iterators = require_iterators();
    var ITERATOR = require_wks()("iterator");
    var ArrayProto = Array.prototype;
    module.exports = function(it) {
      return it !== void 0 && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
    };
  });

  // node_modules/core-js/modules/core.get-iterator-method.js
  var require_core_get_iterator_method = __commonJS((exports, module) => {
    var classof = require_classof();
    var ITERATOR = require_wks()("iterator");
    var Iterators = require_iterators();
    module.exports = require_core().getIteratorMethod = function(it) {
      if (it != void 0)
        return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
    };
  });

  // node_modules/core-js/modules/_for-of.js
  var require_for_of = __commonJS((exports, module) => {
    var ctx = require_ctx();
    var call = require_iter_call();
    var isArrayIter = require_is_array_iter();
    var anObject = require_an_object();
    var toLength = require_to_length();
    var getIterFn = require_core_get_iterator_method();
    var BREAK = {};
    var RETURN = {};
    var exports = module.exports = function(iterable, entries, fn, that, ITERATOR) {
      var iterFn = ITERATOR ? function() {
        return iterable;
      } : getIterFn(iterable);
      var f = ctx(fn, that, entries ? 2 : 1);
      var index = 0;
      var length, step, iterator, result;
      if (typeof iterFn != "function")
        throw TypeError(iterable + " is not iterable!");
      if (isArrayIter(iterFn))
        for (length = toLength(iterable.length); length > index; index++) {
          result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
          if (result === BREAK || result === RETURN)
            return result;
        }
      else
        for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
          result = call(iterator, f, step.value, entries);
          if (result === BREAK || result === RETURN)
            return result;
        }
    };
    exports.BREAK = BREAK;
    exports.RETURN = RETURN;
  });

  // node_modules/core-js/modules/_set-species.js
  var require_set_species = __commonJS((exports, module) => {
    "use strict";
    var global2 = require_global();
    var dP = require_object_dp();
    var DESCRIPTORS = require_descriptors();
    var SPECIES = require_wks()("species");
    module.exports = function(KEY) {
      var C = global2[KEY];
      if (DESCRIPTORS && C && !C[SPECIES])
        dP.f(C, SPECIES, {
          configurable: true,
          get: function() {
            return this;
          }
        });
    };
  });

  // node_modules/core-js/modules/_meta.js
  var require_meta = __commonJS((exports, module) => {
    var META = require_uid()("meta");
    var isObject4 = require_is_object();
    var has = require_has();
    var setDesc = require_object_dp().f;
    var id = 0;
    var isExtensible = Object.isExtensible || function() {
      return true;
    };
    var FREEZE = !require_fails()(function() {
      return isExtensible(Object.preventExtensions({}));
    });
    var setMeta = function(it) {
      setDesc(it, META, {value: {
        i: "O" + ++id,
        w: {}
      }});
    };
    var fastKey = function(it, create) {
      if (!isObject4(it))
        return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
      if (!has(it, META)) {
        if (!isExtensible(it))
          return "F";
        if (!create)
          return "E";
        setMeta(it);
      }
      return it[META].i;
    };
    var getWeak = function(it, create) {
      if (!has(it, META)) {
        if (!isExtensible(it))
          return true;
        if (!create)
          return false;
        setMeta(it);
      }
      return it[META].w;
    };
    var onFreeze = function(it) {
      if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META))
        setMeta(it);
      return it;
    };
    var meta = module.exports = {
      KEY: META,
      NEED: false,
      fastKey,
      getWeak,
      onFreeze
    };
  });

  // node_modules/core-js/modules/_validate-collection.js
  var require_validate_collection = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    module.exports = function(it, TYPE) {
      if (!isObject4(it) || it._t !== TYPE)
        throw TypeError("Incompatible receiver, " + TYPE + " required!");
      return it;
    };
  });

  // node_modules/core-js/modules/_collection-strong.js
  var require_collection_strong = __commonJS((exports, module) => {
    "use strict";
    var dP = require_object_dp().f;
    var create = require_object_create();
    var redefineAll = require_redefine_all();
    var ctx = require_ctx();
    var anInstance = require_an_instance();
    var forOf = require_for_of();
    var $iterDefine = require_iter_define();
    var step = require_iter_step();
    var setSpecies = require_set_species();
    var DESCRIPTORS = require_descriptors();
    var fastKey = require_meta().fastKey;
    var validate3 = require_validate_collection();
    var SIZE = DESCRIPTORS ? "_s" : "size";
    var getEntry = function(that, key) {
      var index = fastKey(key);
      var entry;
      if (index !== "F")
        return that._i[index];
      for (entry = that._f; entry; entry = entry.n) {
        if (entry.k == key)
          return entry;
      }
    };
    module.exports = {
      getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
        var C = wrapper(function(that, iterable) {
          anInstance(that, C, NAME, "_i");
          that._t = NAME;
          that._i = create(null);
          that._f = void 0;
          that._l = void 0;
          that[SIZE] = 0;
          if (iterable != void 0)
            forOf(iterable, IS_MAP, that[ADDER], that);
        });
        redefineAll(C.prototype, {
          clear: function clear() {
            for (var that = validate3(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
              entry.r = true;
              if (entry.p)
                entry.p = entry.p.n = void 0;
              delete data[entry.i];
            }
            that._f = that._l = void 0;
            that[SIZE] = 0;
          },
          delete: function(key) {
            var that = validate3(this, NAME);
            var entry = getEntry(that, key);
            if (entry) {
              var next = entry.n;
              var prev = entry.p;
              delete that._i[entry.i];
              entry.r = true;
              if (prev)
                prev.n = next;
              if (next)
                next.p = prev;
              if (that._f == entry)
                that._f = next;
              if (that._l == entry)
                that._l = prev;
              that[SIZE]--;
            }
            return !!entry;
          },
          forEach: function forEach3(callbackfn) {
            validate3(this, NAME);
            var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : void 0, 3);
            var entry;
            while (entry = entry ? entry.n : this._f) {
              f(entry.v, entry.k, this);
              while (entry && entry.r)
                entry = entry.p;
            }
          },
          has: function has(key) {
            return !!getEntry(validate3(this, NAME), key);
          }
        });
        if (DESCRIPTORS)
          dP(C.prototype, "size", {
            get: function() {
              return validate3(this, NAME)[SIZE];
            }
          });
        return C;
      },
      def: function(that, key, value) {
        var entry = getEntry(that, key);
        var prev, index;
        if (entry) {
          entry.v = value;
        } else {
          that._l = entry = {
            i: index = fastKey(key, true),
            k: key,
            v: value,
            p: prev = that._l,
            n: void 0,
            r: false
          };
          if (!that._f)
            that._f = entry;
          if (prev)
            prev.n = entry;
          that[SIZE]++;
          if (index !== "F")
            that._i[index] = entry;
        }
        return that;
      },
      getEntry,
      setStrong: function(C, NAME, IS_MAP) {
        $iterDefine(C, NAME, function(iterated, kind) {
          this._t = validate3(iterated, NAME);
          this._k = kind;
          this._l = void 0;
        }, function() {
          var that = this;
          var kind = that._k;
          var entry = that._l;
          while (entry && entry.r)
            entry = entry.p;
          if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
            that._t = void 0;
            return step(1);
          }
          if (kind == "keys")
            return step(0, entry.k);
          if (kind == "values")
            return step(0, entry.v);
          return step(0, [entry.k, entry.v]);
        }, IS_MAP ? "entries" : "values", !IS_MAP, true);
        setSpecies(NAME);
      }
    };
  });

  // node_modules/core-js/modules/_iter-detect.js
  var require_iter_detect = __commonJS((exports, module) => {
    var ITERATOR = require_wks()("iterator");
    var SAFE_CLOSING = false;
    try {
      var riter = [7][ITERATOR]();
      riter["return"] = function() {
        SAFE_CLOSING = true;
      };
      Array.from(riter, function() {
        throw 2;
      });
    } catch (e) {
    }
    module.exports = function(exec, skipClosing) {
      if (!skipClosing && !SAFE_CLOSING)
        return false;
      var safe = false;
      try {
        var arr = [7];
        var iter = arr[ITERATOR]();
        iter.next = function() {
          return {done: safe = true};
        };
        arr[ITERATOR] = function() {
          return iter;
        };
        exec(arr);
      } catch (e) {
      }
      return safe;
    };
  });

  // node_modules/core-js/modules/_object-pie.js
  var require_object_pie = __commonJS((exports) => {
    exports.f = {}.propertyIsEnumerable;
  });

  // node_modules/core-js/modules/_object-gopd.js
  var require_object_gopd = __commonJS((exports) => {
    var pIE = require_object_pie();
    var createDesc = require_property_desc();
    var toIObject = require_to_iobject();
    var toPrimitive = require_to_primitive();
    var has = require_has();
    var IE8_DOM_DEFINE = require_ie8_dom_define();
    var gOPD = Object.getOwnPropertyDescriptor;
    exports.f = require_descriptors() ? gOPD : function getOwnPropertyDescriptor(O, P) {
      O = toIObject(O);
      P = toPrimitive(P, true);
      if (IE8_DOM_DEFINE)
        try {
          return gOPD(O, P);
        } catch (e) {
        }
      if (has(O, P))
        return createDesc(!pIE.f.call(O, P), O[P]);
    };
  });

  // node_modules/core-js/modules/_set-proto.js
  var require_set_proto = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    var anObject = require_an_object();
    var check = function(O, proto) {
      anObject(O);
      if (!isObject4(proto) && proto !== null)
        throw TypeError(proto + ": can't set as prototype!");
    };
    module.exports = {
      set: Object.setPrototypeOf || ("__proto__" in {} ? function(test, buggy, set2) {
        try {
          set2 = require_ctx()(Function.call, require_object_gopd().f(Object.prototype, "__proto__").set, 2);
          set2(test, []);
          buggy = !(test instanceof Array);
        } catch (e) {
          buggy = true;
        }
        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy)
            O.__proto__ = proto;
          else
            set2(O, proto);
          return O;
        };
      }({}, false) : void 0),
      check
    };
  });

  // node_modules/core-js/modules/_inherit-if-required.js
  var require_inherit_if_required = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    var setPrototypeOf = require_set_proto().set;
    module.exports = function(that, target, C) {
      var S = target.constructor;
      var P;
      if (S !== C && typeof S == "function" && (P = S.prototype) !== C.prototype && isObject4(P) && setPrototypeOf) {
        setPrototypeOf(that, P);
      }
      return that;
    };
  });

  // node_modules/core-js/modules/_collection.js
  var require_collection = __commonJS((exports, module) => {
    "use strict";
    var global2 = require_global();
    var $export = require_export();
    var redefine = require_redefine();
    var redefineAll = require_redefine_all();
    var meta = require_meta();
    var forOf = require_for_of();
    var anInstance = require_an_instance();
    var isObject4 = require_is_object();
    var fails = require_fails();
    var $iterDetect = require_iter_detect();
    var setToStringTag = require_set_to_string_tag();
    var inheritIfRequired = require_inherit_if_required();
    module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
      var Base = global2[NAME];
      var C = Base;
      var ADDER = IS_MAP ? "set" : "add";
      var proto = C && C.prototype;
      var O = {};
      var fixMethod = function(KEY) {
        var fn = proto[KEY];
        redefine(proto, KEY, KEY == "delete" ? function(a) {
          return IS_WEAK && !isObject4(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == "has" ? function has(a) {
          return IS_WEAK && !isObject4(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == "get" ? function get(a) {
          return IS_WEAK && !isObject4(a) ? void 0 : fn.call(this, a === 0 ? 0 : a);
        } : KEY == "add" ? function add(a) {
          fn.call(this, a === 0 ? 0 : a);
          return this;
        } : function set2(a, b) {
          fn.call(this, a === 0 ? 0 : a, b);
          return this;
        });
      };
      if (typeof C != "function" || !(IS_WEAK || proto.forEach && !fails(function() {
        new C().entries().next();
      }))) {
        C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
        redefineAll(C.prototype, methods);
        meta.NEED = true;
      } else {
        var instance = new C();
        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
        var THROWS_ON_PRIMITIVES = fails(function() {
          instance.has(1);
        });
        var ACCEPT_ITERABLES = $iterDetect(function(iter) {
          new C(iter);
        });
        var BUGGY_ZERO = !IS_WEAK && fails(function() {
          var $instance = new C();
          var index = 5;
          while (index--)
            $instance[ADDER](index, index);
          return !$instance.has(-0);
        });
        if (!ACCEPT_ITERABLES) {
          C = wrapper(function(target, iterable) {
            anInstance(target, C, NAME);
            var that = inheritIfRequired(new Base(), target, C);
            if (iterable != void 0)
              forOf(iterable, IS_MAP, that[ADDER], that);
            return that;
          });
          C.prototype = proto;
          proto.constructor = C;
        }
        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod("delete");
          fixMethod("has");
          IS_MAP && fixMethod("get");
        }
        if (BUGGY_ZERO || HASNT_CHAINING)
          fixMethod(ADDER);
        if (IS_WEAK && proto.clear)
          delete proto.clear;
      }
      setToStringTag(C, NAME);
      O[NAME] = C;
      $export($export.G + $export.W + $export.F * (C != Base), O);
      if (!IS_WEAK)
        common.setStrong(C, NAME, IS_MAP);
      return C;
    };
  });

  // node_modules/core-js/modules/es6.map.js
  var require_es6_map = __commonJS((exports, module) => {
    "use strict";
    var strong = require_collection_strong();
    var validate3 = require_validate_collection();
    var MAP = "Map";
    module.exports = require_collection()(MAP, function(get) {
      return function Map2() {
        return get(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, {
      get: function get(key) {
        var entry = strong.getEntry(validate3(this, MAP), key);
        return entry && entry.v;
      },
      set: function set2(key, value) {
        return strong.def(validate3(this, MAP), key === 0 ? 0 : key, value);
      }
    }, strong, true);
  });

  // node_modules/core-js/modules/_array-from-iterable.js
  var require_array_from_iterable = __commonJS((exports, module) => {
    var forOf = require_for_of();
    module.exports = function(iter, ITERATOR) {
      var result = [];
      forOf(iter, false, result.push, result, ITERATOR);
      return result;
    };
  });

  // node_modules/core-js/modules/_collection-to-json.js
  var require_collection_to_json = __commonJS((exports, module) => {
    var classof = require_classof();
    var from2 = require_array_from_iterable();
    module.exports = function(NAME) {
      return function toJSON() {
        if (classof(this) != NAME)
          throw TypeError(NAME + "#toJSON isn't generic");
        return from2(this);
      };
    };
  });

  // node_modules/core-js/modules/es7.map.to-json.js
  var require_es7_map_to_json = __commonJS(() => {
    var $export = require_export();
    $export($export.P + $export.R, "Map", {toJSON: require_collection_to_json()("Map")});
  });

  // node_modules/core-js/modules/_set-collection-of.js
  var require_set_collection_of = __commonJS((exports, module) => {
    "use strict";
    var $export = require_export();
    module.exports = function(COLLECTION) {
      $export($export.S, COLLECTION, {of: function of() {
        var length = arguments.length;
        var A = new Array(length);
        while (length--)
          A[length] = arguments[length];
        return new this(A);
      }});
    };
  });

  // node_modules/core-js/modules/es7.map.of.js
  var require_es7_map_of = __commonJS(() => {
    require_set_collection_of()("Map");
  });

  // node_modules/core-js/modules/_set-collection-from.js
  var require_set_collection_from = __commonJS((exports, module) => {
    "use strict";
    var $export = require_export();
    var aFunction = require_a_function();
    var ctx = require_ctx();
    var forOf = require_for_of();
    module.exports = function(COLLECTION) {
      $export($export.S, COLLECTION, {from: function from2(source) {
        var mapFn = arguments[1];
        var mapping, A, n, cb;
        aFunction(this);
        mapping = mapFn !== void 0;
        if (mapping)
          aFunction(mapFn);
        if (source == void 0)
          return new this();
        A = [];
        if (mapping) {
          n = 0;
          cb = ctx(mapFn, arguments[2], 2);
          forOf(source, false, function(nextItem) {
            A.push(cb(nextItem, n++));
          });
        } else {
          forOf(source, false, A.push, A);
        }
        return new this(A);
      }});
    };
  });

  // node_modules/core-js/modules/es7.map.from.js
  var require_es7_map_from = __commonJS(() => {
    require_set_collection_from()("Map");
  });

  // node_modules/core-js/fn/map.js
  var require_map = __commonJS((exports, module) => {
    require_es6_object_to_string();
    require_es6_string_iterator();
    require_web_dom_iterable();
    require_es6_map();
    require_es7_map_to_json();
    require_es7_map_of();
    require_es7_map_from();
    module.exports = require_core().Map;
  });

  // node_modules/core-js/modules/es6.set.js
  var require_es6_set = __commonJS((exports, module) => {
    "use strict";
    var strong = require_collection_strong();
    var validate3 = require_validate_collection();
    var SET = "Set";
    module.exports = require_collection()(SET, function(get) {
      return function Set2() {
        return get(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, {
      add: function add(value) {
        return strong.def(validate3(this, SET), value = value === 0 ? 0 : value, value);
      }
    }, strong);
  });

  // node_modules/core-js/modules/es7.set.to-json.js
  var require_es7_set_to_json = __commonJS(() => {
    var $export = require_export();
    $export($export.P + $export.R, "Set", {toJSON: require_collection_to_json()("Set")});
  });

  // node_modules/core-js/modules/es7.set.of.js
  var require_es7_set_of = __commonJS(() => {
    require_set_collection_of()("Set");
  });

  // node_modules/core-js/modules/es7.set.from.js
  var require_es7_set_from = __commonJS(() => {
    require_set_collection_from()("Set");
  });

  // node_modules/core-js/fn/set.js
  var require_set = __commonJS((exports, module) => {
    require_es6_object_to_string();
    require_es6_string_iterator();
    require_web_dom_iterable();
    require_es6_set();
    require_es7_set_to_json();
    require_es7_set_of();
    require_es7_set_from();
    module.exports = require_core().Set;
  });

  // node_modules/core-js/modules/_is-array.js
  var require_is_array = __commonJS((exports, module) => {
    var cof = require_cof();
    module.exports = Array.isArray || function isArray(arg) {
      return cof(arg) == "Array";
    };
  });

  // node_modules/core-js/modules/_array-species-constructor.js
  var require_array_species_constructor = __commonJS((exports, module) => {
    var isObject4 = require_is_object();
    var isArray = require_is_array();
    var SPECIES = require_wks()("species");
    module.exports = function(original) {
      var C;
      if (isArray(original)) {
        C = original.constructor;
        if (typeof C == "function" && (C === Array || isArray(C.prototype)))
          C = void 0;
        if (isObject4(C)) {
          C = C[SPECIES];
          if (C === null)
            C = void 0;
        }
      }
      return C === void 0 ? Array : C;
    };
  });

  // node_modules/core-js/modules/_array-species-create.js
  var require_array_species_create = __commonJS((exports, module) => {
    var speciesConstructor = require_array_species_constructor();
    module.exports = function(original, length) {
      return new (speciesConstructor(original))(length);
    };
  });

  // node_modules/core-js/modules/_array-methods.js
  var require_array_methods = __commonJS((exports, module) => {
    var ctx = require_ctx();
    var IObject = require_iobject();
    var toObject = require_to_object();
    var toLength = require_to_length();
    var asc = require_array_species_create();
    module.exports = function(TYPE, $create) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      var create = $create || asc;
      return function($this, callbackfn, that) {
        var O = toObject($this);
        var self2 = IObject(O);
        var f = ctx(callbackfn, that, 3);
        var length = toLength(self2.length);
        var index = 0;
        var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
        var val, res;
        for (; length > index; index++)
          if (NO_HOLES || index in self2) {
            val = self2[index];
            res = f(val, index, O);
            if (TYPE) {
              if (IS_MAP)
                result[index] = res;
              else if (res)
                switch (TYPE) {
                  case 3:
                    return true;
                  case 5:
                    return val;
                  case 6:
                    return index;
                  case 2:
                    result.push(val);
                }
              else if (IS_EVERY)
                return false;
            }
          }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
      };
    };
  });

  // node_modules/core-js/modules/_object-gops.js
  var require_object_gops = __commonJS((exports) => {
    exports.f = Object.getOwnPropertySymbols;
  });

  // node_modules/core-js/modules/_object-assign.js
  var require_object_assign = __commonJS((exports, module) => {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var getKeys = require_object_keys();
    var gOPS = require_object_gops();
    var pIE = require_object_pie();
    var toObject = require_to_object();
    var IObject = require_iobject();
    var $assign = Object.assign;
    module.exports = !$assign || require_fails()(function() {
      var A = {};
      var B = {};
      var S = Symbol();
      var K = "abcdefghijklmnopqrst";
      A[S] = 7;
      K.split("").forEach(function(k) {
        B[k] = k;
      });
      return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join("") != K;
    }) ? function assign2(target, source) {
      var T = toObject(target);
      var aLen = arguments.length;
      var index = 1;
      var getSymbols = gOPS.f;
      var isEnum = pIE.f;
      while (aLen > index) {
        var S = IObject(arguments[index++]);
        var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
        var length = keys.length;
        var j = 0;
        var key;
        while (length > j) {
          key = keys[j++];
          if (!DESCRIPTORS || isEnum.call(S, key))
            T[key] = S[key];
        }
      }
      return T;
    } : $assign;
  });

  // node_modules/core-js/modules/_collection-weak.js
  var require_collection_weak = __commonJS((exports, module) => {
    "use strict";
    var redefineAll = require_redefine_all();
    var getWeak = require_meta().getWeak;
    var anObject = require_an_object();
    var isObject4 = require_is_object();
    var anInstance = require_an_instance();
    var forOf = require_for_of();
    var createArrayMethod = require_array_methods();
    var $has = require_has();
    var validate3 = require_validate_collection();
    var arrayFind = createArrayMethod(5);
    var arrayFindIndex = createArrayMethod(6);
    var id = 0;
    var uncaughtFrozenStore = function(that) {
      return that._l || (that._l = new UncaughtFrozenStore());
    };
    var UncaughtFrozenStore = function() {
      this.a = [];
    };
    var findUncaughtFrozen = function(store, key) {
      return arrayFind(store.a, function(it) {
        return it[0] === key;
      });
    };
    UncaughtFrozenStore.prototype = {
      get: function(key) {
        var entry = findUncaughtFrozen(this, key);
        if (entry)
          return entry[1];
      },
      has: function(key) {
        return !!findUncaughtFrozen(this, key);
      },
      set: function(key, value) {
        var entry = findUncaughtFrozen(this, key);
        if (entry)
          entry[1] = value;
        else
          this.a.push([key, value]);
      },
      delete: function(key) {
        var index = arrayFindIndex(this.a, function(it) {
          return it[0] === key;
        });
        if (~index)
          this.a.splice(index, 1);
        return !!~index;
      }
    };
    module.exports = {
      getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
        var C = wrapper(function(that, iterable) {
          anInstance(that, C, NAME, "_i");
          that._t = NAME;
          that._i = id++;
          that._l = void 0;
          if (iterable != void 0)
            forOf(iterable, IS_MAP, that[ADDER], that);
        });
        redefineAll(C.prototype, {
          delete: function(key) {
            if (!isObject4(key))
              return false;
            var data = getWeak(key);
            if (data === true)
              return uncaughtFrozenStore(validate3(this, NAME))["delete"](key);
            return data && $has(data, this._i) && delete data[this._i];
          },
          has: function has(key) {
            if (!isObject4(key))
              return false;
            var data = getWeak(key);
            if (data === true)
              return uncaughtFrozenStore(validate3(this, NAME)).has(key);
            return data && $has(data, this._i);
          }
        });
        return C;
      },
      def: function(that, key, value) {
        var data = getWeak(anObject(key), true);
        if (data === true)
          uncaughtFrozenStore(that).set(key, value);
        else
          data[that._i] = value;
        return that;
      },
      ufstore: uncaughtFrozenStore
    };
  });

  // node_modules/core-js/modules/es6.weak-map.js
  var require_es6_weak_map = __commonJS((exports, module) => {
    "use strict";
    var global2 = require_global();
    var each = require_array_methods()(0);
    var redefine = require_redefine();
    var meta = require_meta();
    var assign2 = require_object_assign();
    var weak = require_collection_weak();
    var isObject4 = require_is_object();
    var validate3 = require_validate_collection();
    var NATIVE_WEAK_MAP = require_validate_collection();
    var IS_IE11 = !global2.ActiveXObject && "ActiveXObject" in global2;
    var WEAK_MAP = "WeakMap";
    var getWeak = meta.getWeak;
    var isExtensible = Object.isExtensible;
    var uncaughtFrozenStore = weak.ufstore;
    var InternalMap;
    var wrapper = function(get) {
      return function WeakMap2() {
        return get(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    };
    var methods = {
      get: function get(key) {
        if (isObject4(key)) {
          var data = getWeak(key);
          if (data === true)
            return uncaughtFrozenStore(validate3(this, WEAK_MAP)).get(key);
          return data ? data[this._i] : void 0;
        }
      },
      set: function set2(key, value) {
        return weak.def(validate3(this, WEAK_MAP), key, value);
      }
    };
    var $WeakMap = module.exports = require_collection()(WEAK_MAP, wrapper, methods, weak, true, true);
    if (NATIVE_WEAK_MAP && IS_IE11) {
      InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
      assign2(InternalMap.prototype, methods);
      meta.NEED = true;
      each(["delete", "has", "get", "set"], function(key) {
        var proto = $WeakMap.prototype;
        var method = proto[key];
        redefine(proto, key, function(a, b) {
          if (isObject4(a) && !isExtensible(a)) {
            if (!this._f)
              this._f = new InternalMap();
            var result = this._f[key](a, b);
            return key == "set" ? this : result;
          }
          return method.call(this, a, b);
        });
      });
    }
  });

  // node_modules/core-js/modules/es7.weak-map.of.js
  var require_es7_weak_map_of = __commonJS(() => {
    require_set_collection_of()("WeakMap");
  });

  // node_modules/core-js/modules/es7.weak-map.from.js
  var require_es7_weak_map_from = __commonJS(() => {
    require_set_collection_from()("WeakMap");
  });

  // node_modules/core-js/fn/weak-map.js
  var require_weak_map = __commonJS((exports, module) => {
    require_es6_object_to_string();
    require_web_dom_iterable();
    require_es6_weak_map();
    require_es7_weak_map_of();
    require_es7_weak_map_from();
    module.exports = require_core().WeakMap;
  });

  // node_modules/core-js/modules/_create-property.js
  var require_create_property = __commonJS((exports, module) => {
    "use strict";
    var $defineProperty = require_object_dp();
    var createDesc = require_property_desc();
    module.exports = function(object, index, value) {
      if (index in object)
        $defineProperty.f(object, index, createDesc(0, value));
      else
        object[index] = value;
    };
  });

  // node_modules/core-js/modules/es6.array.from.js
  var require_es6_array_from = __commonJS(() => {
    "use strict";
    var ctx = require_ctx();
    var $export = require_export();
    var toObject = require_to_object();
    var call = require_iter_call();
    var isArrayIter = require_is_array_iter();
    var toLength = require_to_length();
    var createProperty = require_create_property();
    var getIterFn = require_core_get_iterator_method();
    $export($export.S + $export.F * !require_iter_detect()(function(iter) {
      Array.from(iter);
    }), "Array", {
      from: function from2(arrayLike) {
        var O = toObject(arrayLike);
        var C = typeof this == "function" ? this : Array;
        var aLen = arguments.length;
        var mapfn = aLen > 1 ? arguments[1] : void 0;
        var mapping = mapfn !== void 0;
        var index = 0;
        var iterFn = getIterFn(O);
        var length, result, step, iterator;
        if (mapping)
          mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : void 0, 2);
        if (iterFn != void 0 && !(C == Array && isArrayIter(iterFn))) {
          for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
            createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
          }
        } else {
          length = toLength(O.length);
          for (result = new C(length); length > index; index++) {
            createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
          }
        }
        result.length = index;
        return result;
      }
    });
  });

  // node_modules/core-js/fn/array/from.js
  var require_from = __commonJS((exports, module) => {
    require_es6_string_iterator();
    require_es6_array_from();
    module.exports = require_core().Array.from;
  });

  // node_modules/core-js/modules/es6.object.assign.js
  var require_es6_object_assign = __commonJS(() => {
    var $export = require_export();
    $export($export.S + $export.F, "Object", {assign: require_object_assign()});
  });

  // node_modules/core-js/fn/object/assign.js
  var require_assign = __commonJS((exports, module) => {
    require_es6_object_assign();
    module.exports = require_core().Object.assign;
  });

  // node_modules/validate.js/validate.js
  var require_validate = __commonJS((exports, module) => {
    /*!
     * validate.js 0.13.1
     *
     * (c) 2013-2019 Nicklas Ansman, 2013 Wrapp
     * Validate.js may be freely distributed under the MIT license.
     * For all details and documentation:
     * http://validatejs.org/
     */
    (function(exports2, module2, define2) {
      "use strict";
      var validate3 = function(attributes, constraints, options2) {
        options2 = v.extend({}, v.options, options2);
        var results = v.runValidations(attributes, constraints, options2), attr, validator;
        if (results.some(function(r) {
          return v.isPromise(r.error);
        })) {
          throw new Error("Use validate.async if you want support for promises");
        }
        return validate3.processValidationResults(results, options2);
      };
      var v = validate3;
      v.extend = function(obj) {
        [].slice.call(arguments, 1).forEach(function(source) {
          for (var attr in source) {
            obj[attr] = source[attr];
          }
        });
        return obj;
      };
      v.extend(validate3, {
        version: {
          major: 0,
          minor: 13,
          patch: 1,
          metadata: null,
          toString: function() {
            var version = v.format("%{major}.%{minor}.%{patch}", v.version);
            if (!v.isEmpty(v.version.metadata)) {
              version += "+" + v.version.metadata;
            }
            return version;
          }
        },
        Promise: typeof Promise !== "undefined" ? Promise : null,
        EMPTY_STRING_REGEXP: /^\s*$/,
        runValidations: function(attributes, constraints, options2) {
          var results = [], attr, validatorName, value, validators, validator, validatorOptions, error;
          if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
            attributes = v.collectFormValues(attributes);
          }
          for (attr in constraints) {
            value = v.getDeepObjectValue(attributes, attr);
            validators = v.result(constraints[attr], value, attributes, attr, options2, constraints);
            for (validatorName in validators) {
              validator = v.validators[validatorName];
              if (!validator) {
                error = v.format("Unknown validator %{name}", {name: validatorName});
                throw new Error(error);
              }
              validatorOptions = validators[validatorName];
              validatorOptions = v.result(validatorOptions, value, attributes, attr, options2, constraints);
              if (!validatorOptions) {
                continue;
              }
              results.push({
                attribute: attr,
                value,
                validator: validatorName,
                globalOptions: options2,
                attributes,
                options: validatorOptions,
                error: validator.call(validator, value, validatorOptions, attr, attributes, options2)
              });
            }
          }
          return results;
        },
        processValidationResults: function(errors, options2) {
          errors = v.pruneEmptyErrors(errors, options2);
          errors = v.expandMultipleErrors(errors, options2);
          errors = v.convertErrorMessages(errors, options2);
          var format = options2.format || "grouped";
          if (typeof v.formatters[format] === "function") {
            errors = v.formatters[format](errors);
          } else {
            throw new Error(v.format("Unknown format %{format}", options2));
          }
          return v.isEmpty(errors) ? void 0 : errors;
        },
        async: function(attributes, constraints, options2) {
          options2 = v.extend({}, v.async.options, options2);
          var WrapErrors = options2.wrapErrors || function(errors) {
            return errors;
          };
          if (options2.cleanAttributes !== false) {
            attributes = v.cleanAttributes(attributes, constraints);
          }
          var results = v.runValidations(attributes, constraints, options2);
          return new v.Promise(function(resolve, reject) {
            v.waitForResults(results).then(function() {
              var errors = v.processValidationResults(results, options2);
              if (errors) {
                reject(new WrapErrors(errors, options2, attributes, constraints));
              } else {
                resolve(attributes);
              }
            }, function(err) {
              reject(err);
            });
          });
        },
        single: function(value, constraints, options2) {
          options2 = v.extend({}, v.single.options, options2, {
            format: "flat",
            fullMessages: false
          });
          return v({single: value}, {single: constraints}, options2);
        },
        waitForResults: function(results) {
          return results.reduce(function(memo, result) {
            if (!v.isPromise(result.error)) {
              return memo;
            }
            return memo.then(function() {
              return result.error.then(function(error) {
                result.error = error || null;
              });
            });
          }, new v.Promise(function(r) {
            r();
          }));
        },
        result: function(value) {
          var args = [].slice.call(arguments, 1);
          if (typeof value === "function") {
            value = value.apply(null, args);
          }
          return value;
        },
        isNumber: function(value) {
          return typeof value === "number" && !isNaN(value);
        },
        isFunction: function(value) {
          return typeof value === "function";
        },
        isInteger: function(value) {
          return v.isNumber(value) && value % 1 === 0;
        },
        isBoolean: function(value) {
          return typeof value === "boolean";
        },
        isObject: function(obj) {
          return obj === Object(obj);
        },
        isDate: function(obj) {
          return obj instanceof Date;
        },
        isDefined: function(obj) {
          return obj !== null && obj !== void 0;
        },
        isPromise: function(p) {
          return !!p && v.isFunction(p.then);
        },
        isJqueryElement: function(o) {
          return o && v.isString(o.jquery);
        },
        isDomElement: function(o) {
          if (!o) {
            return false;
          }
          if (!o.querySelectorAll || !o.querySelector) {
            return false;
          }
          if (v.isObject(document) && o === document) {
            return true;
          }
          if (typeof HTMLElement === "object") {
            return o instanceof HTMLElement;
          } else {
            return o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
          }
        },
        isEmpty: function(value) {
          var attr;
          if (!v.isDefined(value)) {
            return true;
          }
          if (v.isFunction(value)) {
            return false;
          }
          if (v.isString(value)) {
            return v.EMPTY_STRING_REGEXP.test(value);
          }
          if (v.isArray(value)) {
            return value.length === 0;
          }
          if (v.isDate(value)) {
            return false;
          }
          if (v.isObject(value)) {
            for (attr in value) {
              return false;
            }
            return true;
          }
          return false;
        },
        format: v.extend(function(str, vals) {
          if (!v.isString(str)) {
            return str;
          }
          return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
            if (m1 === "%") {
              return "%{" + m2 + "}";
            } else {
              return String(vals[m2]);
            }
          });
        }, {
          FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
        }),
        prettify: function(str) {
          if (v.isNumber(str)) {
            if (str * 100 % 1 === 0) {
              return "" + str;
            } else {
              return parseFloat(Math.round(str * 100) / 100).toFixed(2);
            }
          }
          if (v.isArray(str)) {
            return str.map(function(s) {
              return v.prettify(s);
            }).join(", ");
          }
          if (v.isObject(str)) {
            if (!v.isDefined(str.toString)) {
              return JSON.stringify(str);
            }
            return str.toString();
          }
          str = "" + str;
          return str.replace(/([^\s])\.([^\s])/g, "$1 $2").replace(/\\+/g, "").replace(/[_-]/g, " ").replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
            return "" + m1 + " " + m2.toLowerCase();
          }).toLowerCase();
        },
        stringifyValue: function(value, options2) {
          var prettify = options2 && options2.prettify || v.prettify;
          return prettify(value);
        },
        isString: function(value) {
          return typeof value === "string";
        },
        isArray: function(value) {
          return {}.toString.call(value) === "[object Array]";
        },
        isHash: function(value) {
          return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
        },
        contains: function(obj, value) {
          if (!v.isDefined(obj)) {
            return false;
          }
          if (v.isArray(obj)) {
            return obj.indexOf(value) !== -1;
          }
          return value in obj;
        },
        unique: function(array) {
          if (!v.isArray(array)) {
            return array;
          }
          return array.filter(function(el, index, array2) {
            return array2.indexOf(el) == index;
          });
        },
        forEachKeyInKeypath: function(object, keypath, callback) {
          if (!v.isString(keypath)) {
            return void 0;
          }
          var key = "", i, escape2 = false;
          for (i = 0; i < keypath.length; ++i) {
            switch (keypath[i]) {
              case ".":
                if (escape2) {
                  escape2 = false;
                  key += ".";
                } else {
                  object = callback(object, key, false);
                  key = "";
                }
                break;
              case "\\":
                if (escape2) {
                  escape2 = false;
                  key += "\\";
                } else {
                  escape2 = true;
                }
                break;
              default:
                escape2 = false;
                key += keypath[i];
                break;
            }
          }
          return callback(object, key, true);
        },
        getDeepObjectValue: function(obj, keypath) {
          if (!v.isObject(obj)) {
            return void 0;
          }
          return v.forEachKeyInKeypath(obj, keypath, function(obj2, key) {
            if (v.isObject(obj2)) {
              return obj2[key];
            }
          });
        },
        collectFormValues: function(form, options2) {
          var values = {}, i, j, input, inputs, option, value;
          if (v.isJqueryElement(form)) {
            form = form[0];
          }
          if (!form) {
            return values;
          }
          options2 = options2 || {};
          inputs = form.querySelectorAll("input[name], textarea[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }
            var name = input.name.replace(/\./g, "\\\\.");
            value = v.sanitizeFormValue(input.value, options2);
            if (input.type === "number") {
              value = value ? +value : null;
            } else if (input.type === "checkbox") {
              if (input.attributes.value) {
                if (!input.checked) {
                  value = values[name] || null;
                }
              } else {
                value = input.checked;
              }
            } else if (input.type === "radio") {
              if (!input.checked) {
                value = values[name] || null;
              }
            }
            values[name] = value;
          }
          inputs = form.querySelectorAll("select[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }
            if (input.multiple) {
              value = [];
              for (j in input.options) {
                option = input.options[j];
                if (option && option.selected) {
                  value.push(v.sanitizeFormValue(option.value, options2));
                }
              }
            } else {
              var _val = typeof input.options[input.selectedIndex] !== "undefined" ? input.options[input.selectedIndex].value : "";
              value = v.sanitizeFormValue(_val, options2);
            }
            values[input.name] = value;
          }
          return values;
        },
        sanitizeFormValue: function(value, options2) {
          if (options2.trim && v.isString(value)) {
            value = value.trim();
          }
          if (options2.nullify !== false && value === "") {
            return null;
          }
          return value;
        },
        capitalize: function(str) {
          if (!v.isString(str)) {
            return str;
          }
          return str[0].toUpperCase() + str.slice(1);
        },
        pruneEmptyErrors: function(errors) {
          return errors.filter(function(error) {
            return !v.isEmpty(error.error);
          });
        },
        expandMultipleErrors: function(errors) {
          var ret = [];
          errors.forEach(function(error) {
            if (v.isArray(error.error)) {
              error.error.forEach(function(msg) {
                ret.push(v.extend({}, error, {error: msg}));
              });
            } else {
              ret.push(error);
            }
          });
          return ret;
        },
        convertErrorMessages: function(errors, options2) {
          options2 = options2 || {};
          var ret = [], prettify = options2.prettify || v.prettify;
          errors.forEach(function(errorInfo) {
            var error = v.result(errorInfo.error, errorInfo.value, errorInfo.attribute, errorInfo.options, errorInfo.attributes, errorInfo.globalOptions);
            if (!v.isString(error)) {
              ret.push(errorInfo);
              return;
            }
            if (error[0] === "^") {
              error = error.slice(1);
            } else if (options2.fullMessages !== false) {
              error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
            }
            error = error.replace(/\\\^/g, "^");
            error = v.format(error, {
              value: v.stringifyValue(errorInfo.value, options2)
            });
            ret.push(v.extend({}, errorInfo, {error}));
          });
          return ret;
        },
        groupErrorsByAttribute: function(errors) {
          var ret = {};
          errors.forEach(function(error) {
            var list = ret[error.attribute];
            if (list) {
              list.push(error);
            } else {
              ret[error.attribute] = [error];
            }
          });
          return ret;
        },
        flattenErrorsToArray: function(errors) {
          return errors.map(function(error) {
            return error.error;
          }).filter(function(value, index, self2) {
            return self2.indexOf(value) === index;
          });
        },
        cleanAttributes: function(attributes, whitelist) {
          function whitelistCreator(obj, key, last) {
            if (v.isObject(obj[key])) {
              return obj[key];
            }
            return obj[key] = last ? true : {};
          }
          function buildObjectWhitelist(whitelist2) {
            var ow = {}, lastObject, attr;
            for (attr in whitelist2) {
              if (!whitelist2[attr]) {
                continue;
              }
              v.forEachKeyInKeypath(ow, attr, whitelistCreator);
            }
            return ow;
          }
          function cleanRecursive(attributes2, whitelist2) {
            if (!v.isObject(attributes2)) {
              return attributes2;
            }
            var ret = v.extend({}, attributes2), w, attribute;
            for (attribute in attributes2) {
              w = whitelist2[attribute];
              if (v.isObject(w)) {
                ret[attribute] = cleanRecursive(ret[attribute], w);
              } else if (!w) {
                delete ret[attribute];
              }
            }
            return ret;
          }
          if (!v.isObject(whitelist) || !v.isObject(attributes)) {
            return {};
          }
          whitelist = buildObjectWhitelist(whitelist);
          return cleanRecursive(attributes, whitelist);
        },
        exposeModule: function(validate4, root4, exports3, module3, define3) {
          if (exports3) {
            if (module3 && module3.exports) {
              exports3 = module3.exports = validate4;
            }
            exports3.validate = validate4;
          } else {
            root4.validate = validate4;
            if (validate4.isFunction(define3) && define3.amd) {
              define3([], function() {
                return validate4;
              });
            }
          }
        },
        warn: function(msg) {
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[validate.js] " + msg);
          }
        },
        error: function(msg) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[validate.js] " + msg);
          }
        }
      });
      validate3.validators = {
        presence: function(value, options2) {
          options2 = v.extend({}, this.options, options2);
          if (options2.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
            return options2.message || this.message || "can't be blank";
          }
        },
        length: function(value, options2, attribute) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var is = options2.is, maximum = options2.maximum, minimum = options2.minimum, tokenizer = options2.tokenizer || function(val) {
            return val;
          }, err, errors = [];
          value = tokenizer(value);
          var length = value.length;
          if (!v.isNumber(length)) {
            return options2.message || this.notValid || "has an incorrect length";
          }
          if (v.isNumber(is) && length !== is) {
            err = options2.wrongLength || this.wrongLength || "is the wrong length (should be %{count} characters)";
            errors.push(v.format(err, {count: is}));
          }
          if (v.isNumber(minimum) && length < minimum) {
            err = options2.tooShort || this.tooShort || "is too short (minimum is %{count} characters)";
            errors.push(v.format(err, {count: minimum}));
          }
          if (v.isNumber(maximum) && length > maximum) {
            err = options2.tooLong || this.tooLong || "is too long (maximum is %{count} characters)";
            errors.push(v.format(err, {count: maximum}));
          }
          if (errors.length > 0) {
            return options2.message || errors;
          }
        },
        numericality: function(value, options2, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var errors = [], name, count, checks = {
            greaterThan: function(v2, c) {
              return v2 > c;
            },
            greaterThanOrEqualTo: function(v2, c) {
              return v2 >= c;
            },
            equalTo: function(v2, c) {
              return v2 === c;
            },
            lessThan: function(v2, c) {
              return v2 < c;
            },
            lessThanOrEqualTo: function(v2, c) {
              return v2 <= c;
            },
            divisibleBy: function(v2, c) {
              return v2 % c === 0;
            }
          }, prettify = options2.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (v.isString(value) && options2.strict) {
            var pattern = "^-?(0|[1-9]\\d*)";
            if (!options2.onlyInteger) {
              pattern += "(\\.\\d+)?";
            }
            pattern += "$";
            if (!new RegExp(pattern).test(value)) {
              return options2.message || options2.notValid || this.notValid || this.message || "must be a valid number";
            }
          }
          if (options2.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
            value = +value;
          }
          if (!v.isNumber(value)) {
            return options2.message || options2.notValid || this.notValid || this.message || "is not a number";
          }
          if (options2.onlyInteger && !v.isInteger(value)) {
            return options2.message || options2.notInteger || this.notInteger || this.message || "must be an integer";
          }
          for (name in checks) {
            count = options2[name];
            if (v.isNumber(count) && !checks[name](value, count)) {
              var key = "not" + v.capitalize(name);
              var msg = options2[key] || this[key] || this.message || "must be %{type} %{count}";
              errors.push(v.format(msg, {
                count,
                type: prettify(name)
              }));
            }
          }
          if (options2.odd && value % 2 !== 1) {
            errors.push(options2.notOdd || this.notOdd || this.message || "must be odd");
          }
          if (options2.even && value % 2 !== 0) {
            errors.push(options2.notEven || this.notEven || this.message || "must be even");
          }
          if (errors.length) {
            return options2.message || errors;
          }
        },
        datetime: v.extend(function(value, options2) {
          if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
            throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
          }
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var err, errors = [], earliest = options2.earliest ? this.parse(options2.earliest, options2) : NaN, latest = options2.latest ? this.parse(options2.latest, options2) : NaN;
          value = this.parse(value, options2);
          if (isNaN(value) || options2.dateOnly && value % 864e5 !== 0) {
            err = options2.notValid || options2.message || this.notValid || "must be a valid date";
            return v.format(err, {value: arguments[0]});
          }
          if (!isNaN(earliest) && value < earliest) {
            err = options2.tooEarly || options2.message || this.tooEarly || "must be no earlier than %{date}";
            err = v.format(err, {
              value: this.format(value, options2),
              date: this.format(earliest, options2)
            });
            errors.push(err);
          }
          if (!isNaN(latest) && value > latest) {
            err = options2.tooLate || options2.message || this.tooLate || "must be no later than %{date}";
            err = v.format(err, {
              date: this.format(latest, options2),
              value: this.format(value, options2)
            });
            errors.push(err);
          }
          if (errors.length) {
            return v.unique(errors);
          }
        }, {
          parse: null,
          format: null
        }),
        date: function(value, options2) {
          options2 = v.extend({}, options2, {dateOnly: true});
          return v.validators.datetime.call(v.validators.datetime, value, options2);
        },
        format: function(value, options2) {
          if (v.isString(options2) || options2 instanceof RegExp) {
            options2 = {pattern: options2};
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is invalid", pattern = options2.pattern, match;
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (v.isString(pattern)) {
            pattern = new RegExp(options2.pattern, options2.flags);
          }
          match = pattern.exec(value);
          if (!match || match[0].length != value.length) {
            return message;
          }
        },
        inclusion: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options2)) {
            options2 = {within: options2};
          }
          options2 = v.extend({}, this.options, options2);
          if (v.contains(options2.within, value)) {
            return;
          }
          var message = options2.message || this.message || "^%{value} is not included in the list";
          return v.format(message, {value});
        },
        exclusion: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options2)) {
            options2 = {within: options2};
          }
          options2 = v.extend({}, this.options, options2);
          if (!v.contains(options2.within, value)) {
            return;
          }
          var message = options2.message || this.message || "^%{value} is restricted";
          if (v.isString(options2.within[value])) {
            value = options2.within[value];
          }
          return v.format(message, {value});
        },
        email: v.extend(function(value, options2) {
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not a valid email";
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (!this.PATTERN.exec(value)) {
            return message;
          }
        }, {
          PATTERN: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
        }),
        equality: function(value, options2, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isString(options2)) {
            options2 = {attribute: options2};
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not equal to %{attribute}";
          if (v.isEmpty(options2.attribute) || !v.isString(options2.attribute)) {
            throw new Error("The attribute must be a non empty string");
          }
          var otherValue = v.getDeepObjectValue(attributes, options2.attribute), comparator = options2.comparator || function(v1, v2) {
            return v1 === v2;
          }, prettify = options2.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (!comparator(value, otherValue, options2, attribute, attributes)) {
            return v.format(message, {attribute: prettify(options2.attribute)});
          }
        },
        url: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not a valid url", schemes = options2.schemes || this.schemes || ["http", "https"], allowLocal = options2.allowLocal || this.allowLocal || false, allowDataUrl = options2.allowDataUrl || this.allowDataUrl || false;
          if (!v.isString(value)) {
            return message;
          }
          var regex = "^(?:(?:" + schemes.join("|") + ")://)(?:\\S+(?::\\S*)?@)?(?:";
          var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
          if (allowLocal) {
            tld += "?";
          } else {
            regex += "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
          }
          regex += "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" + tld + ")(?::\\d{2,5})?(?:[/?#]\\S*)?$";
          if (allowDataUrl) {
            var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
            var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
            var dataurl = "data:(?:" + mediaType + ")?(?:;base64)?," + urlchar;
            regex = "(?:" + regex + ")|(?:^" + dataurl + "$)";
          }
          var PATTERN = new RegExp(regex, "i");
          if (!PATTERN.exec(value)) {
            return message;
          }
        },
        type: v.extend(function(value, originalOptions, attribute, attributes, globalOptions) {
          if (v.isString(originalOptions)) {
            originalOptions = {type: originalOptions};
          }
          if (!v.isDefined(value)) {
            return;
          }
          var options2 = v.extend({}, this.options, originalOptions);
          var type = options2.type;
          if (!v.isDefined(type)) {
            throw new Error("No type was specified");
          }
          var check;
          if (v.isFunction(type)) {
            check = type;
          } else {
            check = this.types[type];
          }
          if (!v.isFunction(check)) {
            throw new Error("validate.validators.type.types." + type + " must be a function.");
          }
          if (!check(value, options2, attribute, attributes, globalOptions)) {
            var message = originalOptions.message || this.messages[type] || this.message || options2.message || (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");
            if (v.isFunction(message)) {
              message = message(value, originalOptions, attribute, attributes, globalOptions);
            }
            return v.format(message, {attribute: v.prettify(attribute), type});
          }
        }, {
          types: {
            object: function(value) {
              return v.isObject(value) && !v.isArray(value);
            },
            array: v.isArray,
            integer: v.isInteger,
            number: v.isNumber,
            string: v.isString,
            date: v.isDate,
            boolean: v.isBoolean
          },
          messages: {}
        })
      };
      validate3.formatters = {
        detailed: function(errors) {
          return errors;
        },
        flat: v.flattenErrorsToArray,
        grouped: function(errors) {
          var attr;
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = v.flattenErrorsToArray(errors[attr]);
          }
          return errors;
        },
        constraint: function(errors) {
          var attr;
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = errors[attr].map(function(result) {
              return result.validator;
            }).sort();
          }
          return errors;
        }
      };
      validate3.exposeModule(validate3, this, exports2, module2, define2);
    }).call(exports, typeof exports !== "undefined" ? exports : null, typeof module !== "undefined" ? module : null, typeof define !== "undefined" ? define : null);
  });

  // node_modules/js-cookie/src/js.cookie.js
  var require_js_cookie = __commonJS((exports, module) => {
    /*!
     * JavaScript Cookie v2.2.1
     * https://github.com/js-cookie/js-cookie
     *
     * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
     * Released under the MIT license
     */
    (function(factory) {
      var registeredInModuleLoader;
      if (typeof define === "function" && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
      }
      if (typeof exports === "object") {
        module.exports = factory();
        registeredInModuleLoader = true;
      }
      if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function() {
          window.Cookies = OldCookies;
          return api;
        };
      }
    })(function() {
      function extend3() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
          var attributes = arguments[i];
          for (var key in attributes) {
            result[key] = attributes[key];
          }
        }
        return result;
      }
      function decode(s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
      }
      function init(converter) {
        function api() {
        }
        function set2(key, value, attributes) {
          if (typeof document === "undefined") {
            return;
          }
          attributes = extend3({
            path: "/"
          }, api.defaults, attributes);
          if (typeof attributes.expires === "number") {
            attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e5);
          }
          attributes.expires = attributes.expires ? attributes.expires.toUTCString() : "";
          try {
            var result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
              value = result;
            }
          } catch (e) {
          }
          value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
          key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
          var stringifiedAttributes = "";
          for (var attributeName in attributes) {
            if (!attributes[attributeName]) {
              continue;
            }
            stringifiedAttributes += "; " + attributeName;
            if (attributes[attributeName] === true) {
              continue;
            }
            stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
          }
          return document.cookie = key + "=" + value + stringifiedAttributes;
        }
        function get(key, json) {
          if (typeof document === "undefined") {
            return;
          }
          var jar = {};
          var cookies = document.cookie ? document.cookie.split("; ") : [];
          var i = 0;
          for (; i < cookies.length; i++) {
            var parts = cookies[i].split("=");
            var cookie = parts.slice(1).join("=");
            if (!json && cookie.charAt(0) === '"') {
              cookie = cookie.slice(1, -1);
            }
            try {
              var name = decode(parts[0]);
              cookie = (converter.read || converter)(cookie, name) || decode(cookie);
              if (json) {
                try {
                  cookie = JSON.parse(cookie);
                } catch (e) {
                }
              }
              jar[name] = cookie;
              if (key === name) {
                break;
              }
            } catch (e) {
            }
          }
          return key ? jar[key] : jar;
        }
        api.set = set2;
        api.get = function(key) {
          return get(key, false);
        };
        api.getJSON = function(key) {
          return get(key, true);
        };
        api.remove = function(key, attributes) {
          set2(key, "", extend3(attributes, {
            expires: -1
          }));
        };
        api.defaults = {};
        api.withConverter = init;
        return api;
      }
      return init(function() {
      });
    });
  });

  // src/js/app/utils/textCasesFilter.js
  var require_textCasesFilter = __commonJS((exports, module) => {
    const getSticker = (name, html) => {
      if (html) {
        return `<div class="cases-page__item cases-page__item--sticker" data-scroll="caseItem2" data-elements="casesItems">
			<div class="cases-page__sticker cases-page__sticker--${name}">
				<img src="/images/cases/stickers/${name}.svg" alt="">
			</div>
		</div>`;
      }
      if (!html) {
        return {
          casesList: {
            type: "sticker",
            name,
            path: name + ".svg"
          }
        };
      }
    };
    module.exports = function(elts, html) {
      let preFilled = [], r = elts.filter((item, i, arr) => {
        if (item.casesList && item.casesList.images == void 0) {
          return item.casesList;
        }
      }), stickersCounter = 24;
      (html ? elts : r).forEach((item, i, arr) => {
        preFilled.push(item);
        if (i % stickersCounter == 1) {
          preFilled.push(getSticker("head", html));
          preFilled.push(getSticker("hotdog", html));
        }
        if (i % stickersCounter == 4) {
          preFilled.push(getSticker("pack", html));
        }
        if (i % stickersCounter == 5) {
          preFilled.push(getSticker("cocktail", html));
          preFilled.push(getSticker("gost", html));
        }
        if (i % stickersCounter == 9) {
          preFilled.push(getSticker("cat", html));
          preFilled.push(getSticker("glass", html));
        }
        if (i % stickersCounter == 12) {
          preFilled.push(getSticker("phone", html));
        }
        if (i % stickersCounter == 13) {
          preFilled.push(getSticker("gun", html));
          preFilled.push(getSticker("umbrella", html));
        }
        if (i % stickersCounter == 17) {
          preFilled.push(getSticker("pig", html));
          preFilled.push(getSticker("dice", html));
        }
        if (i % stickersCounter == 20) {
          preFilled.push(getSticker("face", html));
        }
        if (i % stickersCounter == 21) {
          preFilled.push(getSticker("collar", html));
          if (i != arr.length - 1) {
            preFilled.push(getSticker("hands", html));
          }
        }
      });
      return preFilled;
    };
  });

  // src/js/app.js
  var require_app = __commonJS((exports) => {
    __export(exports, {
      default: () => App
    });
    const splitting = __toModule(require_splitting());
    const debug = new universalDebugger();
    class App {
      constructor() {
        new Vh();
        bindAll(this);
        this.DOM = createDOM();
        this.DOM.scrollSections = {};
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.prevWidth = this.width;
        this.body = document.body;
        this.bodyData = document.body.dataset;
        this.query = getQuery();
        [...document.querySelectorAll("[data-scroll]")].forEach((item, i) => {
          this.DOM.scrollSections[item.dataset.scroll] = item;
        });
        this.animationEngine = new AnimationEngine({
          DOM: this.DOM
        });
        this.popup = new Popup();
        document.querySelectorAll(".js-nav").forEach((el) => {
          this.nav = new Nav(el);
        });
        document.querySelectorAll(".js-slider-box").forEach((el) => {
          new Slider(el);
        });
        document.querySelectorAll(".js-form").forEach((el) => {
          new Form(el, this.popup);
        });
        this.scrollController = new ScrollController({
          sections: this.DOM.scrollSections,
          height: this.height
        });
        this.filter = new Filter(document.querySelector(".js-filter"), this);
        if (this.bodyData.route != "blog" && this.bodyData.route != "article" && this.bodyData.route != "cases-page" && this.bodyData.route != "getreport" && this.bodyData.route != "error") {
          this.initScroll(this.query.scroll);
        }
        document.querySelectorAll(".js-subscribe").forEach((el) => {
          new Subscribe();
        });
        if (this.query.debug) {
          this.body.classList.add("is-debug");
        }
        this.init();
      }
      initScroll(damping = 0.1) {
        this.scrollbar = smooth_scrollbar_default.init(document.querySelector(".wrapper"), {
          damping,
          delegateTo: window
        });
        this.scrollbar.addListener(this.handleScrollEvent);
        if (location.hash) {
          this.scrollbar.scrollIntoView(document.querySelector(location.hash));
        }
      }
      updateDamping(value) {
        this.scrollbar.destroy();
        this.initScroll(value);
      }
      init() {
        new ShowCookie(this.DOM.cookieContainer, "is-open", this.DOM.cookieClose);
        window.addEventListener("resize", this.handleResizeEvent);
        window.addEventListener("load", (e) => {
          this.scrollController.updateRects(this.scroll, window.innerHeight);
          if (this.bodyData.route == "article") {
            this.handleScrollEvent(e);
          }
        });
        if (this.bodyData.route == "article" || this.bodyData.route == "cases-page") {
          window.addEventListener("scroll", this.handleScrollEvent);
        }
        this.progress = this.scrollController.getSectionBounds(0, this.height);
        this.handleScrollEvent({offset: {y: 0}});
        splitting.default();
        if (location.pathname == "/") {
          this.DOM.headerLogo.removeAttribute("href");
        }
        this.DOM.requestLink && this.DOM.requestLink.addEventListener("click", (e) => {
          let anchor = "#" + this.DOM.requestLink.getAttribute("href").split("#").pop();
          if (document.documentElement.clientWidth < 768)
            this.nav.toggleNav();
          this.scrollbar && this.scrollbar.scrollIntoView(document.querySelector(anchor));
        });
        this.DOM.showAllCases && this.DOM.showAllCases.addEventListener("click", (e) => {
          e.preventDefault();
          this.DOM.casesList.classList.add("is-open");
          this.handleResizeEvent();
        });
      }
      handleMiddleClickEvent(event) {
        if (event.which == 2) {
          event.preventDefault();
          return false;
        }
      }
      handleResizeEvent(event) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.animationEngine.resize(this.width, this.height);
        this.scrollController.updateRects(this.scroll, window.innerHeight);
        this.handleScrollEvent({offset: {y: this.scroll}});
        this.filter.buildTextCases();
        this.prevWidth = this.width;
      }
      handleScrollEvent(status) {
        if (this.bodyData.route == "article" || this.bodyData.route == "cases-page") {
          this.scroll = window.scrollY;
        } else {
          this.scroll = status.offset.y;
        }
        this.progress = this.scrollController.getSectionBounds(this.scroll, this.height);
        this.animationEngine.updateState(this.progress, this.scroll);
        this.animationEngine.draw();
        this.DOM.fixedElement && this.DOM.fixedElement.style.setProperty("transform", `translateY(${this.scroll}px)`);
      }
      unlockArticle() {
        console.log("this.DOM.mainArticle", this.DOM.mainArticle);
      }
    }
    const copyToBuffer = (element) => {
      const elem = document.querySelector(".js-copy");
      if (elem) {
        elem.addEventListener("click", function(e) {
          var copytext = document.createElement("input");
          copytext.value = window.location.href;
          document.body.appendChild(copytext);
          copytext.select();
          document.execCommand("copy");
        });
      }
    };
    window.addEventListener("DOMContentLoaded", () => {
      new App();
      copyToBuffer();
    });
  });

  // node_modules/tslib/tslib.es6.js
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (b2.hasOwnProperty(p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __decorate(decorators4, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators4, target, key, desc);
    else
      for (var i = decorators4.length - 1; i >= 0; i--)
        if (d = decorators4[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }

  // node_modules/smooth-scrollbar/polyfills.js
  const map = __toModule(require_map());
  const set = __toModule(require_set());
  const weak_map = __toModule(require_weak_map());
  const from = __toModule(require_from());
  const assign = __toModule(require_assign());

  // node_modules/lodash-es/_baseClamp.js
  function baseClamp(number, lower, upper) {
    if (number === number) {
      if (upper !== void 0) {
        number = number <= upper ? number : upper;
      }
      if (lower !== void 0) {
        number = number >= lower ? number : lower;
      }
    }
    return number;
  }
  var baseClamp_default = baseClamp;

  // node_modules/lodash-es/isObject.js
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_default = isObject;

  // node_modules/lodash-es/_freeGlobal.js
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal_default = freeGlobal;

  // node_modules/lodash-es/_root.js
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal_default || freeSelf || Function("return this")();
  var root_default = root;

  // node_modules/lodash-es/_Symbol.js
  var Symbol2 = root_default.Symbol;
  var Symbol_default = Symbol2;

  // node_modules/lodash-es/_getRawTag.js
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getRawTag_default = getRawTag;

  // node_modules/lodash-es/_objectToString.js
  var objectProto2 = Object.prototype;
  var nativeObjectToString2 = objectProto2.toString;
  function objectToString(value) {
    return nativeObjectToString2.call(value);
  }
  var objectToString_default = objectToString;

  // node_modules/lodash-es/_baseGetTag.js
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
  }
  var baseGetTag_default = baseGetTag;

  // node_modules/lodash-es/isObjectLike.js
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_default = isObjectLike;

  // node_modules/lodash-es/isSymbol.js
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
  }
  var isSymbol_default = isSymbol;

  // node_modules/lodash-es/toNumber.js
  var NAN = 0 / 0;
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol_default(value)) {
      return NAN;
    }
    if (isObject_default(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject_default(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_default = toNumber;

  // node_modules/lodash-es/clamp.js
  function clamp(number, lower, upper) {
    if (upper === void 0) {
      upper = lower;
      lower = void 0;
    }
    if (upper !== void 0) {
      upper = toNumber_default(upper);
      upper = upper === upper ? upper : 0;
    }
    if (lower !== void 0) {
      lower = toNumber_default(lower);
      lower = lower === lower ? lower : 0;
    }
    return baseClamp_default(toNumber_default(number), lower, upper);
  }
  var clamp_default = clamp;

  // node_modules/smooth-scrollbar/decorators/range.js
  function range(min, max) {
    if (min === void 0) {
      min = -Infinity;
    }
    if (max === void 0) {
      max = Infinity;
    }
    return function(proto, key) {
      var alias = "_" + key;
      Object.defineProperty(proto, key, {
        get: function() {
          return this[alias];
        },
        set: function(val) {
          Object.defineProperty(this, alias, {
            value: clamp_default(val, min, max),
            enumerable: false,
            writable: true,
            configurable: true
          });
        },
        enumerable: true,
        configurable: true
      });
    };
  }

  // node_modules/smooth-scrollbar/decorators/boolean.js
  function boolean(proto, key) {
    var alias = "_" + key;
    Object.defineProperty(proto, key, {
      get: function() {
        return this[alias];
      },
      set: function(val) {
        Object.defineProperty(this, alias, {
          value: !!val,
          enumerable: false,
          writable: true,
          configurable: true
        });
      },
      enumerable: true,
      configurable: true
    });
  }

  // node_modules/lodash-es/now.js
  var now = function() {
    return root_default.Date.now();
  };
  var now_default = now;

  // node_modules/lodash-es/debounce.js
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  function debounce(func, wait, options2) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber_default(wait) || 0;
    if (isObject_default(options2)) {
      leading = !!options2.leading;
      maxing = "maxWait" in options2;
      maxWait = maxing ? nativeMax(toNumber_default(options2.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options2 ? !!options2.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now_default();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now_default());
    }
    function debounced() {
      var time = now_default(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_default = debounce;

  // node_modules/smooth-scrollbar/decorators/debounce.js
  function debounce3() {
    var options2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      options2[_i] = arguments[_i];
    }
    return function(_proto, key, descriptor) {
      var fn = descriptor.value;
      return {
        get: function() {
          if (!this.hasOwnProperty(key)) {
            Object.defineProperty(this, key, {
              value: debounce_default.apply(void 0, __spreadArrays([fn], options2))
            });
          }
          return this[key];
        }
      };
    };
  }

  // node_modules/smooth-scrollbar/options.js
  var Options = function() {
    function Options2(config) {
      var _this = this;
      if (config === void 0) {
        config = {};
      }
      this.damping = 0.1;
      this.thumbMinSize = 20;
      this.renderByPixels = true;
      this.alwaysShowTracks = false;
      this.continuousScrolling = true;
      this.delegateTo = null;
      this.plugins = {};
      Object.keys(config).forEach(function(prop) {
        _this[prop] = config[prop];
      });
    }
    Object.defineProperty(Options2.prototype, "wheelEventTarget", {
      get: function() {
        return this.delegateTo;
      },
      set: function(el) {
        console.warn("[smooth-scrollbar]: `options.wheelEventTarget` is deprecated and will be removed in the future, use `options.delegateTo` instead.");
        this.delegateTo = el;
      },
      enumerable: true,
      configurable: true
    });
    __decorate([
      range(0, 1)
    ], Options2.prototype, "damping", void 0);
    __decorate([
      range(0, Infinity)
    ], Options2.prototype, "thumbMinSize", void 0);
    __decorate([
      boolean
    ], Options2.prototype, "renderByPixels", void 0);
    __decorate([
      boolean
    ], Options2.prototype, "alwaysShowTracks", void 0);
    __decorate([
      boolean
    ], Options2.prototype, "continuousScrolling", void 0);
    return Options2;
  }();

  // node_modules/smooth-scrollbar/utils/event-hub.js
  var eventListenerOptions;
  var eventMap = new WeakMap();
  function getOptions() {
    if (eventListenerOptions !== void 0) {
      return eventListenerOptions;
    }
    var supportPassiveEvent = false;
    try {
      var noop = function() {
      };
      var options2 = Object.defineProperty({}, "passive", {
        get: function() {
          supportPassiveEvent = true;
        }
      });
      window.addEventListener("testPassive", noop, options2);
      window.removeEventListener("testPassive", noop, options2);
    } catch (e) {
    }
    eventListenerOptions = supportPassiveEvent ? {passive: false} : false;
    return eventListenerOptions;
  }
  function eventScope(scrollbar2) {
    var configs = eventMap.get(scrollbar2) || [];
    eventMap.set(scrollbar2, configs);
    return function addEvent(elem, events2, fn) {
      function handler(event) {
        if (event.defaultPrevented) {
          return;
        }
        fn(event);
      }
      events2.split(/\s+/g).forEach(function(eventName) {
        configs.push({elem, eventName, handler});
        elem.addEventListener(eventName, handler, getOptions());
      });
    };
  }
  function clearEventsOn(scrollbar2) {
    var configs = eventMap.get(scrollbar2);
    if (!configs) {
      return;
    }
    configs.forEach(function(_a) {
      var elem = _a.elem, eventName = _a.eventName, handler = _a.handler;
      elem.removeEventListener(eventName, handler, getOptions());
    });
    eventMap.delete(scrollbar2);
  }

  // node_modules/smooth-scrollbar/utils/get-pointer-data.js
  function getPointerData(evt) {
    return evt.touches ? evt.touches[evt.touches.length - 1] : evt;
  }

  // node_modules/smooth-scrollbar/utils/get-position.js
  function getPosition(evt) {
    var data = getPointerData(evt);
    return {
      x: data.clientX,
      y: data.clientY
    };
  }

  // node_modules/smooth-scrollbar/utils/is-one-of.js
  function isOneOf(a, b) {
    if (b === void 0) {
      b = [];
    }
    return b.some(function(v) {
      return a === v;
    });
  }

  // node_modules/smooth-scrollbar/utils/set-style.js
  var VENDOR_PREFIX = [
    "webkit",
    "moz",
    "ms",
    "o"
  ];
  var RE = new RegExp("^-(?!(?:" + VENDOR_PREFIX.join("|") + ")-)");
  function autoPrefix(styles) {
    var res = {};
    Object.keys(styles).forEach(function(prop) {
      if (!RE.test(prop)) {
        res[prop] = styles[prop];
        return;
      }
      var val = styles[prop];
      prop = prop.replace(/^-/, "");
      res[prop] = val;
      VENDOR_PREFIX.forEach(function(prefix) {
        res["-" + prefix + "-" + prop] = val;
      });
    });
    return res;
  }
  function setStyle(elem, styles) {
    styles = autoPrefix(styles);
    Object.keys(styles).forEach(function(prop) {
      var cssProp = prop.replace(/^-/, "").replace(/-([a-z])/g, function(_, $1) {
        return $1.toUpperCase();
      });
      elem.style[cssProp] = styles[prop];
    });
  }

  // node_modules/smooth-scrollbar/utils/touch-record.js
  var Tracker = function() {
    function Tracker2(touch) {
      this.updateTime = Date.now();
      this.delta = {x: 0, y: 0};
      this.velocity = {x: 0, y: 0};
      this.lastPosition = {x: 0, y: 0};
      this.lastPosition = getPosition(touch);
    }
    Tracker2.prototype.update = function(touch) {
      var _a = this, velocity = _a.velocity, updateTime = _a.updateTime, lastPosition = _a.lastPosition;
      var now3 = Date.now();
      var position = getPosition(touch);
      var delta = {
        x: -(position.x - lastPosition.x),
        y: -(position.y - lastPosition.y)
      };
      var duration = now3 - updateTime || 16;
      var vx = delta.x / duration * 16;
      var vy = delta.y / duration * 16;
      velocity.x = vx * 0.9 + velocity.x * 0.1;
      velocity.y = vy * 0.9 + velocity.y * 0.1;
      this.delta = delta;
      this.updateTime = now3;
      this.lastPosition = position;
    };
    return Tracker2;
  }();
  var TouchRecord = function() {
    function TouchRecord2() {
      this._touchList = {};
    }
    Object.defineProperty(TouchRecord2.prototype, "_primitiveValue", {
      get: function() {
        return {x: 0, y: 0};
      },
      enumerable: true,
      configurable: true
    });
    TouchRecord2.prototype.isActive = function() {
      return this._activeTouchID !== void 0;
    };
    TouchRecord2.prototype.getDelta = function() {
      var tracker = this._getActiveTracker();
      if (!tracker) {
        return this._primitiveValue;
      }
      return __assign({}, tracker.delta);
    };
    TouchRecord2.prototype.getVelocity = function() {
      var tracker = this._getActiveTracker();
      if (!tracker) {
        return this._primitiveValue;
      }
      return __assign({}, tracker.velocity);
    };
    TouchRecord2.prototype.track = function(evt) {
      var _this = this;
      var targetTouches = evt.targetTouches;
      Array.from(targetTouches).forEach(function(touch) {
        _this._add(touch);
      });
      return this._touchList;
    };
    TouchRecord2.prototype.update = function(evt) {
      var _this = this;
      var touches = evt.touches, changedTouches = evt.changedTouches;
      Array.from(touches).forEach(function(touch) {
        _this._renew(touch);
      });
      this._setActiveID(changedTouches);
      return this._touchList;
    };
    TouchRecord2.prototype.release = function(evt) {
      var _this = this;
      delete this._activeTouchID;
      Array.from(evt.changedTouches).forEach(function(touch) {
        _this._delete(touch);
      });
    };
    TouchRecord2.prototype._add = function(touch) {
      if (this._has(touch)) {
        return;
      }
      var tracker = new Tracker(touch);
      this._touchList[touch.identifier] = tracker;
    };
    TouchRecord2.prototype._renew = function(touch) {
      if (!this._has(touch)) {
        return;
      }
      var tracker = this._touchList[touch.identifier];
      tracker.update(touch);
    };
    TouchRecord2.prototype._delete = function(touch) {
      delete this._touchList[touch.identifier];
    };
    TouchRecord2.prototype._has = function(touch) {
      return this._touchList.hasOwnProperty(touch.identifier);
    };
    TouchRecord2.prototype._setActiveID = function(touches) {
      this._activeTouchID = touches[touches.length - 1].identifier;
    };
    TouchRecord2.prototype._getActiveTracker = function() {
      var _a = this, _touchList = _a._touchList, _activeTouchID = _a._activeTouchID;
      return _touchList[_activeTouchID];
    };
    return TouchRecord2;
  }();

  // node_modules/smooth-scrollbar/track/direction.js
  var TrackDirection;
  (function(TrackDirection2) {
    TrackDirection2["X"] = "x";
    TrackDirection2["Y"] = "y";
  })(TrackDirection || (TrackDirection = {}));

  // node_modules/smooth-scrollbar/track/thumb.js
  var ScrollbarThumb = function() {
    function ScrollbarThumb2(_direction, _minSize) {
      if (_minSize === void 0) {
        _minSize = 0;
      }
      this._direction = _direction;
      this._minSize = _minSize;
      this.element = document.createElement("div");
      this.displaySize = 0;
      this.realSize = 0;
      this.offset = 0;
      this.element.className = "scrollbar-thumb scrollbar-thumb-" + _direction;
    }
    ScrollbarThumb2.prototype.attachTo = function(trackEl) {
      trackEl.appendChild(this.element);
    };
    ScrollbarThumb2.prototype.update = function(scrollOffset, containerSize, pageSize) {
      this.realSize = Math.min(containerSize / pageSize, 1) * containerSize;
      this.displaySize = Math.max(this.realSize, this._minSize);
      this.offset = scrollOffset / pageSize * (containerSize + (this.realSize - this.displaySize));
      setStyle(this.element, this._getStyle());
    };
    ScrollbarThumb2.prototype._getStyle = function() {
      switch (this._direction) {
        case TrackDirection.X:
          return {
            width: this.displaySize + "px",
            "-transform": "translate3d(" + this.offset + "px, 0, 0)"
          };
        case TrackDirection.Y:
          return {
            height: this.displaySize + "px",
            "-transform": "translate3d(0, " + this.offset + "px, 0)"
          };
        default:
          return null;
      }
    };
    return ScrollbarThumb2;
  }();

  // node_modules/smooth-scrollbar/track/track.js
  var ScrollbarTrack = function() {
    function ScrollbarTrack2(direction3, thumbMinSize) {
      if (thumbMinSize === void 0) {
        thumbMinSize = 0;
      }
      this.element = document.createElement("div");
      this._isShown = false;
      this.element.className = "scrollbar-track scrollbar-track-" + direction3;
      this.thumb = new ScrollbarThumb(direction3, thumbMinSize);
      this.thumb.attachTo(this.element);
    }
    ScrollbarTrack2.prototype.attachTo = function(scrollbarContainer) {
      scrollbarContainer.appendChild(this.element);
    };
    ScrollbarTrack2.prototype.show = function() {
      if (this._isShown) {
        return;
      }
      this._isShown = true;
      this.element.classList.add("show");
    };
    ScrollbarTrack2.prototype.hide = function() {
      if (!this._isShown) {
        return;
      }
      this._isShown = false;
      this.element.classList.remove("show");
    };
    ScrollbarTrack2.prototype.update = function(scrollOffset, containerSize, pageSize) {
      setStyle(this.element, {
        display: pageSize <= containerSize ? "none" : "block"
      });
      this.thumb.update(scrollOffset, containerSize, pageSize);
    };
    return ScrollbarTrack2;
  }();

  // node_modules/smooth-scrollbar/track/index.js
  var TrackController = function() {
    function TrackController2(_scrollbar) {
      this._scrollbar = _scrollbar;
      var thumbMinSize = _scrollbar.options.thumbMinSize;
      this.xAxis = new ScrollbarTrack(TrackDirection.X, thumbMinSize);
      this.yAxis = new ScrollbarTrack(TrackDirection.Y, thumbMinSize);
      this.xAxis.attachTo(_scrollbar.containerEl);
      this.yAxis.attachTo(_scrollbar.containerEl);
      if (_scrollbar.options.alwaysShowTracks) {
        this.xAxis.show();
        this.yAxis.show();
      }
    }
    TrackController2.prototype.update = function() {
      var _a = this._scrollbar, size = _a.size, offset = _a.offset;
      this.xAxis.update(offset.x, size.container.width, size.content.width);
      this.yAxis.update(offset.y, size.container.height, size.content.height);
    };
    TrackController2.prototype.autoHideOnIdle = function() {
      if (this._scrollbar.options.alwaysShowTracks) {
        return;
      }
      this.xAxis.hide();
      this.yAxis.hide();
    };
    __decorate([
      debounce3(300)
    ], TrackController2.prototype, "autoHideOnIdle", null);
    return TrackController2;
  }();

  // node_modules/smooth-scrollbar/geometry/get-size.js
  function getSize(scrollbar2) {
    var containerEl = scrollbar2.containerEl, contentEl = scrollbar2.contentEl;
    return {
      container: {
        width: containerEl.clientWidth,
        height: containerEl.clientHeight
      },
      content: {
        width: contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth,
        height: contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight
      }
    };
  }

  // node_modules/smooth-scrollbar/geometry/is-visible.js
  function isVisible(scrollbar2, elem) {
    var bounding = scrollbar2.bounding;
    var targetBounding = elem.getBoundingClientRect();
    var top = Math.max(bounding.top, targetBounding.top);
    var left = Math.max(bounding.left, targetBounding.left);
    var right = Math.min(bounding.right, targetBounding.right);
    var bottom = Math.min(bounding.bottom, targetBounding.bottom);
    return top < bottom && left < right;
  }

  // node_modules/smooth-scrollbar/geometry/update.js
  function update(scrollbar2) {
    var newSize = scrollbar2.getSize();
    var limit = {
      x: Math.max(newSize.content.width - newSize.container.width, 0),
      y: Math.max(newSize.content.height - newSize.container.height, 0)
    };
    var containerBounding = scrollbar2.containerEl.getBoundingClientRect();
    var bounding = {
      top: Math.max(containerBounding.top, 0),
      right: Math.min(containerBounding.right, window.innerWidth),
      bottom: Math.min(containerBounding.bottom, window.innerHeight),
      left: Math.max(containerBounding.left, 0)
    };
    scrollbar2.size = newSize;
    scrollbar2.limit = limit;
    scrollbar2.bounding = bounding;
    scrollbar2.track.update();
    scrollbar2.setPosition();
  }

  // node_modules/smooth-scrollbar/scrolling/set-position.js
  function setPosition(scrollbar2, x, y) {
    var options2 = scrollbar2.options, offset = scrollbar2.offset, limit = scrollbar2.limit, track3 = scrollbar2.track, contentEl = scrollbar2.contentEl;
    if (options2.renderByPixels) {
      x = Math.round(x);
      y = Math.round(y);
    }
    x = clamp_default(x, 0, limit.x);
    y = clamp_default(y, 0, limit.y);
    if (x !== offset.x)
      track3.xAxis.show();
    if (y !== offset.y)
      track3.yAxis.show();
    if (!options2.alwaysShowTracks) {
      track3.autoHideOnIdle();
    }
    if (x === offset.x && y === offset.y) {
      return null;
    }
    offset.x = x;
    offset.y = y;
    setStyle(contentEl, {
      "-transform": "translate3d(" + -x + "px, " + -y + "px, 0)"
    });
    track3.update();
    return {
      offset: __assign({}, offset),
      limit: __assign({}, limit)
    };
  }

  // node_modules/smooth-scrollbar/scrolling/scroll-to.js
  var animationIDStorage = new WeakMap();
  function scrollTo(scrollbar2, x, y, duration, _a) {
    if (duration === void 0) {
      duration = 0;
    }
    var _b = _a === void 0 ? {} : _a, _c = _b.easing, easing = _c === void 0 ? defaultEasing : _c, callback = _b.callback;
    var options2 = scrollbar2.options, offset = scrollbar2.offset, limit = scrollbar2.limit;
    if (options2.renderByPixels) {
      x = Math.round(x);
      y = Math.round(y);
    }
    var startX = offset.x;
    var startY = offset.y;
    var disX = clamp_default(x, 0, limit.x) - startX;
    var disY = clamp_default(y, 0, limit.y) - startY;
    var start = Date.now();
    function scroll() {
      var elapse = Date.now() - start;
      var progress = duration ? easing(Math.min(elapse / duration, 1)) : 1;
      scrollbar2.setPosition(startX + disX * progress, startY + disY * progress);
      if (elapse >= duration) {
        if (typeof callback === "function") {
          callback.call(scrollbar2);
        }
      } else {
        var animationID = requestAnimationFrame(scroll);
        animationIDStorage.set(scrollbar2, animationID);
      }
    }
    cancelAnimationFrame(animationIDStorage.get(scrollbar2));
    scroll();
  }
  function defaultEasing(t) {
    return Math.pow(t - 1, 3) + 1;
  }

  // node_modules/smooth-scrollbar/scrolling/scroll-into-view.js
  function scrollIntoView(scrollbar2, elem, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.alignToTop, alignToTop = _c === void 0 ? true : _c, _d = _b.onlyScrollIfNeeded, onlyScrollIfNeeded = _d === void 0 ? false : _d, _e = _b.offsetTop, offsetTop = _e === void 0 ? 0 : _e, _f = _b.offsetLeft, offsetLeft = _f === void 0 ? 0 : _f, _g = _b.offsetBottom, offsetBottom = _g === void 0 ? 0 : _g;
    var containerEl = scrollbar2.containerEl, bounding = scrollbar2.bounding, offset = scrollbar2.offset, limit = scrollbar2.limit;
    if (!elem || !containerEl.contains(elem))
      return;
    var targetBounding = elem.getBoundingClientRect();
    if (onlyScrollIfNeeded && scrollbar2.isVisible(elem))
      return;
    var delta = alignToTop ? targetBounding.top - bounding.top - offsetTop : targetBounding.bottom - bounding.bottom + offsetBottom;
    scrollbar2.setMomentum(targetBounding.left - bounding.left - offsetLeft, clamp_default(delta, -offset.y, limit.y - offset.y));
  }

  // node_modules/smooth-scrollbar/plugin.js
  var ScrollbarPlugin = function() {
    function ScrollbarPlugin2(scrollbar2, options2) {
      var _newTarget = this.constructor;
      this.scrollbar = scrollbar2;
      this.name = _newTarget.pluginName;
      this.options = __assign(__assign({}, _newTarget.defaultOptions), options2);
    }
    ScrollbarPlugin2.prototype.onInit = function() {
    };
    ScrollbarPlugin2.prototype.onDestroy = function() {
    };
    ScrollbarPlugin2.prototype.onUpdate = function() {
    };
    ScrollbarPlugin2.prototype.onRender = function(_remainMomentum) {
    };
    ScrollbarPlugin2.prototype.transformDelta = function(delta, _evt) {
      return __assign({}, delta);
    };
    ScrollbarPlugin2.pluginName = "";
    ScrollbarPlugin2.defaultOptions = {};
    return ScrollbarPlugin2;
  }();
  var globalPlugins = {
    order: new Set(),
    constructors: {}
  };
  function addPlugins() {
    var Plugins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      Plugins[_i] = arguments[_i];
    }
    Plugins.forEach(function(P) {
      var pluginName = P.pluginName;
      if (!pluginName) {
        throw new TypeError("plugin name is required");
      }
      globalPlugins.order.add(pluginName);
      globalPlugins.constructors[pluginName] = P;
    });
  }
  function initPlugins(scrollbar2, options2) {
    return Array.from(globalPlugins.order).filter(function(pluginName) {
      return options2[pluginName] !== false;
    }).map(function(pluginName) {
      var Plugin = globalPlugins.constructors[pluginName];
      var instance = new Plugin(scrollbar2, options2[pluginName]);
      options2[pluginName] = instance.options;
      return instance;
    });
  }

  // node_modules/smooth-scrollbar/events/index.js
  const events_exports = {};
  __export(events_exports, {
    keyboardHandler: () => keyboardHandler,
    mouseHandler: () => mouseHandler,
    resizeHandler: () => resizeHandler,
    selectHandler: () => selectHandler,
    touchHandler: () => touchHandler,
    wheelHandler: () => wheelHandler
  });

  // node_modules/smooth-scrollbar/events/keyboard.js
  var KEY_CODE;
  (function(KEY_CODE2) {
    KEY_CODE2[KEY_CODE2["TAB"] = 9] = "TAB";
    KEY_CODE2[KEY_CODE2["SPACE"] = 32] = "SPACE";
    KEY_CODE2[KEY_CODE2["PAGE_UP"] = 33] = "PAGE_UP";
    KEY_CODE2[KEY_CODE2["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KEY_CODE2[KEY_CODE2["END"] = 35] = "END";
    KEY_CODE2[KEY_CODE2["HOME"] = 36] = "HOME";
    KEY_CODE2[KEY_CODE2["LEFT"] = 37] = "LEFT";
    KEY_CODE2[KEY_CODE2["UP"] = 38] = "UP";
    KEY_CODE2[KEY_CODE2["RIGHT"] = 39] = "RIGHT";
    KEY_CODE2[KEY_CODE2["DOWN"] = 40] = "DOWN";
  })(KEY_CODE || (KEY_CODE = {}));
  function keyboardHandler(scrollbar2) {
    var addEvent = eventScope(scrollbar2);
    var container = scrollbar2.containerEl;
    addEvent(container, "keydown", function(evt) {
      var activeElement = document.activeElement;
      if (activeElement !== container && !container.contains(activeElement)) {
        return;
      }
      if (isEditable(activeElement)) {
        return;
      }
      var delta = getKeyDelta(scrollbar2, evt.keyCode || evt.which);
      if (!delta) {
        return;
      }
      var x = delta[0], y = delta[1];
      scrollbar2.addTransformableMomentum(x, y, evt, function(willScroll) {
        if (willScroll) {
          evt.preventDefault();
        } else {
          scrollbar2.containerEl.blur();
          if (scrollbar2.parent) {
            scrollbar2.parent.containerEl.focus();
          }
        }
      });
    });
  }
  function getKeyDelta(scrollbar2, keyCode) {
    var size = scrollbar2.size, limit = scrollbar2.limit, offset = scrollbar2.offset;
    switch (keyCode) {
      case KEY_CODE.TAB:
        return handleTabKey(scrollbar2);
      case KEY_CODE.SPACE:
        return [0, 200];
      case KEY_CODE.PAGE_UP:
        return [0, -size.container.height + 40];
      case KEY_CODE.PAGE_DOWN:
        return [0, size.container.height - 40];
      case KEY_CODE.END:
        return [0, limit.y - offset.y];
      case KEY_CODE.HOME:
        return [0, -offset.y];
      case KEY_CODE.LEFT:
        return [-40, 0];
      case KEY_CODE.UP:
        return [0, -40];
      case KEY_CODE.RIGHT:
        return [40, 0];
      case KEY_CODE.DOWN:
        return [0, 40];
      default:
        return null;
    }
  }
  function handleTabKey(scrollbar2) {
    requestAnimationFrame(function() {
      scrollbar2.scrollIntoView(document.activeElement, {
        offsetTop: scrollbar2.size.container.height / 2,
        onlyScrollIfNeeded: true
      });
    });
  }
  function isEditable(elem) {
    if (elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA" || elem.isContentEditable) {
      return !elem.disabled;
    }
    return false;
  }

  // node_modules/smooth-scrollbar/events/mouse.js
  var Direction;
  (function(Direction2) {
    Direction2[Direction2["X"] = 0] = "X";
    Direction2[Direction2["Y"] = 1] = "Y";
  })(Direction || (Direction = {}));
  function mouseHandler(scrollbar2) {
    var addEvent = eventScope(scrollbar2);
    var container = scrollbar2.containerEl;
    var _a = scrollbar2.track, xAxis = _a.xAxis, yAxis = _a.yAxis;
    function calcOffset(direction3, clickPosition) {
      var size = scrollbar2.size;
      if (direction3 === Direction.X) {
        var totalWidth = size.container.width + (xAxis.thumb.realSize - xAxis.thumb.displaySize);
        return clickPosition / totalWidth * size.content.width;
      }
      if (direction3 === Direction.Y) {
        var totalHeight = size.container.height + (yAxis.thumb.realSize - yAxis.thumb.displaySize);
        return clickPosition / totalHeight * size.content.height;
      }
      return 0;
    }
    function getTrackDirection(elem) {
      if (isOneOf(elem, [xAxis.element, xAxis.thumb.element])) {
        return Direction.X;
      }
      if (isOneOf(elem, [yAxis.element, yAxis.thumb.element])) {
        return Direction.Y;
      }
      return void 0;
    }
    var isMouseDown;
    var isMouseMoving;
    var startOffsetToThumb;
    var startTrackDirection;
    var containerRect;
    addEvent(container, "click", function(evt) {
      if (isMouseMoving || !isOneOf(evt.target, [xAxis.element, yAxis.element])) {
        return;
      }
      var track3 = evt.target;
      var direction3 = getTrackDirection(track3);
      var rect = track3.getBoundingClientRect();
      var clickPos = getPosition(evt);
      var offset = scrollbar2.offset, limit = scrollbar2.limit;
      if (direction3 === Direction.X) {
        var offsetOnTrack = clickPos.x - rect.left - xAxis.thumb.displaySize / 2;
        scrollbar2.setMomentum(clamp_default(calcOffset(direction3, offsetOnTrack) - offset.x, -offset.x, limit.x - offset.x), 0);
      }
      if (direction3 === Direction.Y) {
        var offsetOnTrack = clickPos.y - rect.top - yAxis.thumb.displaySize / 2;
        scrollbar2.setMomentum(0, clamp_default(calcOffset(direction3, offsetOnTrack) - offset.y, -offset.y, limit.y - offset.y));
      }
    });
    addEvent(container, "mousedown", function(evt) {
      if (!isOneOf(evt.target, [xAxis.thumb.element, yAxis.thumb.element])) {
        return;
      }
      isMouseDown = true;
      var thumb2 = evt.target;
      var cursorPos = getPosition(evt);
      var thumbRect = thumb2.getBoundingClientRect();
      startTrackDirection = getTrackDirection(thumb2);
      startOffsetToThumb = {
        x: cursorPos.x - thumbRect.left,
        y: cursorPos.y - thumbRect.top
      };
      containerRect = container.getBoundingClientRect();
      setStyle(scrollbar2.containerEl, {
        "-user-select": "none"
      });
    });
    addEvent(window, "mousemove", function(evt) {
      if (!isMouseDown)
        return;
      isMouseMoving = true;
      var offset = scrollbar2.offset;
      var cursorPos = getPosition(evt);
      if (startTrackDirection === Direction.X) {
        var offsetOnTrack = cursorPos.x - startOffsetToThumb.x - containerRect.left;
        scrollbar2.setPosition(calcOffset(startTrackDirection, offsetOnTrack), offset.y);
      }
      if (startTrackDirection === Direction.Y) {
        var offsetOnTrack = cursorPos.y - startOffsetToThumb.y - containerRect.top;
        scrollbar2.setPosition(offset.x, calcOffset(startTrackDirection, offsetOnTrack));
      }
    });
    addEvent(window, "mouseup blur", function() {
      isMouseDown = isMouseMoving = false;
      setStyle(scrollbar2.containerEl, {
        "-user-select": ""
      });
    });
  }

  // node_modules/smooth-scrollbar/events/resize.js
  function resizeHandler(scrollbar2) {
    var addEvent = eventScope(scrollbar2);
    addEvent(window, "resize", debounce_default(scrollbar2.update.bind(scrollbar2), 300));
  }

  // node_modules/smooth-scrollbar/events/select.js
  function selectHandler(scrollbar2) {
    var addEvent = eventScope(scrollbar2);
    var containerEl = scrollbar2.containerEl, contentEl = scrollbar2.contentEl, offset = scrollbar2.offset, limit = scrollbar2.limit;
    var isSelected = false;
    var animationID;
    function scroll(_a) {
      var x = _a.x, y = _a.y;
      if (!x && !y)
        return;
      scrollbar2.setMomentum(clamp_default(offset.x + x, 0, limit.x) - offset.x, clamp_default(offset.y + y, 0, limit.y) - offset.y);
      animationID = requestAnimationFrame(function() {
        scroll({x, y});
      });
    }
    addEvent(window, "mousemove", function(evt) {
      if (!isSelected)
        return;
      cancelAnimationFrame(animationID);
      var dir = calcMomentum(scrollbar2, evt);
      scroll(dir);
    });
    addEvent(contentEl, "selectstart", function(evt) {
      evt.stopPropagation();
      cancelAnimationFrame(animationID);
      isSelected = true;
    });
    addEvent(window, "mouseup blur", function() {
      cancelAnimationFrame(animationID);
      isSelected = false;
    });
    addEvent(containerEl, "scroll", function(evt) {
      evt.preventDefault();
      containerEl.scrollTop = containerEl.scrollLeft = 0;
    });
  }
  function calcMomentum(scrollbar2, evt) {
    var _a = scrollbar2.bounding, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
    var _b = getPosition(evt), x = _b.x, y = _b.y;
    var res = {
      x: 0,
      y: 0
    };
    var padding = 20;
    if (x === 0 && y === 0)
      return res;
    if (x > right - padding) {
      res.x = x - right + padding;
    } else if (x < left + padding) {
      res.x = x - left - padding;
    }
    if (y > bottom - padding) {
      res.y = y - bottom + padding;
    } else if (y < top + padding) {
      res.y = y - top - padding;
    }
    res.x *= 2;
    res.y *= 2;
    return res;
  }

  // node_modules/smooth-scrollbar/events/touch.js
  var activeScrollbar;
  function touchHandler(scrollbar2) {
    var MIN_EAING_MOMENTUM = 50;
    var EASING_MULTIPLIER = /Android/.test(navigator.userAgent) ? 3 : 2;
    var target = scrollbar2.options.delegateTo || scrollbar2.containerEl;
    var touchRecord = new TouchRecord();
    var addEvent = eventScope(scrollbar2);
    var damping;
    var pointerCount = 0;
    addEvent(target, "touchstart", function(evt) {
      touchRecord.track(evt);
      scrollbar2.setMomentum(0, 0);
      if (pointerCount === 0) {
        damping = scrollbar2.options.damping;
        scrollbar2.options.damping = Math.max(damping, 0.5);
      }
      pointerCount++;
    });
    addEvent(target, "touchmove", function(evt) {
      if (activeScrollbar && activeScrollbar !== scrollbar2)
        return;
      touchRecord.update(evt);
      var _a = touchRecord.getDelta(), x = _a.x, y = _a.y;
      scrollbar2.addTransformableMomentum(x, y, evt, function(willScroll) {
        if (willScroll && evt.cancelable) {
          evt.preventDefault();
          activeScrollbar = scrollbar2;
        }
      });
    });
    addEvent(target, "touchcancel touchend", function(evt) {
      var velocity = touchRecord.getVelocity();
      var momentum = {x: 0, y: 0};
      Object.keys(velocity).forEach(function(dir) {
        var s = velocity[dir] / damping;
        momentum[dir] = Math.abs(s) < MIN_EAING_MOMENTUM ? 0 : s * EASING_MULTIPLIER;
      });
      scrollbar2.addTransformableMomentum(momentum.x, momentum.y, evt);
      pointerCount--;
      if (pointerCount === 0) {
        scrollbar2.options.damping = damping;
      }
      touchRecord.release(evt);
      activeScrollbar = null;
    });
  }

  // node_modules/smooth-scrollbar/events/wheel.js
  function wheelHandler(scrollbar2) {
    var addEvent = eventScope(scrollbar2);
    var target = scrollbar2.options.delegateTo || scrollbar2.containerEl;
    var eventName = "onwheel" in window || document.implementation.hasFeature("Events.wheel", "3.0") ? "wheel" : "mousewheel";
    addEvent(target, eventName, function(evt) {
      var _a = normalizeDelta(evt), x = _a.x, y = _a.y;
      scrollbar2.addTransformableMomentum(x, y, evt, function(willScroll) {
        if (willScroll) {
          evt.preventDefault();
        }
      });
    });
  }
  var DELTA_SCALE = {
    STANDARD: 1,
    OTHERS: -3
  };
  var DELTA_MODE = [1, 28, 500];
  var getDeltaMode = function(mode) {
    return DELTA_MODE[mode] || DELTA_MODE[0];
  };
  function normalizeDelta(evt) {
    if ("deltaX" in evt) {
      var mode = getDeltaMode(evt.deltaMode);
      return {
        x: evt.deltaX / DELTA_SCALE.STANDARD * mode,
        y: evt.deltaY / DELTA_SCALE.STANDARD * mode
      };
    }
    if ("wheelDeltaX" in evt) {
      return {
        x: evt.wheelDeltaX / DELTA_SCALE.OTHERS,
        y: evt.wheelDeltaY / DELTA_SCALE.OTHERS
      };
    }
    return {
      x: 0,
      y: evt.wheelDelta / DELTA_SCALE.OTHERS
    };
  }

  // node_modules/smooth-scrollbar/scrollbar.js
  var scrollbarMap = new Map();
  var Scrollbar = function() {
    function Scrollbar2(containerEl, options2) {
      var _this = this;
      this.offset = {
        x: 0,
        y: 0
      };
      this.limit = {
        x: Infinity,
        y: Infinity
      };
      this.bounding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      this._plugins = [];
      this._momentum = {x: 0, y: 0};
      this._listeners = new Set();
      this.containerEl = containerEl;
      var contentEl = this.contentEl = document.createElement("div");
      this.options = new Options(options2);
      containerEl.setAttribute("data-scrollbar", "true");
      containerEl.setAttribute("tabindex", "-1");
      setStyle(containerEl, {
        overflow: "hidden",
        outline: "none"
      });
      if (window.navigator.msPointerEnabled) {
        containerEl.style.msTouchAction = "none";
      }
      contentEl.className = "scroll-content";
      Array.from(containerEl.childNodes).forEach(function(node) {
        contentEl.appendChild(node);
      });
      containerEl.appendChild(contentEl);
      this.track = new TrackController(this);
      this.size = this.getSize();
      this._plugins = initPlugins(this, this.options.plugins);
      var scrollLeft = containerEl.scrollLeft, scrollTop = containerEl.scrollTop;
      containerEl.scrollLeft = containerEl.scrollTop = 0;
      this.setPosition(scrollLeft, scrollTop, {
        withoutCallbacks: true
      });
      var global2 = window;
      var MutationObserver = global2.MutationObserver || global2.WebKitMutationObserver || global2.MozMutationObserver;
      if (typeof MutationObserver === "function") {
        this._observer = new MutationObserver(function() {
          _this.update();
        });
        this._observer.observe(contentEl, {
          subtree: true,
          childList: true
        });
      }
      scrollbarMap.set(containerEl, this);
      requestAnimationFrame(function() {
        _this._init();
      });
    }
    Object.defineProperty(Scrollbar2.prototype, "parent", {
      get: function() {
        var elem = this.containerEl.parentElement;
        while (elem) {
          var parentScrollbar = scrollbarMap.get(elem);
          if (parentScrollbar) {
            return parentScrollbar;
          }
          elem = elem.parentElement;
        }
        return null;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Scrollbar2.prototype, "scrollTop", {
      get: function() {
        return this.offset.y;
      },
      set: function(y) {
        this.setPosition(this.scrollLeft, y);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Scrollbar2.prototype, "scrollLeft", {
      get: function() {
        return this.offset.x;
      },
      set: function(x) {
        this.setPosition(x, this.scrollTop);
      },
      enumerable: true,
      configurable: true
    });
    Scrollbar2.prototype.getSize = function() {
      return getSize(this);
    };
    Scrollbar2.prototype.update = function() {
      update(this);
      this._plugins.forEach(function(plugin3) {
        plugin3.onUpdate();
      });
    };
    Scrollbar2.prototype.isVisible = function(elem) {
      return isVisible(this, elem);
    };
    Scrollbar2.prototype.setPosition = function(x, y, options2) {
      var _this = this;
      if (x === void 0) {
        x = this.offset.x;
      }
      if (y === void 0) {
        y = this.offset.y;
      }
      if (options2 === void 0) {
        options2 = {};
      }
      var status = setPosition(this, x, y);
      if (!status || options2.withoutCallbacks) {
        return;
      }
      this._listeners.forEach(function(fn) {
        fn.call(_this, status);
      });
    };
    Scrollbar2.prototype.scrollTo = function(x, y, duration, options2) {
      if (x === void 0) {
        x = this.offset.x;
      }
      if (y === void 0) {
        y = this.offset.y;
      }
      if (duration === void 0) {
        duration = 0;
      }
      if (options2 === void 0) {
        options2 = {};
      }
      scrollTo(this, x, y, duration, options2);
    };
    Scrollbar2.prototype.scrollIntoView = function(elem, options2) {
      if (options2 === void 0) {
        options2 = {};
      }
      scrollIntoView(this, elem, options2);
    };
    Scrollbar2.prototype.addListener = function(fn) {
      if (typeof fn !== "function") {
        throw new TypeError("[smooth-scrollbar] scrolling listener should be a function");
      }
      this._listeners.add(fn);
    };
    Scrollbar2.prototype.removeListener = function(fn) {
      this._listeners.delete(fn);
    };
    Scrollbar2.prototype.addTransformableMomentum = function(x, y, fromEvent, callback) {
      this._updateDebounced();
      var finalDelta = this._plugins.reduce(function(delta, plugin3) {
        return plugin3.transformDelta(delta, fromEvent) || delta;
      }, {x, y});
      var willScroll = !this._shouldPropagateMomentum(finalDelta.x, finalDelta.y);
      if (willScroll) {
        this.addMomentum(finalDelta.x, finalDelta.y);
      }
      if (callback) {
        callback.call(this, willScroll);
      }
    };
    Scrollbar2.prototype.addMomentum = function(x, y) {
      this.setMomentum(this._momentum.x + x, this._momentum.y + y);
    };
    Scrollbar2.prototype.setMomentum = function(x, y) {
      if (this.limit.x === 0) {
        x = 0;
      }
      if (this.limit.y === 0) {
        y = 0;
      }
      if (this.options.renderByPixels) {
        x = Math.round(x);
        y = Math.round(y);
      }
      this._momentum.x = x;
      this._momentum.y = y;
    };
    Scrollbar2.prototype.updatePluginOptions = function(pluginName, options2) {
      this._plugins.forEach(function(plugin3) {
        if (plugin3.name === pluginName) {
          Object.assign(plugin3.options, options2);
        }
      });
    };
    Scrollbar2.prototype.destroy = function() {
      var _a = this, containerEl = _a.containerEl, contentEl = _a.contentEl;
      clearEventsOn(this);
      this._listeners.clear();
      this.setMomentum(0, 0);
      cancelAnimationFrame(this._renderID);
      if (this._observer) {
        this._observer.disconnect();
      }
      scrollbarMap.delete(this.containerEl);
      var childNodes = Array.from(contentEl.childNodes);
      while (containerEl.firstChild) {
        containerEl.removeChild(containerEl.firstChild);
      }
      childNodes.forEach(function(el) {
        containerEl.appendChild(el);
      });
      setStyle(containerEl, {
        overflow: ""
      });
      containerEl.scrollTop = this.scrollTop;
      containerEl.scrollLeft = this.scrollLeft;
      this._plugins.forEach(function(plugin3) {
        plugin3.onDestroy();
      });
      this._plugins.length = 0;
    };
    Scrollbar2.prototype._init = function() {
      var _this = this;
      this.update();
      Object.keys(events_exports).forEach(function(prop) {
        events_exports[prop](_this);
      });
      this._plugins.forEach(function(plugin3) {
        plugin3.onInit();
      });
      this._render();
    };
    Scrollbar2.prototype._updateDebounced = function() {
      this.update();
    };
    Scrollbar2.prototype._shouldPropagateMomentum = function(deltaX, deltaY) {
      if (deltaX === void 0) {
        deltaX = 0;
      }
      if (deltaY === void 0) {
        deltaY = 0;
      }
      var _a = this, options2 = _a.options, offset = _a.offset, limit = _a.limit;
      if (!options2.continuousScrolling)
        return false;
      if (limit.x === 0 && limit.y === 0) {
        this._updateDebounced();
      }
      var destX = clamp_default(deltaX + offset.x, 0, limit.x);
      var destY = clamp_default(deltaY + offset.y, 0, limit.y);
      var res = true;
      res = res && destX === offset.x;
      res = res && destY === offset.y;
      res = res && (offset.x === limit.x || offset.x === 0 || offset.y === limit.y || offset.y === 0);
      return res;
    };
    Scrollbar2.prototype._render = function() {
      var _momentum = this._momentum;
      if (_momentum.x || _momentum.y) {
        var nextX = this._nextTick("x");
        var nextY = this._nextTick("y");
        _momentum.x = nextX.momentum;
        _momentum.y = nextY.momentum;
        this.setPosition(nextX.position, nextY.position);
      }
      var remain = __assign({}, this._momentum);
      this._plugins.forEach(function(plugin3) {
        plugin3.onRender(remain);
      });
      this._renderID = requestAnimationFrame(this._render.bind(this));
    };
    Scrollbar2.prototype._nextTick = function(direction3) {
      var _a = this, options2 = _a.options, offset = _a.offset, _momentum = _a._momentum;
      var current = offset[direction3];
      var remain = _momentum[direction3];
      if (Math.abs(remain) <= 0.1) {
        return {
          momentum: 0,
          position: current + remain
        };
      }
      var nextMomentum = remain * (1 - options2.damping);
      if (options2.renderByPixels) {
        nextMomentum |= 0;
      }
      return {
        momentum: nextMomentum,
        position: current + remain - nextMomentum
      };
    };
    __decorate([
      debounce3(100, {leading: true})
    ], Scrollbar2.prototype, "_updateDebounced", null);
    return Scrollbar2;
  }();

  // node_modules/smooth-scrollbar/style.js
  var TRACK_BG = "rgba(222, 222, 222, .75)";
  var THUMB_BG = "rgba(0, 0, 0, .5)";
  var SCROLLBAR_STYLE = "\n[data-scrollbar] {\n  display: block;\n  position: relative;\n}\n\n.scroll-content {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n\n.scrollbar-track {\n  position: absolute;\n  opacity: 0;\n  z-index: 1;\n  background: " + TRACK_BG + ";\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity 0.5s 0.5s ease-out;\n          transition: opacity 0.5s 0.5s ease-out;\n}\n.scrollbar-track.show,\n.scrollbar-track:hover {\n  opacity: 1;\n  -webkit-transition-delay: 0s;\n          transition-delay: 0s;\n}\n\n.scrollbar-track-x {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 8px;\n}\n.scrollbar-track-y {\n  top: 0;\n  right: 0;\n  width: 8px;\n  height: 100%;\n}\n.scrollbar-thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 8px;\n  height: 8px;\n  background: " + THUMB_BG + ";\n  border-radius: 4px;\n}\n";
  var STYLE_ID = "smooth-scrollbar-style";
  var isStyleAttached = false;
  function attachStyle() {
    if (isStyleAttached || typeof window === "undefined") {
      return;
    }
    var styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.textContent = SCROLLBAR_STYLE;
    if (document.head) {
      document.head.appendChild(styleEl);
    }
    isStyleAttached = true;
  }
  function detachStyle() {
    if (!isStyleAttached || typeof window === "undefined") {
      return;
    }
    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl || !styleEl.parentNode) {
      return;
    }
    styleEl.parentNode.removeChild(styleEl);
    isStyleAttached = false;
  }

  // node_modules/smooth-scrollbar/index.js
  /*!
   * cast `I.Scrollbar` to `Scrollbar` to avoid error
   *
   * `I.Scrollbar` is not assignable to `Scrollbar`:
   *     "privateProp" is missing in `I.Scrollbar`
   *
   * @see https://github.com/Microsoft/TypeScript/issues/2672
   */
  var SmoothScrollbar = function(_super) {
    __extends(SmoothScrollbar2, _super);
    function SmoothScrollbar2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    SmoothScrollbar2.init = function(elem, options2) {
      if (!elem || elem.nodeType !== 1) {
        throw new TypeError("expect element to be DOM Element, but got " + elem);
      }
      attachStyle();
      if (scrollbarMap.has(elem)) {
        return scrollbarMap.get(elem);
      }
      return new Scrollbar(elem, options2);
    };
    SmoothScrollbar2.initAll = function(options2) {
      return Array.from(document.querySelectorAll("[data-scrollbar]"), function(elem) {
        return SmoothScrollbar2.init(elem, options2);
      });
    };
    SmoothScrollbar2.has = function(elem) {
      return scrollbarMap.has(elem);
    };
    SmoothScrollbar2.get = function(elem) {
      return scrollbarMap.get(elem);
    };
    SmoothScrollbar2.getAll = function() {
      return Array.from(scrollbarMap.values());
    };
    SmoothScrollbar2.destroy = function(elem) {
      var scrollbar2 = scrollbarMap.get(elem);
      if (scrollbar2) {
        scrollbar2.destroy();
      }
    };
    SmoothScrollbar2.destroyAll = function() {
      scrollbarMap.forEach(function(scrollbar2) {
        scrollbar2.destroy();
      });
    };
    SmoothScrollbar2.use = function() {
      var Plugins = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        Plugins[_i] = arguments[_i];
      }
      return addPlugins.apply(void 0, Plugins);
    };
    SmoothScrollbar2.attachStyle = function() {
      return attachStyle();
    };
    SmoothScrollbar2.detachStyle = function() {
      return detachStyle();
    };
    SmoothScrollbar2.version = "8.5.3";
    SmoothScrollbar2.ScrollbarPlugin = ScrollbarPlugin;
    return SmoothScrollbar2;
  }(Scrollbar);
  var smooth_scrollbar_default = SmoothScrollbar;

  // src/js/app/utils/bindAll.js
  function bindAll(targetClass = null, methodNames = []) {
    const thisClass = targetClass || this, allMethods = (thisClass2) => {
      const props = Object.getOwnPropertyNames(Object.getPrototypeOf(thisClass2));
      props.splice(props.indexOf("constructor"), 1);
      return props;
    };
    for (const name of !methodNames.length ? allMethods(thisClass) : methodNames) {
      thisClass[name] = thisClass[name].bind(thisClass);
    }
  }

  // src/js/app/utils/createDOM.js
  function createDOM() {
    const DOM = {};
    [...document.querySelectorAll("[data-elements]")].forEach((item, i) => {
      if (DOM[item.dataset.elements]) {
        DOM[item.dataset.elements].push(item);
      } else {
        DOM[item.dataset.elements] = [item];
      }
    });
    [...document.querySelectorAll("[data-element]")].forEach((elt, i) => {
      DOM[elt.dataset.element] = elt;
    });
    return DOM;
  }

  // src/js/app/ScrollController.js
  class ScrollController {
    constructor(options2 = {}) {
      bindAll(this);
      this.options = options2;
      this.height = options2.height || window.innerHeight;
      this.sections = options2.sections;
      this.newBounds = {};
      this.sectionBounds = {};
      this.inited = false;
      this.elementBounds = {};
      this.init();
    }
    init() {
      this.updateRects(0, window.innerHeight);
      this.getSectionBounds(0, this.height);
    }
    updateRect(item, windowHeight) {
      const bounds = item.getBoundingClientRect();
      return {
        elt: item,
        top: bounds.top - windowHeight,
        bottom: bounds.top + windowHeight,
        height: bounds.height
      };
    }
    updateRects(scroll, windowHeight) {
      Object.entries(this.sections).forEach((item, i, arr) => {
        const name = item[0], elt = item[1], bounds = elt.getBoundingClientRect();
        this.elementBounds[name] = {
          elt,
          top: bounds.top - windowHeight + scroll,
          bottom: bounds.top + windowHeight,
          height: bounds.height
        };
      });
    }
    getSectionBounds(scroll, windowHeight) {
      let height = windowHeight;
      if (!height) {
        height = this.height;
        console.error("Window height should be passed. Current height:", height);
      }
      Object.entries(this.sections).forEach((item, i, arr) => {
        const key = item[0], bounds = this.elementBounds[key];
        if (!this.newBounds[key]) {
          this.newBounds[key] = {};
        }
        this.newBounds[key].in = (bounds.top - scroll) / -bounds.height;
        this.newBounds[key].inClamp = Math.max(0, Math.min(1, this.newBounds[key].in));
        this.newBounds[key].inFull = (bounds.top - scroll + windowHeight) / (-bounds.height + windowHeight);
        this.newBounds[key].inFullClamp = Math.max(0, Math.min(1, this.newBounds[key].inFull));
        this.newBounds[key].out = (bounds.top - scroll + windowHeight) / -bounds.height;
        this.newBounds[key].outClamp = Math.max(0, Math.min(1, this.newBounds[key].out));
        this.newBounds[key].inOut = (bounds.top - scroll) / -(windowHeight + bounds.height);
        this.newBounds[key].inOutClamp = Math.max(0, Math.min(1, this.newBounds[key].inOut));
        this.newBounds[key].screen = (bounds.top - scroll) / -windowHeight;
        this.newBounds[key].screenClamp = Math.max(0, Math.min(1, this.newBounds[key].screen));
      });
      return this.newBounds;
    }
  }

  // src/js/app/utils/interpolate.js
  function clamp9(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // src/js/app/SmartProgress.js
  class SmartProgress {
    constructor(options2 = {}) {
      bindAll(this);
      this.options = options2;
      this.friction = this.options.friction || 0.05;
      this.tweens = {};
    }
    add(name, min = 0, max = 1, bump) {
      if (this.tweens[name]) {
        console.error("Tween", name, "already exists");
      }
      this.tweens[name] = {
        instant: 0,
        smooth: 0,
        bump: bump ? bump : max / 1e3,
        min,
        max
      };
    }
    updateProgress(name, value) {
      const tween = this.tweens[name];
      this.tweens[name].instant = clamp9(value, tween.min, tween.max);
    }
    updateDelta(delta) {
      Object.keys(this.tweens).map((name, i) => {
        const tween = this.tweens[name];
        let increaseValue = 0;
        let progressDiff = tween.instant - tween.smooth;
        if (tween.smooth != tween.instant) {
          increaseValue = progressDiff * this.friction;
          tween.smooth += increaseValue;
        }
        if (Math.abs(progressDiff) < tween.bump) {
          tween.smooth = tween.instant;
        }
      });
    }
    getProgress(name) {
      if (!this.tweens[name]) {
        return 0;
      }
      return this.tweens[name].smooth;
    }
  }

  // src/js/app/utils/getQuery.js
  function getQuery(name) {
    const params = window.location.search.slice(1);
    if (!params) {
      return {};
    }
    const result = params.split("&").map(function(i) {
      return i.split("=");
    }).reduce(function(m, o) {
      m[o[0]] = o[1];
      return m;
    }, {});
    return result;
  }

  // src/js/app/AnimationEngine.js
  class AnimationEngine {
    constructor(options2 = {}) {
      bindAll(this);
      this.options = options2;
      this.DOM = options2.DOM;
      this.lastTime = 0;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.smartProgress = new SmartProgress({
        friction: 0.05
      });
      this.isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      this.deltaRange = getQuery().speed ? +getQuery().speed : this.isMac ? 20 : 100;
      this.scroll = 0;
      if (this.DOM.headerLogo)
        this.logoBounds = this.DOM.headerLogo.getBoundingClientRect();
      this.animationStates = {};
      this.animationStates.headerIsBrandBg = false;
      this.animationStates.headerIsDarkBg = false;
      this.animationStates.titles = [];
      this.animationStates.casesItems = [];
      this.indexFlag = this.DOM.body.classList.contains("index");
      this.init();
    }
    init() {
      this.DOM.titles && this.createTitlesArr();
      this.DOM.introLogo && this.updateIntroLogoBounds();
      this.DOM.infoList && this.getInfoListBounds();
      this.DOM.requestTitle && this.getRequestTitleBounds();
      this.DOM.requestSection && this.getRequestSectionBounds();
      this.DOM.requestBox && this.getRequestBoxBounds();
      this.DOM.requestTitle && this.setRequestTitleTransform();
      this.DOM.casesItems && this.createCasesItemsArr();
      window.addEventListener("load", (e) => {
        this.DOM.infoList && this.getInfoListBounds();
        this.DOM.requestTitle && this.clearRequestTitleTransform();
        this.DOM.requestTitle && this.getRequestTitleBounds();
        this.DOM.requestTitle && this.setRequestTitleTransform();
        this.DOM.requestSection && this.getRequestSectionBounds();
        this.DOM.requestBox && this.getRequestBoxBounds();
      });
      this.indexFlag && this.setHeaderClasses();
      this.indexFlag && this.animateLogo();
      this.bodyHeight = this.DOM.wrapper.clientHeight - this.height;
    }
    resize(width, height) {
      this.width = width;
      this.height = height;
      this.bodyHeight = this.DOM.wrapper.clientHeight - this.height;
      this.DOM.introLogo && this.updateIntroLogoBounds();
      this.DOM.infoList && this.getInfoListBounds();
      this.DOM.requestTitle && this.clearRequestTitleTransform();
      this.DOM.requestTitle && this.getRequestTitleBounds();
      this.DOM.requestTitle && this.setRequestTitleTransform();
      this.DOM.requestSection && this.getRequestSectionBounds();
      this.DOM.requestBox && this.getRequestBoxBounds();
      this.indexFlag && this.setHeaderClasses();
    }
    updateState(progress, scroll) {
      this.scroll = scroll;
      this.progress = progress;
      if (this.indexFlag) {
        let logoTransform = this.calcLogoSize(), logoRatio = this.width >= 768 ? 4 : 3;
        this.animationStates.introScroll = this.progress.introSection.outClamp;
        this.animationStates.logoScale = Math.max(1, logoTransform.scale - logoTransform.scale * this.animationStates.introScroll * logoRatio);
        this.animationStates.logoTranslate = Math.max(0, logoTransform.translate);
        this.animationStates.textTranslate = Math.min(500, this.animationStates.introScroll * 100 * 16);
        let infoListRatio = (this.infoListBounds.width - this.width) / this.width;
        this.animationStates.infoBoxScroll = Math.min(500, this.progress.infoSection.outClamp * 6 * 100);
        this.animationStates.infoScroll = this.progress.infoSection.inFullClamp * infoListRatio * 100;
        let requestRatio = this.requestTitleBounds.width / this.width, requestStopTranslate = (this.requestTitleBounds.width - this.width) / this.width * 100, requestBoxRatio = this.requestSectionBounds.height / this.requestBoxBounds.height, requestBoxStopTranslate = (this.requestSectionBounds.height - this.height) / this.requestBoxBounds.height * 100;
        this.animationStates.requestBoxScroll = Math.min(requestBoxStopTranslate, this.progress.requestSection.outClamp * requestBoxRatio * 100 - 50);
        this.animationStates.requestScroll = Math.min(requestStopTranslate, this.progress.requestSection.outClamp * requestRatio * 100);
        this.animationStates.requestScale = Math.max(1, 2 - 2 * this.progress.requestSection.outClamp * requestRatio);
        this.animationStates.requestRotate = Math.max(0, 15 - 15 * this.progress.requestSection.outClamp * requestRatio);
        this.animationStates.requestFingerVisible = this.progress.requestSection.outClamp > 0.66;
        this.animationStates.headerIsBrandBg = this.progress.infoSection.screenClamp > 0.95 && this.progress.infoSection.outClamp < 0.98;
        this.animationStates.headerIsDarkBg = this.progress.advantagesSection.screenClamp > 0.95 && this.progress.advantagesSection.outClamp < 0.98;
        this.animationStates.titles.forEach((item, i, arr) => {
          for (let key in item) {
            item[key] = this.progress[key].screenClamp > 0.1;
          }
        });
      }
      this.animationStates.casesItems.forEach((item, i, arr) => {
        for (let key in item) {
          item[key] = this.progress[key].screenClamp > 0.2;
        }
      });
      if (this.progress.articleSection) {
        this.animationStates.articleProgress = Math.max(0, Math.min(1, 1 - this.progress.articleSection.inFullClamp)) * 100;
      }
    }
    updateIntroLogoBounds() {
      const b = this.DOM.introLogo.getBoundingClientRect();
      this.introLogoBounds = {
        top: b.top + this.scroll,
        width: b.width
      };
      return this.introLogoBounds;
    }
    getInfoListBounds() {
      const b = this.DOM.infoList.getBoundingClientRect();
      this.infoListBounds = {
        width: b.width
      };
      return this.infoListBounds;
    }
    getRequestTitleBounds() {
      const b = this.DOM.requestTitle.getBoundingClientRect();
      this.requestTitleBounds = {
        width: b.width
      };
      return this.requestTitleBounds;
    }
    clearRequestTitleTransform() {
      this.DOM.requestScroll.style.setProperty("transform", `scale(1) rotate(0deg) translateX(0)`);
    }
    setRequestTitleTransform() {
      this.DOM.requestScroll.style.setProperty("transform", `scale(2) rotate(15deg) translateX(0)`);
    }
    getRequestSectionBounds() {
      const b = this.DOM.requestSection.getBoundingClientRect();
      this.requestSectionBounds = {
        height: b.height
      };
      return this.requestSectionBounds;
    }
    getRequestBoxBounds() {
      const b = this.DOM.requestBox.getBoundingClientRect();
      this.requestBoxBounds = {
        height: b.height
      };
      return this.requestBoxBounds;
    }
    calcLogoSize() {
      const logoBoundsTop = this.width >= 768 ? 42 : 16, introLogoBounds = this.introLogoBounds, introLogoWidth = introLogoBounds.width, introLogoTop = introLogoBounds.top - this.scroll, logoTransform = {};
      logoTransform.scale = Math.max(1, introLogoWidth / this.logoBounds.width);
      logoTransform.translate = (introLogoTop - logoBoundsTop) / (this.logoBounds.height * logoTransform.scale) * 100;
      return logoTransform;
    }
    createTitlesArr() {
      this.DOM.titles.forEach((title, i, arr) => {
        let obj = {};
        obj[title.dataset.scroll] = false;
        this.animationStates.titles.push(obj);
      });
    }
    createCasesItemsArr() {
      this.animationStates.casesItems = [];
      this.DOM.casesItems.forEach((item, i, arr) => {
        let obj = {};
        obj[item.dataset.scroll] = false;
        this.animationStates.casesItems.push(obj);
      });
    }
    animateLogo() {
      this.DOM.headerLogo.style.setProperty("transform", `scale(${this.animationStates.logoScale}) translateY(${this.animationStates.logoTranslate}%)`);
      this.DOM.headerLogo.classList.add("is-animated");
      this.DOM.headerText.style.setProperty("transform", `translateY(-${this.animationStates.textTranslate}%)`);
    }
    animateInfoScroll() {
      this.DOM.infoBox.style.setProperty("transform", `translateY(${this.animationStates.infoBoxScroll}%)`);
      this.DOM.infoScroll.style.setProperty("transform", `translateX(-${this.animationStates.infoScroll}%)`);
    }
    animateRequestScroll() {
      this.DOM.requestBox.style.setProperty("transform", `translateY(${this.animationStates.requestBoxScroll}%)`);
      this.DOM.requestScroll.style.setProperty("transform", `scale(${this.animationStates.requestScale}) rotate(${this.animationStates.requestRotate}deg) translateX(-${this.animationStates.requestScroll}%)`);
      this.DOM.requestFinger.classList.toggle("is-active", this.animationStates.requestFingerVisible);
    }
    setHeaderClasses() {
      this.DOM.header.classList.toggle("is-brand-bg", this.animationStates.headerIsBrandBg);
      this.DOM.header.classList.toggle("is-dark-bg", this.animationStates.headerIsDarkBg);
    }
    setTitlesLoaded() {
      this.animationStates.titles.forEach((item, i, arr) => {
        for (let key in item) {
          this.DOM.titles[i].classList.toggle("is-loaded", item[key]);
        }
      });
    }
    setCasesItemsLoaded() {
      this.animationStates.casesItems.forEach((item, i, arr) => {
        for (let key in item) {
          this.DOM.casesItems[i].classList.toggle("is-loaded", item[key]);
        }
      });
    }
    animateProgressBar() {
      this.DOM.progressBar.style.setProperty("transform", `translateX(${-this.animationStates.articleProgress}%)`);
    }
    draw(delta) {
      this.DOM.titles && this.setTitlesLoaded();
      this.DOM.infoScroll && this.animateInfoScroll();
      this.DOM.requestScroll && this.animateRequestScroll();
      this.indexFlag && this.DOM.header && this.setHeaderClasses();
      this.indexFlag && this.DOM.headerLogo && this.animateLogo();
      this.animationStates.casesItems.length && this.setCasesItemsLoaded();
      this.DOM.progressBar && this.animateProgressBar();
    }
  }

  // src/js/app/form.js
  const validate = __toModule(require_validate());
  const js_cookie = __toModule(require_js_cookie());
  class Form {
    constructor(el, popup) {
      this.popup = popup;
      this.form = el;
      this.formField = this.form.querySelectorAll(".js-form-group");
      this.formInput = this.form.querySelectorAll(".js-form-input");
      this.formRadioBlock = this.form.querySelectorAll(".js-radio");
      this.formId = this.form.getAttribute("id");
      this.formSuccess = this.form.querySelector(".js-form-success");
      this.formError = this.form.querySelector(".js-form-error");
      this.url = "https://usebasin.com/f/e16e55e0335e.json";
      this.readSecretButton = document.querySelector(".js-read-secret-url");
      switch (this.formId) {
        case "form-request":
          this.constraints = {
            email: {
              presence: {message: "Enter your email"},
              email: {message: "Wrong email"}
            },
            agreementPrivacy: {
              presence: true,
              inclusion: {
                within: [true]
              }
            }
          };
          this.gtag = {
            action: "service-request-submit",
            category: "get-in-touch-request"
          };
          break;
        case "form-getreport":
        case "form-getreport-subscribe":
          this.constraints = {
            email: {
              presence: {message: "Enter your email"},
              email: {message: "Wrong email"}
            }
          };
          break;
        case "form-subscribe":
          this.url = "/subscribe";
          this.constraints = {
            email: {
              presence: {message: "Enter your email"},
              email: {message: "Wrong email"}
            }
          };
          this.gtag = {
            action: "shared-secrets-subscribe",
            category: "newsletter"
          };
        case "form-article-subscribe":
        case "form-header-subscribe":
          this.url = "/subscribe";
          this.constraints = {
            email: {
              presence: {message: "Enter your email"},
              email: {message: "Wrong email"}
            }
          };
          this.gtag = {
            action: "shared-secrets-subscribe",
            category: "newsletter"
          };
          break;
      }
      this.init();
    }
    init() {
      this.setListeners();
    }
    setListeners() {
      this.formInput.forEach((el) => {
        el.addEventListener("change", (e) => {
          let errors = validate.default(this.form, this.constraints, {fullMessages: false}) || {}, inputField = el.closest(".js-form-group");
          this.showErrorsForInput(el, errors[el.name]);
          inputField.classList.toggle("is-filled", el.value);
        });
      });
      this.formRadioBlock.forEach((el) => {
        el.addEventListener("focus", (e) => {
          el.querySelector("input").focus();
        });
      });
      document.addEventListener("keyup", (e) => {
        if (e.keyCode == "13" && e.target.type == "radio") {
          e.preventDefault();
          document.activeElement.checked = true;
        }
      });
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (document.activeElement.type != "radio") {
          this.handleFormSubmit(this.form);
        }
      });
    }
    handleFormSubmit(form, input) {
      let errors = validate.default(this.form, this.constraints, {fullMessages: false});
      this.showErrors(this.form, errors || {});
      if (!errors) {
        if (form.id == "form-subscribe" || form.id == "form-header-subscribe") {
          this.sendSubscribeForm(this.form);
        } else {
          if (form.id == "form-request" && this.form.agreementNews.checked) {
            this.url = "/subscribe";
          }
          this.formSend(this.form);
        }
      } else {
        if (form.id == "form-request" && errors.agreementPrivacy) {
          this.showErrorMessage("Please confirm that you read and agree to our privacy policy.", false);
        }
      }
    }
    showErrors(form, errors) {
      this.formInput.forEach((el) => {
        this.showErrorsForInput(el, errors && errors[el.name]);
      });
    }
    showErrorsForInput(input, errors) {
      const formGroup = input.closest(".js-form-group"), formMessages = formGroup.querySelector(".js-form-message");
      this.resetFormGroup(formGroup);
      if (errors) {
        formGroup.classList.add("is-error");
        errors.forEach((el) => {
          this.addError(formMessages, el);
        });
      } else {
        formGroup.classList.add("is-success");
        if (this.form.id == "form-request" && input.getAttribute("name") == "agreementPrivacy") {
          this.formError.classList.remove("is-active");
        }
      }
    }
    resetFormGroup(formGroup) {
      formGroup.classList.remove("is-error");
      formGroup.classList.remove("is-success");
      formGroup.querySelectorAll(".help-block.error").forEach((el) => {
        el.parentNode.removeChild(el);
      });
    }
    addError(messages, error) {
      let block = document.createElement("p");
      block.classList.add("help-block");
      block.classList.add("error");
      block.innerText = error;
      messages.appendChild(block);
    }
    toJSONString(form) {
      let obj = {}, elements = form.querySelectorAll("input, select, textarea");
      for (let i = 0; i < elements.length; ++i) {
        let element = elements[i], name = element.name, value = element.value;
        if (name) {
          obj[name] = value;
        }
      }
      return JSON.stringify(obj);
    }
    formSend(form) {
      fetch(this.url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: this.toJSONString(this.form)
      }).then((r) => r.json()).then((r) => {
        this.showSuccess();
        this.sendGtagEvent(this.gtag.action, this.gtag.category);
      });
    }
    sendSubscribeForm(form) {
      const unlockForm = form.dataset.form;
      fetch(this.url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: this.toJSONString(this.form)
      }).then((r) => r.json()).then((r) => {
        const data = JSON.parse(r);
        if (data.error) {
          if (data.name == "ValidationError") {
            this.showErrorMessage("Email address is not valid. Please try again.", true);
          } else {
            if (unlockForm && data.code == 214) {
              this.unlockArticles();
            } else {
              this.showErrorMessage(data.error, true);
            }
          }
        } else {
          if (unlockForm) {
            this.unlockArticles();
          } else {
            if (this.formId == "form-header-subscribe") {
              this.showSuccess(true);
            } else {
              this.showSuccess();
            }
          }
          this.sendGtagEvent(this.gtag.action, this.gtag.category);
        }
      });
    }
    unlockArticles() {
      const article = document.querySelector(".js-main-article");
      if (article) {
        this.readSecretButton.addEventListener("click", (event) => {
          this.popup.closePopup();
          event.preventDefault();
          return false;
        });
        article.classList.remove("is-locked");
      }
      js_cookie.default.set("unlocked", 1, {path: "/", expires: 365});
      this.readSecretButton.href = window.unlockUrl;
      this.showSuccess(true);
      document.querySelectorAll(".js-popup-link").forEach((item, i, arr) => {
        if ((item.dataset && item.dataset.popup) == "popup-unlock") {
          item.classList.remove("blog-card--lock");
        }
      });
      document.querySelectorAll('.js-popup-link[data-popup="popup-unlock"]').forEach((elt, i, arr) => {
        this.popup.removeListener(elt, "click");
      });
    }
    sendGtagEvent(action, category) {
      if (typeof gtag == "undefined") {
        return;
      }
      gtag("event", action, {
        event_category: category
      });
    }
    formReset() {
      this.form.reset();
      this.formField.forEach((el) => {
        el.classList.remove("is-filled");
        el.classList.remove("is-success");
        el.classList.remove("is-error");
      });
    }
    showSuccess(noTimeout) {
      console.log("Validation success!", this.toJSONString(this.form));
      this.formError && this.formError.classList.remove("is-active");
      this.formSuccess && this.formSuccess.classList.add("is-active");
      this.form.classList.add("is-success");
      this.formReset();
      if (!noTimeout) {
        setTimeout((e) => {
          this.form.classList.remove("is-success");
          this.formSuccess.classList.remove("is-active");
        }, 5e3);
      }
    }
    showErrorMessage(error, reset) {
      console.log("Error", this.toJSONString(this.form));
      this.formError.innerHTML = error;
      this.formError.classList.add("is-active");
      if (reset) {
        this.formReset();
        setTimeout((e) => {
          this.formError.classList.remove("is-active");
        }, 5e3);
      }
    }
  }

  // src/js/app/nav.js
  class Nav {
    constructor(el) {
      this.nav = el;
      this.header = document.querySelector(".js-header");
      this.navToggle = document.querySelector(".js-nav-toggle");
      this.init();
    }
    init() {
      this.setListeners();
    }
    setListeners() {
      this.navToggle.addEventListener("click", this.toggleNav.bind(this));
    }
    toggleNav() {
      if (this.nav.classList.contains("is-open")) {
        this.nav.classList.remove("is-open");
        this.navToggle.classList.remove("is-open");
        this.header.classList.remove("is-nav-open");
      } else {
        this.nav.classList.add("is-open");
        this.navToggle.classList.add("is-open");
        this.header.classList.add("is-nav-open");
      }
      return false;
    }
  }

  // node_modules/tiny-slider/src/helpers/raf.js
  var win = window;
  var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function(cb) {
    return setTimeout(cb, 16);
  };

  // node_modules/tiny-slider/src/helpers/caf.js
  var win2 = window;
  var caf = win2.cancelAnimationFrame || win2.mozCancelAnimationFrame || function(id) {
    clearTimeout(id);
  };

  // node_modules/tiny-slider/src/helpers/extend.js
  function extend() {
    var obj, name, copy, target = arguments[0] || {}, i = 1, length = arguments.length;
    for (; i < length; i++) {
      if ((obj = arguments[i]) !== null) {
        for (name in obj) {
          copy = obj[name];
          if (target === copy) {
            continue;
          } else if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  // node_modules/tiny-slider/src/helpers/checkStorageValue.js
  function checkStorageValue(value) {
    return ["true", "false"].indexOf(value) >= 0 ? JSON.parse(value) : value;
  }

  // node_modules/tiny-slider/src/helpers/setLocalStorage.js
  function setLocalStorage(storage, key, value, access) {
    if (access) {
      try {
        storage.setItem(key, value);
      } catch (e) {
      }
    }
    return value;
  }

  // node_modules/tiny-slider/src/helpers/getSlideId.js
  function getSlideId() {
    var id = window.tnsId;
    window.tnsId = !id ? 1 : id + 1;
    return "tns" + window.tnsId;
  }

  // node_modules/tiny-slider/src/helpers/getBody.js
  function getBody() {
    var doc = document, body = doc.body;
    if (!body) {
      body = doc.createElement("body");
      body.fake = true;
    }
    return body;
  }

  // node_modules/tiny-slider/src/helpers/docElement.js
  var docElement = document.documentElement;

  // node_modules/tiny-slider/src/helpers/setFakeBody.js
  function setFakeBody(body) {
    var docOverflow = "";
    if (body.fake) {
      docOverflow = docElement.style.overflow;
      body.style.background = "";
      body.style.overflow = docElement.style.overflow = "hidden";
      docElement.appendChild(body);
    }
    return docOverflow;
  }

  // node_modules/tiny-slider/src/helpers/resetFakeBody.js
  function resetFakeBody(body, docOverflow) {
    if (body.fake) {
      body.remove();
      docElement.style.overflow = docOverflow;
      docElement.offsetHeight;
    }
  }

  // node_modules/tiny-slider/src/helpers/calc.js
  function calc() {
    var doc = document, body = getBody(), docOverflow = setFakeBody(body), div = doc.createElement("div"), result = false;
    body.appendChild(div);
    try {
      var str = "(10px * 10)", vals = ["calc" + str, "-moz-calc" + str, "-webkit-calc" + str], val;
      for (var i = 0; i < 3; i++) {
        val = vals[i];
        div.style.width = val;
        if (div.offsetWidth === 100) {
          result = val.replace(str, "");
          break;
        }
      }
    } catch (e) {
    }
    body.fake ? resetFakeBody(body, docOverflow) : div.remove();
    return result;
  }

  // node_modules/tiny-slider/src/helpers/percentageLayout.js
  function percentageLayout() {
    var doc = document, body = getBody(), docOverflow = setFakeBody(body), wrapper = doc.createElement("div"), outer = doc.createElement("div"), str = "", count = 70, perPage = 3, supported = false;
    wrapper.className = "tns-t-subp2";
    outer.className = "tns-t-ct";
    for (var i = 0; i < count; i++) {
      str += "<div></div>";
    }
    outer.innerHTML = str;
    wrapper.appendChild(outer);
    body.appendChild(wrapper);
    supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2;
    body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove();
    return supported;
  }

  // node_modules/tiny-slider/src/helpers/mediaquerySupport.js
  function mediaquerySupport() {
    if (window.matchMedia || window.msMatchMedia) {
      return true;
    }
    var doc = document, body = getBody(), docOverflow = setFakeBody(body), div = doc.createElement("div"), style2 = doc.createElement("style"), rule = "@media all and (min-width:1px){.tns-mq-test{position:absolute}}", position;
    style2.type = "text/css";
    div.className = "tns-mq-test";
    body.appendChild(style2);
    body.appendChild(div);
    if (style2.styleSheet) {
      style2.styleSheet.cssText = rule;
    } else {
      style2.appendChild(doc.createTextNode(rule));
    }
    position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle["position"];
    body.fake ? resetFakeBody(body, docOverflow) : div.remove();
    return position === "absolute";
  }

  // node_modules/tiny-slider/src/helpers/createStyleSheet.js
  function createStyleSheet(media, nonce) {
    var style2 = document.createElement("style");
    if (media) {
      style2.setAttribute("media", media);
    }
    if (nonce) {
      style2.setAttribute("nonce", nonce);
    }
    document.querySelector("head").appendChild(style2);
    return style2.sheet ? style2.sheet : style2.styleSheet;
  }

  // node_modules/tiny-slider/src/helpers/addCSSRule.js
  function addCSSRule(sheet, selector, rules, index) {
    "insertRule" in sheet ? sheet.insertRule(selector + "{" + rules + "}", index) : sheet.addRule(selector, rules, index);
  }

  // node_modules/tiny-slider/src/helpers/removeCSSRule.js
  function removeCSSRule(sheet, index) {
    "deleteRule" in sheet ? sheet.deleteRule(index) : sheet.removeRule(index);
  }

  // node_modules/tiny-slider/src/helpers/getCssRulesLength.js
  function getCssRulesLength(sheet) {
    var rule = "insertRule" in sheet ? sheet.cssRules : sheet.rules;
    return rule.length;
  }

  // node_modules/tiny-slider/src/helpers/toDegree.js
  function toDegree(y, x) {
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  // node_modules/tiny-slider/src/helpers/getTouchDirection.js
  function getTouchDirection(angle, range2) {
    var direction3 = false, gap = Math.abs(90 - Math.abs(angle));
    if (gap >= 90 - range2) {
      direction3 = "horizontal";
    } else if (gap <= range2) {
      direction3 = "vertical";
    }
    return direction3;
  }

  // node_modules/tiny-slider/src/helpers/forEach.js
  function forEach(arr, callback, scope) {
    for (var i = 0, l = arr.length; i < l; i++) {
      callback.call(scope, arr[i], i);
    }
  }

  // node_modules/tiny-slider/src/helpers/classListSupport.js
  var classListSupport = "classList" in document.createElement("_");

  // node_modules/tiny-slider/src/helpers/hasClass.js
  var hasClass = classListSupport ? function(el, str) {
    return el.classList.contains(str);
  } : function(el, str) {
    return el.className.indexOf(str) >= 0;
  };

  // node_modules/tiny-slider/src/helpers/addClass.js
  var addClass = classListSupport ? function(el, str) {
    if (!hasClass(el, str)) {
      el.classList.add(str);
    }
  } : function(el, str) {
    if (!hasClass(el, str)) {
      el.className += " " + str;
    }
  };

  // node_modules/tiny-slider/src/helpers/removeClass.js
  var removeClass = classListSupport ? function(el, str) {
    if (hasClass(el, str)) {
      el.classList.remove(str);
    }
  } : function(el, str) {
    if (hasClass(el, str)) {
      el.className = el.className.replace(str, "");
    }
  };

  // node_modules/tiny-slider/src/helpers/hasAttr.js
  function hasAttr(el, attr) {
    return el.hasAttribute(attr);
  }

  // node_modules/tiny-slider/src/helpers/getAttr.js
  function getAttr(el, attr) {
    return el.getAttribute(attr);
  }

  // node_modules/tiny-slider/src/helpers/isNodeList.js
  function isNodeList(el) {
    return typeof el.item !== "undefined";
  }

  // node_modules/tiny-slider/src/helpers/setAttrs.js
  function setAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    if (Object.prototype.toString.call(attrs) !== "[object Object]") {
      return;
    }
    for (var i = els.length; i--; ) {
      for (var key in attrs) {
        els[i].setAttribute(key, attrs[key]);
      }
    }
  }

  // node_modules/tiny-slider/src/helpers/removeAttrs.js
  function removeAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    attrs = attrs instanceof Array ? attrs : [attrs];
    var attrLength = attrs.length;
    for (var i = els.length; i--; ) {
      for (var j = attrLength; j--; ) {
        els[i].removeAttribute(attrs[j]);
      }
    }
  }

  // node_modules/tiny-slider/src/helpers/arrayFromNodeList.js
  function arrayFromNodeList(nl) {
    var arr = [];
    for (var i = 0, l = nl.length; i < l; i++) {
      arr.push(nl[i]);
    }
    return arr;
  }

  // node_modules/tiny-slider/src/helpers/hideElement.js
  function hideElement(el, forceHide) {
    if (el.style.display !== "none") {
      el.style.display = "none";
    }
  }

  // node_modules/tiny-slider/src/helpers/showElement.js
  function showElement(el, forceHide) {
    if (el.style.display === "none") {
      el.style.display = "";
    }
  }

  // node_modules/tiny-slider/src/helpers/isVisible.js
  function isVisible2(el) {
    return window.getComputedStyle(el).display !== "none";
  }

  // node_modules/tiny-slider/src/helpers/whichProperty.js
  function whichProperty(props) {
    if (typeof props === "string") {
      var arr = [props], Props = props.charAt(0).toUpperCase() + props.substr(1), prefixes = ["Webkit", "Moz", "ms", "O"];
      prefixes.forEach(function(prefix) {
        if (prefix !== "ms" || props === "transform") {
          arr.push(prefix + Props);
        }
      });
      props = arr;
    }
    var el = document.createElement("fakeelement"), len = props.length;
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (el.style[prop] !== void 0) {
        return prop;
      }
    }
    return false;
  }

  // node_modules/tiny-slider/src/helpers/has3DTransforms.js
  function has3DTransforms(tf) {
    if (!tf) {
      return false;
    }
    if (!window.getComputedStyle) {
      return false;
    }
    var doc = document, body = getBody(), docOverflow = setFakeBody(body), el = doc.createElement("p"), has3d, cssTF = tf.length > 9 ? "-" + tf.slice(0, -9).toLowerCase() + "-" : "";
    cssTF += "transform";
    body.insertBefore(el, null);
    el.style[tf] = "translate3d(1px,1px,1px)";
    has3d = window.getComputedStyle(el).getPropertyValue(cssTF);
    body.fake ? resetFakeBody(body, docOverflow) : el.remove();
    return has3d !== void 0 && has3d.length > 0 && has3d !== "none";
  }

  // node_modules/tiny-slider/src/helpers/getEndProperty.js
  function getEndProperty(propIn, propOut) {
    var endProp = false;
    if (/^Webkit/.test(propIn)) {
      endProp = "webkit" + propOut + "End";
    } else if (/^O/.test(propIn)) {
      endProp = "o" + propOut + "End";
    } else if (propIn) {
      endProp = propOut.toLowerCase() + "end";
    }
    return endProp;
  }

  // node_modules/tiny-slider/src/helpers/passiveOption.js
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
  var passiveOption = supportsPassive ? {passive: true} : false;

  // node_modules/tiny-slider/src/helpers/addEvents.js
  function addEvents(el, obj, preventScrolling) {
    for (var prop in obj) {
      var option = ["touchstart", "touchmove"].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false;
      el.addEventListener(prop, obj[prop], option);
    }
  }

  // node_modules/tiny-slider/src/helpers/removeEvents.js
  function removeEvents(el, obj) {
    for (var prop in obj) {
      var option = ["touchstart", "touchmove"].indexOf(prop) >= 0 ? passiveOption : false;
      el.removeEventListener(prop, obj[prop], option);
    }
  }

  // node_modules/tiny-slider/src/helpers/events.js
  function Events() {
    return {
      topics: {},
      on: function(eventName, fn) {
        this.topics[eventName] = this.topics[eventName] || [];
        this.topics[eventName].push(fn);
      },
      off: function(eventName, fn) {
        if (this.topics[eventName]) {
          for (var i = 0; i < this.topics[eventName].length; i++) {
            if (this.topics[eventName][i] === fn) {
              this.topics[eventName].splice(i, 1);
              break;
            }
          }
        }
      },
      emit: function(eventName, data) {
        data.type = eventName;
        if (this.topics[eventName]) {
          this.topics[eventName].forEach(function(fn) {
            fn(data, eventName);
          });
        }
      }
    };
  }

  // node_modules/tiny-slider/src/helpers/jsTransform.js
  function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
    var tick = Math.min(duration, 10), unit = to.indexOf("%") >= 0 ? "%" : "px", to = to.replace(unit, ""), from2 = Number(element.style[attr].replace(prefix, "").replace(postfix, "").replace(unit, "")), positionTick = (to - from2) / duration * tick, running;
    setTimeout(moveElement, tick);
    function moveElement() {
      duration -= tick;
      from2 += positionTick;
      element.style[attr] = prefix + from2 + unit + postfix;
      if (duration > 0) {
        setTimeout(moveElement, tick);
      } else {
        callback();
      }
    }
  }

  // node_modules/tiny-slider/src/tiny-slider.js
  if (!Object.keys) {
    Object.keys = function(object) {
      var keys = [];
      for (var name in object) {
        if (Object.prototype.hasOwnProperty.call(object, name)) {
          keys.push(name);
        }
      }
      return keys;
    };
  }
  if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
  var tns = function(options2) {
    options2 = extend({
      container: ".slider",
      mode: "carousel",
      axis: "horizontal",
      items: 1,
      gutter: 0,
      edgePadding: 0,
      fixedWidth: false,
      autoWidth: false,
      viewportMax: false,
      slideBy: 1,
      center: false,
      controls: true,
      controlsPosition: "top",
      controlsText: ["prev", "next"],
      controlsContainer: false,
      prevButton: false,
      nextButton: false,
      nav: true,
      navPosition: "top",
      navContainer: false,
      navAsThumbnails: false,
      arrowKeys: false,
      speed: 300,
      autoplay: false,
      autoplayPosition: "top",
      autoplayTimeout: 5e3,
      autoplayDirection: "forward",
      autoplayText: ["start", "stop"],
      autoplayHoverPause: false,
      autoplayButton: false,
      autoplayButtonOutput: true,
      autoplayResetOnVisibility: true,
      animateIn: "tns-fadeIn",
      animateOut: "tns-fadeOut",
      animateNormal: "tns-normal",
      animateDelay: false,
      loop: true,
      rewind: false,
      autoHeight: false,
      responsive: false,
      lazyload: false,
      lazyloadSelector: ".tns-lazy-img",
      touch: true,
      mouseDrag: false,
      swipeAngle: 15,
      nested: false,
      preventActionWhenRunning: false,
      preventScrollOnTouch: false,
      freezable: true,
      onInit: false,
      useLocalStorage: true,
      nonce: false
    }, options2 || {});
    var doc = document, win3 = window, KEYS = {
      ENTER: 13,
      SPACE: 32,
      LEFT: 37,
      RIGHT: 39
    }, tnsStorage = {}, localStorageAccess = options2.useLocalStorage;
    if (localStorageAccess) {
      var browserInfo = navigator.userAgent;
      var uid = new Date();
      try {
        tnsStorage = win3.localStorage;
        if (tnsStorage) {
          tnsStorage.setItem(uid, uid);
          localStorageAccess = tnsStorage.getItem(uid) == uid;
          tnsStorage.removeItem(uid);
        } else {
          localStorageAccess = false;
        }
        if (!localStorageAccess) {
          tnsStorage = {};
        }
      } catch (e) {
        localStorageAccess = false;
      }
      if (localStorageAccess) {
        if (tnsStorage["tnsApp"] && tnsStorage["tnsApp"] !== browserInfo) {
          ["tC", "tPL", "tMQ", "tTf", "t3D", "tTDu", "tTDe", "tADu", "tADe", "tTE", "tAE"].forEach(function(item) {
            tnsStorage.removeItem(item);
          });
        }
        localStorage["tnsApp"] = browserInfo;
      }
    }
    var CALC = tnsStorage["tC"] ? checkStorageValue(tnsStorage["tC"]) : setLocalStorage(tnsStorage, "tC", calc(), localStorageAccess), PERCENTAGELAYOUT = tnsStorage["tPL"] ? checkStorageValue(tnsStorage["tPL"]) : setLocalStorage(tnsStorage, "tPL", percentageLayout(), localStorageAccess), CSSMQ = tnsStorage["tMQ"] ? checkStorageValue(tnsStorage["tMQ"]) : setLocalStorage(tnsStorage, "tMQ", mediaquerySupport(), localStorageAccess), TRANSFORM = tnsStorage["tTf"] ? checkStorageValue(tnsStorage["tTf"]) : setLocalStorage(tnsStorage, "tTf", whichProperty("transform"), localStorageAccess), HAS3DTRANSFORMS = tnsStorage["t3D"] ? checkStorageValue(tnsStorage["t3D"]) : setLocalStorage(tnsStorage, "t3D", has3DTransforms(TRANSFORM), localStorageAccess), TRANSITIONDURATION = tnsStorage["tTDu"] ? checkStorageValue(tnsStorage["tTDu"]) : setLocalStorage(tnsStorage, "tTDu", whichProperty("transitionDuration"), localStorageAccess), TRANSITIONDELAY = tnsStorage["tTDe"] ? checkStorageValue(tnsStorage["tTDe"]) : setLocalStorage(tnsStorage, "tTDe", whichProperty("transitionDelay"), localStorageAccess), ANIMATIONDURATION = tnsStorage["tADu"] ? checkStorageValue(tnsStorage["tADu"]) : setLocalStorage(tnsStorage, "tADu", whichProperty("animationDuration"), localStorageAccess), ANIMATIONDELAY = tnsStorage["tADe"] ? checkStorageValue(tnsStorage["tADe"]) : setLocalStorage(tnsStorage, "tADe", whichProperty("animationDelay"), localStorageAccess), TRANSITIONEND = tnsStorage["tTE"] ? checkStorageValue(tnsStorage["tTE"]) : setLocalStorage(tnsStorage, "tTE", getEndProperty(TRANSITIONDURATION, "Transition"), localStorageAccess), ANIMATIONEND = tnsStorage["tAE"] ? checkStorageValue(tnsStorage["tAE"]) : setLocalStorage(tnsStorage, "tAE", getEndProperty(ANIMATIONDURATION, "Animation"), localStorageAccess);
    var supportConsoleWarn = win3.console && typeof win3.console.warn === "function", tnsList = ["container", "controlsContainer", "prevButton", "nextButton", "navContainer", "autoplayButton"], optionsElements = {};
    tnsList.forEach(function(item) {
      if (typeof options2[item] === "string") {
        var str = options2[item], el = doc.querySelector(str);
        optionsElements[item] = str;
        if (el && el.nodeName) {
          options2[item] = el;
        } else {
          if (supportConsoleWarn) {
            console.warn("Can't find", options2[item]);
          }
          return;
        }
      }
    });
    if (options2.container.children.length < 1) {
      if (supportConsoleWarn) {
        console.warn("No slides found in", options2.container);
      }
      return;
    }
    var responsive = options2.responsive, nested = options2.nested, carousel = options2.mode === "carousel" ? true : false;
    if (responsive) {
      if (0 in responsive) {
        options2 = extend(options2, responsive[0]);
        delete responsive[0];
      }
      var responsiveTem = {};
      for (var key in responsive) {
        var val = responsive[key];
        val = typeof val === "number" ? {items: val} : val;
        responsiveTem[key] = val;
      }
      responsive = responsiveTem;
      responsiveTem = null;
    }
    function updateOptions(obj) {
      for (var key2 in obj) {
        if (!carousel) {
          if (key2 === "slideBy") {
            obj[key2] = "page";
          }
          if (key2 === "edgePadding") {
            obj[key2] = false;
          }
          if (key2 === "autoHeight") {
            obj[key2] = false;
          }
        }
        if (key2 === "responsive") {
          updateOptions(obj[key2]);
        }
      }
    }
    if (!carousel) {
      updateOptions(options2);
    }
    if (!carousel) {
      options2.axis = "horizontal";
      options2.slideBy = "page";
      options2.edgePadding = false;
      var animateIn = options2.animateIn, animateOut = options2.animateOut, animateDelay = options2.animateDelay, animateNormal = options2.animateNormal;
    }
    var horizontal = options2.axis === "horizontal" ? true : false, outerWrapper = doc.createElement("div"), innerWrapper = doc.createElement("div"), middleWrapper, container = options2.container, containerParent = container.parentNode, containerHTML = container.outerHTML, slideItems = container.children, slideCount = slideItems.length, breakpointZone, windowWidth = getWindowWidth(), isOn = false;
    if (responsive) {
      setBreakpointZone();
    }
    if (carousel) {
      container.className += " tns-vpfix";
    }
    var autoWidth = options2.autoWidth, fixedWidth = getOption("fixedWidth"), edgePadding = getOption("edgePadding"), gutter = getOption("gutter"), viewport = getViewportWidth(), center = getOption("center"), items = !autoWidth ? Math.floor(getOption("items")) : 1, slideBy = getOption("slideBy"), viewportMax = options2.viewportMax || options2.fixedWidthViewportWidth, arrowKeys = getOption("arrowKeys"), speed = getOption("speed"), rewind = options2.rewind, loop = rewind ? false : options2.loop, autoHeight = getOption("autoHeight"), controls = getOption("controls"), controlsText = getOption("controlsText"), nav = getOption("nav"), touch = getOption("touch"), mouseDrag = getOption("mouseDrag"), autoplay = getOption("autoplay"), autoplayTimeout = getOption("autoplayTimeout"), autoplayText = getOption("autoplayText"), autoplayHoverPause = getOption("autoplayHoverPause"), autoplayResetOnVisibility = getOption("autoplayResetOnVisibility"), sheet = createStyleSheet(null, getOption("nonce")), lazyload = options2.lazyload, lazyloadSelector = options2.lazyloadSelector, slidePositions, slideItemsOut = [], cloneCount = loop ? getCloneCountForLoop() : 0, slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2, hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false, rightBoundary = fixedWidth ? getRightBoundary() : null, updateIndexBeforeTransform = !carousel || !loop ? true : false, transformAttr = horizontal ? "left" : "top", transformPrefix = "", transformPostfix = "", getIndexMax = function() {
      if (fixedWidth) {
        return function() {
          return center && !loop ? slideCount - 1 : Math.ceil(-rightBoundary / (fixedWidth + gutter));
        };
      } else if (autoWidth) {
        return function() {
          for (var i = 0; i < slideCountNew; i++) {
            if (slidePositions[i] >= -rightBoundary) {
              return i;
            }
          }
        };
      } else {
        return function() {
          if (center && carousel && !loop) {
            return slideCount - 1;
          } else {
            return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1;
          }
        };
      }
    }(), index = getStartIndex(getOption("startIndex")), indexCached = index, displayIndex = getCurrentSlide(), indexMin = 0, indexMax = !autoWidth ? getIndexMax() : null, resizeTimer, preventActionWhenRunning = options2.preventActionWhenRunning, swipeAngle = options2.swipeAngle, moveDirectionExpected = swipeAngle ? "?" : true, running = false, onInit = options2.onInit, events2 = new Events(), newContainerClasses = " tns-slider tns-" + options2.mode, slideId = container.id || getSlideId(), disable = getOption("disable"), disabled = false, freezable = options2.freezable, freeze = freezable && !autoWidth ? getFreeze() : false, frozen = false, controlsEvents = {
      click: onControlsClick,
      keydown: onControlsKeydown
    }, navEvents = {
      click: onNavClick,
      keydown: onNavKeydown
    }, hoverEvents = {
      mouseover: mouseoverPause,
      mouseout: mouseoutRestart
    }, visibilityEvent = {visibilitychange: onVisibilityChange}, docmentKeydownEvent = {keydown: onDocumentKeydown}, touchEvents = {
      touchstart: onPanStart,
      touchmove: onPanMove,
      touchend: onPanEnd,
      touchcancel: onPanEnd
    }, dragEvents = {
      mousedown: onPanStart,
      mousemove: onPanMove,
      mouseup: onPanEnd,
      mouseleave: onPanEnd
    }, hasControls = hasOption("controls"), hasNav = hasOption("nav"), navAsThumbnails = autoWidth ? true : options2.navAsThumbnails, hasAutoplay = hasOption("autoplay"), hasTouch = hasOption("touch"), hasMouseDrag = hasOption("mouseDrag"), slideActiveClass = "tns-slide-active", slideClonedClass = "tns-slide-cloned", imgCompleteClass = "tns-complete", imgEvents = {
      load: onImgLoaded,
      error: onImgFailed
    }, imgsComplete, liveregionCurrent, preventScroll = options2.preventScrollOnTouch === "force" ? true : false;
    if (hasControls) {
      var controlsContainer = options2.controlsContainer, controlsContainerHTML = options2.controlsContainer ? options2.controlsContainer.outerHTML : "", prevButton = options2.prevButton, nextButton = options2.nextButton, prevButtonHTML = options2.prevButton ? options2.prevButton.outerHTML : "", nextButtonHTML = options2.nextButton ? options2.nextButton.outerHTML : "", prevIsButton, nextIsButton;
    }
    if (hasNav) {
      var navContainer = options2.navContainer, navContainerHTML = options2.navContainer ? options2.navContainer.outerHTML : "", navItems, pages = autoWidth ? slideCount : getPages(), pagesCached = 0, navClicked = -1, navCurrentIndex = getCurrentNavIndex(), navCurrentIndexCached = navCurrentIndex, navActiveClass = "tns-nav-active", navStr = "Carousel Page ", navStrCurrent = " (Current Slide)";
    }
    if (hasAutoplay) {
      var autoplayDirection = options2.autoplayDirection === "forward" ? 1 : -1, autoplayButton = options2.autoplayButton, autoplayButtonHTML = options2.autoplayButton ? options2.autoplayButton.outerHTML : "", autoplayHtmlStrings = ["<span class='tns-visually-hidden'>", " animation</span>"], autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused;
    }
    if (hasTouch || hasMouseDrag) {
      var initPosition = {}, lastPosition = {}, translateInit, disX, disY, panStart = false, rafIndex, getDist = horizontal ? function(a, b) {
        return a.x - b.x;
      } : function(a, b) {
        return a.y - b.y;
      };
    }
    if (!autoWidth) {
      resetVariblesWhenDisable(disable || freeze);
    }
    if (TRANSFORM) {
      transformAttr = TRANSFORM;
      transformPrefix = "translate";
      if (HAS3DTRANSFORMS) {
        transformPrefix += horizontal ? "3d(" : "3d(0px, ";
        transformPostfix = horizontal ? ", 0px, 0px)" : ", 0px)";
      } else {
        transformPrefix += horizontal ? "X(" : "Y(";
        transformPostfix = ")";
      }
    }
    if (carousel) {
      container.className = container.className.replace("tns-vpfix", "");
    }
    initStructure();
    initSheet();
    initSliderTransform();
    function resetVariblesWhenDisable(condition) {
      if (condition) {
        controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
      }
    }
    function getCurrentSlide() {
      var tem = carousel ? index - cloneCount : index;
      while (tem < 0) {
        tem += slideCount;
      }
      return tem % slideCount + 1;
    }
    function getStartIndex(ind) {
      ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0;
      return carousel ? ind + cloneCount : ind;
    }
    function getAbsIndex(i) {
      if (i == null) {
        i = index;
      }
      if (carousel) {
        i -= cloneCount;
      }
      while (i < 0) {
        i += slideCount;
      }
      return Math.floor(i % slideCount);
    }
    function getCurrentNavIndex() {
      var absIndex = getAbsIndex(), result;
      result = navAsThumbnails ? absIndex : fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) : Math.floor(absIndex / items);
      if (!loop && carousel && index === indexMax) {
        result = pages - 1;
      }
      return result;
    }
    function getItemsMax() {
      if (autoWidth || fixedWidth && !viewportMax) {
        return slideCount - 1;
      } else {
        var str = fixedWidth ? "fixedWidth" : "items", arr = [];
        if (fixedWidth || options2[str] < slideCount) {
          arr.push(options2[str]);
        }
        if (responsive) {
          for (var bp in responsive) {
            var tem = responsive[bp][str];
            if (tem && (fixedWidth || tem < slideCount)) {
              arr.push(tem);
            }
          }
        }
        if (!arr.length) {
          arr.push(0);
        }
        return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
      }
    }
    function getCloneCountForLoop() {
      var itemsMax = getItemsMax(), result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : itemsMax * 4 - slideCount;
      result = Math.max(itemsMax, result);
      return hasOption("edgePadding") ? result + 1 : result;
    }
    function getWindowWidth() {
      return win3.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
    }
    function getInsertPosition(pos) {
      return pos === "top" ? "afterbegin" : "beforeend";
    }
    function getClientWidth(el) {
      if (el == null) {
        return;
      }
      var div = doc.createElement("div"), rect, width;
      el.appendChild(div);
      rect = div.getBoundingClientRect();
      width = rect.right - rect.left;
      div.remove();
      return width || getClientWidth(el.parentNode);
    }
    function getViewportWidth() {
      var gap = edgePadding ? edgePadding * 2 - gutter : 0;
      return getClientWidth(containerParent) - gap;
    }
    function hasOption(item) {
      if (options2[item]) {
        return true;
      } else {
        if (responsive) {
          for (var bp in responsive) {
            if (responsive[bp][item]) {
              return true;
            }
          }
        }
        return false;
      }
    }
    function getOption(item, ww) {
      if (ww == null) {
        ww = windowWidth;
      }
      if (item === "items" && fixedWidth) {
        return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;
      } else {
        var result = options2[item];
        if (responsive) {
          for (var bp in responsive) {
            if (ww >= parseInt(bp)) {
              if (item in responsive[bp]) {
                result = responsive[bp][item];
              }
            }
          }
        }
        if (item === "slideBy" && result === "page") {
          result = getOption("items");
        }
        if (!carousel && (item === "slideBy" || item === "items")) {
          result = Math.floor(result);
        }
        return result;
      }
    }
    function getSlideMarginLeft(i) {
      return CALC ? CALC + "(" + i * 100 + "% / " + slideCountNew + ")" : i * 100 / slideCountNew + "%";
    }
    function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
      var str = "";
      if (edgePaddingTem !== void 0) {
        var gap = edgePaddingTem;
        if (gutterTem) {
          gap -= gutterTem;
        }
        str = horizontal ? "margin: 0 " + gap + "px 0 " + edgePaddingTem + "px;" : "margin: " + edgePaddingTem + "px 0 " + gap + "px 0;";
      } else if (gutterTem && !fixedWidthTem) {
        var gutterTemUnit = "-" + gutterTem + "px", dir = horizontal ? gutterTemUnit + " 0 0" : "0 " + gutterTemUnit + " 0";
        str = "margin: 0 " + dir + ";";
      }
      if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) {
        str += getTransitionDurationStyle(speedTem);
      }
      return str;
    }
    function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) {
      if (fixedWidthTem) {
        return (fixedWidthTem + gutterTem) * slideCountNew + "px";
      } else {
        return CALC ? CALC + "(" + slideCountNew * 100 + "% / " + itemsTem + ")" : slideCountNew * 100 / itemsTem + "%";
      }
    }
    function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
      var width;
      if (fixedWidthTem) {
        width = fixedWidthTem + gutterTem + "px";
      } else {
        if (!carousel) {
          itemsTem = Math.floor(itemsTem);
        }
        var dividend = carousel ? slideCountNew : itemsTem;
        width = CALC ? CALC + "(100% / " + dividend + ")" : 100 / dividend + "%";
      }
      width = "width:" + width;
      return nested !== "inner" ? width + ";" : width + " !important;";
    }
    function getSlideGutterStyle(gutterTem) {
      var str = "";
      if (gutterTem !== false) {
        var prop = horizontal ? "padding-" : "margin-", dir = horizontal ? "right" : "bottom";
        str = prop + dir + ": " + gutterTem + "px;";
      }
      return str;
    }
    function getCSSPrefix(name, num) {
      var prefix = name.substring(0, name.length - num).toLowerCase();
      if (prefix) {
        prefix = "-" + prefix + "-";
      }
      return prefix;
    }
    function getTransitionDurationStyle(speed2) {
      return getCSSPrefix(TRANSITIONDURATION, 18) + "transition-duration:" + speed2 / 1e3 + "s;";
    }
    function getAnimationDurationStyle(speed2) {
      return getCSSPrefix(ANIMATIONDURATION, 17) + "animation-duration:" + speed2 / 1e3 + "s;";
    }
    function initStructure() {
      var classOuter = "tns-outer", classInner = "tns-inner", hasGutter = hasOption("gutter");
      outerWrapper.className = classOuter;
      innerWrapper.className = classInner;
      outerWrapper.id = slideId + "-ow";
      innerWrapper.id = slideId + "-iw";
      if (container.id === "") {
        container.id = slideId;
      }
      newContainerClasses += PERCENTAGELAYOUT || autoWidth ? " tns-subpixel" : " tns-no-subpixel";
      newContainerClasses += CALC ? " tns-calc" : " tns-no-calc";
      if (autoWidth) {
        newContainerClasses += " tns-autowidth";
      }
      newContainerClasses += " tns-" + options2.axis;
      container.className += newContainerClasses;
      if (carousel) {
        middleWrapper = doc.createElement("div");
        middleWrapper.id = slideId + "-mw";
        middleWrapper.className = "tns-ovh";
        outerWrapper.appendChild(middleWrapper);
        middleWrapper.appendChild(innerWrapper);
      } else {
        outerWrapper.appendChild(innerWrapper);
      }
      if (autoHeight) {
        var wp = middleWrapper ? middleWrapper : innerWrapper;
        wp.className += " tns-ah";
      }
      containerParent.insertBefore(outerWrapper, container);
      innerWrapper.appendChild(container);
      forEach(slideItems, function(item, i) {
        addClass(item, "tns-item");
        if (!item.id) {
          item.id = slideId + "-item" + i;
        }
        if (!carousel && animateNormal) {
          addClass(item, animateNormal);
        }
        setAttrs(item, {
          "aria-hidden": "true",
          tabindex: "-1"
        });
      });
      if (cloneCount) {
        var fragmentBefore = doc.createDocumentFragment(), fragmentAfter = doc.createDocumentFragment();
        for (var j = cloneCount; j--; ) {
          var num = j % slideCount, cloneFirst = slideItems[num].cloneNode(true);
          addClass(cloneFirst, slideClonedClass);
          removeAttrs(cloneFirst, "id");
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);
          if (carousel) {
            var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
            addClass(cloneLast, slideClonedClass);
            removeAttrs(cloneLast, "id");
            fragmentBefore.appendChild(cloneLast);
          }
        }
        container.insertBefore(fragmentBefore, container.firstChild);
        container.appendChild(fragmentAfter);
        slideItems = container.children;
      }
    }
    function initSliderTransform() {
      if (hasOption("autoHeight") || autoWidth || !horizontal) {
        var imgs = container.querySelectorAll("img");
        forEach(imgs, function(img) {
          var src = img.src;
          if (!lazyload) {
            if (src && src.indexOf("data:image") < 0) {
              img.src = "";
              addEvents(img, imgEvents);
              addClass(img, "loading");
              img.src = src;
            } else {
              imgLoaded(img);
            }
          }
        });
        raf(function() {
          imgsLoadedCheck(arrayFromNodeList(imgs), function() {
            imgsComplete = true;
          });
        });
        if (hasOption("autoHeight")) {
          imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1));
        }
        lazyload ? initSliderTransformStyleCheck() : raf(function() {
          imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck);
        });
      } else {
        if (carousel) {
          doContainerTransformSilent();
        }
        initTools();
        initEvents();
      }
    }
    function initSliderTransformStyleCheck() {
      if (autoWidth && slideCount > 1) {
        var num = loop ? index : slideCount - 1;
        (function stylesApplicationCheck() {
          var left = slideItems[num].getBoundingClientRect().left;
          var right = slideItems[num - 1].getBoundingClientRect().right;
          Math.abs(left - right) <= 1 ? initSliderTransformCore() : setTimeout(function() {
            stylesApplicationCheck();
          }, 16);
        })();
      } else {
        initSliderTransformCore();
      }
    }
    function initSliderTransformCore() {
      if (!horizontal || autoWidth) {
        setSlidePositions();
        if (autoWidth) {
          rightBoundary = getRightBoundary();
          if (freezable) {
            freeze = getFreeze();
          }
          indexMax = getIndexMax();
          resetVariblesWhenDisable(disable || freeze);
        } else {
          updateContentWrapperHeight();
        }
      }
      if (carousel) {
        doContainerTransformSilent();
      }
      initTools();
      initEvents();
    }
    function initSheet() {
      if (!carousel) {
        for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
          var item = slideItems[i];
          item.style.left = (i - index) * 100 / items + "%";
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }
      if (horizontal) {
        if (PERCENTAGELAYOUT || autoWidth) {
          addCSSRule(sheet, "#" + slideId + " > .tns-item", "font-size:" + win3.getComputedStyle(slideItems[0]).fontSize + ";", getCssRulesLength(sheet));
          addCSSRule(sheet, "#" + slideId, "font-size:0;", getCssRulesLength(sheet));
        } else if (carousel) {
          forEach(slideItems, function(slide, i2) {
            slide.style.marginLeft = getSlideMarginLeft(i2);
          });
        }
      }
      if (CSSMQ) {
        if (TRANSITIONDURATION) {
          var str = middleWrapper && options2.autoHeight ? getTransitionDurationStyle(options2.speed) : "";
          addCSSRule(sheet, "#" + slideId + "-mw", str, getCssRulesLength(sheet));
        }
        str = getInnerWrapperStyles(options2.edgePadding, options2.gutter, options2.fixedWidth, options2.speed, options2.autoHeight);
        addCSSRule(sheet, "#" + slideId + "-iw", str, getCssRulesLength(sheet));
        if (carousel) {
          str = horizontal && !autoWidth ? "width:" + getContainerWidth(options2.fixedWidth, options2.gutter, options2.items) + ";" : "";
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          addCSSRule(sheet, "#" + slideId, str, getCssRulesLength(sheet));
        }
        str = horizontal && !autoWidth ? getSlideWidthStyle(options2.fixedWidth, options2.gutter, options2.items) : "";
        if (options2.gutter) {
          str += getSlideGutterStyle(options2.gutter);
        }
        if (!carousel) {
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          if (ANIMATIONDURATION) {
            str += getAnimationDurationStyle(speed);
          }
        }
        if (str) {
          addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet));
        }
      } else {
        update_carousel_transition_duration();
        innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight);
        if (carousel && horizontal && !autoWidth) {
          container.style.width = getContainerWidth(fixedWidth, gutter, items);
        }
        var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : "";
        if (gutter) {
          str += getSlideGutterStyle(gutter);
        }
        if (str) {
          addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet));
        }
      }
      if (responsive && CSSMQ) {
        for (var bp in responsive) {
          bp = parseInt(bp);
          var opts = responsive[bp], str = "", middleWrapperStr = "", innerWrapperStr = "", containerStr = "", slideStr = "", itemsBP = !autoWidth ? getOption("items", bp) : null, fixedWidthBP = getOption("fixedWidth", bp), speedBP = getOption("speed", bp), edgePaddingBP = getOption("edgePadding", bp), autoHeightBP = getOption("autoHeight", bp), gutterBP = getOption("gutter", bp);
          if (TRANSITIONDURATION && middleWrapper && getOption("autoHeight", bp) && "speed" in opts) {
            middleWrapperStr = "#" + slideId + "-mw{" + getTransitionDurationStyle(speedBP) + "}";
          }
          if ("edgePadding" in opts || "gutter" in opts) {
            innerWrapperStr = "#" + slideId + "-iw{" + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + "}";
          }
          if (carousel && horizontal && !autoWidth && ("fixedWidth" in opts || "items" in opts || fixedWidth && "gutter" in opts)) {
            containerStr = "width:" + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ";";
          }
          if (TRANSITIONDURATION && "speed" in opts) {
            containerStr += getTransitionDurationStyle(speedBP);
          }
          if (containerStr) {
            containerStr = "#" + slideId + "{" + containerStr + "}";
          }
          if ("fixedWidth" in opts || fixedWidth && "gutter" in opts || !carousel && "items" in opts) {
            slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
          }
          if ("gutter" in opts) {
            slideStr += getSlideGutterStyle(gutterBP);
          }
          if (!carousel && "speed" in opts) {
            if (TRANSITIONDURATION) {
              slideStr += getTransitionDurationStyle(speedBP);
            }
            if (ANIMATIONDURATION) {
              slideStr += getAnimationDurationStyle(speedBP);
            }
          }
          if (slideStr) {
            slideStr = "#" + slideId + " > .tns-item{" + slideStr + "}";
          }
          str = middleWrapperStr + innerWrapperStr + containerStr + slideStr;
          if (str) {
            sheet.insertRule("@media (min-width: " + bp / 16 + "em) {" + str + "}", sheet.cssRules.length);
          }
        }
      }
    }
    function initTools() {
      updateSlideStatus();
      outerWrapper.insertAdjacentHTML("afterbegin", '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + "</span>  of " + slideCount + "</div>");
      liveregionCurrent = outerWrapper.querySelector(".tns-liveregion .current");
      if (hasAutoplay) {
        var txt = autoplay ? "stop" : "start";
        if (autoplayButton) {
          setAttrs(autoplayButton, {"data-action": txt});
        } else if (options2.autoplayButtonOutput) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options2.autoplayPosition), '<button type="button" data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + "</button>");
          autoplayButton = outerWrapper.querySelector("[data-action]");
        }
        if (autoplayButton) {
          addEvents(autoplayButton, {click: toggleAutoplay});
        }
        if (autoplay) {
          startAutoplay();
          if (autoplayHoverPause) {
            addEvents(container, hoverEvents);
          }
          if (autoplayResetOnVisibility) {
            addEvents(container, visibilityEvent);
          }
        }
      }
      if (hasNav) {
        var initIndex = !carousel ? 0 : cloneCount;
        if (navContainer) {
          setAttrs(navContainer, {"aria-label": "Carousel Pagination"});
          navItems = navContainer.children;
          forEach(navItems, function(item, i2) {
            setAttrs(item, {
              "data-nav": i2,
              tabindex: "-1",
              "aria-label": navStr + (i2 + 1),
              "aria-controls": slideId
            });
          });
        } else {
          var navHtml = "", hiddenStr = navAsThumbnails ? "" : 'style="display:none"';
          for (var i = 0; i < slideCount; i++) {
            navHtml += '<button type="button" data-nav="' + i + '" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) + '"></button>';
          }
          navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + "</div>";
          outerWrapper.insertAdjacentHTML(getInsertPosition(options2.navPosition), navHtml);
          navContainer = outerWrapper.querySelector(".tns-nav");
          navItems = navContainer.children;
        }
        updateNavVisibility();
        if (TRANSITIONDURATION) {
          var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(), str = "transition: all " + speed / 1e3 + "s";
          if (prefix) {
            str = "-" + prefix + "-" + str;
          }
          addCSSRule(sheet, "[aria-controls^=" + slideId + "-item]", str, getCssRulesLength(sheet));
        }
        setAttrs(navItems[navCurrentIndex], {"aria-label": navStr + (navCurrentIndex + 1) + navStrCurrent});
        removeAttrs(navItems[navCurrentIndex], "tabindex");
        addClass(navItems[navCurrentIndex], navActiveClass);
        addEvents(navContainer, navEvents);
      }
      if (hasControls) {
        if (!controlsContainer && (!prevButton || !nextButton)) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options2.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[0] + '</button><button type="button" data-controls="next" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[1] + "</button></div>");
          controlsContainer = outerWrapper.querySelector(".tns-controls");
        }
        if (!prevButton || !nextButton) {
          prevButton = controlsContainer.children[0];
          nextButton = controlsContainer.children[1];
        }
        if (options2.controlsContainer) {
          setAttrs(controlsContainer, {
            "aria-label": "Carousel Navigation",
            tabindex: "0"
          });
        }
        if (options2.controlsContainer || options2.prevButton && options2.nextButton) {
          setAttrs([prevButton, nextButton], {
            "aria-controls": slideId,
            tabindex: "-1"
          });
        }
        if (options2.controlsContainer || options2.prevButton && options2.nextButton) {
          setAttrs(prevButton, {"data-controls": "prev"});
          setAttrs(nextButton, {"data-controls": "next"});
        }
        prevIsButton = isButton(prevButton);
        nextIsButton = isButton(nextButton);
        updateControlsStatus();
        if (controlsContainer) {
          addEvents(controlsContainer, controlsEvents);
        } else {
          addEvents(prevButton, controlsEvents);
          addEvents(nextButton, controlsEvents);
        }
      }
      disableUI();
    }
    function initEvents() {
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        addEvents(container, eve);
      }
      if (touch) {
        addEvents(container, touchEvents, options2.preventScrollOnTouch);
      }
      if (mouseDrag) {
        addEvents(container, dragEvents);
      }
      if (arrowKeys) {
        addEvents(doc, docmentKeydownEvent);
      }
      if (nested === "inner") {
        events2.on("outerResized", function() {
          resizeTasks();
          events2.emit("innerLoaded", info());
        });
      } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) {
        addEvents(win3, {resize: onResize});
      }
      if (autoHeight) {
        if (nested === "outer") {
          events2.on("innerLoaded", doAutoHeight);
        } else if (!disable) {
          doAutoHeight();
        }
      }
      doLazyLoad();
      if (disable) {
        disableSlider();
      } else if (freeze) {
        freezeSlider();
      }
      events2.on("indexChanged", additionalUpdates);
      if (nested === "inner") {
        events2.emit("innerLoaded", info());
      }
      if (typeof onInit === "function") {
        onInit(info());
      }
      isOn = true;
    }
    function destroy() {
      sheet.disabled = true;
      if (sheet.ownerNode) {
        sheet.ownerNode.remove();
      }
      removeEvents(win3, {resize: onResize});
      if (arrowKeys) {
        removeEvents(doc, docmentKeydownEvent);
      }
      if (controlsContainer) {
        removeEvents(controlsContainer, controlsEvents);
      }
      if (navContainer) {
        removeEvents(navContainer, navEvents);
      }
      removeEvents(container, hoverEvents);
      removeEvents(container, visibilityEvent);
      if (autoplayButton) {
        removeEvents(autoplayButton, {click: toggleAutoplay});
      }
      if (autoplay) {
        clearInterval(autoplayTimer);
      }
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        removeEvents(container, eve);
      }
      if (touch) {
        removeEvents(container, touchEvents);
      }
      if (mouseDrag) {
        removeEvents(container, dragEvents);
      }
      var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];
      tnsList.forEach(function(item, i) {
        var el = item === "container" ? outerWrapper : options2[item];
        if (typeof el === "object" && el) {
          var prevEl = el.previousElementSibling ? el.previousElementSibling : false, parentEl = el.parentNode;
          el.outerHTML = htmlList[i];
          options2[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild;
        }
      });
      tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = resizeTimer = swipeAngle = moveDirectionExpected = running = onInit = events2 = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = disX = disY = panStart = rafIndex = getDist = touch = mouseDrag = null;
      for (var a in this) {
        if (a !== "rebuild") {
          this[a] = null;
        }
      }
      isOn = false;
    }
    function onResize(e) {
      raf(function() {
        resizeTasks(getEvent(e));
      });
    }
    function resizeTasks(e) {
      if (!isOn) {
        return;
      }
      if (nested === "outer") {
        events2.emit("outerResized", info(e));
      }
      windowWidth = getWindowWidth();
      var bpChanged, breakpointZoneTem = breakpointZone, needContainerTransform = false;
      if (responsive) {
        setBreakpointZone();
        bpChanged = breakpointZoneTem !== breakpointZone;
        if (bpChanged) {
          events2.emit("newBreakpointStart", info(e));
        }
      }
      var indChanged, itemsChanged, itemsTem = items, disableTem = disable, freezeTem = freeze, arrowKeysTem = arrowKeys, controlsTem = controls, navTem = nav, touchTem = touch, mouseDragTem = mouseDrag, autoplayTem = autoplay, autoplayHoverPauseTem = autoplayHoverPause, autoplayResetOnVisibilityTem = autoplayResetOnVisibility, indexTem = index;
      if (bpChanged) {
        var fixedWidthTem = fixedWidth, autoHeightTem = autoHeight, controlsTextTem = controlsText, centerTem = center, autoplayTextTem = autoplayText;
        if (!CSSMQ) {
          var gutterTem = gutter, edgePaddingTem = edgePadding;
        }
      }
      arrowKeys = getOption("arrowKeys");
      controls = getOption("controls");
      nav = getOption("nav");
      touch = getOption("touch");
      center = getOption("center");
      mouseDrag = getOption("mouseDrag");
      autoplay = getOption("autoplay");
      autoplayHoverPause = getOption("autoplayHoverPause");
      autoplayResetOnVisibility = getOption("autoplayResetOnVisibility");
      if (bpChanged) {
        disable = getOption("disable");
        fixedWidth = getOption("fixedWidth");
        speed = getOption("speed");
        autoHeight = getOption("autoHeight");
        controlsText = getOption("controlsText");
        autoplayText = getOption("autoplayText");
        autoplayTimeout = getOption("autoplayTimeout");
        if (!CSSMQ) {
          edgePadding = getOption("edgePadding");
          gutter = getOption("gutter");
        }
      }
      resetVariblesWhenDisable(disable);
      viewport = getViewportWidth();
      if ((!horizontal || autoWidth) && !disable) {
        setSlidePositions();
        if (!horizontal) {
          updateContentWrapperHeight();
          needContainerTransform = true;
        }
      }
      if (fixedWidth || autoWidth) {
        rightBoundary = getRightBoundary();
        indexMax = getIndexMax();
      }
      if (bpChanged || fixedWidth) {
        items = getOption("items");
        slideBy = getOption("slideBy");
        itemsChanged = items !== itemsTem;
        if (itemsChanged) {
          if (!fixedWidth && !autoWidth) {
            indexMax = getIndexMax();
          }
          updateIndex();
        }
      }
      if (bpChanged) {
        if (disable !== disableTem) {
          if (disable) {
            disableSlider();
          } else {
            enableSlider();
          }
        }
      }
      if (freezable && (bpChanged || fixedWidth || autoWidth)) {
        freeze = getFreeze();
        if (freeze !== freezeTem) {
          if (freeze) {
            doContainerTransform(getContainerTransformValue(getStartIndex(0)));
            freezeSlider();
          } else {
            unfreezeSlider();
            needContainerTransform = true;
          }
        }
      }
      resetVariblesWhenDisable(disable || freeze);
      if (!autoplay) {
        autoplayHoverPause = autoplayResetOnVisibility = false;
      }
      if (arrowKeys !== arrowKeysTem) {
        arrowKeys ? addEvents(doc, docmentKeydownEvent) : removeEvents(doc, docmentKeydownEvent);
      }
      if (controls !== controlsTem) {
        if (controls) {
          if (controlsContainer) {
            showElement(controlsContainer);
          } else {
            if (prevButton) {
              showElement(prevButton);
            }
            if (nextButton) {
              showElement(nextButton);
            }
          }
        } else {
          if (controlsContainer) {
            hideElement(controlsContainer);
          } else {
            if (prevButton) {
              hideElement(prevButton);
            }
            if (nextButton) {
              hideElement(nextButton);
            }
          }
        }
      }
      if (nav !== navTem) {
        if (nav) {
          showElement(navContainer);
          updateNavVisibility();
        } else {
          hideElement(navContainer);
        }
      }
      if (touch !== touchTem) {
        touch ? addEvents(container, touchEvents, options2.preventScrollOnTouch) : removeEvents(container, touchEvents);
      }
      if (mouseDrag !== mouseDragTem) {
        mouseDrag ? addEvents(container, dragEvents) : removeEvents(container, dragEvents);
      }
      if (autoplay !== autoplayTem) {
        if (autoplay) {
          if (autoplayButton) {
            showElement(autoplayButton);
          }
          if (!animating && !autoplayUserPaused) {
            startAutoplay();
          }
        } else {
          if (autoplayButton) {
            hideElement(autoplayButton);
          }
          if (animating) {
            stopAutoplay();
          }
        }
      }
      if (autoplayHoverPause !== autoplayHoverPauseTem) {
        autoplayHoverPause ? addEvents(container, hoverEvents) : removeEvents(container, hoverEvents);
      }
      if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
        autoplayResetOnVisibility ? addEvents(doc, visibilityEvent) : removeEvents(doc, visibilityEvent);
      }
      if (bpChanged) {
        if (fixedWidth !== fixedWidthTem || center !== centerTem) {
          needContainerTransform = true;
        }
        if (autoHeight !== autoHeightTem) {
          if (!autoHeight) {
            innerWrapper.style.height = "";
          }
        }
        if (controls && controlsText !== controlsTextTem) {
          prevButton.innerHTML = controlsText[0];
          nextButton.innerHTML = controlsText[1];
        }
        if (autoplayButton && autoplayText !== autoplayTextTem) {
          var i = autoplay ? 1 : 0, html = autoplayButton.innerHTML, len = html.length - autoplayTextTem[i].length;
          if (html.substring(len) === autoplayTextTem[i]) {
            autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
          }
        }
      } else {
        if (center && (fixedWidth || autoWidth)) {
          needContainerTransform = true;
        }
      }
      if (itemsChanged || fixedWidth && !autoWidth) {
        pages = getPages();
        updateNavVisibility();
      }
      indChanged = index !== indexTem;
      if (indChanged) {
        events2.emit("indexChanged", info());
        needContainerTransform = true;
      } else if (itemsChanged) {
        if (!indChanged) {
          additionalUpdates();
        }
      } else if (fixedWidth || autoWidth) {
        doLazyLoad();
        updateSlideStatus();
        updateLiveRegion();
      }
      if (itemsChanged && !carousel) {
        updateGallerySlidePositions();
      }
      if (!disable && !freeze) {
        if (bpChanged && !CSSMQ) {
          if (edgePadding !== edgePaddingTem || gutter !== gutterTem) {
            innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight);
          }
          if (horizontal) {
            if (carousel) {
              container.style.width = getContainerWidth(fixedWidth, gutter, items);
            }
            var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);
            removeCSSRule(sheet, getCssRulesLength(sheet) - 1);
            addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet));
          }
        }
        if (autoHeight) {
          doAutoHeight();
        }
        if (needContainerTransform) {
          doContainerTransformSilent();
          indexCached = index;
        }
      }
      if (bpChanged) {
        events2.emit("newBreakpointEnd", info(e));
      }
    }
    function getFreeze() {
      if (!fixedWidth && !autoWidth) {
        var a = center ? items - (items - 1) / 2 : items;
        return slideCount <= a;
      }
      var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount], vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter;
      if (center) {
        vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2;
      }
      return width <= vp;
    }
    function setBreakpointZone() {
      breakpointZone = 0;
      for (var bp in responsive) {
        bp = parseInt(bp);
        if (windowWidth >= bp) {
          breakpointZone = bp;
        }
      }
    }
    var updateIndex = function() {
      return loop ? carousel ? function() {
        var leftEdge = indexMin, rightEdge = indexMax;
        leftEdge += slideBy;
        rightEdge -= slideBy;
        if (edgePadding) {
          leftEdge += 1;
          rightEdge -= 1;
        } else if (fixedWidth) {
          if ((viewport + gutter) % (fixedWidth + gutter)) {
            rightEdge -= 1;
          }
        }
        if (cloneCount) {
          if (index > rightEdge) {
            index -= slideCount;
          } else if (index < leftEdge) {
            index += slideCount;
          }
        }
      } : function() {
        if (index > indexMax) {
          while (index >= indexMin + slideCount) {
            index -= slideCount;
          }
        } else if (index < indexMin) {
          while (index <= indexMax - slideCount) {
            index += slideCount;
          }
        }
      } : function() {
        index = Math.max(indexMin, Math.min(indexMax, index));
      };
    }();
    function disableUI() {
      if (!autoplay && autoplayButton) {
        hideElement(autoplayButton);
      }
      if (!nav && navContainer) {
        hideElement(navContainer);
      }
      if (!controls) {
        if (controlsContainer) {
          hideElement(controlsContainer);
        } else {
          if (prevButton) {
            hideElement(prevButton);
          }
          if (nextButton) {
            hideElement(nextButton);
          }
        }
      }
    }
    function enableUI() {
      if (autoplay && autoplayButton) {
        showElement(autoplayButton);
      }
      if (nav && navContainer) {
        showElement(navContainer);
      }
      if (controls) {
        if (controlsContainer) {
          showElement(controlsContainer);
        } else {
          if (prevButton) {
            showElement(prevButton);
          }
          if (nextButton) {
            showElement(nextButton);
          }
        }
      }
    }
    function freezeSlider() {
      if (frozen) {
        return;
      }
      if (edgePadding) {
        innerWrapper.style.margin = "0px";
      }
      if (cloneCount) {
        var str = "tns-transparent";
        for (var i = cloneCount; i--; ) {
          if (carousel) {
            addClass(slideItems[i], str);
          }
          addClass(slideItems[slideCountNew - i - 1], str);
        }
      }
      disableUI();
      frozen = true;
    }
    function unfreezeSlider() {
      if (!frozen) {
        return;
      }
      if (edgePadding && CSSMQ) {
        innerWrapper.style.margin = "";
      }
      if (cloneCount) {
        var str = "tns-transparent";
        for (var i = cloneCount; i--; ) {
          if (carousel) {
            removeClass(slideItems[i], str);
          }
          removeClass(slideItems[slideCountNew - i - 1], str);
        }
      }
      enableUI();
      frozen = false;
    }
    function disableSlider() {
      if (disabled) {
        return;
      }
      sheet.disabled = true;
      container.className = container.className.replace(newContainerClasses.substring(1), "");
      removeAttrs(container, ["style"]);
      if (loop) {
        for (var j = cloneCount; j--; ) {
          if (carousel) {
            hideElement(slideItems[j]);
          }
          hideElement(slideItems[slideCountNew - j - 1]);
        }
      }
      if (!horizontal || !carousel) {
        removeAttrs(innerWrapper, ["style"]);
      }
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i];
          removeAttrs(item, ["style"]);
          removeClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }
      disableUI();
      disabled = true;
    }
    function enableSlider() {
      if (!disabled) {
        return;
      }
      sheet.disabled = false;
      container.className += newContainerClasses;
      doContainerTransformSilent();
      if (loop) {
        for (var j = cloneCount; j--; ) {
          if (carousel) {
            showElement(slideItems[j]);
          }
          showElement(slideItems[slideCountNew - j - 1]);
        }
      }
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i], classN = i < index + items ? animateIn : animateNormal;
          item.style.left = (i - index) * 100 / items + "%";
          addClass(item, classN);
        }
      }
      enableUI();
      disabled = false;
    }
    function updateLiveRegion() {
      var str = getLiveRegionStr();
      if (liveregionCurrent.innerHTML !== str) {
        liveregionCurrent.innerHTML = str;
      }
    }
    function getLiveRegionStr() {
      var arr = getVisibleSlideRange(), start = arr[0] + 1, end = arr[1] + 1;
      return start === end ? start + "" : start + " to " + end;
    }
    function getVisibleSlideRange(val2) {
      if (val2 == null) {
        val2 = getContainerTransformValue();
      }
      var start = index, end, rangestart, rangeend;
      if (center || edgePadding) {
        if (autoWidth || fixedWidth) {
          rangestart = -(parseFloat(val2) + edgePadding);
          rangeend = rangestart + viewport + edgePadding * 2;
        }
      } else {
        if (autoWidth) {
          rangestart = slidePositions[index];
          rangeend = rangestart + viewport;
        }
      }
      if (autoWidth) {
        slidePositions.forEach(function(point, i) {
          if (i < slideCountNew) {
            if ((center || edgePadding) && point <= rangestart + 0.5) {
              start = i;
            }
            if (rangeend - point >= 0.5) {
              end = i;
            }
          }
        });
      } else {
        if (fixedWidth) {
          var cell = fixedWidth + gutter;
          if (center || edgePadding) {
            start = Math.floor(rangestart / cell);
            end = Math.ceil(rangeend / cell - 1);
          } else {
            end = start + Math.ceil(viewport / cell) - 1;
          }
        } else {
          if (center || edgePadding) {
            var a = items - 1;
            if (center) {
              start -= a / 2;
              end = index + a / 2;
            } else {
              end = index + a;
            }
            if (edgePadding) {
              var b = edgePadding * items / viewport;
              start -= b;
              end += b;
            }
            start = Math.floor(start);
            end = Math.ceil(end);
          } else {
            end = start + items - 1;
          }
        }
        start = Math.max(start, 0);
        end = Math.min(end, slideCountNew - 1);
      }
      return [start, end];
    }
    function doLazyLoad() {
      if (lazyload && !disable) {
        var arg = getVisibleSlideRange();
        arg.push(lazyloadSelector);
        getImageArray.apply(null, arg).forEach(function(img) {
          if (!hasClass(img, imgCompleteClass)) {
            var eve = {};
            eve[TRANSITIONEND] = function(e) {
              e.stopPropagation();
            };
            addEvents(img, eve);
            addEvents(img, imgEvents);
            img.src = getAttr(img, "data-src");
            var srcset = getAttr(img, "data-srcset");
            if (srcset) {
              img.srcset = srcset;
            }
            addClass(img, "loading");
          }
        });
      }
    }
    function onImgLoaded(e) {
      imgLoaded(getTarget(e));
    }
    function onImgFailed(e) {
      imgFailed(getTarget(e));
    }
    function imgLoaded(img) {
      addClass(img, "loaded");
      imgCompleted(img);
    }
    function imgFailed(img) {
      addClass(img, "failed");
      imgCompleted(img);
    }
    function imgCompleted(img) {
      addClass(img, imgCompleteClass);
      removeClass(img, "loading");
      removeEvents(img, imgEvents);
    }
    function getImageArray(start, end, imgSelector) {
      var imgs = [];
      if (!imgSelector) {
        imgSelector = "img";
      }
      while (start <= end) {
        forEach(slideItems[start].querySelectorAll(imgSelector), function(img) {
          imgs.push(img);
        });
        start++;
      }
      return imgs;
    }
    function doAutoHeight() {
      var imgs = getImageArray.apply(null, getVisibleSlideRange());
      raf(function() {
        imgsLoadedCheck(imgs, updateInnerWrapperHeight);
      });
    }
    function imgsLoadedCheck(imgs, cb) {
      if (imgsComplete) {
        return cb();
      }
      imgs.forEach(function(img, index2) {
        if (!lazyload && img.complete) {
          imgCompleted(img);
        }
        if (hasClass(img, imgCompleteClass)) {
          imgs.splice(index2, 1);
        }
      });
      if (!imgs.length) {
        return cb();
      }
      raf(function() {
        imgsLoadedCheck(imgs, cb);
      });
    }
    function additionalUpdates() {
      doLazyLoad();
      updateSlideStatus();
      updateLiveRegion();
      updateControlsStatus();
      updateNavStatus();
    }
    function update_carousel_transition_duration() {
      if (carousel && autoHeight) {
        middleWrapper.style[TRANSITIONDURATION] = speed / 1e3 + "s";
      }
    }
    function getMaxSlideHeight(slideStart, slideRange) {
      var heights = [];
      for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) {
        heights.push(slideItems[i].offsetHeight);
      }
      return Math.max.apply(null, heights);
    }
    function updateInnerWrapperHeight() {
      var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount), wp = middleWrapper ? middleWrapper : innerWrapper;
      if (wp.style.height !== maxHeight) {
        wp.style.height = maxHeight + "px";
      }
    }
    function setSlidePositions() {
      slidePositions = [0];
      var attr = horizontal ? "left" : "top", attr2 = horizontal ? "right" : "bottom", base = slideItems[0].getBoundingClientRect()[attr];
      forEach(slideItems, function(item, i) {
        if (i) {
          slidePositions.push(item.getBoundingClientRect()[attr] - base);
        }
        if (i === slideCountNew - 1) {
          slidePositions.push(item.getBoundingClientRect()[attr2] - base);
        }
      });
    }
    function updateSlideStatus() {
      var range2 = getVisibleSlideRange(), start = range2[0], end = range2[1];
      forEach(slideItems, function(item, i) {
        if (i >= start && i <= end) {
          if (hasAttr(item, "aria-hidden")) {
            removeAttrs(item, ["aria-hidden", "tabindex"]);
            addClass(item, slideActiveClass);
          }
        } else {
          if (!hasAttr(item, "aria-hidden")) {
            setAttrs(item, {
              "aria-hidden": "true",
              tabindex: "-1"
            });
            removeClass(item, slideActiveClass);
          }
        }
      });
    }
    function updateGallerySlidePositions() {
      var l = index + Math.min(slideCount, items);
      for (var i = slideCountNew; i--; ) {
        var item = slideItems[i];
        if (i >= index && i < l) {
          addClass(item, "tns-moving");
          item.style.left = (i - index) * 100 / items + "%";
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        } else if (item.style.left) {
          item.style.left = "";
          addClass(item, animateNormal);
          removeClass(item, animateIn);
        }
        removeClass(item, animateOut);
      }
      setTimeout(function() {
        forEach(slideItems, function(el) {
          removeClass(el, "tns-moving");
        });
      }, 300);
    }
    function updateNavStatus() {
      if (nav) {
        navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex();
        navClicked = -1;
        if (navCurrentIndex !== navCurrentIndexCached) {
          var navPrev = navItems[navCurrentIndexCached], navCurrent = navItems[navCurrentIndex];
          setAttrs(navPrev, {
            tabindex: "-1",
            "aria-label": navStr + (navCurrentIndexCached + 1)
          });
          removeClass(navPrev, navActiveClass);
          setAttrs(navCurrent, {"aria-label": navStr + (navCurrentIndex + 1) + navStrCurrent});
          removeAttrs(navCurrent, "tabindex");
          addClass(navCurrent, navActiveClass);
          navCurrentIndexCached = navCurrentIndex;
        }
      }
    }
    function getLowerCaseNodeName(el) {
      return el.nodeName.toLowerCase();
    }
    function isButton(el) {
      return getLowerCaseNodeName(el) === "button";
    }
    function isAriaDisabled(el) {
      return el.getAttribute("aria-disabled") === "true";
    }
    function disEnableElement(isButton2, el, val2) {
      if (isButton2) {
        el.disabled = val2;
      } else {
        el.setAttribute("aria-disabled", val2.toString());
      }
    }
    function updateControlsStatus() {
      if (!controls || rewind || loop) {
        return;
      }
      var prevDisabled = prevIsButton ? prevButton.disabled : isAriaDisabled(prevButton), nextDisabled = nextIsButton ? nextButton.disabled : isAriaDisabled(nextButton), disablePrev = index <= indexMin ? true : false, disableNext = !rewind && index >= indexMax ? true : false;
      if (disablePrev && !prevDisabled) {
        disEnableElement(prevIsButton, prevButton, true);
      }
      if (!disablePrev && prevDisabled) {
        disEnableElement(prevIsButton, prevButton, false);
      }
      if (disableNext && !nextDisabled) {
        disEnableElement(nextIsButton, nextButton, true);
      }
      if (!disableNext && nextDisabled) {
        disEnableElement(nextIsButton, nextButton, false);
      }
    }
    function resetDuration(el, str) {
      if (TRANSITIONDURATION) {
        el.style[TRANSITIONDURATION] = str;
      }
    }
    function getSliderWidth() {
      return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew];
    }
    function getCenterGap(num) {
      if (num == null) {
        num = index;
      }
      var gap = edgePadding ? gutter : 0;
      return autoWidth ? (viewport - gap - (slidePositions[num + 1] - slidePositions[num] - gutter)) / 2 : fixedWidth ? (viewport - fixedWidth) / 2 : (items - 1) / 2;
    }
    function getRightBoundary() {
      var gap = edgePadding ? gutter : 0, result = viewport + gap - getSliderWidth();
      if (center && !loop) {
        result = fixedWidth ? -(fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() : getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1];
      }
      if (result > 0) {
        result = 0;
      }
      return result;
    }
    function getContainerTransformValue(num) {
      if (num == null) {
        num = index;
      }
      var val2;
      if (horizontal && !autoWidth) {
        if (fixedWidth) {
          val2 = -(fixedWidth + gutter) * num;
          if (center) {
            val2 += getCenterGap();
          }
        } else {
          var denominator = TRANSFORM ? slideCountNew : items;
          if (center) {
            num -= getCenterGap();
          }
          val2 = -num * 100 / denominator;
        }
      } else {
        val2 = -slidePositions[num];
        if (center && autoWidth) {
          val2 += getCenterGap();
        }
      }
      if (hasRightDeadZone) {
        val2 = Math.max(val2, rightBoundary);
      }
      val2 += horizontal && !autoWidth && !fixedWidth ? "%" : "px";
      return val2;
    }
    function doContainerTransformSilent(val2) {
      resetDuration(container, "0s");
      doContainerTransform(val2);
    }
    function doContainerTransform(val2) {
      if (val2 == null) {
        val2 = getContainerTransformValue();
      }
      container.style[transformAttr] = transformPrefix + val2 + transformPostfix;
    }
    function animateSlide(number, classOut, classIn, isOut) {
      var l = number + items;
      if (!loop) {
        l = Math.min(l, slideCountNew);
      }
      for (var i = number; i < l; i++) {
        var item = slideItems[i];
        if (!isOut) {
          item.style.left = (i - index) * 100 / items + "%";
        }
        if (animateDelay && TRANSITIONDELAY) {
          item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1e3 + "s";
        }
        removeClass(item, classOut);
        addClass(item, classIn);
        if (isOut) {
          slideItemsOut.push(item);
        }
      }
    }
    var transformCore = function() {
      return carousel ? function() {
        resetDuration(container, "");
        if (TRANSITIONDURATION || !speed) {
          doContainerTransform();
          if (!speed || !isVisible2(container)) {
            onTransitionEnd();
          }
        } else {
          jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd);
        }
        if (!horizontal) {
          updateContentWrapperHeight();
        }
      } : function() {
        slideItemsOut = [];
        var eve = {};
        eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
        removeEvents(slideItems[indexCached], eve);
        addEvents(slideItems[index], eve);
        animateSlide(indexCached, animateIn, animateOut, true);
        animateSlide(index, animateNormal, animateIn);
        if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible2(container)) {
          onTransitionEnd();
        }
      };
    }();
    function render(e, sliderMoved) {
      if (updateIndexBeforeTransform) {
        updateIndex();
      }
      if (index !== indexCached || sliderMoved) {
        events2.emit("indexChanged", info());
        events2.emit("transitionStart", info());
        if (autoHeight) {
          doAutoHeight();
        }
        if (animating && e && ["click", "keydown"].indexOf(e.type) >= 0) {
          stopAutoplay();
        }
        running = true;
        transformCore();
      }
    }
    function strTrans(str) {
      return str.toLowerCase().replace(/-/g, "");
    }
    function onTransitionEnd(event) {
      if (carousel || running) {
        events2.emit("transitionEnd", info(event));
        if (!carousel && slideItemsOut.length > 0) {
          for (var i = 0; i < slideItemsOut.length; i++) {
            var item = slideItemsOut[i];
            item.style.left = "";
            if (ANIMATIONDELAY && TRANSITIONDELAY) {
              item.style[ANIMATIONDELAY] = "";
              item.style[TRANSITIONDELAY] = "";
            }
            removeClass(item, animateOut);
            addClass(item, animateNormal);
          }
        }
        if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {
          if (!updateIndexBeforeTransform) {
            var indexTem = index;
            updateIndex();
            if (index !== indexTem) {
              events2.emit("indexChanged", info());
              doContainerTransformSilent();
            }
          }
          if (nested === "inner") {
            events2.emit("innerLoaded", info());
          }
          running = false;
          indexCached = index;
        }
      }
    }
    function goTo(targetIndex, e) {
      if (freeze) {
        return;
      }
      if (targetIndex === "prev") {
        onControlsClick(e, -1);
      } else if (targetIndex === "next") {
        onControlsClick(e, 1);
      } else {
        if (running) {
          if (preventActionWhenRunning) {
            return;
          } else {
            onTransitionEnd();
          }
        }
        var absIndex = getAbsIndex(), indexGap = 0;
        if (targetIndex === "first") {
          indexGap = -absIndex;
        } else if (targetIndex === "last") {
          indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex;
        } else {
          if (typeof targetIndex !== "number") {
            targetIndex = parseInt(targetIndex);
          }
          if (!isNaN(targetIndex)) {
            if (!e) {
              targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex));
            }
            indexGap = targetIndex - absIndex;
          }
        }
        if (!carousel && indexGap && Math.abs(indexGap) < items) {
          var factor = indexGap > 0 ? 1 : -1;
          indexGap += index + indexGap - slideCount >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1;
        }
        index += indexGap;
        if (carousel && loop) {
          if (index < indexMin) {
            index += slideCount;
          }
          if (index > indexMax) {
            index -= slideCount;
          }
        }
        if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
          render(e);
        }
      }
    }
    function onControlsClick(e, dir) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }
      var passEventObject;
      if (!dir) {
        e = getEvent(e);
        var target = getTarget(e);
        while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) {
          target = target.parentNode;
        }
        var targetIn = [prevButton, nextButton].indexOf(target);
        if (targetIn >= 0) {
          passEventObject = true;
          dir = targetIn === 0 ? -1 : 1;
        }
      }
      if (rewind) {
        if (index === indexMin && dir === -1) {
          goTo("last", e);
          return;
        } else if (index === indexMax && dir === 1) {
          goTo("first", e);
          return;
        }
      }
      if (dir) {
        index += slideBy * dir;
        if (autoWidth) {
          index = Math.floor(index);
        }
        render(passEventObject || e && e.type === "keydown" ? e : null);
      }
    }
    function onNavClick(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }
      e = getEvent(e);
      var target = getTarget(e), navIndex;
      while (target !== navContainer && !hasAttr(target, "data-nav")) {
        target = target.parentNode;
      }
      if (hasAttr(target, "data-nav")) {
        var navIndex = navClicked = Number(getAttr(target, "data-nav")), targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items, targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1);
        goTo(targetIndex, e);
        if (navCurrentIndex === navIndex) {
          if (animating) {
            stopAutoplay();
          }
          navClicked = -1;
        }
      }
    }
    function setAutoplayTimer() {
      autoplayTimer = setInterval(function() {
        onControlsClick(null, autoplayDirection);
      }, autoplayTimeout);
      animating = true;
    }
    function stopAutoplayTimer() {
      clearInterval(autoplayTimer);
      animating = false;
    }
    function updateAutoplayButton(action, txt) {
      setAttrs(autoplayButton, {"data-action": action});
      autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
    }
    function startAutoplay() {
      setAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton("stop", autoplayText[1]);
      }
    }
    function stopAutoplay() {
      stopAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton("start", autoplayText[0]);
      }
    }
    function play() {
      if (autoplay && !animating) {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }
    function pause() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      }
    }
    function toggleAutoplay() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      } else {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }
    function onVisibilityChange() {
      if (doc.hidden) {
        if (animating) {
          stopAutoplayTimer();
          autoplayVisibilityPaused = true;
        }
      } else if (autoplayVisibilityPaused) {
        setAutoplayTimer();
        autoplayVisibilityPaused = false;
      }
    }
    function mouseoverPause() {
      if (animating) {
        stopAutoplayTimer();
        autoplayHoverPaused = true;
      }
    }
    function mouseoutRestart() {
      if (autoplayHoverPaused) {
        setAutoplayTimer();
        autoplayHoverPaused = false;
      }
    }
    function onDocumentKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
      if (keyIndex >= 0) {
        onControlsClick(e, keyIndex === 0 ? -1 : 1);
      }
    }
    function onControlsKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (!prevButton.disabled) {
            onControlsClick(e, -1);
          }
        } else if (!nextButton.disabled) {
          onControlsClick(e, 1);
        }
      }
    }
    function setFocus(el) {
      el.focus();
    }
    function onNavKeydown(e) {
      e = getEvent(e);
      var curElement = doc.activeElement;
      if (!hasAttr(curElement, "data-nav")) {
        return;
      }
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode), navIndex = Number(getAttr(curElement, "data-nav"));
      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (navIndex > 0) {
            setFocus(navItems[navIndex - 1]);
          }
        } else if (keyIndex === 1) {
          if (navIndex < pages - 1) {
            setFocus(navItems[navIndex + 1]);
          }
        } else {
          navClicked = navIndex;
          goTo(navIndex, e);
        }
      }
    }
    function getEvent(e) {
      e = e || win3.event;
      return isTouchEvent(e) ? e.changedTouches[0] : e;
    }
    function getTarget(e) {
      return e.target || win3.event.srcElement;
    }
    function isTouchEvent(e) {
      return e.type.indexOf("touch") >= 0;
    }
    function preventDefaultBehavior(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }
    function getMoveDirectionExpected() {
      return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options2.axis;
    }
    function onPanStart(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }
      if (autoplay && animating) {
        stopAutoplayTimer();
      }
      panStart = true;
      if (rafIndex) {
        caf(rafIndex);
        rafIndex = null;
      }
      var $ = getEvent(e);
      events2.emit(isTouchEvent(e) ? "touchStart" : "dragStart", info(e));
      if (!isTouchEvent(e) && ["img", "a"].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
        preventDefaultBehavior(e);
      }
      lastPosition.x = initPosition.x = $.clientX;
      lastPosition.y = initPosition.y = $.clientY;
      if (carousel) {
        translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, ""));
        resetDuration(container, "0s");
      }
    }
    function onPanMove(e) {
      if (panStart) {
        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;
        if (carousel) {
          if (!rafIndex) {
            rafIndex = raf(function() {
              panUpdate(e);
            });
          }
        } else {
          if (moveDirectionExpected === "?") {
            moveDirectionExpected = getMoveDirectionExpected();
          }
          if (moveDirectionExpected) {
            preventScroll = true;
          }
        }
        if ((typeof e.cancelable !== "boolean" || e.cancelable) && preventScroll) {
          e.preventDefault();
        }
      }
    }
    function panUpdate(e) {
      if (!moveDirectionExpected) {
        panStart = false;
        return;
      }
      caf(rafIndex);
      if (panStart) {
        rafIndex = raf(function() {
          panUpdate(e);
        });
      }
      if (moveDirectionExpected === "?") {
        moveDirectionExpected = getMoveDirectionExpected();
      }
      if (moveDirectionExpected) {
        if (!preventScroll && isTouchEvent(e)) {
          preventScroll = true;
        }
        try {
          if (e.type) {
            events2.emit(isTouchEvent(e) ? "touchMove" : "dragMove", info(e));
          }
        } catch (err) {
        }
        var x = translateInit, dist = getDist(lastPosition, initPosition);
        if (!horizontal || fixedWidth || autoWidth) {
          x += dist;
          x += "px";
        } else {
          var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : dist * 100 / (viewport + gutter);
          x += percentageX;
          x += "%";
        }
        container.style[transformAttr] = transformPrefix + x + transformPostfix;
      }
    }
    function onPanEnd(e) {
      if (panStart) {
        if (rafIndex) {
          caf(rafIndex);
          rafIndex = null;
        }
        if (carousel) {
          resetDuration(container, "");
        }
        panStart = false;
        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;
        var dist = getDist(lastPosition, initPosition);
        if (Math.abs(dist)) {
          if (!isTouchEvent(e)) {
            var target = getTarget(e);
            addEvents(target, {click: function preventClick(e2) {
              preventDefaultBehavior(e2);
              removeEvents(target, {click: preventClick});
            }});
          }
          if (carousel) {
            rafIndex = raf(function() {
              if (horizontal && !autoWidth) {
                var indexMoved = -dist * items / (viewport + gutter);
                indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
                index += indexMoved;
              } else {
                var moved = -(translateInit + dist);
                if (moved <= 0) {
                  index = indexMin;
                } else if (moved >= slidePositions[slideCountNew - 1]) {
                  index = indexMax;
                } else {
                  var i = 0;
                  while (i < slideCountNew && moved >= slidePositions[i]) {
                    index = i;
                    if (moved > slidePositions[i] && dist < 0) {
                      index += 1;
                    }
                    i++;
                  }
                }
              }
              render(e, dist);
              events2.emit(isTouchEvent(e) ? "touchEnd" : "dragEnd", info(e));
            });
          } else {
            if (moveDirectionExpected) {
              onControlsClick(e, dist > 0 ? -1 : 1);
            }
          }
        }
      }
      if (options2.preventScrollOnTouch === "auto") {
        preventScroll = false;
      }
      if (swipeAngle) {
        moveDirectionExpected = "?";
      }
      if (autoplay && !animating) {
        setAutoplayTimer();
      }
    }
    function updateContentWrapperHeight() {
      var wp = middleWrapper ? middleWrapper : innerWrapper;
      wp.style.height = slidePositions[index + items] - slidePositions[index] + "px";
    }
    function getPages() {
      var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
      return Math.min(Math.ceil(rough), slideCount);
    }
    function updateNavVisibility() {
      if (!nav || navAsThumbnails) {
        return;
      }
      if (pages !== pagesCached) {
        var min = pagesCached, max = pages, fn = showElement;
        if (pagesCached > pages) {
          min = pages;
          max = pagesCached;
          fn = hideElement;
        }
        while (min < max) {
          fn(navItems[min]);
          min++;
        }
        pagesCached = pages;
      }
    }
    function info(e) {
      return {
        container,
        slideItems,
        navContainer,
        navItems,
        controlsContainer,
        hasControls,
        prevButton,
        nextButton,
        items,
        slideBy,
        cloneCount,
        slideCount,
        slideCountNew,
        index,
        indexCached,
        displayIndex: getCurrentSlide(),
        navCurrentIndex,
        navCurrentIndexCached,
        pages,
        pagesCached,
        sheet,
        isOn,
        event: e || {}
      };
    }
    return {
      version: "2.9.3",
      getInfo: info,
      events: events2,
      goTo,
      play,
      pause,
      isOn,
      updateSliderHeight: updateInnerWrapperHeight,
      refresh: initSliderTransform,
      destroy,
      rebuild: function() {
        return tns(extend(options2, optionsElements));
      }
    };
  };

  // src/js/app/slider.js
  class Slider {
    constructor(el) {
      this.sliderBox = el;
      this.sliderContainer = this.sliderBox.querySelector(".js-slider");
      this.sliderType = this.sliderBox.getAttribute("data-type");
      this.sliderOptionsDefault = {
        container: this.sliderContainer,
        mode: "carousel",
        items: 1,
        speed: 400,
        mouseDrag: false,
        nav: false,
        gutter: 20,
        preventScrollOnTouch: "auto"
      };
      this.sliderOptionsCustom = null;
      this.sliderOptions = null;
      this.slider = null;
      if (this.sliderType == "main") {
        this.sliderArrows = this.sliderBox.querySelector(".js-slider-arrows");
        this.sliderArrowPrev = this.sliderArrows.querySelector(".js-slider-arrow-prev");
        this.sliderArrowNext = this.sliderArrows.querySelector(".js-slider-arrow-next");
      }
      switch (this.sliderType) {
        case "main":
          this.sliderOptionsCustom = {
            controlsContainer: this.sliderArrows,
            items: 1,
            gutter: 0,
            loop: true
          };
          break;
        default:
          this.sliderOptionsCustom = {
            items: 1,
            slideBy: 1
          };
      }
      this.sliderOptions = Object.assign(this.sliderOptionsDefault, this.sliderOptionsCustom);
      this.init();
    }
    init() {
      this.initSlider();
      this.setListeners();
    }
    initSlider() {
      this.slider = tns(this.sliderOptions);
    }
    setListeners() {
    }
  }

  // src/js/app/filter.js
  const textCasesFilter = __toModule(require_textCasesFilter());
  class Filter {
    constructor(el, core) {
      if (!el) {
        return;
      }
      this.filter = el;
      this.filterButtons = this.filter.querySelectorAll(".js-filter-button");
      this.filterItems = document.querySelectorAll(".js-filter-item");
      this.core = core;
      this.scrollController = core.scrollController;
      this.init();
    }
    init() {
      this.setListeners();
      if (this.filterButtons.length && this.filterItems) {
        this.buildTextCases([...this.filterItems]);
      }
    }
    buildGrid(cases) {
      let count = 0;
      const r = [...cases].map((item, i, arr) => {
        if (item.dataset.size == void 0) {
          return;
        }
        const size = +item.dataset.size;
        count += size;
        item.dataset.viewSize = size;
        if (count == 3) {
          count = 0;
        }
        if (count > 3) {
          item.dataset.viewSize = 1;
          count = 0;
        }
        return item;
      });
      return r;
    }
    buildTextCases(allFilteredCases) {
      if (!this.filterItems) {
        return;
      }
      allFilteredCases = allFilteredCases || [...this.filterItems];
      const textCases = allFilteredCases.filter((item, i, arr) => {
        return !item.dataset.size;
      });
      let stickers = [];
      this.core.DOM.casesItems.forEach((item) => {
        if (item.classList.contains("cases-page__item--sticker")) {
          item.classList.add("is-hidden");
          stickers.push(item);
        }
      });
      let isMobile = this.core.width < 1024, newCasesArray = [], posPattern = isMobile ? 12 : 13, posPattern2 = 8, stickersOrder = 0;
      textCases.forEach((item, i, arr) => {
        item.style.removeProperty("order");
        newCasesArray.push(item);
        if (!isMobile) {
          if (i % posPattern2 == 1 || i % posPattern2 == 5) {
            let sticker = stickers[stickersOrder++];
            newCasesArray.push(sticker);
            if (i < arr.length - 1) {
              sticker = stickers[stickersOrder++];
              newCasesArray.push(sticker);
            }
          }
          if (i % posPattern2 == 4) {
            let sticker = stickers[stickersOrder++];
            newCasesArray.push(sticker);
          }
        } else {
          if (i % 2 == 0) {
            let sticker = stickers[stickersOrder++];
            newCasesArray.push(sticker);
          }
        }
      });
      newCasesArray.forEach((item, i, arr) => {
        if (!item) {
          return;
        }
        item.dataset.pos = i % posPattern;
        item.style.setProperty("order", i);
        item.dataset.attr = i % posPattern;
        item.classList.remove("is-hidden");
      });
      this.core.animationEngine.createCasesItemsArr();
    }
    setListeners() {
      this.filterButtons.forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          let filter = el.getAttribute("data-filter");
          if (filter == "all") {
            this.clearFilter();
          } else {
            this.setFilter(filter);
          }
        });
      });
    }
    clearFilterItems() {
      this.filteredItems = [];
      this.filterItems.forEach((el) => {
        el.classList.remove("is-hidden");
        this.filteredItems.push(el);
      });
      this.buildGrid(this.filteredItems);
      this.buildTextCases(this.filteredItems);
    }
    clearButtonItems() {
      this.filterButtons.forEach((el) => {
        el.classList.remove("is-active");
      });
    }
    clearFilter() {
      this.clearFilterItems();
      this.clearButtonItems();
      document.querySelector('.js-filter-button[data-filter="all"]').classList.add("is-active");
    }
    setFilter(filter) {
      this.clearFilterItems();
      this.clearButtonItems();
      document.querySelector('.js-filter-button[data-filter="' + filter + '"]').classList.add("is-active");
      this.filteredItems = [];
      this.filteredTextItems = [];
      this.filterItems.forEach((el) => {
        if (!~el.getAttribute("data-tags").indexOf(filter)) {
          el.classList.add("is-hidden");
        } else {
          this.filteredItems.push(el);
        }
      });
      this.buildGrid(this.filteredItems);
      this.buildTextCases(this.filteredItems);
      this.scrollController.updateRects(this.core.scroll, window.innerHeight);
    }
  }

  // src/js/app/popup.js
  class Popup {
    constructor(el) {
      bindAll(this);
      this.popup = document.querySelectorAll(".popup");
      this.popupClose = document.querySelectorAll(".js-popup-close");
      this.popupLink = document.querySelectorAll(".js-popup-link");
      this.init();
    }
    init() {
      this.setListeners();
    }
    setListeners() {
      this.popupLink.forEach((el) => {
        el.addEventListener("click", this.openPopupHandler);
      });
      this.popupClose.forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.closePopup();
        });
      });
    }
    removeListener(elt, eventType) {
      this.popupLink.forEach((el) => {
        if (el == elt) {
          el.removeEventListener("click", this.openPopupHandler);
        }
      });
    }
    openPopupHandler(e) {
      const el = e.currentTarget;
      e.preventDefault();
      this.openPopup(el.getAttribute("data-popup"), el);
    }
    openPopup(id, elt) {
      this.popup.forEach((el) => {
        el.classList.remove("is-open");
      });
      document.querySelector('.js-popup[data-popup="' + id + '"]').classList.add("is-open");
      if (elt.dataset.popup == "popup-unlock") {
        this.popup.forEach((item, i, arr) => {
          if (item.dataset.popup == "popup-unlock") {
            const input = item.querySelector('.js-form-input[name="email"]');
            input.focus();
          }
        });
        window.unlockUrl = elt.href;
      }
    }
    closePopup() {
      this.popup.forEach((el) => {
        el.classList.remove("is-open");
      });
    }
  }

  // src/js/app/subscribe.js
  class Subscribe {
    constructor(el) {
      bindAll(this);
      this.subscribe = document.querySelector(".js-subscribe");
      this.subscribeForm = this.subscribe.querySelector(".js-form");
      this.subscribeFormGroup = this.subscribeForm.querySelector(".js-form-group");
      this.subscribeClose = this.subscribe.querySelectorAll(".js-subscribe-close");
      this.subscribeBtn = document.querySelector(".js-subscribe-btn");
      this.subscribeBtnBox = document.querySelector(".js-subscribe-btn-box");
      this.init();
    }
    init() {
      this.setListeners();
    }
    setListeners() {
      this.subscribeBtn.addEventListener("click", this.openSubscribe);
      this.subscribeClose.forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeSubscribe();
        });
      });
      this.checkFixedBtn();
      window.addEventListener("resize", (e) => {
        this.checkFixedBtn();
      });
      document.querySelector(".wrapper").addEventListener("scroll", () => {
        this.checkFixedBtn();
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".js-subscribe, .js-subscribe-btn")) {
          this.closeSubscribe();
        }
      });
    }
    openSubscribe() {
      this.subscribe.classList.add("is-open");
    }
    closeSubscribe() {
      this.subscribe.classList.remove("is-open");
      this.subscribeForm.reset();
      this.subscribeFormGroup.classList.remove("is-error");
      this.subscribeFormGroup.classList.remove("is-success");
      this.subscribeFormGroup.querySelectorAll(".help-block.error").forEach((el) => {
        el.parentNode.removeChild(el);
      });
    }
    checkFixedBtn() {
      const btnBoxOffsetTop = this.subscribeBtnBox.offsetTop;
      if (document.querySelector(".wrapper").scrollTop > btnBoxOffsetTop) {
        this.subscribeBtn.classList.add("is-fixed");
      } else {
        this.subscribeBtn.classList.remove("is-fixed");
      }
    }
  }

  // src/js/app/utils/universalDebugger.js
  class universalDebugger {
    constructor(options2 = {}) {
      if (window.universalDebugger) {
        return console.trace("Universal debugger already inited");
      }
      bindAll(this);
      window.universalDebugger = this;
      this.options = {
        fontSize: 11,
        maxElts: 100,
        maxHeight: "40vh",
        showLineNum: true,
        ...options2
      };
      this.DOM = {
        debug: null
      };
      if (this.options.forceEnable == void 0 && getQuery().debug != 1) {
        this.disabled = true;
        return;
      }
      this.count = 0;
      this.appendStyles();
      this.createDebug();
    }
    appendStyles() {
      const stylesElt = document.createElement("style"), styles = `
				.debug {
				    position: fixed;
				    bottom: 0;
				    left: 0;
				    z-index: 100000000;
				    max-height: ${this.options.maxHeight};
				    max-width: 80vh;
				    display: flex;
				    flex-direction: column;
				    color: #fff;
				    background-color: rgb(39, 41, 45);
				    font-family: Consolas, Courier New, monospace;
				    transition: max-height .3s;
				    font-size: ${this.options.fontSize}px;
				}

				.debug__container {
				    overflow-y: auto;
				}

			    .debug__container::-webkit-scrollbar {
			        width: 5px;
			    }
			    .debug__container::-webkit-scrollbar-track {
			        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
			    }

			    .debug__container::-webkit-scrollbar-thumb {
				    background-color: darkgrey;
				    outline: 1px solid slategrey;
			    }

				.debug__row {
					padding: 5px 20px 5px 0;
					border-bottom: 1px solid rgba(127, 127, 127, 0.2);
				}
				
				.debug__row small {
					display: inline-block;
					font-size: 10px;
					color: #5a5a5a;
					text-align: right;
					width: 25px;
				}
				
				.debug__row span {
					display: inline-block;
					padding-left: 10px;
				}

				.debug__row--info {
					color: #4791ff;
				}
				
				.debug__row--err {
					background-color: #a70031;
				}

				.debug__close {
					position: absolute;
					top: 0;
					right: 0;
					width: 32px;
					height: 32px;
					padding: 0;
					border: 0;
					background-color: #46265d;
				}

				.debug__close::before,
				.debug__close::after {
					position: absolute;
					top: 15px;
					width: 14px;
					height: 1px;
					background-color: #fff;
					transition: background-color .3s, transform .3s;
					content: '';
				}

				.debug__close::before {
					left: 4px;
					transform: rotate(45deg);
				}

				.debug__close::after {
					left: 14px;
					transform: rotate(-45deg);
				}
				
				.debug.is-closed {
					max-height: 32px;
				}
				
				.debug.is-closed .debug__close::before {
					transform: rotate(-45deg);
				}

				.debug.is-closed .debug__close::after {
					transform: rotate(45deg);
				}
			`;
      stylesElt.innerHTML = styles;
      document.body.appendChild(stylesElt);
    }
    createDebug() {
      this.DOM.debug = document.createElement("div");
      this.DOM.debug.classList.add("debug");
      this.DOM.debug.appendChild(this.createCloseButton());
      this.DOM.container = document.createElement("div");
      this.DOM.container.classList.add("debug__container");
      this.DOM.debug.appendChild(this.DOM.container);
      document.body.appendChild(this.DOM.debug);
    }
    objToString(obj) {
      let str = "{ ", propsCount = 0;
      for (let p in obj) {
        if (obj[p]) {
          if (propsCount > 0) {
            str += ", ";
          }
          str += p + ":" + obj[p];
          propsCount++;
        }
      }
      return str + " }";
    }
    createRow(log) {
      const row = document.createElement("div");
      row.classList.add("debug__row");
      const num = this.options.showLineNum ? `<small>${++this.count}</small>` : "";
      row.innerHTML = num + `<span>${log}</span>`;
      return row;
    }
    prepareData(data) {
      let log = [];
      data.forEach((item, i, arr) => {
        if (typeof item == "object") {
          log.push(this.objToString(item));
        } else {
          log.push(item);
        }
      });
      return log.join(" ");
    }
    createLog(data) {
      const log = this.prepareData(data);
      const row = this.createRow(log);
      this.DOM.container.appendChild(row);
      this.DOM.container.scrollTo(0, 1e7);
      if (this.count > this.options.maxElts) {
        this.DOM.container.removeChild(this.DOM.container.firstChild);
      }
      return row;
    }
    createCloseButton() {
      const btn = document.createElement("button");
      btn.classList.add("debug__close");
      btn.addEventListener("click", (event) => {
        this.closeEvent();
      });
      return btn;
    }
    closeEvent() {
      this.DOM.debug.classList.toggle("is-closed");
    }
    log() {
      if (this.disabled) {
        return;
      }
      const row = this.createLog([...arguments]);
      row.classList.add("debug__row--log");
    }
    info() {
      if (this.disabled) {
        return;
      }
      const row = this.createLog([...arguments]);
      row.classList.add("debug__row--info");
    }
    err() {
      if (this.disabled) {
        return;
      }
      const row = this.createLog([...arguments]);
      row.classList.add("debug__row--err");
    }
  }

  // src/js/app/vh.js
  class Vh {
    constructor(el) {
      this.init();
    }
    init() {
      this.setVh();
      this.setListeners();
    }
    setListeners() {
      window.addEventListener("resize", () => {
        this.setVh();
      });
    }
    setVh() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }

  // src/js/app/ShowCookie.js
  const js_cookie2 = __toModule(require_js_cookie());
  class ShowCookie {
    constructor(container, toggleClass, closeBtn) {
      this.container = container;
      this.toggleClass = toggleClass;
      this.closeBtn = closeBtn;
      this.state = js_cookie2.default.get("cookieAccepted");
      if (!this.state) {
        this.init();
      }
    }
    init() {
      this.showCookie();
      this.closeBtn.addEventListener("click", (event) => {
        this.acceptCookie();
        this.container.classList.toggle(this.toggleClass, false);
        event.preventDefault();
      });
    }
    showCookie() {
      this.container.classList.toggle(this.toggleClass, true);
    }
    acceptCookie() {
      js_cookie2.default.set("cookieAccepted", "1", {expires: new Date(2147483647e3)});
    }
  }
  require_app();
})();
