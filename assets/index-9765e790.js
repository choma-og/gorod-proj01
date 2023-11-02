(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isObject$2(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$2(target = {}, src = {}) {
  Object.keys(src).forEach((key) => {
    if (typeof target[key] === "undefined")
      target[key] = src[key];
    else if (isObject$2(src[key]) && isObject$2(target[key]) && Object.keys(src[key]).length > 0) {
      extend$2(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend$2(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent2() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend$2(win, ssrWindow);
  return win;
}
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, "__proto__", {
    get() {
      return proto;
    },
    set(value) {
      proto.__proto__ = value;
    }
  });
}
class Dom7 extends Array {
  constructor(items) {
    if (typeof items === "number") {
      super(items);
    } else {
      super(...items || []);
      makeReactive(this);
    }
  }
}
function arrayFlat(arr = []) {
  const res = [];
  arr.forEach((el) => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1)
      uniqueArray.push(arr[i]);
  }
  return uniqueArray;
}
function qsa(selector, context) {
  if (typeof selector !== "string") {
    return [selector];
  }
  const a = [];
  const res = context.querySelectorAll(selector);
  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }
  return a;
}
function $(selector, context) {
  const window2 = getWindow();
  const document2 = getDocument();
  let arr = [];
  if (!context && selector instanceof Dom7) {
    return selector;
  }
  if (!selector) {
    return new Dom7(arr);
  }
  if (typeof selector === "string") {
    const html2 = selector.trim();
    if (html2.indexOf("<") >= 0 && html2.indexOf(">") >= 0) {
      let toCreate = "div";
      if (html2.indexOf("<li") === 0)
        toCreate = "ul";
      if (html2.indexOf("<tr") === 0)
        toCreate = "tbody";
      if (html2.indexOf("<td") === 0 || html2.indexOf("<th") === 0)
        toCreate = "tr";
      if (html2.indexOf("<tbody") === 0)
        toCreate = "table";
      if (html2.indexOf("<option") === 0)
        toCreate = "select";
      const tempParent = document2.createElement(toCreate);
      tempParent.innerHTML = html2;
      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document2);
    }
  } else if (selector.nodeType || selector === window2 || selector === document2) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7)
      return selector;
    arr = selector;
  }
  return new Dom7(arrayUnique(arr));
}
$.fn = Dom7.prototype;
function addClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.add(...classNames);
  });
  return this;
}
function removeClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.remove(...classNames);
  });
  return this;
}
function toggleClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    classNames.forEach((className) => {
      el.classList.toggle(className);
    });
  });
}
function hasClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  return arrayFilter(this, (el) => {
    return classNames.filter((className) => el.classList.contains(className)).length > 0;
  }).length > 0;
}
function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === "string") {
    if (this[0])
      return this[0].getAttribute(attrs);
    return void 0;
  }
  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      this[i].setAttribute(attrs, value);
    } else {
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }
  return this;
}
function removeAttr(attr2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr2);
  }
  return this;
}
function transform(transform2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform2;
  }
  return this;
}
function transition$1(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== "string" ? `${duration}ms` : duration;
  }
  return this;
}
function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  function handleLiveEvent(e) {
    const target = e.target;
    if (!target)
      return;
    const eventData = e.target.dom7EventData || [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    if ($(target).is(targetSelector))
      listener.apply(target, eventData);
    else {
      const parents2 = $(target).parents();
      for (let k = 0; k < parents2.length; k += 1) {
        if ($(parents2[k]).is(targetSelector))
          listener.apply(parents2[k], eventData);
      }
    }
  }
  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    listener.apply(this, eventData);
  }
  const events2 = eventType.split(" ");
  let j;
  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];
    if (!targetSelector) {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7Listeners)
          el.dom7Listeners = {};
        if (!el.dom7Listeners[event])
          el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7LiveListeners)
          el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event])
          el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }
  return this;
}
function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  const events2 = eventType.split(" ");
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;
      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }
      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];
          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }
  return this;
}
function trigger(...args) {
  const window2 = getWindow();
  const events2 = args[0].split(" ");
  const eventData = args[1];
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      if (window2.CustomEvent) {
        const evt = new window2.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }
  return this;
}
function transitionEnd$1(callback) {
  const dom = this;
  function fireCallBack(e) {
    if (e.target !== this)
      return;
    callback.call(this, e);
    dom.off("transitionend", fireCallBack);
  }
  if (callback) {
    dom.on("transitionend", fireCallBack);
  }
  return this;
}
function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetWidth + parseFloat(styles2.getPropertyValue("margin-right")) + parseFloat(styles2.getPropertyValue("margin-left"));
    }
    return this[0].offsetWidth;
  }
  return null;
}
function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetHeight + parseFloat(styles2.getPropertyValue("margin-top")) + parseFloat(styles2.getPropertyValue("margin-bottom"));
    }
    return this[0].offsetHeight;
  }
  return null;
}
function offset() {
  if (this.length > 0) {
    const window2 = getWindow();
    const document2 = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document2.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
    const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  return null;
}
function styles() {
  const window2 = getWindow();
  if (this[0])
    return window2.getComputedStyle(this[0], null);
  return {};
}
function css(props, value) {
  const window2 = getWindow();
  let i;
  if (arguments.length === 1) {
    if (typeof props === "string") {
      if (this[0])
        return window2.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }
      return this;
    }
  }
  if (arguments.length === 2 && typeof props === "string") {
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }
    return this;
  }
  return this;
}
function each(callback) {
  if (!callback)
    return this;
  this.forEach((el, index2) => {
    callback.apply(el, [el, index2]);
  });
  return this;
}
function filter(callback) {
  const result = arrayFilter(this, callback);
  return $(result);
}
function html(html2) {
  if (typeof html2 === "undefined") {
    return this[0] ? this[0].innerHTML : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html2;
  }
  return this;
}
function text(text2) {
  if (typeof text2 === "undefined") {
    return this[0] ? this[0].textContent.trim() : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text2;
  }
  return this;
}
function is(selector) {
  const window2 = getWindow();
  const document2 = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === "undefined")
    return false;
  if (typeof selector === "string") {
    if (el.matches)
      return el.matches(selector);
    if (el.webkitMatchesSelector)
      return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector)
      return el.msMatchesSelector(selector);
    compareWith = $(selector);
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  if (selector === document2) {
    return el === document2;
  }
  if (selector === window2) {
    return el === window2;
  }
  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  return false;
}
function index() {
  let child = this[0];
  let i;
  if (child) {
    i = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1)
        i += 1;
    }
    return i;
  }
  return void 0;
}
function eq(index2) {
  if (typeof index2 === "undefined")
    return this;
  const length = this.length;
  if (index2 > length - 1) {
    return $([]);
  }
  if (index2 < 0) {
    const returnIndex = length + index2;
    if (returnIndex < 0)
      return $([]);
    return $([this[returnIndex]]);
  }
  return $([this[index2]]);
}
function append(...els) {
  let newChild;
  const document2 = getDocument();
  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];
    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === "string") {
        const tempDiv = document2.createElement("div");
        tempDiv.innerHTML = newChild;
        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }
  return this;
}
function prepend(newChild) {
  const document2 = getDocument();
  let i;
  let j;
  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === "string") {
      const tempDiv = document2.createElement("div");
      tempDiv.innerHTML = newChild;
      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }
  return this;
}
function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
        return $([this[0].nextElementSibling]);
      }
      return $([]);
    }
    if (this[0].nextElementSibling)
      return $([this[0].nextElementSibling]);
    return $([]);
  }
  return $([]);
}
function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el)
    return $([]);
  while (el.nextElementSibling) {
    const next2 = el.nextElementSibling;
    if (selector) {
      if ($(next2).is(selector))
        nextEls.push(next2);
    } else
      nextEls.push(next2);
    el = next2;
  }
  return $(nextEls);
}
function prev(selector) {
  if (this.length > 0) {
    const el = this[0];
    if (selector) {
      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
        return $([el.previousElementSibling]);
      }
      return $([]);
    }
    if (el.previousElementSibling)
      return $([el.previousElementSibling]);
    return $([]);
  }
  return $([]);
}
function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el)
    return $([]);
  while (el.previousElementSibling) {
    const prev2 = el.previousElementSibling;
    if (selector) {
      if ($(prev2).is(selector))
        prevEls.push(prev2);
    } else
      prevEls.push(prev2);
    el = prev2;
  }
  return $(prevEls);
}
function parent(selector) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($(this[i].parentNode).is(selector))
          parents2.push(this[i].parentNode);
      } else {
        parents2.push(this[i].parentNode);
      }
    }
  }
  return $(parents2);
}
function parents(selector) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    let parent2 = this[i].parentNode;
    while (parent2) {
      if (selector) {
        if ($(parent2).is(selector))
          parents2.push(parent2);
      } else {
        parents2.push(parent2);
      }
      parent2 = parent2.parentNode;
    }
  }
  return $(parents2);
}
function closest(selector) {
  let closest2 = this;
  if (typeof selector === "undefined") {
    return $([]);
  }
  if (!closest2.is(selector)) {
    closest2 = closest2.parents(selector).eq(0);
  }
  return closest2;
}
function find(selector) {
  const foundElements = [];
  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);
    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }
  return $(foundElements);
}
function children(selector) {
  const children2 = [];
  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;
    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || $(childNodes[j]).is(selector)) {
        children2.push(childNodes[j]);
      }
    }
  }
  return $(children2);
}
function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode)
      this[i].parentNode.removeChild(this[i]);
  }
  return this;
}
const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition: transition$1,
  on,
  off,
  trigger,
  transitionEnd: transitionEnd$1,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach((methodName) => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e) {
    }
    try {
      delete object[key];
    } catch (e) {
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style2;
  if (window2.getComputedStyle) {
    style2 = window2.getComputedStyle(el, null);
  }
  if (!style2 && el.currentStyle) {
    style2 = el.currentStyle;
  }
  if (!style2) {
    style2 = el.style;
  }
  return style2;
}
function getTranslate(el, axis = "x") {
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m41;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[12]);
    else
      curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m42;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[13]);
    else
      curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject$1(o) {
  return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend$1(...args) {
  const to = Object(args[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate = () => {
    time = (/* @__PURE__ */ new Date()).getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          }
        });
        window2.addEventListener("testPassiveListener", null, opts);
      } catch (e) {
      }
      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return "ongesturestart" in window2;
    }()
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice({
  userAgent
} = {}) {
  const support2 = getSupport();
  const window2 = getWindow();
  const platform2 = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform2 === "Win32";
  let macos = platform2 === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad)
      ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize({
  swiper,
  on: on2,
  emit
}) {
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el)
            return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("orientationchange");
  };
  on2("init", () => {
    if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on2("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  const observers = [];
  const window2 = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: typeof options.childList === "undefined" ? true : options.childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer)
      return;
    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on2("init", init);
  on2("destroy", destroy);
}
const eventsEmitter = {
  on(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self2.eventsListeners[event])
        self2.eventsListeners[event] = [];
      self2.eventsListeners[event][method](handler);
    });
    return self2;
  },
  once(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    function onceHandler(...args) {
      self2.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler.apply(self2, args);
    }
    onceHandler.__emitterProxy = handler;
    return self2.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    if (self2.eventsAnyListeners.indexOf(handler) < 0) {
      self2.eventsAnyListeners[method](handler);
    }
    return self2;
  },
  offAny(handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsAnyListeners)
      return self2;
    const index2 = self2.eventsAnyListeners.indexOf(handler);
    if (index2 >= 0) {
      self2.eventsAnyListeners.splice(index2, 1);
    }
    return self2;
  },
  off(events2, handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    events2.split(" ").forEach((event) => {
      if (typeof handler === "undefined") {
        self2.eventsListeners[event] = [];
      } else if (self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler, index2) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self2.eventsListeners[event].splice(index2, 1);
          }
        });
      }
    });
    return self2;
  },
  emit(...args) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    let events2;
    let data;
    let context;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context = self2;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context = args[0].context || self2;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
        self2.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self2.eventsListeners && self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self2;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
  height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
  if (Number.isNaN(width))
    width = 0;
  if (Number.isNaN(height))
    height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides2 = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides2.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index2 = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  }
  swiper.virtualSize = -spaceBetween;
  if (rtl)
    slides2.css({
      marginLeft: "",
      marginBottom: "",
      marginTop: ""
    });
  else
    slides2.css({
      marginRight: "",
      marginBottom: "",
      marginTop: ""
    });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide2 = slides2.eq(i);
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide2, slidesLength, getDirectionLabel);
    }
    if (slide2.css("display") === "none")
      continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides2[i].style[getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2[0]);
      const currentTransform = slide2[0].style.transform;
      const currentWebKitTransform = slide2[0].style.webkitTransform;
      if (currentTransform) {
        slide2[0].style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide2.outerWidth(true) : slide2.outerHeight(true);
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2[0].style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
      if (slides2[i]) {
        slides2[i].style[getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides2[i]) {
      slides2[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3)
        slidePosition = 0;
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if (index2 % params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if ((index2 - Math.min(swiper.params.slidesPerGroupSkip, index2)) % swiper.params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index2 += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths)
        slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (snapGrid.length === 0)
    snapGrid = [0];
  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
    slides2.filter((_, slideIndex) => {
      if (!params.cssMode)
        return true;
      if (slideIndex === slides2.length - 1) {
        return false;
      }
      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map((snap) => {
      if (snap < 0)
        return -offsetBefore;
      if (snap > maxSnap)
        return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides: slides2,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow)
      swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.$el.removeClass(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index2) => {
    if (isVirtual) {
      return swiper.slides.filter((el) => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index2)[0];
    }
    return swiper.slides.eq(index2)[0];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || $([])).each((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index2 = swiper.activeIndex + i;
        if (index2 > swiper.slides.length && !isVirtual)
          break;
        activeSlides.push(getSlideByIndex(index2));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== "undefined") {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper.$wrapperEl.css("height", `${newHeight}px`);
}
function updateSlidesOffset() {
  const swiper = this;
  const slides2 = swiper.slides;
  for (let i = 0; i < slides2.length; i += 1) {
    slides2[i].swiperSlideOffset = swiper.isHorizontal() ? slides2[i].offsetLeft : slides2[i].offsetTop;
  }
}
function updateSlidesProgress(translate2 = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides: slides2,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides2.length === 0)
    return;
  if (typeof slides2[0].swiperSlideOffset === "undefined")
    swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl)
    offsetCenter = translate2;
  slides2.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  for (let i = 0; i < slides2.length; i += 1) {
    const slide2 = slides2[i];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides2[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i);
      slides2.eq(i).addClass(params.slideVisibleClass);
    }
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
  swiper.visibleSlides = $(swiper.visibleSlides);
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }
  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
    swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides: slides2,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides2.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;
  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides2.eq(activeIndex);
  }
  activeSlide.addClass(params.slideActiveClass);
  if (params.loop) {
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  }
  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides2.eq(0);
    nextSlide.addClass(params.slideNextClass);
  }
  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides2.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }
  if (params.loop) {
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    }
    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }
  swiper.emitSlidesClasses();
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  if (typeof activeIndex === "undefined") {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (previousRealIndex !== realIndex) {
    swiper.emit("realIndexChange");
  }
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide2 = $(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide2) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($(slide2).attr("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
const update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    $wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl)
    currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x = rtl ? -translate2 : translate2;
  } else {
    y = translate2;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else
    newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper || swiper.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
const translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex)
      dir = "next";
    else if (activeIndex < previousIndex)
      dir = "prev";
    else
      dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode)
    return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode)
    return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
const transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index2 = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index2 !== "number" && typeof index2 !== "string") {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index2}] given.`);
  }
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let slideIndex = index2;
  if (slideIndex < 0)
    slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate2 < swiper.translate && translate2 < swiper.minTranslate()) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex)
        return false;
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex)
    direction = "next";
  else if (slideIndex < activeIndex)
    direction = "prev";
  else
    direction = "reset";
  if (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate2 : -translate2;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t,
        behavior: "smooth"
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
        if (!swiper || swiper.destroyed)
          return;
        if (e.target !== this)
          return;
        swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index2 = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper = this;
  let newIndex = index2;
  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }
  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled)
    return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return swiper;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper.loopFix();
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0)
      return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0)
      prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index2 = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index2);
  const snapIndex = skip + Math.floor((index2 - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index2 += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index2 -= swiper.params.slidesPerGroup;
    }
  }
  index2 = Math.max(index2, 0);
  index2 = Math.min(index2, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index2, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  if (params.loop) {
    if (swiper.animating)
      return;
    realIndex = parseInt($(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
const slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper;
  const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides2 = $selector.children(`.${params.slideClass}`);
  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides2.length % params.slidesPerGroup;
    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $(document2.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }
      slides2 = $selector.children(`.${params.slideClass}`);
    }
  }
  if (params.slidesPerView === "auto" && !params.loopedSlides)
    params.loopedSlides = slides2.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;
  if (swiper.loopedSlides > slides2.length && swiper.params.loopedSlidesLimit) {
    swiper.loopedSlides = slides2.length;
  }
  const prependSlides = [];
  const appendSlides = [];
  slides2.each((el, index2) => {
    const slide2 = $(el);
    slide2.attr("data-swiper-slide-index", index2);
  });
  for (let i = 0; i < swiper.loopedSlides; i += 1) {
    const index2 = i - Math.floor(i / slides2.length) * slides2.length;
    appendSlides.push(slides2.eq(index2)[0]);
    prependSlides.unshift(slides2.eq(slides2.length - index2 - 1)[0]);
  }
  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}
function loopFix() {
  const swiper = this;
  swiper.emit("beforeLoopFix");
  const {
    activeIndex,
    slides: slides2,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate();
  if (activeIndex < loopedSlides) {
    newIndex = slides2.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides2.length - loopedSlides) {
    newIndex = -slides2.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides: slides2
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides2.removeAttr("data-swiper-slide-index");
}
const loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
    return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
}
const grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow())
      return null;
    if (el.assignedSlot)
      el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event) {
  const swiper = this;
  const document2 = getDocument();
  const window2 = getWindow();
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  let $targetEl = $(e.target);
  if (params.touchEventsTarget === "wrapper") {
    if (!$targetEl.closest(swiper.wrapperEl).length)
      return;
  }
  data.isTouchEvent = e.type === "touchstart";
  if (!data.isTouchEvent && "which" in e && e.which === 3)
    return;
  if (!data.isTouchEvent && "button" in e && e.button > 0)
    return;
  if (data.isTouched && data.isMoved)
    return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = event.composedPath ? event.composedPath() : event.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    $targetEl = $(eventPath[0]);
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0])
      return;
  }
  touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0)
    data.allowThresholdMove = false;
  if (e.type !== "touchstart") {
    let preventDefault = true;
    if ($targetEl.is(data.focusableElements)) {
      preventDefault = false;
      if ($targetEl[0].nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && $(document2.activeElement).is(data.focusableElements) && document2.activeElement !== $targetEl[0]) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }
  if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e);
}
function onTouchMove(event) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    return;
  }
  if (data.isTouchEvent && e.type !== "touchmove")
    return;
  const targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
  const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!$(e.target).is(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (data.isTouchEvent && document2.activeElement) {
    if (e.target === document2.activeElement && $(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e);
  }
  if (e.targetTouches && e.targetTouches.length > 1)
    return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
    return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e);
  }
  swiper.emit("sliderMove", e);
  data.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl)
    diff = -diff;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode)
    return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit("tap click", e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed)
      swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment2] !== "undefined") {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment2] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else
        swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0)
    return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e) {
  const swiper = this;
  if (!swiper.enabled)
    return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks)
      e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0)
    swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
let dummyEventAttached = false;
function dummyEventListener() {
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support: support2
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!support2.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document2[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document2[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === "touchstart" && support2.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support2.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  }
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
};
function attachEvents() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params,
    support: support2
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  if (support2.touch && !dummyEventAttached) {
    document2.addEventListener("touchstart", dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
const events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
    return;
  const breakpoint = swiper.getBreakpoint(breakpoints2, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint)
    return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend$1(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base = "window", containerEl) {
  if (!breakpoints2 || base === "container" && !containerEl)
    return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
const breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support: support2
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "pointer-events": !support2.touch
  }, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(" "));
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(" "));
  swiper.emitContainerClasses();
}
const classes = {
  addClasses,
  removeClasses
};
function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window2 = getWindow();
  let image2;
  function onReady() {
    if (callback)
      callback();
  }
  const isPicture = $(imageEl).parent("picture")[0];
  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image2 = new window2.Image();
      image2.onload = onReady;
      image2.onerror = onReady;
      if (sizes) {
        image2.sizes = sizes;
      }
      if (srcset) {
        image2.srcset = srcset;
      }
      if (src) {
        image2.src = src;
      }
    } else {
      onReady();
    }
  } else {
    onReady();
  }
}
function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find("img");
  function onReady() {
    if (typeof swiper === "undefined" || swiper === null || !swiper || swiper.destroyed)
      return;
    if (swiper.imagesLoaded !== void 0)
      swiper.imagesLoaded += 1;
    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady)
        swiper.update();
      swiper.emit("imagesReady");
    }
  }
  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
  }
}
const images = {
  loadImage,
  preloadImages
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
const checkOverflow$1 = {
  checkOverflow
};
const defaults$2 = {
  init: true,
  direction: "horizontal",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopedSlidesLimit: true,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-invisible-blank",
  slideActiveClass: "swiper-slide-active",
  slideDuplicateActiveClass: "swiper-slide-duplicate-active",
  slideVisibleClass: "swiper-slide-visible",
  slideDuplicateClass: "swiper-slide-duplicate",
  slideNextClass: "swiper-slide-next",
  slideDuplicateNextClass: "swiper-slide-duplicate-next",
  slidePrevClass: "swiper-slide-prev",
  slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
  wrapperClass: "swiper-wrapper",
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false
      };
    extend$1(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params)
      params = {};
    params = extend$1({}, params);
    if (el && !params.el)
      params.el = el;
    if (params.el && $(params.el).length > 1) {
      const swipers = [];
      $(params.el).each((containerEl) => {
        const newParams = extend$1({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend$1({}, defaults$2, allModulesParams);
    swiper.params = extend$1({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend$1({}, swiper.params);
    swiper.passedParams = extend$1({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    swiper.$ = $;
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: $(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
        const desktop = ["pointerdown", "pointermove", "pointerup"];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        isTouchEvent: void 0,
        startMoving: void 0
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  enable() {
    const swiper = this;
    if (swiper.enabled)
      return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled)
      return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed)
      return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const updates = [];
    swiper.slides.each((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper = this;
    const {
      params,
      slides: slides2,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides2[activeIndex].swiperSlideSize;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides2.length; i += 1) {
        if (slides2[i] && !breakLoop) {
          slideSize += slides2[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides2[i] && !breakLoop) {
          slideSize += slides2[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i = activeIndex + 1; i < slides2.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed)
      return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate2();
      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate)
      swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
      return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(el) {
    const swiper = this;
    if (swiper.mounted)
      return true;
    const $el = $(el || swiper.params.el);
    el = $el[0];
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $(el.shadowRoot.querySelector(getWrapperSelector()));
        res.children = (options) => $el.children(options);
        return res;
      }
      if (!$el.children) {
        return $($el).children(getWrapperSelector());
      }
      return $el.children(getWrapperSelector());
    };
    let $wrapperEl = getWrapper();
    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document2 = getDocument();
      const wrapper = document2.createElement("div");
      $wrapperEl = $(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each((slideEl) => {
        $wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
      wrongRTL: $wrapperEl.css("display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized)
      return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false)
      return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    if (swiper.params.loop) {
      swiper.loopCreate();
    }
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    }
    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    swiper.attachEvents();
    swiper.initialized = true;
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides: slides2
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr("style");
      $wrapperEl.removeAttr("style");
      if (slides2 && slides2.length) {
        slides2.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend$1(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults$2;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__)
      Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m) => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document2 = getDocument();
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];
        if (!element) {
          element = document2.createElement("div");
          element.className = checkProps[key];
          swiper.$el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
function Navigation({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };
  function getEl(el) {
    let $el;
    if (el) {
      $el = $(el);
      if (swiper.params.uniqueNavElements && typeof el === "string" && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }
    return $el;
  }
  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;
    if ($el && $el.length > 0) {
      $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
      if ($el[0] && $el[0].tagName === "BUTTON")
        $el[0].disabled = disabled;
      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
    }
  }
  function update2() {
    if (swiper.params.loop)
      return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl))
      return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);
    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on("click", onNextClick);
    }
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on("click", onPrevClick);
    }
    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
    if (!swiper.enabled) {
      if ($nextEl)
        $nextEl.addClass(params.lockClass);
      if ($prevEl)
        $prevEl.addClass(params.lockClass);
    }
  }
  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl && $nextEl.length) {
      $nextEl.off("click", onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off("click", onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }
  on2("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init();
      update2();
    }
  });
  on2("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl) {
      $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
    if ($prevEl) {
      $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
  });
  on2("click", (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;
    if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
        return;
      let isHidden;
      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });
  const enable = () => {
    swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
    init();
    update2();
  };
  const disable = () => {
    swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init,
    destroy
  });
}
const navigation_min = "";
const pagination_min = "";
const swiperBundle = "";
const style = "";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var simpleParallax_min = { exports: {} };
/*!
 * simpleParallax.min - simpleParallax is a simple JavaScript library that gives your website parallax animations on any images or videos, 
 * @date: 20-08-2020 14:0:14, 
 * @version: 5.6.2,
 * @link: https://simpleparallax.com/
 */
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(window, function() {
    return function(t) {
      var e = {};
      function n(i) {
        if (e[i])
          return e[i].exports;
        var r = e[i] = { i, l: false, exports: {} };
        return t[i].call(r.exports, r, r.exports, n), r.l = true, r.exports;
      }
      return n.m = t, n.c = e, n.d = function(t2, e2, i) {
        n.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: i });
      }, n.r = function(t2) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      }, n.t = function(t2, e2) {
        if (1 & e2 && (t2 = n(t2)), 8 & e2)
          return t2;
        if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
          return t2;
        var i = /* @__PURE__ */ Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
          for (var r in t2)
            n.d(i, r, function(e3) {
              return t2[e3];
            }.bind(null, r));
        return i;
      }, n.n = function(t2) {
        var e2 = t2 && t2.__esModule ? function() {
          return t2.default;
        } : function() {
          return t2;
        };
        return n.d(e2, "a", e2), e2;
      }, n.o = function(t2, e2) {
        return Object.prototype.hasOwnProperty.call(t2, e2);
      }, n.p = "", n(n.s = 0);
    }([function(t, e, n) {
      n.r(e), n.d(e, "default", function() {
        return x;
      });
      var i = function() {
        return Element.prototype.closest && "IntersectionObserver" in window;
      };
      function r(t2, e2) {
        for (var n2 = 0; n2 < e2.length; n2++) {
          var i2 = e2[n2];
          i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(t2, i2.key, i2);
        }
      }
      var s = new (function() {
        function t2() {
          !function(t3, e3) {
            if (!(t3 instanceof e3))
              throw new TypeError("Cannot call a class as a function");
          }(this, t2), this.positions = { top: 0, bottom: 0, height: 0 };
        }
        var e2, n2;
        return e2 = t2, (n2 = [{ key: "setViewportTop", value: function(t3) {
          return this.positions.top = t3 ? t3.scrollTop : window.pageYOffset, this.positions;
        } }, { key: "setViewportBottom", value: function() {
          return this.positions.bottom = this.positions.top + this.positions.height, this.positions;
        } }, { key: "setViewportAll", value: function(t3) {
          return this.positions.top = t3 ? t3.scrollTop : window.pageYOffset, this.positions.height = t3 ? t3.clientHeight : document.documentElement.clientHeight, this.positions.bottom = this.positions.top + this.positions.height, this.positions;
        } }]) && r(e2.prototype, n2), t2;
      }())(), o = function(t2) {
        return NodeList.prototype.isPrototypeOf(t2) || HTMLCollection.prototype.isPrototypeOf(t2) ? Array.from(t2) : "string" == typeof t2 || t2 instanceof String ? document.querySelectorAll(t2) : [t2];
      }, a = function() {
        for (var t2, e2 = "transform webkitTransform mozTransform oTransform msTransform".split(" "), n2 = 0; void 0 === t2; )
          t2 = void 0 !== document.createElement("div").style[e2[n2]] ? e2[n2] : void 0, n2 += 1;
        return t2;
      }(), l = function(t2) {
        return "img" !== t2.tagName.toLowerCase() && "picture" !== t2.tagName.toLowerCase() || !!t2 && (!!t2.complete && (void 0 === t2.naturalWidth || 0 !== t2.naturalWidth));
      };
      function u(t2) {
        return function(t3) {
          if (Array.isArray(t3))
            return c(t3);
        }(t2) || function(t3) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(t3))
            return Array.from(t3);
        }(t2) || function(t3, e2) {
          if (!t3)
            return;
          if ("string" == typeof t3)
            return c(t3, e2);
          var n2 = Object.prototype.toString.call(t3).slice(8, -1);
          "Object" === n2 && t3.constructor && (n2 = t3.constructor.name);
          if ("Map" === n2 || "Set" === n2)
            return Array.from(t3);
          if ("Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
            return c(t3, e2);
        }(t2) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function c(t2, e2) {
        (null == e2 || e2 > t2.length) && (e2 = t2.length);
        for (var n2 = 0, i2 = new Array(e2); n2 < e2; n2++)
          i2[n2] = t2[n2];
        return i2;
      }
      function h(t2, e2) {
        for (var n2 = 0; n2 < e2.length; n2++) {
          var i2 = e2[n2];
          i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(t2, i2.key, i2);
        }
      }
      var f = function() {
        function t2(e3, n3) {
          var i2 = this;
          !function(t3, e4) {
            if (!(t3 instanceof e4))
              throw new TypeError("Cannot call a class as a function");
          }(this, t2), this.element = e3, this.elementContainer = e3, this.settings = n3, this.isVisible = true, this.isInit = false, this.oldTranslateValue = -1, this.init = this.init.bind(this), this.customWrapper = this.settings.customWrapper && this.element.closest(this.settings.customWrapper) ? this.element.closest(this.settings.customWrapper) : null, l(e3) ? this.init() : this.element.addEventListener("load", function() {
            setTimeout(function() {
              i2.init(true);
            }, 50);
          });
        }
        var e2, n2;
        return e2 = t2, (n2 = [{ key: "init", value: function(t3) {
          var e3 = this;
          this.isInit || (t3 && (this.rangeMax = null), this.element.closest(".simpleParallax") || (false === this.settings.overflow && this.wrapElement(this.element), this.setTransformCSS(), this.getElementOffset(), this.intersectionObserver(), this.getTranslateValue(), this.animate(), this.settings.delay > 0 ? setTimeout(function() {
            e3.setTransitionCSS(), e3.elementContainer.classList.add("simple-parallax-initialized");
          }, 10) : this.elementContainer.classList.add("simple-parallax-initialized"), this.isInit = true));
        } }, { key: "wrapElement", value: function() {
          var t3 = this.element.closest("picture") || this.element, e3 = this.customWrapper || document.createElement("div");
          e3.classList.add("simpleParallax"), e3.style.overflow = "hidden", this.customWrapper || (t3.parentNode.insertBefore(e3, t3), e3.appendChild(t3)), this.elementContainer = e3;
        } }, { key: "unWrapElement", value: function() {
          var t3 = this.elementContainer;
          this.customWrapper ? (t3.classList.remove("simpleParallax"), t3.style.overflow = "") : t3.replaceWith.apply(t3, u(t3.childNodes));
        } }, { key: "setTransformCSS", value: function() {
          false === this.settings.overflow && (this.element.style[a] = "scale(".concat(this.settings.scale, ")")), this.element.style.willChange = "transform";
        } }, { key: "setTransitionCSS", value: function() {
          this.element.style.transition = "transform ".concat(this.settings.delay, "s ").concat(this.settings.transition);
        } }, { key: "unSetStyle", value: function() {
          this.element.style.willChange = "", this.element.style[a] = "", this.element.style.transition = "";
        } }, { key: "getElementOffset", value: function() {
          var t3 = this.elementContainer.getBoundingClientRect();
          if (this.elementHeight = t3.height, this.elementTop = t3.top + s.positions.top, this.settings.customContainer) {
            var e3 = this.settings.customContainer.getBoundingClientRect();
            this.elementTop = t3.top - e3.top + s.positions.top;
          }
          this.elementBottom = this.elementHeight + this.elementTop;
        } }, { key: "buildThresholdList", value: function() {
          for (var t3 = [], e3 = 1; e3 <= this.elementHeight; e3++) {
            var n3 = e3 / this.elementHeight;
            t3.push(n3);
          }
          return t3;
        } }, { key: "intersectionObserver", value: function() {
          var t3 = { root: null, threshold: this.buildThresholdList() };
          this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), t3), this.observer.observe(this.element);
        } }, { key: "intersectionObserverCallback", value: function(t3) {
          var e3 = this;
          t3.forEach(function(t4) {
            t4.isIntersecting ? e3.isVisible = true : e3.isVisible = false;
          });
        } }, { key: "checkIfVisible", value: function() {
          return this.elementBottom > s.positions.top && this.elementTop < s.positions.bottom;
        } }, { key: "getRangeMax", value: function() {
          var t3 = this.element.clientHeight;
          this.rangeMax = t3 * this.settings.scale - t3;
        } }, { key: "getTranslateValue", value: function() {
          var t3 = ((s.positions.bottom - this.elementTop) / ((s.positions.height + this.elementHeight) / 100)).toFixed(1);
          return t3 = Math.min(100, Math.max(0, t3)), 0 !== this.settings.maxTransition && t3 > this.settings.maxTransition && (t3 = this.settings.maxTransition), this.oldPercentage !== t3 && (this.rangeMax || this.getRangeMax(), this.translateValue = (t3 / 100 * this.rangeMax - this.rangeMax / 2).toFixed(0), this.oldTranslateValue !== this.translateValue && (this.oldPercentage = t3, this.oldTranslateValue = this.translateValue, true));
        } }, { key: "animate", value: function() {
          var t3, e3 = 0, n3 = 0;
          (this.settings.orientation.includes("left") || this.settings.orientation.includes("right")) && (n3 = "".concat(this.settings.orientation.includes("left") ? -1 * this.translateValue : this.translateValue, "px")), (this.settings.orientation.includes("up") || this.settings.orientation.includes("down")) && (e3 = "".concat(this.settings.orientation.includes("up") ? -1 * this.translateValue : this.translateValue, "px")), t3 = false === this.settings.overflow ? "translate3d(".concat(n3, ", ").concat(e3, ", 0) scale(").concat(this.settings.scale, ")") : "translate3d(".concat(n3, ", ").concat(e3, ", 0)"), this.element.style[a] = t3;
        } }]) && h(e2.prototype, n2), t2;
      }();
      function m(t2) {
        return function(t3) {
          if (Array.isArray(t3))
            return y(t3);
        }(t2) || function(t3) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(t3))
            return Array.from(t3);
        }(t2) || d(t2) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function p(t2, e2) {
        return function(t3) {
          if (Array.isArray(t3))
            return t3;
        }(t2) || function(t3, e3) {
          if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t3)))
            return;
          var n2 = [], i2 = true, r2 = false, s2 = void 0;
          try {
            for (var o2, a2 = t3[Symbol.iterator](); !(i2 = (o2 = a2.next()).done) && (n2.push(o2.value), !e3 || n2.length !== e3); i2 = true)
              ;
          } catch (t4) {
            r2 = true, s2 = t4;
          } finally {
            try {
              i2 || null == a2.return || a2.return();
            } finally {
              if (r2)
                throw s2;
            }
          }
          return n2;
        }(t2, e2) || d(t2, e2) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function d(t2, e2) {
        if (t2) {
          if ("string" == typeof t2)
            return y(t2, e2);
          var n2 = Object.prototype.toString.call(t2).slice(8, -1);
          return "Object" === n2 && t2.constructor && (n2 = t2.constructor.name), "Map" === n2 || "Set" === n2 ? Array.from(t2) : "Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2) ? y(t2, e2) : void 0;
        }
      }
      function y(t2, e2) {
        (null == e2 || e2 > t2.length) && (e2 = t2.length);
        for (var n2 = 0, i2 = new Array(e2); n2 < e2; n2++)
          i2[n2] = t2[n2];
        return i2;
      }
      function v(t2, e2) {
        for (var n2 = 0; n2 < e2.length; n2++) {
          var i2 = e2[n2];
          i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(t2, i2.key, i2);
        }
      }
      var g, b, w = false, T = [], x = function() {
        function t2(e3, n3) {
          if (function(t3, e4) {
            if (!(t3 instanceof e4))
              throw new TypeError("Cannot call a class as a function");
          }(this, t2), e3 && i()) {
            if (this.elements = o(e3), this.defaults = { delay: 0, orientation: "up", scale: 1.3, overflow: false, transition: "cubic-bezier(0,0,0,1)", customContainer: "", customWrapper: "", maxTransition: 0 }, this.settings = Object.assign(this.defaults, n3), this.settings.customContainer) {
              var r2 = p(o(this.settings.customContainer), 1);
              this.customContainer = r2[0];
            }
            this.lastPosition = -1, this.resizeIsDone = this.resizeIsDone.bind(this), this.refresh = this.refresh.bind(this), this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this), this.init();
          }
        }
        var e2, n2;
        return e2 = t2, (n2 = [{ key: "init", value: function() {
          var t3 = this;
          s.setViewportAll(this.customContainer), T = [].concat(m(this.elements.map(function(e3) {
            return new f(e3, t3.settings);
          })), m(T)), w || (this.proceedRequestAnimationFrame(), window.addEventListener("resize", this.resizeIsDone), w = true);
        } }, { key: "resizeIsDone", value: function() {
          clearTimeout(b), b = setTimeout(this.refresh, 200);
        } }, { key: "proceedRequestAnimationFrame", value: function() {
          var t3 = this;
          s.setViewportTop(this.customContainer), this.lastPosition !== s.positions.top ? (s.setViewportBottom(), T.forEach(function(e3) {
            t3.proceedElement(e3);
          }), g = window.requestAnimationFrame(this.proceedRequestAnimationFrame), this.lastPosition = s.positions.top) : g = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
        } }, { key: "proceedElement", value: function(t3) {
          (this.customContainer ? t3.checkIfVisible() : t3.isVisible) && t3.getTranslateValue() && t3.animate();
        } }, { key: "refresh", value: function() {
          s.setViewportAll(this.customContainer), T.forEach(function(t3) {
            t3.getElementOffset(), t3.getRangeMax();
          }), this.lastPosition = -1;
        } }, { key: "destroy", value: function() {
          var t3 = this, e3 = [];
          T = T.filter(function(n3) {
            return t3.elements.includes(n3.element) ? (e3.push(n3), false) : n3;
          }), e3.forEach(function(e4) {
            e4.unSetStyle(), false === t3.settings.overflow && e4.unWrapElement();
          }), T.length || (window.cancelAnimationFrame(g), window.removeEventListener("resize", this.refresh), w = false);
        } }]) && v(e2.prototype, n2), t2;
      }();
    }]).default;
  });
})(simpleParallax_min);
var simpleParallax_minExports = simpleParallax_min.exports;
const SimpleParallax = /* @__PURE__ */ getDefaultExportFromCjs(simpleParallax_minExports);
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter3, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter3 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter3 || filter3(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils.toFlatObject(error, axiosError, function filter3(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}
function removeBrackets(key) {
  return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each2(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter2(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);
  if (!utils.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each2(el, index2) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils.forEach(value, function each2(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append2(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each2(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
})();
const isStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index2) {
    let name = path[index2++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index2 >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index2);
    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};
    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils.isObject(data);
    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
const defaults$1 = defaults;
const ignoreDuplicateOf = utils.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter3, isHeaderNameFilter) {
  if (utils.isFunction(filter3)) {
    return filter3.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils.isString(value))
    return;
  if (utils.isString(filter3)) {
    return value.indexOf(filter3) !== -1;
  }
  if (utils.isRegExp(filter3)) {
    return filter3.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils.forEach(fns, function transform2(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
  AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
const cookies = platform.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove2(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove2() {
      }
    };
  }()
);
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const isURLSameOrigin = platform.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin2() {
      return true;
    };
  }()
);
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now2 = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now2;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now2;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now2 - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now2 - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    let contentType;
    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else if (!requestHeaders.getContentType(/^\s*multipart\/form-data/)) {
        requestHeaders.setContentType("multipart/form-data");
      } else if (utils.isString(contentType = requestHeaders.getContentType())) {
        requestHeaders.setContentType(contentType.replace(/^\s*(multipart\/form-data);+/, "$1"));
      }
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    if (platform.isStandardBrowserEnv) {
      const xsrfValue = isURLSameOrigin(fullPath) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({ caseless }, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const VERSION = "1.6.0";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}
utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index2 = this._listeners.indexOf(listener);
    if (index2 !== -1) {
      this._listeners.splice(index2, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
const CancelToken$1 = CancelToken;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
const HttpStatusCode$1 = HttpStatusCode;
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const axios$1 = axios;
var inputmask = { exports: {} };
/*!
 * dist/inputmask
 * https://github.com/RobinHerbots/Inputmask
 * Copyright (c) 2010 - 2023 Robin Herbots
 * Licensed under the MIT license
 * Version: 5.0.8
 */
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }("undefined" != typeof self ? self : commonjsGlobal, function() {
    return function() {
      var e = {
        8741: function(e2, t2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          var i2 = !("undefined" == typeof window || !window.document || !window.document.createElement);
          t2.default = i2;
        },
        3976: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          var n2 = i2(2839), a = {
            _maxTestPos: 500,
            placeholder: "_",
            optionalmarker: ["[", "]"],
            quantifiermarker: ["{", "}"],
            groupmarker: ["(", ")"],
            alternatormarker: "|",
            escapeChar: "\\",
            mask: null,
            regex: null,
            oncomplete: function() {
            },
            onincomplete: function() {
            },
            oncleared: function() {
            },
            repeat: 0,
            greedy: false,
            autoUnmask: false,
            removeMaskOnSubmit: false,
            clearMaskOnLostFocus: true,
            insertMode: true,
            insertModeVisual: true,
            clearIncomplete: false,
            alias: null,
            onKeyDown: function() {
            },
            onBeforeMask: null,
            onBeforePaste: function(e3, t3) {
              return "function" == typeof t3.onBeforeMask ? t3.onBeforeMask.call(this, e3, t3) : e3;
            },
            onBeforeWrite: null,
            onUnMask: null,
            showMaskOnFocus: true,
            showMaskOnHover: true,
            onKeyValidation: function() {
            },
            skipOptionalPartCharacter: " ",
            numericInput: false,
            rightAlign: false,
            undoOnEscape: true,
            radixPoint: "",
            _radixDance: false,
            groupSeparator: "",
            keepStatic: null,
            positionCaretOnTab: true,
            tabThrough: false,
            supportsInputType: ["text", "tel", "url", "password", "search"],
            ignorables: [n2.keys.Backspace, n2.keys.Tab, n2.keys.Pause, n2.keys.Escape, n2.keys.PageUp, n2.keys.PageDown, n2.keys.End, n2.keys.Home, n2.keys.ArrowLeft, n2.keys.ArrowUp, n2.keys.ArrowRight, n2.keys.ArrowDown, n2.keys.Insert, n2.keys.Delete, n2.keys.ContextMenu, n2.keys.F1, n2.keys.F2, n2.keys.F3, n2.keys.F4, n2.keys.F5, n2.keys.F6, n2.keys.F7, n2.keys.F8, n2.keys.F9, n2.keys.F10, n2.keys.F11, n2.keys.F12, n2.keys.Process, n2.keys.Unidentified, n2.keys.Shift, n2.keys.Control, n2.keys.Alt, n2.keys.Tab, n2.keys.AltGraph, n2.keys.CapsLock],
            isComplete: null,
            preValidation: null,
            postValidation: null,
            staticDefinitionSymbol: void 0,
            jitMasking: false,
            nullable: true,
            inputEventOnly: false,
            noValuePatching: false,
            positionCaretOnClick: "lvp",
            casing: null,
            inputmode: "text",
            importDataAttributes: true,
            shiftPositions: true,
            usePrototypeDefinitions: true,
            validationEventTimeOut: 3e3,
            substitutes: {}
          };
          t2.default = a;
        },
        7392: function(e2, t2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          t2.default = {
            9: {
              validator: "[0-9０-９]",
              definitionSymbol: "*"
            },
            a: {
              validator: "[A-Za-zА-яЁёÀ-ÿµ]",
              definitionSymbol: "*"
            },
            "*": {
              validator: "[0-9０-９A-Za-zА-яЁёÀ-ÿµ]"
            }
          };
        },
        253: function(e2, t2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = function(e3, t3, i2) {
            if (void 0 === i2)
              return e3.__data ? e3.__data[t3] : null;
            e3.__data = e3.__data || {}, e3.__data[t3] = i2;
          };
        },
        3776: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.Event = void 0, t2.off = function(e3, t3) {
            var i3, n3;
            f(this[0]) && e3 && (i3 = this[0].eventRegistry, n3 = this[0], e3.split(" ").forEach(function(e4) {
              var a2 = l(e4.split("."), 2);
              (function(e5, n4) {
                var a3, r2, o2 = [];
                if (e5.length > 0)
                  if (void 0 === t3)
                    for (a3 = 0, r2 = i3[e5][n4].length; a3 < r2; a3++)
                      o2.push({
                        ev: e5,
                        namespace: n4 && n4.length > 0 ? n4 : "global",
                        handler: i3[e5][n4][a3]
                      });
                  else
                    o2.push({
                      ev: e5,
                      namespace: n4 && n4.length > 0 ? n4 : "global",
                      handler: t3
                    });
                else if (n4.length > 0) {
                  for (var s2 in i3)
                    for (var l2 in i3[s2])
                      if (l2 === n4)
                        if (void 0 === t3)
                          for (a3 = 0, r2 = i3[s2][l2].length; a3 < r2; a3++)
                            o2.push({
                              ev: s2,
                              namespace: l2,
                              handler: i3[s2][l2][a3]
                            });
                        else
                          o2.push({
                            ev: s2,
                            namespace: l2,
                            handler: t3
                          });
                }
                return o2;
              })(a2[0], a2[1]).forEach(function(e5) {
                var t4 = e5.ev, a3 = e5.handler;
                !function(e6, t5, a4) {
                  if (e6 in i3 == 1)
                    if (n3.removeEventListener ? n3.removeEventListener(e6, a4, false) : n3.detachEvent && n3.detachEvent("on".concat(e6), a4), "global" === t5)
                      for (var r2 in i3[e6])
                        i3[e6][r2].splice(i3[e6][r2].indexOf(a4), 1);
                    else
                      i3[e6][t5].splice(i3[e6][t5].indexOf(a4), 1);
                }(t4, e5.namespace, a3);
              });
            }));
            return this;
          }, t2.on = function(e3, t3) {
            if (f(this[0])) {
              var i3 = this[0].eventRegistry, n3 = this[0];
              e3.split(" ").forEach(function(e4) {
                var a2 = l(e4.split("."), 2), r2 = a2[0], o2 = a2[1];
                !function(e5, a3) {
                  n3.addEventListener ? n3.addEventListener(e5, t3, false) : n3.attachEvent && n3.attachEvent("on".concat(e5), t3), i3[e5] = i3[e5] || {}, i3[e5][a3] = i3[e5][a3] || [], i3[e5][a3].push(t3);
                }(r2, void 0 === o2 ? "global" : o2);
              });
            }
            return this;
          }, t2.trigger = function(e3) {
            var t3 = arguments;
            if (f(this[0]))
              for (var i3 = this[0].eventRegistry, n3 = this[0], r2 = "string" == typeof e3 ? e3.split(" ") : [e3.type], s2 = 0; s2 < r2.length; s2++) {
                var l2 = r2[s2].split("."), c2 = l2[0], u2 = l2[1] || "global";
                if (void 0 !== document && "global" === u2) {
                  var d, p = {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: arguments[1]
                  };
                  if (document.createEvent) {
                    try {
                      if ("input" === c2)
                        p.inputType = "insertText", d = new InputEvent(c2, p);
                      else
                        d = new CustomEvent(c2, p);
                    } catch (e4) {
                      (d = document.createEvent("CustomEvent")).initCustomEvent(c2, p.bubbles, p.cancelable, p.detail);
                    }
                    e3.type && (0, a.default)(d, e3), n3.dispatchEvent(d);
                  } else
                    (d = document.createEventObject()).eventType = c2, d.detail = arguments[1], e3.type && (0, a.default)(d, e3), n3.fireEvent("on" + d.eventType, d);
                } else if (void 0 !== i3[c2]) {
                  arguments[0] = arguments[0].type ? arguments[0] : o.default.Event(arguments[0]), arguments[0].detail = arguments.slice(1);
                  var h = i3[c2];
                  ("global" === u2 ? Object.values(h).flat() : h[u2]).forEach(function(e4) {
                    return e4.apply(n3, t3);
                  });
                }
              }
            return this;
          };
          var n2, a = u(i2(600)), r = u(i2(9380)), o = u(i2(4963)), s = u(i2(8741));
          function l(e3, t3) {
            return function(e4) {
              if (Array.isArray(e4))
                return e4;
            }(e3) || function(e4, t4) {
              var i3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
              if (null != i3) {
                var n3, a2, r2, o2, s2 = [], l2 = true, c2 = false;
                try {
                  if (r2 = (i3 = i3.call(e4)).next, 0 === t4) {
                    if (Object(i3) !== i3)
                      return;
                    l2 = false;
                  } else
                    for (; !(l2 = (n3 = r2.call(i3)).done) && (s2.push(n3.value), s2.length !== t4); l2 = true)
                      ;
                } catch (e5) {
                  c2 = true, a2 = e5;
                } finally {
                  try {
                    if (!l2 && null != i3.return && (o2 = i3.return(), Object(o2) !== o2))
                      return;
                  } finally {
                    if (c2)
                      throw a2;
                  }
                }
                return s2;
              }
            }(e3, t3) || function(e4, t4) {
              if (!e4)
                return;
              if ("string" == typeof e4)
                return c(e4, t4);
              var i3 = Object.prototype.toString.call(e4).slice(8, -1);
              "Object" === i3 && e4.constructor && (i3 = e4.constructor.name);
              if ("Map" === i3 || "Set" === i3)
                return Array.from(e4);
              if ("Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3))
                return c(e4, t4);
            }(e3, t3) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function c(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var i3 = 0, n3 = new Array(t3); i3 < t3; i3++)
              n3[i3] = e3[i3];
            return n3;
          }
          function u(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          function f(e3) {
            return e3 instanceof Element;
          }
          t2.Event = n2, "function" == typeof r.default.CustomEvent ? t2.Event = n2 = r.default.CustomEvent : s.default && (t2.Event = n2 = function(e3, t3) {
            t3 = t3 || {
              bubbles: false,
              cancelable: false,
              composed: true,
              detail: void 0
            };
            var i3 = document.createEvent("CustomEvent");
            return i3.initCustomEvent(e3, t3.bubbles, t3.cancelable, t3.detail), i3;
          }, n2.prototype = r.default.Event.prototype);
        },
        600: function(e2, t2) {
          function i2(e3) {
            return i2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            }, i2(e3);
          }
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = function e3() {
            var t3, n2, a, r, o, s, l = arguments[0] || {}, c = 1, u = arguments.length, f = false;
            "boolean" == typeof l && (f = l, l = arguments[c] || {}, c++);
            "object" !== i2(l) && "function" != typeof l && (l = {});
            for (; c < u; c++)
              if (null != (t3 = arguments[c]))
                for (n2 in t3)
                  a = l[n2], l !== (r = t3[n2]) && (f && r && ("[object Object]" === Object.prototype.toString.call(r) || (o = Array.isArray(r))) ? (o ? (o = false, s = a && Array.isArray(a) ? a : []) : s = a && "[object Object]" === Object.prototype.toString.call(a) ? a : {}, l[n2] = e3(f, s, r)) : void 0 !== r && (l[n2] = r));
            return l;
          };
        },
        4963: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          var n2 = s(i2(600)), a = s(i2(9380)), r = s(i2(253)), o = i2(3776);
          function s(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          var l = a.default.document;
          function c(e3) {
            return e3 instanceof c ? e3 : this instanceof c ? void (null != e3 && e3 !== a.default && (this[0] = e3.nodeName ? e3 : void 0 !== e3[0] && e3[0].nodeName ? e3[0] : l.querySelector(e3), void 0 !== this[0] && null !== this[0] && (this[0].eventRegistry = this[0].eventRegistry || {}))) : new c(e3);
          }
          c.prototype = {
            on: o.on,
            off: o.off,
            trigger: o.trigger
          }, c.extend = n2.default, c.data = r.default, c.Event = o.Event;
          var u = c;
          t2.default = u;
        },
        9845: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.mobile = t2.iphone = t2.ie = void 0;
          var n2, a = (n2 = i2(9380)) && n2.__esModule ? n2 : {
            default: n2
          };
          var r = a.default.navigator && a.default.navigator.userAgent || "", o = r.indexOf("MSIE ") > 0 || r.indexOf("Trident/") > 0, s = navigator.userAgentData && navigator.userAgentData.mobile || a.default.navigator && a.default.navigator.maxTouchPoints || "ontouchstart" in a.default, l = /iphone/i.test(r);
          t2.iphone = l, t2.mobile = s, t2.ie = o;
        },
        7184: function(e2, t2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = function(e3) {
            return e3.replace(i2, "\\$1");
          };
          var i2 = new RegExp("(\\" + ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^"].join("|\\") + ")", "gim");
        },
        6030: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.EventHandlers = void 0;
          var n2 = i2(8711), a = i2(2839), r = i2(9845), o = i2(7215), s = i2(7760), l = i2(4713);
          function c(e3, t3) {
            var i3 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (!i3) {
              if (Array.isArray(e3) || (i3 = function(e4, t4) {
                if (!e4)
                  return;
                if ("string" == typeof e4)
                  return u(e4, t4);
                var i4 = Object.prototype.toString.call(e4).slice(8, -1);
                "Object" === i4 && e4.constructor && (i4 = e4.constructor.name);
                if ("Map" === i4 || "Set" === i4)
                  return Array.from(e4);
                if ("Arguments" === i4 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i4))
                  return u(e4, t4);
              }(e3)) || t3 && e3 && "number" == typeof e3.length) {
                i3 && (e3 = i3);
                var n3 = 0, a2 = function() {
                };
                return {
                  s: a2,
                  n: function() {
                    return n3 >= e3.length ? {
                      done: true
                    } : {
                      done: false,
                      value: e3[n3++]
                    };
                  },
                  e: function(e4) {
                    throw e4;
                  },
                  f: a2
                };
              }
              throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var r2, o2 = true, s2 = false;
            return {
              s: function() {
                i3 = i3.call(e3);
              },
              n: function() {
                var e4 = i3.next();
                return o2 = e4.done, e4;
              },
              e: function(e4) {
                s2 = true, r2 = e4;
              },
              f: function() {
                try {
                  o2 || null == i3.return || i3.return();
                } finally {
                  if (s2)
                    throw r2;
                }
              }
            };
          }
          function u(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var i3 = 0, n3 = new Array(t3); i3 < t3; i3++)
              n3[i3] = e3[i3];
            return n3;
          }
          var f = {
            keyEvent: function(e3, t3, i3, c2, u2) {
              var d = this.inputmask, p = d.opts, h = d.dependencyLib, v = d.maskset, m = this, g = h(m), y = e3.key, k = n2.caret.call(d, m), b = p.onKeyDown.call(this, e3, n2.getBuffer.call(d), k, p);
              if (void 0 !== b)
                return b;
              if (y === a.keys.Backspace || y === a.keys.Delete || r.iphone && y === a.keys.BACKSPACE_SAFARI || e3.ctrlKey && y === a.keys.x && !("oncut" in m))
                e3.preventDefault(), o.handleRemove.call(d, m, y, k), (0, s.writeBuffer)(m, n2.getBuffer.call(d, true), v.p, e3, m.inputmask._valueGet() !== n2.getBuffer.call(d).join(""));
              else if (y === a.keys.End || y === a.keys.PageDown) {
                e3.preventDefault();
                var x = n2.seekNext.call(d, n2.getLastValidPosition.call(d));
                n2.caret.call(d, m, e3.shiftKey ? k.begin : x, x, true);
              } else
                y === a.keys.Home && !e3.shiftKey || y === a.keys.PageUp ? (e3.preventDefault(), n2.caret.call(d, m, 0, e3.shiftKey ? k.begin : 0, true)) : p.undoOnEscape && y === a.keys.Escape && true !== e3.altKey ? ((0, s.checkVal)(m, true, false, d.undoValue.split("")), g.trigger("click")) : y !== a.keys.Insert || e3.shiftKey || e3.ctrlKey || void 0 !== d.userOptions.insertMode ? true === p.tabThrough && y === a.keys.Tab ? true === e3.shiftKey ? (k.end = n2.seekPrevious.call(d, k.end, true), true === l.getTest.call(d, k.end - 1).match.static && k.end--, k.begin = n2.seekPrevious.call(d, k.end, true), k.begin >= 0 && k.end > 0 && (e3.preventDefault(), n2.caret.call(d, m, k.begin, k.end))) : (k.begin = n2.seekNext.call(d, k.begin, true), k.end = n2.seekNext.call(d, k.begin, true), k.end < v.maskLength && k.end--, k.begin <= v.maskLength && (e3.preventDefault(), n2.caret.call(d, m, k.begin, k.end))) : e3.shiftKey || p.insertModeVisual && false === p.insertMode && (y === a.keys.ArrowRight ? setTimeout(function() {
                  var e4 = n2.caret.call(d, m);
                  n2.caret.call(d, m, e4.begin);
                }, 0) : y === a.keys.ArrowLeft && setTimeout(function() {
                  var e4 = n2.translatePosition.call(d, m.inputmask.caretPos.begin);
                  n2.translatePosition.call(d, m.inputmask.caretPos.end);
                  d.isRTL ? n2.caret.call(d, m, e4 + (e4 === v.maskLength ? 0 : 1)) : n2.caret.call(d, m, e4 - (0 === e4 ? 0 : 1));
                }, 0)) : o.isSelection.call(d, k) ? p.insertMode = !p.insertMode : (p.insertMode = !p.insertMode, n2.caret.call(d, m, k.begin, k.begin));
              return d.isComposing = y == a.keys.Process || y == a.keys.Unidentified, d.ignorable = p.ignorables.includes(y), f.keypressEvent.call(this, e3, t3, i3, c2, u2);
            },
            keypressEvent: function(e3, t3, i3, r2, l2) {
              var c2 = this.inputmask || this, u2 = c2.opts, f2 = c2.dependencyLib, d = c2.maskset, p = c2.el, h = f2(p), v = e3.key;
              if (true === t3 || e3.ctrlKey && e3.altKey || !(e3.ctrlKey || e3.metaKey || c2.ignorable)) {
                if (v) {
                  var m, g = t3 ? {
                    begin: l2,
                    end: l2
                  } : n2.caret.call(c2, p);
                  v = u2.substitutes[v] || v, d.writeOutBuffer = true;
                  var y = o.isValid.call(c2, g, v, r2, void 0, void 0, void 0, t3);
                  if (false !== y && (n2.resetMaskSet.call(c2, true), m = void 0 !== y.caret ? y.caret : n2.seekNext.call(c2, y.pos.begin ? y.pos.begin : y.pos), d.p = m), m = u2.numericInput && void 0 === y.caret ? n2.seekPrevious.call(c2, m) : m, false !== i3 && (setTimeout(function() {
                    u2.onKeyValidation.call(p, v, y);
                  }, 0), d.writeOutBuffer && false !== y)) {
                    var k = n2.getBuffer.call(c2);
                    (0, s.writeBuffer)(p, k, m, e3, true !== t3);
                  }
                  if (e3.preventDefault(), t3)
                    return false !== y && (y.forwardPosition = m), y;
                }
              } else
                v === a.keys.Enter && c2.undoValue !== c2._valueGet(true) && (c2.undoValue = c2._valueGet(true), setTimeout(function() {
                  h.trigger("change");
                }, 0));
            },
            pasteEvent: function(e3) {
              var t3, i3 = this.inputmask, a2 = i3.opts, r2 = i3._valueGet(true), o2 = n2.caret.call(i3, this);
              i3.isRTL && (t3 = o2.end, o2.end = n2.translatePosition.call(i3, o2.begin), o2.begin = n2.translatePosition.call(i3, t3));
              var l2 = r2.substr(0, o2.begin), u2 = r2.substr(o2.end, r2.length);
              if (l2 == (i3.isRTL ? n2.getBufferTemplate.call(i3).slice().reverse() : n2.getBufferTemplate.call(i3)).slice(0, o2.begin).join("") && (l2 = ""), u2 == (i3.isRTL ? n2.getBufferTemplate.call(i3).slice().reverse() : n2.getBufferTemplate.call(i3)).slice(o2.end).join("") && (u2 = ""), window.clipboardData && window.clipboardData.getData)
                r2 = l2 + window.clipboardData.getData("Text") + u2;
              else {
                if (!e3.clipboardData || !e3.clipboardData.getData)
                  return true;
                r2 = l2 + e3.clipboardData.getData("text/plain") + u2;
              }
              var f2 = r2;
              if (i3.isRTL) {
                f2 = f2.split("");
                var d, p = c(n2.getBufferTemplate.call(i3));
                try {
                  for (p.s(); !(d = p.n()).done; ) {
                    var h = d.value;
                    f2[0] === h && f2.shift();
                  }
                } catch (e4) {
                  p.e(e4);
                } finally {
                  p.f();
                }
                f2 = f2.join("");
              }
              if ("function" == typeof a2.onBeforePaste) {
                if (false === (f2 = a2.onBeforePaste.call(i3, f2, a2)))
                  return false;
                f2 || (f2 = r2);
              }
              (0, s.checkVal)(this, true, false, f2.toString().split(""), e3), e3.preventDefault();
            },
            inputFallBackEvent: function(e3) {
              var t3 = this.inputmask, i3 = t3.opts, o2 = t3.dependencyLib;
              var c2, u2 = this, d = u2.inputmask._valueGet(true), p = (t3.isRTL ? n2.getBuffer.call(t3).slice().reverse() : n2.getBuffer.call(t3)).join(""), h = n2.caret.call(t3, u2, void 0, void 0, true);
              if (p !== d) {
                if (c2 = function(e4, a2, r2) {
                  for (var o3, s2, c3, u3 = e4.substr(0, r2.begin).split(""), f2 = e4.substr(r2.begin).split(""), d2 = a2.substr(0, r2.begin).split(""), p2 = a2.substr(r2.begin).split(""), h2 = u3.length >= d2.length ? u3.length : d2.length, v2 = f2.length >= p2.length ? f2.length : p2.length, m = "", g = [], y = "~"; u3.length < h2; )
                    u3.push(y);
                  for (; d2.length < h2; )
                    d2.push(y);
                  for (; f2.length < v2; )
                    f2.unshift(y);
                  for (; p2.length < v2; )
                    p2.unshift(y);
                  var k = u3.concat(f2), b = d2.concat(p2);
                  for (s2 = 0, o3 = k.length; s2 < o3; s2++)
                    switch (c3 = l.getPlaceholder.call(t3, n2.translatePosition.call(t3, s2)), m) {
                      case "insertText":
                        b[s2 - 1] === k[s2] && r2.begin == k.length - 1 && g.push(k[s2]), s2 = o3;
                        break;
                      case "insertReplacementText":
                      case "deleteContentBackward":
                        k[s2] === y ? r2.end++ : s2 = o3;
                        break;
                      default:
                        k[s2] !== b[s2] && (k[s2 + 1] !== y && k[s2 + 1] !== c3 && void 0 !== k[s2 + 1] || (b[s2] !== c3 || b[s2 + 1] !== y) && b[s2] !== y ? b[s2 + 1] === y && b[s2] === k[s2 + 1] ? (m = "insertText", g.push(k[s2]), r2.begin--, r2.end--) : k[s2] !== c3 && k[s2] !== y && (k[s2 + 1] === y || b[s2] !== k[s2] && b[s2 + 1] === k[s2 + 1]) ? (m = "insertReplacementText", g.push(k[s2]), r2.begin--) : k[s2] === y ? (m = "deleteContentBackward", (n2.isMask.call(t3, n2.translatePosition.call(t3, s2), true) || b[s2] === i3.radixPoint) && r2.end++) : s2 = o3 : (m = "insertText", g.push(k[s2]), r2.begin--, r2.end--));
                    }
                  return {
                    action: m,
                    data: g,
                    caret: r2
                  };
                }(d, p, h), (u2.inputmask.shadowRoot || u2.ownerDocument).activeElement !== u2 && u2.focus(), (0, s.writeBuffer)(u2, n2.getBuffer.call(t3)), n2.caret.call(t3, u2, h.begin, h.end, true), !r.mobile && t3.skipNextInsert && "insertText" === e3.inputType && "insertText" === c2.action && t3.isComposing)
                  return false;
                switch ("insertCompositionText" === e3.inputType && "insertText" === c2.action && t3.isComposing ? t3.skipNextInsert = true : t3.skipNextInsert = false, c2.action) {
                  case "insertText":
                  case "insertReplacementText":
                    c2.data.forEach(function(e4, i4) {
                      var n3 = new o2.Event("keypress");
                      n3.key = e4, t3.ignorable = false, f.keypressEvent.call(u2, n3);
                    }), setTimeout(function() {
                      t3.$el.trigger("keyup");
                    }, 0);
                    break;
                  case "deleteContentBackward":
                    var v = new o2.Event("keydown");
                    v.key = a.keys.Backspace, f.keyEvent.call(u2, v);
                    break;
                  default:
                    (0, s.applyInputValue)(u2, d), n2.caret.call(t3, u2, h.begin, h.end, true);
                }
                e3.preventDefault();
              }
            },
            setValueEvent: function(e3) {
              var t3 = this.inputmask, i3 = this, a2 = e3 && e3.detail ? e3.detail[0] : arguments[1];
              void 0 === a2 && (a2 = i3.inputmask._valueGet(true)), (0, s.applyInputValue)(i3, a2), (e3.detail && void 0 !== e3.detail[1] || void 0 !== arguments[2]) && n2.caret.call(t3, i3, e3.detail ? e3.detail[1] : arguments[2]);
            },
            focusEvent: function(e3) {
              var t3 = this.inputmask, i3 = t3.opts, a2 = null == t3 ? void 0 : t3._valueGet();
              i3.showMaskOnFocus && a2 !== n2.getBuffer.call(t3).join("") && (0, s.writeBuffer)(this, n2.getBuffer.call(t3), n2.seekNext.call(t3, n2.getLastValidPosition.call(t3))), true !== i3.positionCaretOnTab || false !== t3.mouseEnter || o.isComplete.call(t3, n2.getBuffer.call(t3)) && -1 !== n2.getLastValidPosition.call(t3) || f.clickEvent.apply(this, [e3, true]), t3.undoValue = null == t3 ? void 0 : t3._valueGet(true);
            },
            invalidEvent: function(e3) {
              this.inputmask.validationEvent = true;
            },
            mouseleaveEvent: function() {
              var e3 = this.inputmask, t3 = e3.opts, i3 = this;
              e3.mouseEnter = false, t3.clearMaskOnLostFocus && (i3.inputmask.shadowRoot || i3.ownerDocument).activeElement !== i3 && (0, s.HandleNativePlaceholder)(i3, e3.originalPlaceholder);
            },
            clickEvent: function(e3, t3) {
              var i3 = this.inputmask;
              i3.clicked++;
              var a2 = this;
              if ((a2.inputmask.shadowRoot || a2.ownerDocument).activeElement === a2) {
                var r2 = n2.determineNewCaretPosition.call(i3, n2.caret.call(i3, a2), t3);
                void 0 !== r2 && n2.caret.call(i3, a2, r2);
              }
            },
            cutEvent: function(e3) {
              var t3 = this.inputmask, i3 = t3.maskset, r2 = this, l2 = n2.caret.call(t3, r2), c2 = t3.isRTL ? n2.getBuffer.call(t3).slice(l2.end, l2.begin) : n2.getBuffer.call(t3).slice(l2.begin, l2.end), u2 = t3.isRTL ? c2.reverse().join("") : c2.join("");
              window.navigator.clipboard ? window.navigator.clipboard.writeText(u2) : window.clipboardData && window.clipboardData.getData && window.clipboardData.setData("Text", u2), o.handleRemove.call(t3, r2, a.keys.Delete, l2), (0, s.writeBuffer)(r2, n2.getBuffer.call(t3), i3.p, e3, t3.undoValue !== t3._valueGet(true));
            },
            blurEvent: function(e3) {
              var t3 = this.inputmask, i3 = t3.opts, a2 = t3.dependencyLib;
              t3.clicked = 0;
              var r2 = a2(this), l2 = this;
              if (l2.inputmask) {
                (0, s.HandleNativePlaceholder)(l2, t3.originalPlaceholder);
                var c2 = l2.inputmask._valueGet(), u2 = n2.getBuffer.call(t3).slice();
                "" !== c2 && (i3.clearMaskOnLostFocus && (-1 === n2.getLastValidPosition.call(t3) && c2 === n2.getBufferTemplate.call(t3).join("") ? u2 = [] : s.clearOptionalTail.call(t3, u2)), false === o.isComplete.call(t3, u2) && (setTimeout(function() {
                  r2.trigger("incomplete");
                }, 0), i3.clearIncomplete && (n2.resetMaskSet.call(t3), u2 = i3.clearMaskOnLostFocus ? [] : n2.getBufferTemplate.call(t3).slice())), (0, s.writeBuffer)(l2, u2, void 0, e3)), t3.undoValue !== t3._valueGet(true) && (t3.undoValue = t3._valueGet(true), r2.trigger("change"));
              }
            },
            mouseenterEvent: function() {
              var e3 = this.inputmask, t3 = e3.opts.showMaskOnHover, i3 = this;
              if (e3.mouseEnter = true, (i3.inputmask.shadowRoot || i3.ownerDocument).activeElement !== i3) {
                var a2 = (e3.isRTL ? n2.getBufferTemplate.call(e3).slice().reverse() : n2.getBufferTemplate.call(e3)).join("");
                t3 && (0, s.HandleNativePlaceholder)(i3, a2);
              }
            },
            submitEvent: function() {
              var e3 = this.inputmask, t3 = e3.opts;
              e3.undoValue !== e3._valueGet(true) && e3.$el.trigger("change"), -1 === n2.getLastValidPosition.call(e3) && e3._valueGet && e3._valueGet() === n2.getBufferTemplate.call(e3).join("") && e3._valueSet(""), t3.clearIncomplete && false === o.isComplete.call(e3, n2.getBuffer.call(e3)) && e3._valueSet(""), t3.removeMaskOnSubmit && (e3._valueSet(e3.unmaskedvalue(), true), setTimeout(function() {
                (0, s.writeBuffer)(e3.el, n2.getBuffer.call(e3));
              }, 0));
            },
            resetEvent: function() {
              var e3 = this.inputmask;
              e3.refreshValue = true, setTimeout(function() {
                (0, s.applyInputValue)(e3.el, e3._valueGet(true));
              }, 0);
            }
          };
          t2.EventHandlers = f;
        },
        9716: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.EventRuler = void 0;
          var n2, a = (n2 = i2(2394)) && n2.__esModule ? n2 : {
            default: n2
          }, r = i2(2839), o = i2(8711), s = i2(7760);
          var l = {
            on: function(e3, t3, i3) {
              var n3 = e3.inputmask.dependencyLib, l2 = function(t4) {
                t4.originalEvent && (t4 = t4.originalEvent || t4, arguments[0] = t4);
                var l3, c = this, u = c.inputmask, f = u ? u.opts : void 0;
                if (void 0 === u && "FORM" !== this.nodeName) {
                  var d = n3.data(c, "_inputmask_opts");
                  n3(c).off(), d && new a.default(d).mask(c);
                } else {
                  if (["submit", "reset", "setvalue"].includes(t4.type) || "FORM" === this.nodeName || !(c.disabled || c.readOnly && !("keydown" === t4.type && t4.ctrlKey && t4.key === r.keys.c || false === f.tabThrough && t4.key === r.keys.Tab))) {
                    switch (t4.type) {
                      case "input":
                        if (true === u.skipInputEvent)
                          return u.skipInputEvent = false, t4.preventDefault();
                        break;
                      case "click":
                      case "focus":
                        return u.validationEvent ? (u.validationEvent = false, e3.blur(), (0, s.HandleNativePlaceholder)(e3, (u.isRTL ? o.getBufferTemplate.call(u).slice().reverse() : o.getBufferTemplate.call(u)).join("")), setTimeout(function() {
                          e3.focus();
                        }, f.validationEventTimeOut), false) : (l3 = arguments, void setTimeout(function() {
                          e3.inputmask && i3.apply(c, l3);
                        }, 0));
                    }
                    var p = i3.apply(c, arguments);
                    return false === p && (t4.preventDefault(), t4.stopPropagation()), p;
                  }
                  t4.preventDefault();
                }
              };
              ["submit", "reset"].includes(t3) ? (l2 = l2.bind(e3), null !== e3.form && n3(e3.form).on(t3, l2)) : n3(e3).on(t3, l2), e3.inputmask.events[t3] = e3.inputmask.events[t3] || [], e3.inputmask.events[t3].push(l2);
            },
            off: function(e3, t3) {
              if (e3.inputmask && e3.inputmask.events) {
                var i3 = e3.inputmask.dependencyLib, n3 = e3.inputmask.events;
                for (var a2 in t3 && ((n3 = [])[t3] = e3.inputmask.events[t3]), n3) {
                  for (var r2 = n3[a2]; r2.length > 0; ) {
                    var o2 = r2.pop();
                    ["submit", "reset"].includes(a2) ? null !== e3.form && i3(e3.form).off(a2, o2) : i3(e3).off(a2, o2);
                  }
                  delete e3.inputmask.events[a2];
                }
              }
            }
          };
          t2.EventRuler = l;
        },
        219: function(e2, t2, i2) {
          var n2 = d(i2(2394)), a = i2(2839), r = d(i2(7184)), o = i2(8711), s = i2(4713);
          function l(e3, t3) {
            return function(e4) {
              if (Array.isArray(e4))
                return e4;
            }(e3) || function(e4, t4) {
              var i3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
              if (null != i3) {
                var n3, a2, r2, o2, s2 = [], l2 = true, c2 = false;
                try {
                  if (r2 = (i3 = i3.call(e4)).next, 0 === t4) {
                    if (Object(i3) !== i3)
                      return;
                    l2 = false;
                  } else
                    for (; !(l2 = (n3 = r2.call(i3)).done) && (s2.push(n3.value), s2.length !== t4); l2 = true)
                      ;
                } catch (e5) {
                  c2 = true, a2 = e5;
                } finally {
                  try {
                    if (!l2 && null != i3.return && (o2 = i3.return(), Object(o2) !== o2))
                      return;
                  } finally {
                    if (c2)
                      throw a2;
                  }
                }
                return s2;
              }
            }(e3, t3) || function(e4, t4) {
              if (!e4)
                return;
              if ("string" == typeof e4)
                return c(e4, t4);
              var i3 = Object.prototype.toString.call(e4).slice(8, -1);
              "Object" === i3 && e4.constructor && (i3 = e4.constructor.name);
              if ("Map" === i3 || "Set" === i3)
                return Array.from(e4);
              if ("Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3))
                return c(e4, t4);
            }(e3, t3) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function c(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var i3 = 0, n3 = new Array(t3); i3 < t3; i3++)
              n3[i3] = e3[i3];
            return n3;
          }
          function u(e3) {
            return u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            }, u(e3);
          }
          function f(e3, t3) {
            for (var i3 = 0; i3 < t3.length; i3++) {
              var n3 = t3[i3];
              n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e3, (a2 = n3.key, r2 = void 0, r2 = function(e4, t4) {
                if ("object" !== u(e4) || null === e4)
                  return e4;
                var i4 = e4[Symbol.toPrimitive];
                if (void 0 !== i4) {
                  var n4 = i4.call(e4, t4 || "default");
                  if ("object" !== u(n4))
                    return n4;
                  throw new TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t4 ? String : Number)(e4);
              }(a2, "string"), "symbol" === u(r2) ? r2 : String(r2)), n3);
            }
            var a2, r2;
          }
          function d(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          var p = n2.default.dependencyLib, h = function() {
            function e3(t4, i4, n3) {
              !function(e4, t5) {
                if (!(e4 instanceof t5))
                  throw new TypeError("Cannot call a class as a function");
              }(this, e3), this.mask = t4, this.format = i4, this.opts = n3, this._date = new Date(1, 0, 1), this.initDateObject(t4, this.opts);
            }
            var t3, i3;
            return t3 = e3, (i3 = [{
              key: "date",
              get: function() {
                return void 0 === this._date && (this._date = new Date(1, 0, 1), this.initDateObject(void 0, this.opts)), this._date;
              }
            }, {
              key: "initDateObject",
              value: function(e4, t4) {
                var i4;
                for (P(t4).lastIndex = 0; i4 = P(t4).exec(this.format); ) {
                  var n3 = new RegExp("\\d+$").exec(i4[0]), a2 = n3 ? i4[0][0] + "x" : i4[0], r2 = void 0;
                  if (void 0 !== e4) {
                    if (n3) {
                      var o2 = P(t4).lastIndex, s2 = E(i4.index, t4);
                      P(t4).lastIndex = o2, r2 = e4.slice(0, e4.indexOf(s2.nextMatch[0]));
                    } else
                      r2 = e4.slice(0, g[a2] && g[a2][4] || a2.length);
                    e4 = e4.slice(r2.length);
                  }
                  Object.prototype.hasOwnProperty.call(g, a2) && this.setValue(this, r2, a2, g[a2][2], g[a2][1]);
                }
              }
            }, {
              key: "setValue",
              value: function(e4, t4, i4, n3, a2) {
                if (void 0 !== t4 && (e4[n3] = "ampm" === n3 ? t4 : t4.replace(/[^0-9]/g, "0"), e4["raw" + n3] = t4.replace(/\s/g, "_")), void 0 !== a2) {
                  var r2 = e4[n3];
                  ("day" === n3 && 29 === parseInt(r2) || "month" === n3 && 2 === parseInt(r2)) && (29 !== parseInt(e4.day) || 2 !== parseInt(e4.month) || "" !== e4.year && void 0 !== e4.year || e4._date.setFullYear(2012, 1, 29)), "day" === n3 && (m = true, 0 === parseInt(r2) && (r2 = 1)), "month" === n3 && (m = true), "year" === n3 && (m = true, r2.length < 4 && (r2 = M(r2, 4, true))), "" === r2 || isNaN(r2) || a2.call(e4._date, r2), "ampm" === n3 && a2.call(e4._date, r2);
                }
              }
            }, {
              key: "reset",
              value: function() {
                this._date = new Date(1, 0, 1);
              }
            }, {
              key: "reInit",
              value: function() {
                this._date = void 0, this.date;
              }
            }]) && f(t3.prototype, i3), Object.defineProperty(t3, "prototype", {
              writable: false
            }), e3;
          }(), v = (/* @__PURE__ */ new Date()).getFullYear(), m = false, g = {
            d: ["[1-9]|[12][0-9]|3[01]", Date.prototype.setDate, "day", Date.prototype.getDate],
            dd: ["0[1-9]|[12][0-9]|3[01]", Date.prototype.setDate, "day", function() {
              return M(Date.prototype.getDate.call(this), 2);
            }],
            ddd: [""],
            dddd: [""],
            m: ["[1-9]|1[012]", function(e3) {
              var t3 = e3 ? parseInt(e3) : 0;
              return t3 > 0 && t3--, Date.prototype.setMonth.call(this, t3);
            }, "month", function() {
              return Date.prototype.getMonth.call(this) + 1;
            }],
            mm: ["0[1-9]|1[012]", function(e3) {
              var t3 = e3 ? parseInt(e3) : 0;
              return t3 > 0 && t3--, Date.prototype.setMonth.call(this, t3);
            }, "month", function() {
              return M(Date.prototype.getMonth.call(this) + 1, 2);
            }],
            mmm: [""],
            mmmm: [""],
            yy: ["[0-9]{2}", Date.prototype.setFullYear, "year", function() {
              return M(Date.prototype.getFullYear.call(this), 2);
            }],
            yyyy: ["[0-9]{4}", Date.prototype.setFullYear, "year", function() {
              return M(Date.prototype.getFullYear.call(this), 4);
            }],
            h: ["[1-9]|1[0-2]", Date.prototype.setHours, "hours", Date.prototype.getHours],
            hh: ["0[1-9]|1[0-2]", Date.prototype.setHours, "hours", function() {
              return M(Date.prototype.getHours.call(this), 2);
            }],
            hx: [function(e3) {
              return "[0-9]{".concat(e3, "}");
            }, Date.prototype.setHours, "hours", function(e3) {
              return Date.prototype.getHours;
            }],
            H: ["1?[0-9]|2[0-3]", Date.prototype.setHours, "hours", Date.prototype.getHours],
            HH: ["0[0-9]|1[0-9]|2[0-3]", Date.prototype.setHours, "hours", function() {
              return M(Date.prototype.getHours.call(this), 2);
            }],
            Hx: [function(e3) {
              return "[0-9]{".concat(e3, "}");
            }, Date.prototype.setHours, "hours", function(e3) {
              return function() {
                return M(Date.prototype.getHours.call(this), e3);
              };
            }],
            M: ["[1-5]?[0-9]", Date.prototype.setMinutes, "minutes", Date.prototype.getMinutes],
            MM: ["0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]", Date.prototype.setMinutes, "minutes", function() {
              return M(Date.prototype.getMinutes.call(this), 2);
            }],
            s: ["[1-5]?[0-9]", Date.prototype.setSeconds, "seconds", Date.prototype.getSeconds],
            ss: ["0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]", Date.prototype.setSeconds, "seconds", function() {
              return M(Date.prototype.getSeconds.call(this), 2);
            }],
            l: ["[0-9]{3}", Date.prototype.setMilliseconds, "milliseconds", function() {
              return M(Date.prototype.getMilliseconds.call(this), 3);
            }, 3],
            L: ["[0-9]{2}", Date.prototype.setMilliseconds, "milliseconds", function() {
              return M(Date.prototype.getMilliseconds.call(this), 2);
            }, 2],
            t: ["[ap]", k, "ampm", b, 1],
            tt: ["[ap]m", k, "ampm", b, 2],
            T: ["[AP]", k, "ampm", b, 1],
            TT: ["[AP]M", k, "ampm", b, 2],
            Z: [".*", void 0, "Z", function() {
              var e3 = this.toString().match(/\((.+)\)/)[1];
              e3.includes(" ") && (e3 = (e3 = e3.replace("-", " ").toUpperCase()).split(" ").map(function(e4) {
                return l(e4, 1)[0];
              }).join(""));
              return e3;
            }],
            o: [""],
            S: [""]
          }, y = {
            isoDate: "yyyy-mm-dd",
            isoTime: "HH:MM:ss",
            isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
          };
          function k(e3) {
            var t3 = this.getHours();
            e3.toLowerCase().includes("p") ? this.setHours(t3 + 12) : e3.toLowerCase().includes("a") && t3 >= 12 && this.setHours(t3 - 12);
          }
          function b() {
            var e3 = this.getHours();
            return (e3 = e3 || 12) >= 12 ? "PM" : "AM";
          }
          function x(e3) {
            var t3 = new RegExp("\\d+$").exec(e3[0]);
            if (t3 && void 0 !== t3[0]) {
              var i3 = g[e3[0][0] + "x"].slice("");
              return i3[0] = i3[0](t3[0]), i3[3] = i3[3](t3[0]), i3;
            }
            if (g[e3[0]])
              return g[e3[0]];
          }
          function P(e3) {
            if (!e3.tokenizer) {
              var t3 = [], i3 = [];
              for (var n3 in g)
                if (/\.*x$/.test(n3)) {
                  var a2 = n3[0] + "\\d+";
                  -1 === i3.indexOf(a2) && i3.push(a2);
                } else
                  -1 === t3.indexOf(n3[0]) && t3.push(n3[0]);
              e3.tokenizer = "(" + (i3.length > 0 ? i3.join("|") + "|" : "") + t3.join("+|") + ")+?|.", e3.tokenizer = new RegExp(e3.tokenizer, "g");
            }
            return e3.tokenizer;
          }
          function w(e3, t3, i3) {
            if (!m)
              return true;
            if (void 0 === e3.rawday || !isFinite(e3.rawday) && new Date(e3.date.getFullYear(), isFinite(e3.rawmonth) ? e3.month : e3.date.getMonth() + 1, 0).getDate() >= e3.day || "29" == e3.day && (!isFinite(e3.rawyear) || void 0 === e3.rawyear || "" === e3.rawyear) || new Date(e3.date.getFullYear(), isFinite(e3.rawmonth) ? e3.month : e3.date.getMonth() + 1, 0).getDate() >= e3.day)
              return t3;
            if ("29" == e3.day) {
              var n3 = E(t3.pos, i3);
              if ("yyyy" === n3.targetMatch[0] && t3.pos - n3.targetMatchIndex == 2)
                return t3.remove = t3.pos + 1, t3;
            } else if ("02" == e3.month && "30" == e3.day && void 0 !== t3.c)
              return e3.day = "03", e3.date.setDate(3), e3.date.setMonth(1), t3.insert = [{
                pos: t3.pos,
                c: "0"
              }, {
                pos: t3.pos + 1,
                c: t3.c
              }], t3.caret = o.seekNext.call(this, t3.pos + 1), t3;
            return false;
          }
          function S(e3, t3, i3, n3) {
            var a2, o2, s2 = "";
            for (P(i3).lastIndex = 0; a2 = P(i3).exec(e3); ) {
              if (void 0 === t3)
                if (o2 = x(a2))
                  s2 += "(" + o2[0] + ")";
                else
                  switch (a2[0]) {
                    case "[":
                      s2 += "(";
                      break;
                    case "]":
                      s2 += ")?";
                      break;
                    default:
                      s2 += (0, r.default)(a2[0]);
                  }
              else if (o2 = x(a2))
                if (true !== n3 && o2[3])
                  s2 += o2[3].call(t3.date);
                else
                  o2[2] ? s2 += t3["raw" + o2[2]] : s2 += a2[0];
              else
                s2 += a2[0];
            }
            return s2;
          }
          function M(e3, t3, i3) {
            for (e3 = String(e3), t3 = t3 || 2; e3.length < t3; )
              e3 = i3 ? e3 + "0" : "0" + e3;
            return e3;
          }
          function _(e3, t3, i3) {
            return "string" == typeof e3 ? new h(e3, t3, i3) : e3 && "object" === u(e3) && Object.prototype.hasOwnProperty.call(e3, "date") ? e3 : void 0;
          }
          function O(e3, t3) {
            return S(t3.inputFormat, {
              date: e3
            }, t3);
          }
          function E(e3, t3) {
            var i3, n3, a2 = 0, r2 = 0;
            for (P(t3).lastIndex = 0; n3 = P(t3).exec(t3.inputFormat); ) {
              var o2 = new RegExp("\\d+$").exec(n3[0]);
              if ((a2 += r2 = o2 ? parseInt(o2[0]) : n3[0].length) >= e3 + 1) {
                i3 = n3, n3 = P(t3).exec(t3.inputFormat);
                break;
              }
            }
            return {
              targetMatchIndex: a2 - r2,
              nextMatch: n3,
              targetMatch: i3
            };
          }
          n2.default.extendAliases({
            datetime: {
              mask: function(e3) {
                return e3.numericInput = false, g.S = e3.i18n.ordinalSuffix.join("|"), e3.inputFormat = y[e3.inputFormat] || e3.inputFormat, e3.displayFormat = y[e3.displayFormat] || e3.displayFormat || e3.inputFormat, e3.outputFormat = y[e3.outputFormat] || e3.outputFormat || e3.inputFormat, e3.placeholder = "" !== e3.placeholder ? e3.placeholder : e3.inputFormat.replace(/[[\]]/, ""), e3.regex = S(e3.inputFormat, void 0, e3), e3.min = _(e3.min, e3.inputFormat, e3), e3.max = _(e3.max, e3.inputFormat, e3), null;
              },
              placeholder: "",
              inputFormat: "isoDateTime",
              displayFormat: null,
              outputFormat: null,
              min: null,
              max: null,
              skipOptionalPartCharacter: "",
              i18n: {
                dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                ordinalSuffix: ["st", "nd", "rd", "th"]
              },
              preValidation: function(e3, t3, i3, n3, a2, r2, o2, s2) {
                if (s2)
                  return true;
                if (isNaN(i3) && e3[t3] !== i3) {
                  var l2 = E(t3, a2);
                  if (l2.nextMatch && l2.nextMatch[0] === i3 && l2.targetMatch[0].length > 1) {
                    var c2 = g[l2.targetMatch[0]][0];
                    if (new RegExp(c2).test("0" + e3[t3 - 1]))
                      return e3[t3] = e3[t3 - 1], e3[t3 - 1] = "0", {
                        fuzzy: true,
                        buffer: e3,
                        refreshFromBuffer: {
                          start: t3 - 1,
                          end: t3 + 1
                        },
                        pos: t3 + 1
                      };
                  }
                }
                return true;
              },
              postValidation: function(e3, t3, i3, n3, a2, r2, o2, l2) {
                var c2, u2;
                if (o2)
                  return true;
                if (false === n3 && (((c2 = E(t3 + 1, a2)).targetMatch && c2.targetMatchIndex === t3 && c2.targetMatch[0].length > 1 && void 0 !== g[c2.targetMatch[0]] || (c2 = E(t3 + 2, a2)).targetMatch && c2.targetMatchIndex === t3 + 1 && c2.targetMatch[0].length > 1 && void 0 !== g[c2.targetMatch[0]]) && (u2 = g[c2.targetMatch[0]][0]), void 0 !== u2 && (void 0 !== r2.validPositions[t3 + 1] && new RegExp(u2).test(i3 + "0") ? (e3[t3] = i3, e3[t3 + 1] = "0", n3 = {
                  pos: t3 + 2,
                  caret: t3
                }) : new RegExp(u2).test("0" + i3) && (e3[t3] = "0", e3[t3 + 1] = i3, n3 = {
                  pos: t3 + 2
                })), false === n3))
                  return n3;
                if (n3.fuzzy && (e3 = n3.buffer, t3 = n3.pos), (c2 = E(t3, a2)).targetMatch && c2.targetMatch[0] && void 0 !== g[c2.targetMatch[0]]) {
                  var f2 = g[c2.targetMatch[0]];
                  u2 = f2[0];
                  var d2 = e3.slice(c2.targetMatchIndex, c2.targetMatchIndex + c2.targetMatch[0].length);
                  if (false === new RegExp(u2).test(d2.join("")) && 2 === c2.targetMatch[0].length && r2.validPositions[c2.targetMatchIndex] && r2.validPositions[c2.targetMatchIndex + 1] && (r2.validPositions[c2.targetMatchIndex + 1].input = "0"), "year" == f2[2])
                    for (var p2 = s.getMaskTemplate.call(this, false, 1, void 0, true), h2 = t3 + 1; h2 < e3.length; h2++)
                      e3[h2] = p2[h2], delete r2.validPositions[h2];
                }
                var m2 = n3, y2 = _(e3.join(""), a2.inputFormat, a2);
                return m2 && !isNaN(y2.date.getTime()) && (a2.prefillYear && (m2 = function(e4, t4, i4) {
                  if (e4.year !== e4.rawyear) {
                    var n4 = v.toString(), a3 = e4.rawyear.replace(/[^0-9]/g, ""), r3 = n4.slice(0, a3.length), o3 = n4.slice(a3.length);
                    if (2 === a3.length && a3 === r3) {
                      var s2 = new Date(v, e4.month - 1, e4.day);
                      e4.day == s2.getDate() && (!i4.max || i4.max.date.getTime() >= s2.getTime()) && (e4.date.setFullYear(v), e4.year = n4, t4.insert = [{
                        pos: t4.pos + 1,
                        c: o3[0]
                      }, {
                        pos: t4.pos + 2,
                        c: o3[1]
                      }]);
                    }
                  }
                  return t4;
                }(y2, m2, a2)), m2 = function(e4, t4, i4, n4, a3) {
                  if (!t4)
                    return t4;
                  if (t4 && i4.min && !isNaN(i4.min.date.getTime())) {
                    var r3;
                    for (e4.reset(), P(i4).lastIndex = 0; r3 = P(i4).exec(i4.inputFormat); ) {
                      var o3;
                      if ((o3 = x(r3)) && o3[3]) {
                        for (var s2 = o3[1], l3 = e4[o3[2]], c3 = i4.min[o3[2]], u3 = i4.max ? i4.max[o3[2]] : c3, f3 = [], d3 = false, p3 = 0; p3 < c3.length; p3++)
                          void 0 !== n4.validPositions[p3 + r3.index] || d3 ? (f3[p3] = l3[p3], d3 = d3 || l3[p3] > c3[p3]) : (f3[p3] = c3[p3], "year" === o3[2] && l3.length - 1 == p3 && c3 != u3 && (f3 = (parseInt(f3.join("")) + 1).toString().split("")), "ampm" === o3[2] && c3 != u3 && i4.min.date.getTime() > e4.date.getTime() && (f3[p3] = u3[p3]));
                        s2.call(e4._date, f3.join(""));
                      }
                    }
                    t4 = i4.min.date.getTime() <= e4.date.getTime(), e4.reInit();
                  }
                  return t4 && i4.max && (isNaN(i4.max.date.getTime()) || (t4 = i4.max.date.getTime() >= e4.date.getTime())), t4;
                }(y2, m2 = w.call(this, y2, m2, a2), a2, r2)), void 0 !== t3 && m2 && n3.pos !== t3 ? {
                  buffer: S(a2.inputFormat, y2, a2).split(""),
                  refreshFromBuffer: {
                    start: t3,
                    end: n3.pos
                  },
                  pos: n3.caret || n3.pos
                } : m2;
              },
              onKeyDown: function(e3, t3, i3, n3) {
                e3.ctrlKey && e3.key === a.keys.ArrowRight && (this.inputmask._valueSet(O(/* @__PURE__ */ new Date(), n3)), p(this).trigger("setvalue"));
              },
              onUnMask: function(e3, t3, i3) {
                return t3 ? S(i3.outputFormat, _(e3, i3.inputFormat, i3), i3, true) : t3;
              },
              casing: function(e3, t3, i3, n3) {
                return 0 == t3.nativeDef.indexOf("[ap]") ? e3.toLowerCase() : 0 == t3.nativeDef.indexOf("[AP]") ? e3.toUpperCase() : e3;
              },
              onBeforeMask: function(e3, t3) {
                return "[object Date]" === Object.prototype.toString.call(e3) && (e3 = O(e3, t3)), e3;
              },
              insertMode: false,
              insertModeVisual: false,
              shiftPositions: false,
              keepStatic: false,
              inputmode: "numeric",
              prefillYear: true
            }
          });
        },
        3851: function(e2, t2, i2) {
          var n2, a = (n2 = i2(2394)) && n2.__esModule ? n2 : {
            default: n2
          }, r = i2(8711), o = i2(4713);
          a.default.extendDefinitions({
            A: {
              validator: "[A-Za-zА-яЁёÀ-ÿµ]",
              casing: "upper"
            },
            "&": {
              validator: "[0-9A-Za-zА-яЁёÀ-ÿµ]",
              casing: "upper"
            },
            "#": {
              validator: "[0-9A-Fa-f]",
              casing: "upper"
            }
          });
          var s = new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]");
          function l(e3, t3, i3, n3, a2) {
            return i3 - 1 > -1 && "." !== t3.buffer[i3 - 1] ? (e3 = t3.buffer[i3 - 1] + e3, e3 = i3 - 2 > -1 && "." !== t3.buffer[i3 - 2] ? t3.buffer[i3 - 2] + e3 : "0" + e3) : e3 = "00" + e3, s.test(e3);
          }
          a.default.extendAliases({
            cssunit: {
              regex: "[+-]?[0-9]+\\.?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)"
            },
            url: {
              regex: "(https?|ftp)://.*",
              autoUnmask: false,
              keepStatic: false,
              tabThrough: true
            },
            ip: {
              mask: "i{1,3}.j{1,3}.k{1,3}.l{1,3}",
              definitions: {
                i: {
                  validator: l
                },
                j: {
                  validator: l
                },
                k: {
                  validator: l
                },
                l: {
                  validator: l
                }
              },
              onUnMask: function(e3, t3, i3) {
                return e3;
              },
              inputmode: "decimal",
              substitutes: {
                ",": "."
              }
            },
            email: {
              mask: function(e3) {
                var t3 = e3.separator, i3 = e3.quantifier, n3 = "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]", a2 = n3;
                if (t3)
                  for (var r2 = 0; r2 < i3; r2++)
                    a2 += "[".concat(t3).concat(n3, "]");
                return a2;
              },
              greedy: false,
              casing: "lower",
              separator: null,
              quantifier: 5,
              skipOptionalPartCharacter: "",
              onBeforePaste: function(e3, t3) {
                return (e3 = e3.toLowerCase()).replace("mailto:", "");
              },
              definitions: {
                "*": {
                  validator: "[0-9１-９A-Za-zА-яЁёÀ-ÿµ!#$%&'*+/=?^_`{|}~-]"
                },
                "-": {
                  validator: "[0-9A-Za-z-]"
                }
              },
              onUnMask: function(e3, t3, i3) {
                return e3;
              },
              inputmode: "email"
            },
            mac: {
              mask: "##:##:##:##:##:##"
            },
            vin: {
              mask: "V{13}9{4}",
              definitions: {
                V: {
                  validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
                  casing: "upper"
                }
              },
              clearIncomplete: true,
              autoUnmask: true
            },
            ssn: {
              mask: "999-99-9999",
              postValidation: function(e3, t3, i3, n3, a2, s2, l2) {
                var c = o.getMaskTemplate.call(this, true, r.getLastValidPosition.call(this), true, true);
                return /^(?!219-09-9999|078-05-1120)(?!666|000|9.{2}).{3}-(?!00).{2}-(?!0{4}).{4}$/.test(c.join(""));
              }
            }
          });
        },
        207: function(e2, t2, i2) {
          var n2 = s(i2(2394)), a = s(i2(7184)), r = i2(8711), o = i2(2839);
          function s(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          var l = n2.default.dependencyLib;
          function c(e3, t3) {
            for (var i3 = "", a2 = 0; a2 < e3.length; a2++)
              n2.default.prototype.definitions[e3.charAt(a2)] || t3.definitions[e3.charAt(a2)] || t3.optionalmarker[0] === e3.charAt(a2) || t3.optionalmarker[1] === e3.charAt(a2) || t3.quantifiermarker[0] === e3.charAt(a2) || t3.quantifiermarker[1] === e3.charAt(a2) || t3.groupmarker[0] === e3.charAt(a2) || t3.groupmarker[1] === e3.charAt(a2) || t3.alternatormarker === e3.charAt(a2) ? i3 += "\\" + e3.charAt(a2) : i3 += e3.charAt(a2);
            return i3;
          }
          function u(e3, t3, i3, n3) {
            if (e3.length > 0 && t3 > 0 && (!i3.digitsOptional || n3)) {
              var a2 = e3.indexOf(i3.radixPoint), r2 = false;
              i3.negationSymbol.back === e3[e3.length - 1] && (r2 = true, e3.length--), -1 === a2 && (e3.push(i3.radixPoint), a2 = e3.length - 1);
              for (var o2 = 1; o2 <= t3; o2++)
                isFinite(e3[a2 + o2]) || (e3[a2 + o2] = "0");
            }
            return r2 && e3.push(i3.negationSymbol.back), e3;
          }
          function f(e3, t3) {
            var i3 = 0;
            for (var n3 in "+" === e3 && (i3 = r.seekNext.call(this, t3.validPositions.length - 1)), t3.tests)
              if ((n3 = parseInt(n3)) >= i3) {
                for (var a2 = 0, o2 = t3.tests[n3].length; a2 < o2; a2++)
                  if ((void 0 === t3.validPositions[n3] || "-" === e3) && t3.tests[n3][a2].match.def === e3)
                    return n3 + (void 0 !== t3.validPositions[n3] && "-" !== e3 ? 1 : 0);
              }
            return i3;
          }
          function d(e3, t3) {
            for (var i3 = -1, n3 = 0, a2 = t3.validPositions.length; n3 < a2; n3++) {
              var r2 = t3.validPositions[n3];
              if (r2 && r2.match.def === e3) {
                i3 = n3;
                break;
              }
            }
            return i3;
          }
          function p(e3, t3, i3, n3, a2) {
            var r2 = t3.buffer ? t3.buffer.indexOf(a2.radixPoint) : -1, o2 = (-1 !== r2 || n3 && a2.jitMasking) && new RegExp(a2.definitions[9].validator).test(e3);
            return a2._radixDance && -1 !== r2 && o2 && null == t3.validPositions[r2] ? {
              insert: {
                pos: r2 === i3 ? r2 + 1 : r2,
                c: a2.radixPoint
              },
              pos: i3
            } : o2;
          }
          n2.default.extendAliases({
            numeric: {
              mask: function(e3) {
                e3.repeat = 0, e3.groupSeparator === e3.radixPoint && e3.digits && "0" !== e3.digits && ("." === e3.radixPoint ? e3.groupSeparator = "," : "," === e3.radixPoint ? e3.groupSeparator = "." : e3.groupSeparator = ""), " " === e3.groupSeparator && (e3.skipOptionalPartCharacter = void 0), e3.placeholder.length > 1 && (e3.placeholder = e3.placeholder.charAt(0)), "radixFocus" === e3.positionCaretOnClick && "" === e3.placeholder && (e3.positionCaretOnClick = "lvp");
                var t3 = "0", i3 = e3.radixPoint;
                true === e3.numericInput && void 0 === e3.__financeInput ? (t3 = "1", e3.positionCaretOnClick = "radixFocus" === e3.positionCaretOnClick ? "lvp" : e3.positionCaretOnClick, e3.digitsOptional = false, isNaN(e3.digits) && (e3.digits = 2), e3._radixDance = false, i3 = "," === e3.radixPoint ? "?" : "!", "" !== e3.radixPoint && void 0 === e3.definitions[i3] && (e3.definitions[i3] = {}, e3.definitions[i3].validator = "[" + e3.radixPoint + "]", e3.definitions[i3].placeholder = e3.radixPoint, e3.definitions[i3].static = true, e3.definitions[i3].generated = true)) : (e3.__financeInput = false, e3.numericInput = true);
                var n3, r2 = "[+]";
                if (r2 += c(e3.prefix, e3), "" !== e3.groupSeparator ? (void 0 === e3.definitions[e3.groupSeparator] && (e3.definitions[e3.groupSeparator] = {}, e3.definitions[e3.groupSeparator].validator = "[" + e3.groupSeparator + "]", e3.definitions[e3.groupSeparator].placeholder = e3.groupSeparator, e3.definitions[e3.groupSeparator].static = true, e3.definitions[e3.groupSeparator].generated = true), r2 += e3._mask(e3)) : r2 += "9{+}", void 0 !== e3.digits && 0 !== e3.digits) {
                  var o2 = e3.digits.toString().split(",");
                  isFinite(o2[0]) && o2[1] && isFinite(o2[1]) ? r2 += i3 + t3 + "{" + e3.digits + "}" : (isNaN(e3.digits) || parseInt(e3.digits) > 0) && (e3.digitsOptional || e3.jitMasking ? (n3 = r2 + i3 + t3 + "{0," + e3.digits + "}", e3.keepStatic = true) : r2 += i3 + t3 + "{" + e3.digits + "}");
                } else
                  e3.inputmode = "numeric";
                return r2 += c(e3.suffix, e3), r2 += "[-]", n3 && (r2 = [n3 + c(e3.suffix, e3) + "[-]", r2]), e3.greedy = false, function(e4) {
                  void 0 === e4.parseMinMaxOptions && (null !== e4.min && (e4.min = e4.min.toString().replace(new RegExp((0, a.default)(e4.groupSeparator), "g"), ""), "," === e4.radixPoint && (e4.min = e4.min.replace(e4.radixPoint, ".")), e4.min = isFinite(e4.min) ? parseFloat(e4.min) : NaN, isNaN(e4.min) && (e4.min = Number.MIN_VALUE)), null !== e4.max && (e4.max = e4.max.toString().replace(new RegExp((0, a.default)(e4.groupSeparator), "g"), ""), "," === e4.radixPoint && (e4.max = e4.max.replace(e4.radixPoint, ".")), e4.max = isFinite(e4.max) ? parseFloat(e4.max) : NaN, isNaN(e4.max) && (e4.max = Number.MAX_VALUE)), e4.parseMinMaxOptions = "done");
                }(e3), "" !== e3.radixPoint && e3.substituteRadixPoint && (e3.substitutes["." == e3.radixPoint ? "," : "."] = e3.radixPoint), r2;
              },
              _mask: function(e3) {
                return "(" + e3.groupSeparator + "999){+|1}";
              },
              digits: "*",
              digitsOptional: true,
              enforceDigitsOnBlur: false,
              radixPoint: ".",
              positionCaretOnClick: "radixFocus",
              _radixDance: true,
              groupSeparator: "",
              allowMinus: true,
              negationSymbol: {
                front: "-",
                back: ""
              },
              prefix: "",
              suffix: "",
              min: null,
              max: null,
              SetMaxOnOverflow: false,
              step: 1,
              inputType: "text",
              unmaskAsNumber: false,
              roundingFN: Math.round,
              inputmode: "decimal",
              shortcuts: {
                k: "1000",
                m: "1000000"
              },
              placeholder: "0",
              greedy: false,
              rightAlign: true,
              insertMode: true,
              autoUnmask: false,
              skipOptionalPartCharacter: "",
              usePrototypeDefinitions: false,
              stripLeadingZeroes: true,
              substituteRadixPoint: true,
              definitions: {
                0: {
                  validator: p
                },
                1: {
                  validator: p,
                  definitionSymbol: "9"
                },
                9: {
                  validator: "[0-9０-９٠-٩۰-۹]",
                  definitionSymbol: "*"
                },
                "+": {
                  validator: function(e3, t3, i3, n3, a2) {
                    return a2.allowMinus && ("-" === e3 || e3 === a2.negationSymbol.front);
                  }
                },
                "-": {
                  validator: function(e3, t3, i3, n3, a2) {
                    return a2.allowMinus && e3 === a2.negationSymbol.back;
                  }
                }
              },
              preValidation: function(e3, t3, i3, n3, a2, r2, o2, s2) {
                if (false !== a2.__financeInput && i3 === a2.radixPoint)
                  return false;
                var l2 = e3.indexOf(a2.radixPoint), c2 = t3;
                if (t3 = function(e4, t4, i4, n4, a3) {
                  return a3._radixDance && a3.numericInput && t4 !== a3.negationSymbol.back && e4 <= i4 && (i4 > 0 || t4 == a3.radixPoint) && (void 0 === n4.validPositions[e4 - 1] || n4.validPositions[e4 - 1].input !== a3.negationSymbol.back) && (e4 -= 1), e4;
                }(t3, i3, l2, r2, a2), "-" === i3 || i3 === a2.negationSymbol.front) {
                  if (true !== a2.allowMinus)
                    return false;
                  var u2 = false, p2 = d("+", r2), h = d("-", r2);
                  return -1 !== p2 && (u2 = [p2, h]), false !== u2 ? {
                    remove: u2,
                    caret: c2 - a2.negationSymbol.back.length
                  } : {
                    insert: [{
                      pos: f.call(this, "+", r2),
                      c: a2.negationSymbol.front,
                      fromIsValid: true
                    }, {
                      pos: f.call(this, "-", r2),
                      c: a2.negationSymbol.back,
                      fromIsValid: void 0
                    }],
                    caret: c2 + a2.negationSymbol.back.length
                  };
                }
                if (i3 === a2.groupSeparator)
                  return {
                    caret: c2
                  };
                if (s2)
                  return true;
                if (-1 !== l2 && true === a2._radixDance && false === n3 && i3 === a2.radixPoint && void 0 !== a2.digits && (isNaN(a2.digits) || parseInt(a2.digits) > 0) && l2 !== t3)
                  return {
                    caret: a2._radixDance && t3 === l2 - 1 ? l2 + 1 : l2
                  };
                if (false === a2.__financeInput) {
                  if (n3) {
                    if (a2.digitsOptional)
                      return {
                        rewritePosition: o2.end
                      };
                    if (!a2.digitsOptional) {
                      if (o2.begin > l2 && o2.end <= l2)
                        return i3 === a2.radixPoint ? {
                          insert: {
                            pos: l2 + 1,
                            c: "0",
                            fromIsValid: true
                          },
                          rewritePosition: l2
                        } : {
                          rewritePosition: l2 + 1
                        };
                      if (o2.begin < l2)
                        return {
                          rewritePosition: o2.begin - 1
                        };
                    }
                  } else if (!a2.showMaskOnHover && !a2.showMaskOnFocus && !a2.digitsOptional && a2.digits > 0 && "" === this.__valueGet.call(this.el))
                    return {
                      rewritePosition: l2
                    };
                }
                return {
                  rewritePosition: t3
                };
              },
              postValidation: function(e3, t3, i3, n3, a2, r2, o2) {
                if (false === n3)
                  return n3;
                if (o2)
                  return true;
                if (null !== a2.min || null !== a2.max) {
                  var s2 = a2.onUnMask(e3.slice().reverse().join(""), void 0, l.extend({}, a2, {
                    unmaskAsNumber: true
                  }));
                  if (null !== a2.min && s2 < a2.min && (s2.toString().length > a2.min.toString().length || s2 < 0))
                    return false;
                  if (null !== a2.max && s2 > a2.max)
                    return !!a2.SetMaxOnOverflow && {
                      refreshFromBuffer: true,
                      buffer: u(a2.max.toString().replace(".", a2.radixPoint).split(""), a2.digits, a2).reverse()
                    };
                }
                return n3;
              },
              onUnMask: function(e3, t3, i3) {
                if ("" === t3 && true === i3.nullable)
                  return t3;
                var n3 = e3.replace(i3.prefix, "");
                return n3 = (n3 = n3.replace(i3.suffix, "")).replace(new RegExp((0, a.default)(i3.groupSeparator), "g"), ""), "" !== i3.placeholder.charAt(0) && (n3 = n3.replace(new RegExp(i3.placeholder.charAt(0), "g"), "0")), i3.unmaskAsNumber ? ("" !== i3.radixPoint && -1 !== n3.indexOf(i3.radixPoint) && (n3 = n3.replace(a.default.call(this, i3.radixPoint), ".")), n3 = (n3 = n3.replace(new RegExp("^" + (0, a.default)(i3.negationSymbol.front)), "-")).replace(new RegExp((0, a.default)(i3.negationSymbol.back) + "$"), ""), Number(n3)) : n3;
              },
              isComplete: function(e3, t3) {
                var i3 = (t3.numericInput ? e3.slice().reverse() : e3).join("");
                return i3 = (i3 = (i3 = (i3 = (i3 = i3.replace(new RegExp("^" + (0, a.default)(t3.negationSymbol.front)), "-")).replace(new RegExp((0, a.default)(t3.negationSymbol.back) + "$"), "")).replace(t3.prefix, "")).replace(t3.suffix, "")).replace(new RegExp((0, a.default)(t3.groupSeparator) + "([0-9]{3})", "g"), "$1"), "," === t3.radixPoint && (i3 = i3.replace((0, a.default)(t3.radixPoint), ".")), isFinite(i3);
              },
              onBeforeMask: function(e3, t3) {
                var i3 = t3.radixPoint || ",";
                isFinite(t3.digits) && (t3.digits = parseInt(t3.digits)), "number" != typeof e3 && "number" !== t3.inputType || "" === i3 || (e3 = e3.toString().replace(".", i3));
                var n3 = "-" === e3.charAt(0) || e3.charAt(0) === t3.negationSymbol.front, r2 = e3.split(i3), o2 = r2[0].replace(/[^\-0-9]/g, ""), s2 = r2.length > 1 ? r2[1].replace(/[^0-9]/g, "") : "", l2 = r2.length > 1;
                e3 = o2 + ("" !== s2 ? i3 + s2 : s2);
                var c2 = 0;
                if ("" !== i3 && (c2 = t3.digitsOptional ? t3.digits < s2.length ? t3.digits : s2.length : t3.digits, "" !== s2 || !t3.digitsOptional)) {
                  var f2 = Math.pow(10, c2 || 1);
                  e3 = e3.replace((0, a.default)(i3), "."), isNaN(parseFloat(e3)) || (e3 = (t3.roundingFN(parseFloat(e3) * f2) / f2).toFixed(c2)), e3 = e3.toString().replace(".", i3);
                }
                if (0 === t3.digits && -1 !== e3.indexOf(i3) && (e3 = e3.substring(0, e3.indexOf(i3))), null !== t3.min || null !== t3.max) {
                  var d2 = e3.toString().replace(i3, ".");
                  null !== t3.min && d2 < t3.min ? e3 = t3.min.toString().replace(".", i3) : null !== t3.max && d2 > t3.max && (e3 = t3.max.toString().replace(".", i3));
                }
                return n3 && "-" !== e3.charAt(0) && (e3 = "-" + e3), u(e3.toString().split(""), c2, t3, l2).join("");
              },
              onBeforeWrite: function(e3, t3, i3, n3) {
                function r2(e4, t4) {
                  if (false !== n3.__financeInput || t4) {
                    var i4 = e4.indexOf(n3.radixPoint);
                    -1 !== i4 && e4.splice(i4, 1);
                  }
                  if ("" !== n3.groupSeparator)
                    for (; -1 !== (i4 = e4.indexOf(n3.groupSeparator)); )
                      e4.splice(i4, 1);
                  return e4;
                }
                var o2, s2;
                if (n3.stripLeadingZeroes && (s2 = function(e4, t4) {
                  var i4 = new RegExp("(^" + ("" !== t4.negationSymbol.front ? (0, a.default)(t4.negationSymbol.front) + "?" : "") + (0, a.default)(t4.prefix) + ")(.*)(" + (0, a.default)(t4.suffix) + ("" != t4.negationSymbol.back ? (0, a.default)(t4.negationSymbol.back) + "?" : "") + "$)").exec(e4.slice().reverse().join("")), n4 = i4 ? i4[2] : "", r3 = false;
                  return n4 && (n4 = n4.split(t4.radixPoint.charAt(0))[0], r3 = new RegExp("^[0" + t4.groupSeparator + "]*").exec(n4)), !(!r3 || !(r3[0].length > 1 || r3[0].length > 0 && r3[0].length < n4.length)) && r3;
                }(t3, n3)))
                  for (var c2 = t3.join("").lastIndexOf(s2[0].split("").reverse().join("")) - (s2[0] == s2.input ? 0 : 1), f2 = s2[0] == s2.input ? 1 : 0, d2 = s2[0].length - f2; d2 > 0; d2--)
                    delete this.maskset.validPositions[c2 + d2], delete t3[c2 + d2];
                if (e3)
                  switch (e3.type) {
                    case "blur":
                    case "checkval":
                      if (null !== n3.min) {
                        var p2 = n3.onUnMask(t3.slice().reverse().join(""), void 0, l.extend({}, n3, {
                          unmaskAsNumber: true
                        }));
                        if (null !== n3.min && p2 < n3.min)
                          return {
                            refreshFromBuffer: true,
                            buffer: u(n3.min.toString().replace(".", n3.radixPoint).split(""), n3.digits, n3).reverse()
                          };
                      }
                      if (t3[t3.length - 1] === n3.negationSymbol.front) {
                        var h = new RegExp("(^" + ("" != n3.negationSymbol.front ? (0, a.default)(n3.negationSymbol.front) + "?" : "") + (0, a.default)(n3.prefix) + ")(.*)(" + (0, a.default)(n3.suffix) + ("" != n3.negationSymbol.back ? (0, a.default)(n3.negationSymbol.back) + "?" : "") + "$)").exec(r2(t3.slice(), true).reverse().join(""));
                        0 == (h ? h[2] : "") && (o2 = {
                          refreshFromBuffer: true,
                          buffer: [0]
                        });
                      } else if ("" !== n3.radixPoint) {
                        t3.indexOf(n3.radixPoint) === n3.suffix.length && (o2 && o2.buffer ? o2.buffer.splice(0, 1 + n3.suffix.length) : (t3.splice(0, 1 + n3.suffix.length), o2 = {
                          refreshFromBuffer: true,
                          buffer: r2(t3)
                        }));
                      }
                      if (n3.enforceDigitsOnBlur) {
                        var v = (o2 = o2 || {}) && o2.buffer || t3.slice().reverse();
                        o2.refreshFromBuffer = true, o2.buffer = u(v, n3.digits, n3, true).reverse();
                      }
                  }
                return o2;
              },
              onKeyDown: function(e3, t3, i3, n3) {
                var a2, r2 = l(this);
                if (3 != e3.location) {
                  var s2, c2 = e3.key;
                  if ((s2 = n3.shortcuts && n3.shortcuts[c2]) && s2.length > 1)
                    return this.inputmask.__valueSet.call(this, parseFloat(this.inputmask.unmaskedvalue()) * parseInt(s2)), r2.trigger("setvalue"), false;
                }
                if (e3.ctrlKey)
                  switch (e3.key) {
                    case o.keys.ArrowUp:
                      return this.inputmask.__valueSet.call(this, parseFloat(this.inputmask.unmaskedvalue()) + parseInt(n3.step)), r2.trigger("setvalue"), false;
                    case o.keys.ArrowDown:
                      return this.inputmask.__valueSet.call(this, parseFloat(this.inputmask.unmaskedvalue()) - parseInt(n3.step)), r2.trigger("setvalue"), false;
                  }
                if (!e3.shiftKey && (e3.key === o.keys.Delete || e3.key === o.keys.Backspace || e3.key === o.keys.BACKSPACE_SAFARI) && i3.begin !== t3.length) {
                  if (t3[e3.key === o.keys.Delete ? i3.begin - 1 : i3.end] === n3.negationSymbol.front)
                    return a2 = t3.slice().reverse(), "" !== n3.negationSymbol.front && a2.shift(), "" !== n3.negationSymbol.back && a2.pop(), r2.trigger("setvalue", [a2.join(""), i3.begin]), false;
                  if (true === n3._radixDance) {
                    var f2 = t3.indexOf(n3.radixPoint);
                    if (n3.digitsOptional) {
                      if (0 === f2)
                        return (a2 = t3.slice().reverse()).pop(), r2.trigger("setvalue", [a2.join(""), i3.begin >= a2.length ? a2.length : i3.begin]), false;
                    } else if (-1 !== f2 && (i3.begin < f2 || i3.end < f2 || e3.key === o.keys.Delete && (i3.begin === f2 || i3.begin - 1 === f2))) {
                      var d2 = void 0;
                      return i3.begin === i3.end && (e3.key === o.keys.Backspace || e3.key === o.keys.BACKSPACE_SAFARI ? i3.begin++ : e3.key === o.keys.Delete && i3.begin - 1 === f2 && (d2 = l.extend({}, i3), i3.begin--, i3.end--)), (a2 = t3.slice().reverse()).splice(a2.length - i3.begin, i3.begin - i3.end + 1), a2 = u(a2, n3.digits, n3).join(""), d2 && (i3 = d2), r2.trigger("setvalue", [a2, i3.begin >= a2.length ? f2 + 1 : i3.begin]), false;
                    }
                  }
                }
              }
            },
            currency: {
              prefix: "",
              groupSeparator: ",",
              alias: "numeric",
              digits: 2,
              digitsOptional: false
            },
            decimal: {
              alias: "numeric"
            },
            integer: {
              alias: "numeric",
              inputmode: "numeric",
              digits: 0
            },
            percentage: {
              alias: "numeric",
              min: 0,
              max: 100,
              suffix: " %",
              digits: 0,
              allowMinus: false
            },
            indianns: {
              alias: "numeric",
              _mask: function(e3) {
                return "(" + e3.groupSeparator + "99){*|1}(" + e3.groupSeparator + "999){1|1}";
              },
              groupSeparator: ",",
              radixPoint: ".",
              placeholder: "0",
              digits: 2,
              digitsOptional: false
            }
          });
        },
        9380: function(e2, t2, i2) {
          var n2;
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          var a = ((n2 = i2(8741)) && n2.__esModule ? n2 : {
            default: n2
          }).default ? window : {};
          t2.default = a;
        },
        7760: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.HandleNativePlaceholder = function(e3, t3) {
            var i3 = e3 ? e3.inputmask : this;
            if (s.ie) {
              if (e3.inputmask._valueGet() !== t3 && (e3.placeholder !== t3 || "" === e3.placeholder)) {
                var n3 = r.getBuffer.call(i3).slice(), a2 = e3.inputmask._valueGet();
                if (a2 !== t3) {
                  var o2 = r.getLastValidPosition.call(i3);
                  -1 === o2 && a2 === r.getBufferTemplate.call(i3).join("") ? n3 = [] : -1 !== o2 && u.call(i3, n3), d(e3, n3);
                }
              }
            } else
              e3.placeholder !== t3 && (e3.placeholder = t3, "" === e3.placeholder && e3.removeAttribute("placeholder"));
          }, t2.applyInputValue = c, t2.checkVal = f, t2.clearOptionalTail = u, t2.unmaskedvalue = function(e3) {
            var t3 = e3 ? e3.inputmask : this, i3 = t3.opts, n3 = t3.maskset;
            if (e3) {
              if (void 0 === e3.inputmask)
                return e3.value;
              e3.inputmask && e3.inputmask.refreshValue && c(e3, e3.inputmask._valueGet(true));
            }
            for (var a2 = [], o2 = n3.validPositions, s2 = 0, l2 = o2.length; s2 < l2; s2++)
              o2[s2] && o2[s2].match && (1 != o2[s2].match.static || Array.isArray(n3.metadata) && true !== o2[s2].generatedInput) && a2.push(o2[s2].input);
            var u2 = 0 === a2.length ? "" : (t3.isRTL ? a2.reverse() : a2).join("");
            if ("function" == typeof i3.onUnMask) {
              var f2 = (t3.isRTL ? r.getBuffer.call(t3).slice().reverse() : r.getBuffer.call(t3)).join("");
              u2 = i3.onUnMask.call(t3, f2, u2, i3);
            }
            return u2;
          }, t2.writeBuffer = d;
          var n2 = i2(2839), a = i2(4713), r = i2(8711), o = i2(7215), s = i2(9845), l = i2(6030);
          function c(e3, t3) {
            var i3 = e3 ? e3.inputmask : this, n3 = i3.opts;
            e3.inputmask.refreshValue = false, "function" == typeof n3.onBeforeMask && (t3 = n3.onBeforeMask.call(i3, t3, n3) || t3), f(e3, true, false, t3 = (t3 || "").toString().split("")), i3.undoValue = i3._valueGet(true), (n3.clearMaskOnLostFocus || n3.clearIncomplete) && e3.inputmask._valueGet() === r.getBufferTemplate.call(i3).join("") && -1 === r.getLastValidPosition.call(i3) && e3.inputmask._valueSet("");
          }
          function u(e3) {
            e3.length = 0;
            for (var t3, i3 = a.getMaskTemplate.call(this, true, 0, true, void 0, true); void 0 !== (t3 = i3.shift()); )
              e3.push(t3);
            return e3;
          }
          function f(e3, t3, i3, n3, s2) {
            var c2 = e3 ? e3.inputmask : this, u2 = c2.maskset, f2 = c2.opts, p = c2.dependencyLib, h = n3.slice(), v = "", m = -1, g = void 0, y = f2.skipOptionalPartCharacter;
            f2.skipOptionalPartCharacter = "", r.resetMaskSet.call(c2), u2.tests = {}, m = f2.radixPoint ? r.determineNewCaretPosition.call(c2, {
              begin: 0,
              end: 0
            }, false, false === f2.__financeInput ? "radixFocus" : void 0).begin : 0, u2.p = m, c2.caretPos = {
              begin: m
            };
            var k = [], b = c2.caretPos;
            if (h.forEach(function(e4, t4) {
              if (void 0 !== e4) {
                var n4 = new p.Event("_checkval");
                n4.key = e4, v += e4;
                var o2 = r.getLastValidPosition.call(c2, void 0, true);
                !function(e5, t5) {
                  for (var i4 = a.getMaskTemplate.call(c2, true, 0).slice(e5, r.seekNext.call(c2, e5, false, false)).join("").replace(/'/g, ""), n5 = i4.indexOf(t5); n5 > 0 && " " === i4[n5 - 1]; )
                    n5--;
                  var o3 = 0 === n5 && !r.isMask.call(c2, e5) && (a.getTest.call(c2, e5).match.nativeDef === t5.charAt(0) || true === a.getTest.call(c2, e5).match.static && a.getTest.call(c2, e5).match.nativeDef === "'" + t5.charAt(0) || " " === a.getTest.call(c2, e5).match.nativeDef && (a.getTest.call(c2, e5 + 1).match.nativeDef === t5.charAt(0) || true === a.getTest.call(c2, e5 + 1).match.static && a.getTest.call(c2, e5 + 1).match.nativeDef === "'" + t5.charAt(0)));
                  if (!o3 && n5 > 0 && !r.isMask.call(c2, e5, false, true)) {
                    var s3 = r.seekNext.call(c2, e5);
                    c2.caretPos.begin < s3 && (c2.caretPos = {
                      begin: s3
                    });
                  }
                  return o3;
                }(m, v) ? (g = l.EventHandlers.keypressEvent.call(c2, n4, true, false, i3, c2.caretPos.begin)) && (m = c2.caretPos.begin + 1, v = "") : g = l.EventHandlers.keypressEvent.call(c2, n4, true, false, i3, o2 + 1), g ? (void 0 !== g.pos && u2.validPositions[g.pos] && true === u2.validPositions[g.pos].match.static && void 0 === u2.validPositions[g.pos].alternation && (k.push(g.pos), c2.isRTL || (g.forwardPosition = g.pos + 1)), d.call(c2, void 0, r.getBuffer.call(c2), g.forwardPosition, n4, false), c2.caretPos = {
                  begin: g.forwardPosition,
                  end: g.forwardPosition
                }, b = c2.caretPos) : void 0 === u2.validPositions[t4] && h[t4] === a.getPlaceholder.call(c2, t4) && r.isMask.call(c2, t4, true) ? c2.caretPos.begin++ : c2.caretPos = b;
              }
            }), k.length > 0) {
              var x, P, w = r.seekNext.call(c2, -1, void 0, false);
              if (!o.isComplete.call(c2, r.getBuffer.call(c2)) && k.length <= w || o.isComplete.call(c2, r.getBuffer.call(c2)) && k.length > 0 && k.length !== w && 0 === k[0])
                for (var S = w; void 0 !== (x = k.shift()); ) {
                  var M = new p.Event("_checkval");
                  if ((P = u2.validPositions[x]).generatedInput = true, M.key = P.input, (g = l.EventHandlers.keypressEvent.call(c2, M, true, false, i3, S)) && void 0 !== g.pos && g.pos !== x && u2.validPositions[g.pos] && true === u2.validPositions[g.pos].match.static)
                    k.push(g.pos);
                  else if (!g)
                    break;
                  S++;
                }
            }
            t3 && d.call(c2, e3, r.getBuffer.call(c2), g ? g.forwardPosition : c2.caretPos.begin, s2 || new p.Event("checkval"), s2 && ("input" === s2.type && c2.undoValue !== r.getBuffer.call(c2).join("") || "paste" === s2.type)), f2.skipOptionalPartCharacter = y;
          }
          function d(e3, t3, i3, a2, s2) {
            var l2 = e3 ? e3.inputmask : this, c2 = l2.opts, u2 = l2.dependencyLib;
            if (a2 && "function" == typeof c2.onBeforeWrite) {
              var f2 = c2.onBeforeWrite.call(l2, a2, t3, i3, c2);
              if (f2) {
                if (f2.refreshFromBuffer) {
                  var d2 = f2.refreshFromBuffer;
                  o.refreshFromBuffer.call(l2, true === d2 ? d2 : d2.start, d2.end, f2.buffer || t3), t3 = r.getBuffer.call(l2, true);
                }
                void 0 !== i3 && (i3 = void 0 !== f2.caret ? f2.caret : i3);
              }
            }
            if (void 0 !== e3 && (e3.inputmask._valueSet(t3.join("")), void 0 === i3 || void 0 !== a2 && "blur" === a2.type || r.caret.call(l2, e3, i3, void 0, void 0, void 0 !== a2 && "keydown" === a2.type && (a2.key === n2.keys.Delete || a2.key === n2.keys.Backspace)), true === s2)) {
              var p = u2(e3), h = e3.inputmask._valueGet();
              e3.inputmask.skipInputEvent = true, p.trigger("input"), setTimeout(function() {
                h === r.getBufferTemplate.call(l2).join("") ? p.trigger("cleared") : true === o.isComplete.call(l2, t3) && p.trigger("complete");
              }, 0);
            }
          }
        },
        2394: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = void 0;
          var n2 = i2(157), a = m(i2(4963)), r = m(i2(9380)), o = i2(2391), s = i2(4713), l = i2(8711), c = i2(7215), u = i2(7760), f = i2(9716), d = m(i2(7392)), p = m(i2(3976)), h = m(i2(8741));
          function v(e3) {
            return v = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            }, v(e3);
          }
          function m(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          var g = r.default.document, y = "_inputmask_opts";
          function k(e3, t3, i3) {
            if (h.default) {
              if (!(this instanceof k))
                return new k(e3, t3, i3);
              this.dependencyLib = a.default, this.el = void 0, this.events = {}, this.maskset = void 0, true !== i3 && ("[object Object]" === Object.prototype.toString.call(e3) ? t3 = e3 : (t3 = t3 || {}, e3 && (t3.alias = e3)), this.opts = a.default.extend(true, {}, this.defaults, t3), this.noMasksCache = t3 && void 0 !== t3.definitions, this.userOptions = t3 || {}, b(this.opts.alias, t3, this.opts)), this.refreshValue = false, this.undoValue = void 0, this.$el = void 0, this.skipInputEvent = false, this.validationEvent = false, this.ignorable = false, this.maxLength, this.mouseEnter = false, this.clicked = 0, this.originalPlaceholder = void 0, this.isComposing = false, this.hasAlternator = false;
            }
          }
          function b(e3, t3, i3) {
            var n3 = k.prototype.aliases[e3];
            return n3 ? (n3.alias && b(n3.alias, void 0, i3), a.default.extend(true, i3, n3), a.default.extend(true, i3, t3), true) : (null === i3.mask && (i3.mask = e3), false);
          }
          k.prototype = {
            dataAttribute: "data-inputmask",
            defaults: p.default,
            definitions: d.default,
            aliases: {},
            masksCache: {},
            get isRTL() {
              return this.opts.isRTL || this.opts.numericInput;
            },
            mask: function(e3) {
              var t3 = this;
              return "string" == typeof e3 && (e3 = g.getElementById(e3) || g.querySelectorAll(e3)), (e3 = e3.nodeName ? [e3] : Array.isArray(e3) ? e3 : [].slice.call(e3)).forEach(function(e4, i3) {
                var s2 = a.default.extend(true, {}, t3.opts);
                if (function(e5, t4, i4, n3) {
                  function o2(t5, a2) {
                    var o3 = "" === n3 ? t5 : n3 + "-" + t5;
                    null !== (a2 = void 0 !== a2 ? a2 : e5.getAttribute(o3)) && ("string" == typeof a2 && (0 === t5.indexOf("on") ? a2 = r.default[a2] : "false" === a2 ? a2 = false : "true" === a2 && (a2 = true)), i4[t5] = a2);
                  }
                  if (true === t4.importDataAttributes) {
                    var s3, l3, c2, u2, f2 = e5.getAttribute(n3);
                    if (f2 && "" !== f2 && (f2 = f2.replace(/'/g, '"'), l3 = JSON.parse("{" + f2 + "}")), l3) {
                      for (u2 in c2 = void 0, l3)
                        if ("alias" === u2.toLowerCase()) {
                          c2 = l3[u2];
                          break;
                        }
                    }
                    for (s3 in o2("alias", c2), i4.alias && b(i4.alias, i4, t4), t4) {
                      if (l3) {
                        for (u2 in c2 = void 0, l3)
                          if (u2.toLowerCase() === s3.toLowerCase()) {
                            c2 = l3[u2];
                            break;
                          }
                      }
                      o2(s3, c2);
                    }
                  }
                  a.default.extend(true, t4, i4), ("rtl" === e5.dir || t4.rightAlign) && (e5.style.textAlign = "right");
                  ("rtl" === e5.dir || t4.numericInput) && (e5.dir = "ltr", e5.removeAttribute("dir"), t4.isRTL = true);
                  return Object.keys(i4).length;
                }(e4, s2, a.default.extend(true, {}, t3.userOptions), t3.dataAttribute)) {
                  var l2 = (0, o.generateMaskSet)(s2, t3.noMasksCache);
                  void 0 !== l2 && (void 0 !== e4.inputmask && (e4.inputmask.opts.autoUnmask = true, e4.inputmask.remove()), e4.inputmask = new k(void 0, void 0, true), e4.inputmask.opts = s2, e4.inputmask.noMasksCache = t3.noMasksCache, e4.inputmask.userOptions = a.default.extend(true, {}, t3.userOptions), e4.inputmask.el = e4, e4.inputmask.$el = (0, a.default)(e4), e4.inputmask.maskset = l2, a.default.data(e4, y, t3.userOptions), n2.mask.call(e4.inputmask));
                }
              }), e3 && e3[0] && e3[0].inputmask || this;
            },
            option: function(e3, t3) {
              return "string" == typeof e3 ? this.opts[e3] : "object" === v(e3) ? (a.default.extend(this.userOptions, e3), this.el && true !== t3 && this.mask(this.el), this) : void 0;
            },
            unmaskedvalue: function(e3) {
              if (this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache), void 0 === this.el || void 0 !== e3) {
                var t3 = ("function" == typeof this.opts.onBeforeMask && this.opts.onBeforeMask.call(this, e3, this.opts) || e3).split("");
                u.checkVal.call(this, void 0, false, false, t3), "function" == typeof this.opts.onBeforeWrite && this.opts.onBeforeWrite.call(this, void 0, l.getBuffer.call(this), 0, this.opts);
              }
              return u.unmaskedvalue.call(this, this.el);
            },
            remove: function() {
              if (this.el) {
                a.default.data(this.el, y, null);
                var e3 = this.opts.autoUnmask ? (0, u.unmaskedvalue)(this.el) : this._valueGet(this.opts.autoUnmask);
                e3 !== l.getBufferTemplate.call(this).join("") ? this._valueSet(e3, this.opts.autoUnmask) : this._valueSet(""), f.EventRuler.off(this.el), Object.getOwnPropertyDescriptor && Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.el), "value") && this.__valueGet && Object.defineProperty(this.el, "value", {
                  get: this.__valueGet,
                  set: this.__valueSet,
                  configurable: true
                }) : g.__lookupGetter__ && this.el.__lookupGetter__("value") && this.__valueGet && (this.el.__defineGetter__("value", this.__valueGet), this.el.__defineSetter__("value", this.__valueSet)), this.el.inputmask = void 0;
              }
              return this.el;
            },
            getemptymask: function() {
              return this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache), (this.isRTL ? l.getBufferTemplate.call(this).reverse() : l.getBufferTemplate.call(this)).join("");
            },
            hasMaskedValue: function() {
              return !this.opts.autoUnmask;
            },
            isComplete: function() {
              return this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache), c.isComplete.call(this, l.getBuffer.call(this));
            },
            getmetadata: function() {
              if (this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache), Array.isArray(this.maskset.metadata)) {
                var e3 = s.getMaskTemplate.call(this, true, 0, false).join("");
                return this.maskset.metadata.forEach(function(t3) {
                  return t3.mask !== e3 || (e3 = t3, false);
                }), e3;
              }
              return this.maskset.metadata;
            },
            isValid: function(e3) {
              if (this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache), e3) {
                var t3 = ("function" == typeof this.opts.onBeforeMask && this.opts.onBeforeMask.call(this, e3, this.opts) || e3).split("");
                u.checkVal.call(this, void 0, true, false, t3);
              } else
                e3 = this.isRTL ? l.getBuffer.call(this).slice().reverse().join("") : l.getBuffer.call(this).join("");
              for (var i3 = l.getBuffer.call(this), n3 = l.determineLastRequiredPosition.call(this), a2 = i3.length - 1; a2 > n3 && !l.isMask.call(this, a2); a2--)
                ;
              return i3.splice(n3, a2 + 1 - n3), c.isComplete.call(this, i3) && e3 === (this.isRTL ? l.getBuffer.call(this).slice().reverse().join("") : l.getBuffer.call(this).join(""));
            },
            format: function(e3, t3) {
              this.maskset = this.maskset || (0, o.generateMaskSet)(this.opts, this.noMasksCache);
              var i3 = ("function" == typeof this.opts.onBeforeMask && this.opts.onBeforeMask.call(this, e3, this.opts) || e3).split("");
              u.checkVal.call(this, void 0, true, false, i3);
              var n3 = this.isRTL ? l.getBuffer.call(this).slice().reverse().join("") : l.getBuffer.call(this).join("");
              return t3 ? {
                value: n3,
                metadata: this.getmetadata()
              } : n3;
            },
            setValue: function(e3) {
              this.el && (0, a.default)(this.el).trigger("setvalue", [e3]);
            },
            analyseMask: o.analyseMask
          }, k.extendDefaults = function(e3) {
            a.default.extend(true, k.prototype.defaults, e3);
          }, k.extendDefinitions = function(e3) {
            a.default.extend(true, k.prototype.definitions, e3);
          }, k.extendAliases = function(e3) {
            a.default.extend(true, k.prototype.aliases, e3);
          }, k.format = function(e3, t3, i3) {
            return k(t3).format(e3, i3);
          }, k.unmask = function(e3, t3) {
            return k(t3).unmaskedvalue(e3);
          }, k.isValid = function(e3, t3) {
            return k(t3).isValid(e3);
          }, k.remove = function(e3) {
            "string" == typeof e3 && (e3 = g.getElementById(e3) || g.querySelectorAll(e3)), (e3 = e3.nodeName ? [e3] : e3).forEach(function(e4) {
              e4.inputmask && e4.inputmask.remove();
            });
          }, k.setValue = function(e3, t3) {
            "string" == typeof e3 && (e3 = g.getElementById(e3) || g.querySelectorAll(e3)), (e3 = e3.nodeName ? [e3] : e3).forEach(function(e4) {
              e4.inputmask ? e4.inputmask.setValue(t3) : (0, a.default)(e4).trigger("setvalue", [t3]);
            });
          }, k.dependencyLib = a.default, r.default.Inputmask = k;
          var x = k;
          t2.default = x;
        },
        5296: function(e2, t2, i2) {
          function n2(e3) {
            return n2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            }, n2(e3);
          }
          var a = h(i2(9380)), r = h(i2(2394)), o = h(i2(8741));
          function l(e3) {
            var t3 = f();
            return function() {
              var i3, a2 = p(e3);
              if (t3) {
                var r2 = p(this).constructor;
                i3 = Reflect.construct(a2, arguments, r2);
              } else
                i3 = a2.apply(this, arguments);
              return function(e4, t4) {
                if (t4 && ("object" === n2(t4) || "function" == typeof t4))
                  return t4;
                if (void 0 !== t4)
                  throw new TypeError("Derived constructors may only return object or undefined");
                return function(e5) {
                  if (void 0 === e5)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  return e5;
                }(e4);
              }(this, i3);
            };
          }
          function c(e3) {
            var t3 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
            return c = function(e4) {
              if (null === e4 || (i3 = e4, -1 === Function.toString.call(i3).indexOf("[native code]")))
                return e4;
              var i3;
              if ("function" != typeof e4)
                throw new TypeError("Super expression must either be null or a function");
              if (void 0 !== t3) {
                if (t3.has(e4))
                  return t3.get(e4);
                t3.set(e4, n3);
              }
              function n3() {
                return u(e4, arguments, p(this).constructor);
              }
              return n3.prototype = Object.create(e4.prototype, {
                constructor: {
                  value: n3,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              }), d(n3, e4);
            }, c(e3);
          }
          function u(e3, t3, i3) {
            return u = f() ? Reflect.construct.bind() : function(e4, t4, i4) {
              var n3 = [null];
              n3.push.apply(n3, t4);
              var a2 = new (Function.bind.apply(e4, n3))();
              return i4 && d(a2, i4.prototype), a2;
            }, u.apply(null, arguments);
          }
          function f() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if ("function" == typeof Proxy)
              return true;
            try {
              return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              })), true;
            } catch (e3) {
              return false;
            }
          }
          function d(e3, t3) {
            return d = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
              return e4.__proto__ = t4, e4;
            }, d(e3, t3);
          }
          function p(e3) {
            return p = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
              return e4.__proto__ || Object.getPrototypeOf(e4);
            }, p(e3);
          }
          function h(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
          var v = a.default.document;
          if (o.default && v && v.head && v.head.attachShadow && a.default.customElements && void 0 === a.default.customElements.get("input-mask")) {
            var m = function(e3) {
              !function(e4, t4) {
                if ("function" != typeof t4 && null !== t4)
                  throw new TypeError("Super expression must either be null or a function");
                e4.prototype = Object.create(t4 && t4.prototype, {
                  constructor: {
                    value: e4,
                    writable: true,
                    configurable: true
                  }
                }), Object.defineProperty(e4, "prototype", {
                  writable: false
                }), t4 && d(e4, t4);
              }(o2, e3);
              var t3, a2 = l(o2);
              function o2() {
                var e4;
                !function(e5, t5) {
                  if (!(e5 instanceof t5))
                    throw new TypeError("Cannot call a class as a function");
                }(this, o2);
                var t4 = (e4 = a2.call(this)).getAttributeNames(), i3 = e4.attachShadow({
                  mode: "closed"
                }), n3 = v.createElement("input");
                for (var s in n3.type = "text", i3.appendChild(n3), t4)
                  Object.prototype.hasOwnProperty.call(t4, s) && n3.setAttribute(t4[s], e4.getAttribute(t4[s]));
                var l2 = new r.default();
                return l2.dataAttribute = "", l2.mask(n3), n3.inputmask.shadowRoot = i3, e4;
              }
              return t3 = o2, Object.defineProperty(t3, "prototype", {
                writable: false
              }), t3;
            }(c(HTMLElement));
            a.default.customElements.define("input-mask", m);
          }
        },
        2839: function(e2, t2) {
          function i2(e3, t3) {
            return function(e4) {
              if (Array.isArray(e4))
                return e4;
            }(e3) || function(e4, t4) {
              var i3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
              if (null != i3) {
                var n3, a2, r2, o2, s = [], l = true, c = false;
                try {
                  if (r2 = (i3 = i3.call(e4)).next, 0 === t4) {
                    if (Object(i3) !== i3)
                      return;
                    l = false;
                  } else
                    for (; !(l = (n3 = r2.call(i3)).done) && (s.push(n3.value), s.length !== t4); l = true)
                      ;
                } catch (e5) {
                  c = true, a2 = e5;
                } finally {
                  try {
                    if (!l && null != i3.return && (o2 = i3.return(), Object(o2) !== o2))
                      return;
                  } finally {
                    if (c)
                      throw a2;
                  }
                }
                return s;
              }
            }(e3, t3) || function(e4, t4) {
              if (!e4)
                return;
              if ("string" == typeof e4)
                return n2(e4, t4);
              var i3 = Object.prototype.toString.call(e4).slice(8, -1);
              "Object" === i3 && e4.constructor && (i3 = e4.constructor.name);
              if ("Map" === i3 || "Set" === i3)
                return Array.from(e4);
              if ("Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3))
                return n2(e4, t4);
            }(e3, t3) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function n2(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var i3 = 0, n3 = new Array(t3); i3 < t3; i3++)
              n3[i3] = e3[i3];
            return n3;
          }
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.keys = t2.keyCode = void 0, t2.toKey = function(e3, t3) {
            return r[e3] || (t3 ? String.fromCharCode(e3) : String.fromCharCode(e3).toLowerCase());
          }, t2.toKeyCode = function(e3) {
            return a[e3];
          };
          var a = {
            AltGraph: 18,
            ArrowDown: 40,
            ArrowLeft: 37,
            ArrowRight: 39,
            ArrowUp: 38,
            Backspace: 8,
            BACKSPACE_SAFARI: 127,
            CapsLock: 20,
            Delete: 46,
            End: 35,
            Enter: 13,
            Escape: 27,
            Home: 36,
            Insert: 45,
            PageDown: 34,
            PageUp: 33,
            Space: 32,
            Tab: 9,
            c: 67,
            x: 88,
            z: 90,
            Shift: 16,
            Control: 17,
            Alt: 18,
            Pause: 19,
            Meta_LEFT: 91,
            Meta_RIGHT: 92,
            ContextMenu: 93,
            Process: 229,
            Unidentified: 229,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123
          };
          t2.keyCode = a;
          var r = Object.entries(a).reduce(function(e3, t3) {
            var n3 = i2(t3, 2), a2 = n3[0], r2 = n3[1];
            return e3[r2] = void 0 === e3[r2] ? a2 : e3[r2], e3;
          }, {}), o = Object.entries(a).reduce(function(e3, t3) {
            var n3 = i2(t3, 2), a2 = n3[0];
            n3[1];
            return e3[a2] = "Space" === a2 ? " " : a2, e3;
          }, {});
          t2.keys = o;
        },
        2391: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.analyseMask = function(e3, t3, i3) {
            var n3, o2, s2, l2, c, u, f = /(?:[?*+]|\{[0-9+*]+(?:,[0-9+*]*)?(?:\|[0-9+*]*)?\})|[^.?*+^${[]()|\\]+|./g, d = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g, p = false, h = new a.default(), v = [], m = [], g = false;
            function y(e4, n4, a2) {
              a2 = void 0 !== a2 ? a2 : e4.matches.length;
              var o3 = e4.matches[a2 - 1];
              if (t3) {
                if (0 === n4.indexOf("[") || p && /\\d|\\s|\\w|\\p/i.test(n4) || "." === n4) {
                  var s3 = i3.casing ? "i" : "";
                  /^\\p\{.*}$/i.test(n4) && (s3 += "u"), e4.matches.splice(a2++, 0, {
                    fn: new RegExp(n4, s3),
                    static: false,
                    optionality: false,
                    newBlockMarker: void 0 === o3 ? "master" : o3.def !== n4,
                    casing: null,
                    def: n4,
                    placeholder: void 0,
                    nativeDef: n4
                  });
                } else
                  p && (n4 = n4[n4.length - 1]), n4.split("").forEach(function(t4, n5) {
                    o3 = e4.matches[a2 - 1], e4.matches.splice(a2++, 0, {
                      fn: /[a-z]/i.test(i3.staticDefinitionSymbol || t4) ? new RegExp("[" + (i3.staticDefinitionSymbol || t4) + "]", i3.casing ? "i" : "") : null,
                      static: true,
                      optionality: false,
                      newBlockMarker: void 0 === o3 ? "master" : o3.def !== t4 && true !== o3.static,
                      casing: null,
                      def: i3.staticDefinitionSymbol || t4,
                      placeholder: void 0 !== i3.staticDefinitionSymbol ? t4 : void 0,
                      nativeDef: (p ? "'" : "") + t4
                    });
                  });
                p = false;
              } else {
                var l3 = i3.definitions && i3.definitions[n4] || i3.usePrototypeDefinitions && r.default.prototype.definitions[n4];
                l3 && !p ? e4.matches.splice(a2++, 0, {
                  fn: l3.validator ? "string" == typeof l3.validator ? new RegExp(l3.validator, i3.casing ? "i" : "") : new function() {
                    this.test = l3.validator;
                  }() : new RegExp("."),
                  static: l3.static || false,
                  optionality: l3.optional || false,
                  defOptionality: l3.optional || false,
                  newBlockMarker: void 0 === o3 || l3.optional ? "master" : o3.def !== (l3.definitionSymbol || n4),
                  casing: l3.casing,
                  def: l3.definitionSymbol || n4,
                  placeholder: l3.placeholder,
                  nativeDef: n4,
                  generated: l3.generated
                }) : (e4.matches.splice(a2++, 0, {
                  fn: /[a-z]/i.test(i3.staticDefinitionSymbol || n4) ? new RegExp("[" + (i3.staticDefinitionSymbol || n4) + "]", i3.casing ? "i" : "") : null,
                  static: true,
                  optionality: false,
                  newBlockMarker: void 0 === o3 ? "master" : o3.def !== n4 && true !== o3.static,
                  casing: null,
                  def: i3.staticDefinitionSymbol || n4,
                  placeholder: void 0 !== i3.staticDefinitionSymbol ? n4 : void 0,
                  nativeDef: (p ? "'" : "") + n4
                }), p = false);
              }
            }
            function k() {
              if (v.length > 0) {
                if (y(l2 = v[v.length - 1], o2), l2.isAlternator) {
                  c = v.pop();
                  for (var e4 = 0; e4 < c.matches.length; e4++)
                    c.matches[e4].isGroup && (c.matches[e4].isGroup = false);
                  v.length > 0 ? (l2 = v[v.length - 1]).matches.push(c) : h.matches.push(c);
                }
              } else
                y(h, o2);
            }
            function b(e4) {
              var t4 = new a.default(true);
              return t4.openGroup = false, t4.matches = e4, t4;
            }
            function x() {
              if ((s2 = v.pop()).openGroup = false, void 0 !== s2)
                if (v.length > 0) {
                  if ((l2 = v[v.length - 1]).matches.push(s2), l2.isAlternator) {
                    for (var e4 = (c = v.pop()).matches[0].matches ? c.matches[0].matches.length : 1, t4 = 0; t4 < c.matches.length; t4++)
                      c.matches[t4].isGroup = false, c.matches[t4].alternatorGroup = false, null === i3.keepStatic && e4 < (c.matches[t4].matches ? c.matches[t4].matches.length : 1) && (i3.keepStatic = true), e4 = c.matches[t4].matches ? c.matches[t4].matches.length : 1;
                    v.length > 0 ? (l2 = v[v.length - 1]).matches.push(c) : h.matches.push(c);
                  }
                } else
                  h.matches.push(s2);
              else
                k();
            }
            function P(e4) {
              var t4 = e4.pop();
              return t4.isQuantifier && (t4 = b([e4.pop(), t4])), t4;
            }
            t3 && (i3.optionalmarker[0] = void 0, i3.optionalmarker[1] = void 0);
            for (; n3 = t3 ? d.exec(e3) : f.exec(e3); ) {
              if (o2 = n3[0], t3) {
                switch (o2.charAt(0)) {
                  case "?":
                    o2 = "{0,1}";
                    break;
                  case "+":
                  case "*":
                    o2 = "{" + o2 + "}";
                    break;
                  case "|":
                    if (0 === v.length) {
                      var w = b(h.matches);
                      w.openGroup = true, v.push(w), h.matches = [], g = true;
                    }
                }
                switch (o2) {
                  case "\\d":
                    o2 = "[0-9]";
                    break;
                  case "\\p":
                    o2 += d.exec(e3)[0], o2 += d.exec(e3)[0];
                }
              }
              if (p)
                k();
              else
                switch (o2.charAt(0)) {
                  case "$":
                  case "^":
                    t3 || k();
                    break;
                  case i3.escapeChar:
                    p = true, t3 && k();
                    break;
                  case i3.optionalmarker[1]:
                  case i3.groupmarker[1]:
                    x();
                    break;
                  case i3.optionalmarker[0]:
                    v.push(new a.default(false, true));
                    break;
                  case i3.groupmarker[0]:
                    v.push(new a.default(true));
                    break;
                  case i3.quantifiermarker[0]:
                    var S = new a.default(false, false, true), M = (o2 = o2.replace(/[{}?]/g, "")).split("|"), _ = M[0].split(","), O = isNaN(_[0]) ? _[0] : parseInt(_[0]), E = 1 === _.length ? O : isNaN(_[1]) ? _[1] : parseInt(_[1]), T = isNaN(M[1]) ? M[1] : parseInt(M[1]);
                    "*" !== O && "+" !== O || (O = "*" === E ? 0 : 1), S.quantifier = {
                      min: O,
                      max: E,
                      jit: T
                    };
                    var j = v.length > 0 ? v[v.length - 1].matches : h.matches;
                    (n3 = j.pop()).isGroup || (n3 = b([n3])), j.push(n3), j.push(S);
                    break;
                  case i3.alternatormarker:
                    if (v.length > 0) {
                      var A = (l2 = v[v.length - 1]).matches[l2.matches.length - 1];
                      u = l2.openGroup && (void 0 === A.matches || false === A.isGroup && false === A.isAlternator) ? v.pop() : P(l2.matches);
                    } else
                      u = P(h.matches);
                    if (u.isAlternator)
                      v.push(u);
                    else if (u.alternatorGroup ? (c = v.pop(), u.alternatorGroup = false) : c = new a.default(false, false, false, true), c.matches.push(u), v.push(c), u.openGroup) {
                      u.openGroup = false;
                      var D = new a.default(true);
                      D.alternatorGroup = true, v.push(D);
                    }
                    break;
                  default:
                    k();
                }
            }
            g && x();
            for (; v.length > 0; )
              s2 = v.pop(), h.matches.push(s2);
            h.matches.length > 0 && (!function e4(n4) {
              n4 && n4.matches && n4.matches.forEach(function(a2, r2) {
                var o3 = n4.matches[r2 + 1];
                (void 0 === o3 || void 0 === o3.matches || false === o3.isQuantifier) && a2 && a2.isGroup && (a2.isGroup = false, t3 || (y(a2, i3.groupmarker[0], 0), true !== a2.openGroup && y(a2, i3.groupmarker[1]))), e4(a2);
              });
            }(h), m.push(h));
            (i3.numericInput || i3.isRTL) && function e4(t4) {
              for (var n4 in t4.matches = t4.matches.reverse(), t4.matches)
                if (Object.prototype.hasOwnProperty.call(t4.matches, n4)) {
                  var a2 = parseInt(n4);
                  if (t4.matches[n4].isQuantifier && t4.matches[a2 + 1] && t4.matches[a2 + 1].isGroup) {
                    var r2 = t4.matches[n4];
                    t4.matches.splice(n4, 1), t4.matches.splice(a2 + 1, 0, r2);
                  }
                  void 0 !== t4.matches[n4].matches ? t4.matches[n4] = e4(t4.matches[n4]) : t4.matches[n4] = ((o3 = t4.matches[n4]) === i3.optionalmarker[0] ? o3 = i3.optionalmarker[1] : o3 === i3.optionalmarker[1] ? o3 = i3.optionalmarker[0] : o3 === i3.groupmarker[0] ? o3 = i3.groupmarker[1] : o3 === i3.groupmarker[1] && (o3 = i3.groupmarker[0]), o3);
                }
              var o3;
              return t4;
            }(m[0]);
            return m;
          }, t2.generateMaskSet = function(e3, t3) {
            var i3;
            function a2(e4, t4) {
              var i4 = t4.repeat, n3 = t4.groupmarker, a3 = t4.quantifiermarker, r2 = t4.keepStatic;
              if (i4 > 0 || "*" === i4 || "+" === i4) {
                var l3 = "*" === i4 ? 0 : "+" === i4 ? 1 : i4;
                e4 = n3[0] + e4 + n3[1] + a3[0] + l3 + "," + i4 + a3[1];
              }
              if (true === r2) {
                var c2 = e4.match(new RegExp("(.)\\[([^\\]]*)\\]", "g"));
                c2 && c2.forEach(function(t5, i5) {
                  var n4 = function(e5, t6) {
                    return function(e6) {
                      if (Array.isArray(e6))
                        return e6;
                    }(e5) || function(e6, t7) {
                      var i6 = null == e6 ? null : "undefined" != typeof Symbol && e6[Symbol.iterator] || e6["@@iterator"];
                      if (null != i6) {
                        var n5, a5, r4, o2, s2 = [], l4 = true, c3 = false;
                        try {
                          if (r4 = (i6 = i6.call(e6)).next, 0 === t7) {
                            if (Object(i6) !== i6)
                              return;
                            l4 = false;
                          } else
                            for (; !(l4 = (n5 = r4.call(i6)).done) && (s2.push(n5.value), s2.length !== t7); l4 = true)
                              ;
                        } catch (e7) {
                          c3 = true, a5 = e7;
                        } finally {
                          try {
                            if (!l4 && null != i6.return && (o2 = i6.return(), Object(o2) !== o2))
                              return;
                          } finally {
                            if (c3)
                              throw a5;
                          }
                        }
                        return s2;
                      }
                    }(e5, t6) || function(e6, t7) {
                      if (!e6)
                        return;
                      if ("string" == typeof e6)
                        return s(e6, t7);
                      var i6 = Object.prototype.toString.call(e6).slice(8, -1);
                      "Object" === i6 && e6.constructor && (i6 = e6.constructor.name);
                      if ("Map" === i6 || "Set" === i6)
                        return Array.from(e6);
                      if ("Arguments" === i6 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i6))
                        return s(e6, t7);
                    }(e5, t6) || function() {
                      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                    }();
                  }(t5.split("["), 2), a4 = n4[0], r3 = n4[1];
                  r3 = r3.replace("]", ""), e4 = e4.replace(new RegExp("".concat((0, o.default)(a4), "\\[").concat((0, o.default)(r3), "\\]")), a4.charAt(0) === r3.charAt(0) ? "(".concat(a4, "|").concat(a4).concat(r3, ")") : "".concat(a4, "[").concat(r3, "]"));
                });
              }
              return e4;
            }
            function l2(e4, i4, o2) {
              var s2, l3, c2 = false;
              return null !== e4 && "" !== e4 || ((c2 = null !== o2.regex) ? e4 = (e4 = o2.regex).replace(/^(\^)(.*)(\$)$/, "$2") : (c2 = true, e4 = ".*")), 1 === e4.length && false === o2.greedy && 0 !== o2.repeat && (o2.placeholder = ""), e4 = a2(e4, o2), l3 = c2 ? "regex_" + o2.regex : o2.numericInput ? e4.split("").reverse().join("") : e4, null !== o2.keepStatic && (l3 = "ks_" + o2.keepStatic + l3), void 0 === r.default.prototype.masksCache[l3] || true === t3 ? (s2 = {
                mask: e4,
                maskToken: r.default.prototype.analyseMask(e4, c2, o2),
                validPositions: [],
                _buffer: void 0,
                buffer: void 0,
                tests: {},
                excludes: {},
                metadata: i4,
                maskLength: void 0,
                jitOffset: {}
              }, true !== t3 && (r.default.prototype.masksCache[l3] = s2, s2 = n2.default.extend(true, {}, r.default.prototype.masksCache[l3]))) : s2 = n2.default.extend(true, {}, r.default.prototype.masksCache[l3]), s2;
            }
            "function" == typeof e3.mask && (e3.mask = e3.mask(e3));
            if (Array.isArray(e3.mask)) {
              if (e3.mask.length > 1) {
                null === e3.keepStatic && (e3.keepStatic = true);
                var c = e3.groupmarker[0];
                return (e3.isRTL ? e3.mask.reverse() : e3.mask).forEach(function(t4) {
                  c.length > 1 && (c += e3.alternatormarker), void 0 !== t4.mask && "function" != typeof t4.mask ? c += t4.mask : c += t4;
                }), l2(c += e3.groupmarker[1], e3.mask, e3);
              }
              e3.mask = e3.mask.pop();
            }
            i3 = e3.mask && void 0 !== e3.mask.mask && "function" != typeof e3.mask.mask ? l2(e3.mask.mask, e3.mask, e3) : l2(e3.mask, e3.mask, e3);
            null === e3.keepStatic && (e3.keepStatic = false);
            return i3;
          };
          var n2 = l(i2(4963)), a = l(i2(9695)), r = l(i2(2394)), o = l(i2(7184));
          function s(e3, t3) {
            (null == t3 || t3 > e3.length) && (t3 = e3.length);
            for (var i3 = 0, n3 = new Array(t3); i3 < t3; i3++)
              n3[i3] = e3[i3];
            return n3;
          }
          function l(e3) {
            return e3 && e3.__esModule ? e3 : {
              default: e3
            };
          }
        },
        157: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.mask = function() {
            var e3 = this, t3 = this.opts, i3 = this.el, u = this.dependencyLib;
            o.EventRuler.off(i3);
            var f = function(t4, i4) {
              "textarea" !== t4.tagName.toLowerCase() && i4.ignorables.push(n2.keys.Enter);
              var s2 = t4.getAttribute("type"), l2 = "input" === t4.tagName.toLowerCase() && i4.supportsInputType.includes(s2) || t4.isContentEditable || "textarea" === t4.tagName.toLowerCase();
              if (!l2)
                if ("input" === t4.tagName.toLowerCase()) {
                  var c2 = document.createElement("input");
                  c2.setAttribute("type", s2), l2 = "text" === c2.type, c2 = null;
                } else
                  l2 = "partial";
              return false !== l2 ? function(t5) {
                var n3, s3;
                function l3() {
                  return this.inputmask ? this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : -1 !== a.getLastValidPosition.call(e3) || true !== i4.nullable ? (this.inputmask.shadowRoot || this.ownerDocument).activeElement === this && i4.clearMaskOnLostFocus ? (e3.isRTL ? r.clearOptionalTail.call(e3, a.getBuffer.call(e3).slice()).reverse() : r.clearOptionalTail.call(e3, a.getBuffer.call(e3).slice())).join("") : n3.call(this) : "" : n3.call(this);
                }
                function c3(e4) {
                  s3.call(this, e4), this.inputmask && (0, r.applyInputValue)(this, e4);
                }
                if (!t5.inputmask.__valueGet) {
                  if (true !== i4.noValuePatching) {
                    if (Object.getOwnPropertyDescriptor) {
                      var f2 = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(t5), "value") : void 0;
                      f2 && f2.get && f2.set ? (n3 = f2.get, s3 = f2.set, Object.defineProperty(t5, "value", {
                        get: l3,
                        set: c3,
                        configurable: true
                      })) : "input" !== t5.tagName.toLowerCase() && (n3 = function() {
                        return this.textContent;
                      }, s3 = function(e4) {
                        this.textContent = e4;
                      }, Object.defineProperty(t5, "value", {
                        get: l3,
                        set: c3,
                        configurable: true
                      }));
                    } else
                      document.__lookupGetter__ && t5.__lookupGetter__("value") && (n3 = t5.__lookupGetter__("value"), s3 = t5.__lookupSetter__("value"), t5.__defineGetter__("value", l3), t5.__defineSetter__("value", c3));
                    t5.inputmask.__valueGet = n3, t5.inputmask.__valueSet = s3;
                  }
                  t5.inputmask._valueGet = function(t6) {
                    return e3.isRTL && true !== t6 ? n3.call(this.el).split("").reverse().join("") : n3.call(this.el);
                  }, t5.inputmask._valueSet = function(t6, i5) {
                    s3.call(this.el, null == t6 ? "" : true !== i5 && e3.isRTL ? t6.split("").reverse().join("") : t6);
                  }, void 0 === n3 && (n3 = function() {
                    return this.value;
                  }, s3 = function(e4) {
                    this.value = e4;
                  }, function(t6) {
                    if (u.valHooks && (void 0 === u.valHooks[t6] || true !== u.valHooks[t6].inputmaskpatch)) {
                      var n4 = u.valHooks[t6] && u.valHooks[t6].get ? u.valHooks[t6].get : function(e4) {
                        return e4.value;
                      }, o2 = u.valHooks[t6] && u.valHooks[t6].set ? u.valHooks[t6].set : function(e4, t7) {
                        return e4.value = t7, e4;
                      };
                      u.valHooks[t6] = {
                        get: function(t7) {
                          if (t7.inputmask) {
                            if (t7.inputmask.opts.autoUnmask)
                              return t7.inputmask.unmaskedvalue();
                            var r2 = n4(t7);
                            return -1 !== a.getLastValidPosition.call(e3, void 0, void 0, t7.inputmask.maskset.validPositions) || true !== i4.nullable ? r2 : "";
                          }
                          return n4(t7);
                        },
                        set: function(e4, t7) {
                          var i5 = o2(e4, t7);
                          return e4.inputmask && (0, r.applyInputValue)(e4, t7), i5;
                        },
                        inputmaskpatch: true
                      };
                    }
                  }(t5.type), function(e4) {
                    o.EventRuler.on(e4, "mouseenter", function() {
                      var e5 = this, t6 = e5.inputmask._valueGet(true);
                      t6 != (e5.inputmask.isRTL ? a.getBuffer.call(e5.inputmask).slice().reverse() : a.getBuffer.call(e5.inputmask)).join("") && (0, r.applyInputValue)(e5, t6);
                    });
                  }(t5));
                }
              }(t4) : t4.inputmask = void 0, l2;
            }(i3, t3);
            if (false !== f) {
              e3.originalPlaceholder = i3.placeholder, e3.maxLength = void 0 !== i3 ? i3.maxLength : void 0, -1 === e3.maxLength && (e3.maxLength = void 0), "inputMode" in i3 && null === i3.getAttribute("inputmode") && (i3.inputMode = t3.inputmode, i3.setAttribute("inputmode", t3.inputmode)), true === f && (t3.showMaskOnFocus = t3.showMaskOnFocus && -1 === ["cc-number", "cc-exp"].indexOf(i3.autocomplete), s.iphone && (t3.insertModeVisual = false, i3.setAttribute("autocorrect", "off")), o.EventRuler.on(i3, "submit", c.EventHandlers.submitEvent), o.EventRuler.on(i3, "reset", c.EventHandlers.resetEvent), o.EventRuler.on(i3, "blur", c.EventHandlers.blurEvent), o.EventRuler.on(i3, "focus", c.EventHandlers.focusEvent), o.EventRuler.on(i3, "invalid", c.EventHandlers.invalidEvent), o.EventRuler.on(i3, "click", c.EventHandlers.clickEvent), o.EventRuler.on(i3, "mouseleave", c.EventHandlers.mouseleaveEvent), o.EventRuler.on(i3, "mouseenter", c.EventHandlers.mouseenterEvent), o.EventRuler.on(i3, "paste", c.EventHandlers.pasteEvent), o.EventRuler.on(i3, "cut", c.EventHandlers.cutEvent), o.EventRuler.on(i3, "complete", t3.oncomplete), o.EventRuler.on(i3, "incomplete", t3.onincomplete), o.EventRuler.on(i3, "cleared", t3.oncleared), true !== t3.inputEventOnly && o.EventRuler.on(i3, "keydown", c.EventHandlers.keyEvent), (s.mobile || t3.inputEventOnly) && i3.removeAttribute("maxLength"), o.EventRuler.on(i3, "input", c.EventHandlers.inputFallBackEvent)), o.EventRuler.on(i3, "setvalue", c.EventHandlers.setValueEvent), a.getBufferTemplate.call(e3).join(""), e3.undoValue = e3._valueGet(true);
              var d = (i3.inputmask.shadowRoot || i3.ownerDocument).activeElement;
              if ("" !== i3.inputmask._valueGet(true) || false === t3.clearMaskOnLostFocus || d === i3) {
                (0, r.applyInputValue)(i3, i3.inputmask._valueGet(true), t3);
                var p = a.getBuffer.call(e3).slice();
                false === l.isComplete.call(e3, p) && t3.clearIncomplete && a.resetMaskSet.call(e3), t3.clearMaskOnLostFocus && d !== i3 && (-1 === a.getLastValidPosition.call(e3) ? p = [] : r.clearOptionalTail.call(e3, p)), (false === t3.clearMaskOnLostFocus || t3.showMaskOnFocus && d === i3 || "" !== i3.inputmask._valueGet(true)) && (0, r.writeBuffer)(i3, p), d === i3 && a.caret.call(e3, i3, a.seekNext.call(e3, a.getLastValidPosition.call(e3)));
              }
            }
          };
          var n2 = i2(2839), a = i2(8711), r = i2(7760), o = i2(9716), s = i2(9845), l = i2(7215), c = i2(6030);
        },
        9695: function(e2, t2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.default = function(e3, t3, i2, n2) {
            this.matches = [], this.openGroup = e3 || false, this.alternatorGroup = false, this.isGroup = e3 || false, this.isOptional = t3 || false, this.isQuantifier = i2 || false, this.isAlternator = n2 || false, this.quantifier = {
              min: 1,
              max: 1
            };
          };
        },
        3194: function() {
          Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
            value: function(e2, t2) {
              if (null == this)
                throw new TypeError('"this" is null or not defined');
              var i2 = Object(this), n2 = i2.length >>> 0;
              if (0 === n2)
                return false;
              for (var a = 0 | t2, r = Math.max(a >= 0 ? a : n2 - Math.abs(a), 0); r < n2; ) {
                if (i2[r] === e2)
                  return true;
                r++;
              }
              return false;
            }
          });
        },
        9302: function() {
          var e2 = Function.bind.call(Function.call, Array.prototype.reduce), t2 = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable), i2 = Function.bind.call(Function.call, Array.prototype.concat), n2 = Object.keys;
          Object.entries || (Object.entries = function(a) {
            return e2(n2(a), function(e3, n3) {
              return i2(e3, "string" == typeof n3 && t2(a, n3) ? [[n3, a[n3]]] : []);
            }, []);
          });
        },
        7149: function() {
          function e2(t2) {
            return e2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
              return typeof e3;
            } : function(e3) {
              return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
            }, e2(t2);
          }
          "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" === e2("test".__proto__) ? function(e3) {
            return e3.__proto__;
          } : function(e3) {
            return e3.constructor.prototype;
          });
        },
        4013: function() {
          String.prototype.includes || (String.prototype.includes = function(e2, t2) {
            return "number" != typeof t2 && (t2 = 0), !(t2 + e2.length > this.length) && -1 !== this.indexOf(e2, t2);
          });
        },
        8711: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.caret = function(e3, t3, i3, n3, a2) {
            var r2, o2 = this, s2 = this.opts;
            if (void 0 === t3)
              return "selectionStart" in e3 && "selectionEnd" in e3 ? (t3 = e3.selectionStart, i3 = e3.selectionEnd) : window.getSelection ? (r2 = window.getSelection().getRangeAt(0)).commonAncestorContainer.parentNode !== e3 && r2.commonAncestorContainer !== e3 || (t3 = r2.startOffset, i3 = r2.endOffset) : document.selection && document.selection.createRange && (i3 = (t3 = 0 - (r2 = document.selection.createRange()).duplicate().moveStart("character", -e3.inputmask._valueGet().length)) + r2.text.length), {
                begin: n3 ? t3 : c.call(o2, t3),
                end: n3 ? i3 : c.call(o2, i3)
              };
            if (Array.isArray(t3) && (i3 = o2.isRTL ? t3[0] : t3[1], t3 = o2.isRTL ? t3[1] : t3[0]), void 0 !== t3.begin && (i3 = o2.isRTL ? t3.begin : t3.end, t3 = o2.isRTL ? t3.end : t3.begin), "number" == typeof t3) {
              t3 = n3 ? t3 : c.call(o2, t3), i3 = "number" == typeof (i3 = n3 ? i3 : c.call(o2, i3)) ? i3 : t3;
              var l2 = parseInt(((e3.ownerDocument.defaultView || window).getComputedStyle ? (e3.ownerDocument.defaultView || window).getComputedStyle(e3, null) : e3.currentStyle).fontSize) * i3;
              if (e3.scrollLeft = l2 > e3.scrollWidth ? l2 : 0, e3.inputmask.caretPos = {
                begin: t3,
                end: i3
              }, s2.insertModeVisual && false === s2.insertMode && t3 === i3 && (a2 || i3++), e3 === (e3.inputmask.shadowRoot || e3.ownerDocument).activeElement)
                if ("setSelectionRange" in e3)
                  e3.setSelectionRange(t3, i3);
                else if (window.getSelection) {
                  if (r2 = document.createRange(), void 0 === e3.firstChild || null === e3.firstChild) {
                    var u = document.createTextNode("");
                    e3.appendChild(u);
                  }
                  r2.setStart(e3.firstChild, t3 < e3.inputmask._valueGet().length ? t3 : e3.inputmask._valueGet().length), r2.setEnd(e3.firstChild, i3 < e3.inputmask._valueGet().length ? i3 : e3.inputmask._valueGet().length), r2.collapse(true);
                  var f = window.getSelection();
                  f.removeAllRanges(), f.addRange(r2);
                } else
                  e3.createTextRange && ((r2 = e3.createTextRange()).collapse(true), r2.moveEnd("character", i3), r2.moveStart("character", t3), r2.select());
            }
          }, t2.determineLastRequiredPosition = function(e3) {
            var t3, i3, r2 = this, s2 = r2.maskset, l2 = r2.dependencyLib, c2 = n2.getMaskTemplate.call(r2, true, o.call(r2), true, true), u = c2.length, f = o.call(r2), d = {}, p = s2.validPositions[f], h = void 0 !== p ? p.locator.slice() : void 0;
            for (t3 = f + 1; t3 < c2.length; t3++)
              h = (i3 = n2.getTestTemplate.call(r2, t3, h, t3 - 1)).locator.slice(), d[t3] = l2.extend(true, {}, i3);
            var v = p && void 0 !== p.alternation ? p.locator[p.alternation] : void 0;
            for (t3 = u - 1; t3 > f && (((i3 = d[t3]).match.optionality || i3.match.optionalQuantifier && i3.match.newBlockMarker || v && (v !== d[t3].locator[p.alternation] && 1 != i3.match.static || true === i3.match.static && i3.locator[p.alternation] && a.checkAlternationMatch.call(r2, i3.locator[p.alternation].toString().split(","), v.toString().split(",")) && "" !== n2.getTests.call(r2, t3)[0].def)) && c2[t3] === n2.getPlaceholder.call(r2, t3, i3.match)); t3--)
              u--;
            return e3 ? {
              l: u,
              def: d[u] ? d[u].match : void 0
            } : u;
          }, t2.determineNewCaretPosition = function(e3, t3, i3) {
            var a2 = this, c2 = a2.maskset, u = a2.opts;
            t3 && (a2.isRTL ? e3.end = e3.begin : e3.begin = e3.end);
            if (e3.begin === e3.end) {
              switch (i3 = i3 || u.positionCaretOnClick) {
                case "none":
                  break;
                case "select":
                  e3 = {
                    begin: 0,
                    end: r.call(a2).length
                  };
                  break;
                case "ignore":
                  e3.end = e3.begin = l.call(a2, o.call(a2));
                  break;
                case "radixFocus":
                  if (a2.clicked > 1 && 0 == c2.validPositions.length)
                    break;
                  if (function(e4) {
                    if ("" !== u.radixPoint && 0 !== u.digits) {
                      var t4 = c2.validPositions;
                      if (void 0 === t4[e4] || t4[e4].input === n2.getPlaceholder.call(a2, e4)) {
                        if (e4 < l.call(a2, -1))
                          return true;
                        var i4 = r.call(a2).indexOf(u.radixPoint);
                        if (-1 !== i4) {
                          for (var o2 = 0, s2 = t4.length; o2 < s2; o2++)
                            if (t4[o2] && i4 < o2 && t4[o2].input !== n2.getPlaceholder.call(a2, o2))
                              return false;
                          return true;
                        }
                      }
                    }
                    return false;
                  }(e3.begin)) {
                    var f = r.call(a2).join("").indexOf(u.radixPoint);
                    e3.end = e3.begin = u.numericInput ? l.call(a2, f) : f;
                    break;
                  }
                default:
                  var d = e3.begin, p = o.call(a2, d, true), h = l.call(a2, -1 !== p || s.call(a2, 0) ? p : -1);
                  if (d <= h)
                    e3.end = e3.begin = s.call(a2, d, false, true) ? d : l.call(a2, d);
                  else {
                    var v = c2.validPositions[p], m = n2.getTestTemplate.call(a2, h, v ? v.match.locator : void 0, v), g = n2.getPlaceholder.call(a2, h, m.match);
                    if ("" !== g && r.call(a2)[h] !== g && true !== m.match.optionalQuantifier && true !== m.match.newBlockMarker || !s.call(a2, h, u.keepStatic, true) && m.match.def === g) {
                      var y = l.call(a2, h);
                      (d >= y || d === h) && (h = y);
                    }
                    e3.end = e3.begin = h;
                  }
              }
              return e3;
            }
          }, t2.getBuffer = r, t2.getBufferTemplate = function() {
            var e3 = this.maskset;
            void 0 === e3._buffer && (e3._buffer = n2.getMaskTemplate.call(this, false, 1), void 0 === e3.buffer && (e3.buffer = e3._buffer.slice()));
            return e3._buffer;
          }, t2.getLastValidPosition = o, t2.isMask = s, t2.resetMaskSet = function(e3) {
            var t3 = this.maskset;
            t3.buffer = void 0, true !== e3 && (t3.validPositions = [], t3.p = 0);
          }, t2.seekNext = l, t2.seekPrevious = function(e3, t3) {
            var i3 = this, a2 = e3 - 1;
            if (e3 <= 0)
              return 0;
            for (; a2 > 0 && (true === t3 && (true !== n2.getTest.call(i3, a2).match.newBlockMarker || !s.call(i3, a2, void 0, true)) || true !== t3 && !s.call(i3, a2, void 0, true)); )
              a2--;
            return a2;
          }, t2.translatePosition = c;
          var n2 = i2(4713), a = i2(7215);
          function r(e3) {
            var t3 = this, i3 = t3.maskset;
            return void 0 !== i3.buffer && true !== e3 || (i3.buffer = n2.getMaskTemplate.call(t3, true, o.call(t3), true), void 0 === i3._buffer && (i3._buffer = i3.buffer.slice())), i3.buffer;
          }
          function o(e3, t3, i3) {
            var n3 = this.maskset, a2 = -1, r2 = -1, o2 = i3 || n3.validPositions;
            void 0 === e3 && (e3 = -1);
            for (var s2 = 0, l2 = o2.length; s2 < l2; s2++)
              o2[s2] && (t3 || true !== o2[s2].generatedInput) && (s2 <= e3 && (a2 = s2), s2 >= e3 && (r2 = s2));
            return -1 === a2 || a2 == e3 ? r2 : -1 == r2 || e3 - a2 < r2 - e3 ? a2 : r2;
          }
          function s(e3, t3, i3) {
            var a2 = this, r2 = this.maskset, o2 = n2.getTestTemplate.call(a2, e3).match;
            if ("" === o2.def && (o2 = n2.getTest.call(a2, e3).match), true !== o2.static)
              return o2.fn;
            if (true === i3 && void 0 !== r2.validPositions[e3] && true !== r2.validPositions[e3].generatedInput)
              return true;
            if (true !== t3 && e3 > -1) {
              if (i3) {
                var s2 = n2.getTests.call(a2, e3);
                return s2.length > 1 + ("" === s2[s2.length - 1].match.def ? 1 : 0);
              }
              var l2 = n2.determineTestTemplate.call(a2, e3, n2.getTests.call(a2, e3)), c2 = n2.getPlaceholder.call(a2, e3, l2.match);
              return l2.match.def !== c2;
            }
            return false;
          }
          function l(e3, t3, i3) {
            var a2 = this;
            void 0 === i3 && (i3 = true);
            for (var r2 = e3 + 1; "" !== n2.getTest.call(a2, r2).match.def && (true === t3 && (true !== n2.getTest.call(a2, r2).match.newBlockMarker || !s.call(a2, r2, void 0, true)) || true !== t3 && !s.call(a2, r2, void 0, i3)); )
              r2++;
            return r2;
          }
          function c(e3) {
            var t3 = this.opts, i3 = this.el;
            return !this.isRTL || "number" != typeof e3 || t3.greedy && "" === t3.placeholder || !i3 || (e3 = this._valueGet().length - e3) < 0 && (e3 = 0), e3;
          }
        },
        4713: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.determineTestTemplate = c, t2.getDecisionTaker = o, t2.getMaskTemplate = function(e3, t3, i3, n3, a2) {
            var r2 = this, o2 = this.opts, u2 = this.maskset, f2 = o2.greedy;
            a2 && o2.greedy && (o2.greedy = false, r2.maskset.tests = {});
            t3 = t3 || 0;
            var p, h, v, m, g = [], y = 0;
            do {
              if (true === e3 && u2.validPositions[y])
                h = (v = a2 && u2.validPositions[y].match.optionality && void 0 === u2.validPositions[y + 1] && (true === u2.validPositions[y].generatedInput || u2.validPositions[y].input == o2.skipOptionalPartCharacter && y > 0) ? c.call(r2, y, d.call(r2, y, p, y - 1)) : u2.validPositions[y]).match, p = v.locator.slice(), g.push(true === i3 ? v.input : false === i3 ? h.nativeDef : s.call(r2, y, h));
              else {
                h = (v = l.call(r2, y, p, y - 1)).match, p = v.locator.slice();
                var k = true !== n3 && (false !== o2.jitMasking ? o2.jitMasking : h.jit);
                (m = (m && h.static && h.def !== o2.groupSeparator && null === h.fn || u2.validPositions[y - 1] && h.static && h.def !== o2.groupSeparator && null === h.fn) && u2.tests[y]) || false === k || void 0 === k || "number" == typeof k && isFinite(k) && k > y ? g.push(false === i3 ? h.nativeDef : s.call(r2, g.length, h)) : m = false;
              }
              y++;
            } while (true !== h.static || "" !== h.def || t3 > y);
            "" === g[g.length - 1] && g.pop();
            false === i3 && void 0 !== u2.maskLength || (u2.maskLength = y - 1);
            return o2.greedy = f2, g;
          }, t2.getPlaceholder = s, t2.getTest = u, t2.getTestTemplate = l, t2.getTests = d, t2.isSubsetOf = f;
          var n2, a = (n2 = i2(2394)) && n2.__esModule ? n2 : {
            default: n2
          };
          function r(e3, t3) {
            var i3 = (null != e3.alternation ? e3.mloc[o(e3)] : e3.locator).join("");
            if ("" !== i3)
              for (; i3.length < t3; )
                i3 += "0";
            return i3;
          }
          function o(e3) {
            var t3 = e3.locator[e3.alternation];
            return "string" == typeof t3 && t3.length > 0 && (t3 = t3.split(",")[0]), void 0 !== t3 ? t3.toString() : "";
          }
          function s(e3, t3, i3) {
            var n3 = this.opts, a2 = this.maskset;
            if (void 0 !== (t3 = t3 || u.call(this, e3).match).placeholder || true === i3)
              return "function" == typeof t3.placeholder ? t3.placeholder(n3) : t3.placeholder;
            if (true === t3.static) {
              if (e3 > -1 && void 0 === a2.validPositions[e3]) {
                var r2, o2 = d.call(this, e3), s2 = [];
                if (o2.length > 1 + ("" === o2[o2.length - 1].match.def ? 1 : 0)) {
                  for (var l2 = 0; l2 < o2.length; l2++)
                    if ("" !== o2[l2].match.def && true !== o2[l2].match.optionality && true !== o2[l2].match.optionalQuantifier && (true === o2[l2].match.static || void 0 === r2 || false !== o2[l2].match.fn.test(r2.match.def, a2, e3, true, n3)) && (s2.push(o2[l2]), true === o2[l2].match.static && (r2 = o2[l2]), s2.length > 1 && /[0-9a-bA-Z]/.test(s2[0].match.def)))
                      return n3.placeholder.charAt(e3 % n3.placeholder.length);
                }
              }
              return t3.def;
            }
            return n3.placeholder.charAt(e3 % n3.placeholder.length);
          }
          function l(e3, t3, i3) {
            return this.maskset.validPositions[e3] || c.call(this, e3, d.call(this, e3, t3 ? t3.slice() : t3, i3));
          }
          function c(e3, t3) {
            var i3 = this.opts, n3 = 0, a2 = function(e4, t4) {
              var i4 = 0, n4 = false;
              t4.forEach(function(e5) {
                e5.match.optionality && (0 !== i4 && i4 !== e5.match.optionality && (n4 = true), (0 === i4 || i4 > e5.match.optionality) && (i4 = e5.match.optionality));
              }), i4 && (0 == e4 || 1 == t4.length ? i4 = 0 : n4 || (i4 = 0));
              return i4;
            }(e3, t3);
            e3 = e3 > 0 ? e3 - 1 : 0;
            var o2, s2, l2, c2 = r(u.call(this, e3));
            i3.greedy && t3.length > 1 && "" === t3[t3.length - 1].match.def && (n3 = 1);
            for (var f2 = 0; f2 < t3.length - n3; f2++) {
              var d2 = t3[f2];
              o2 = r(d2, c2.length);
              var p = Math.abs(o2 - c2);
              (void 0 === s2 || "" !== o2 && p < s2 || l2 && !i3.greedy && l2.match.optionality && l2.match.optionality - a2 > 0 && "master" === l2.match.newBlockMarker && (!d2.match.optionality || d2.match.optionality - a2 < 1 || !d2.match.newBlockMarker) || l2 && !i3.greedy && l2.match.optionalQuantifier && !d2.match.optionalQuantifier) && (s2 = p, l2 = d2);
            }
            return l2;
          }
          function u(e3, t3) {
            var i3 = this.maskset;
            return i3.validPositions[e3] ? i3.validPositions[e3] : (t3 || d.call(this, e3))[0];
          }
          function f(e3, t3, i3) {
            function n3(e4) {
              for (var t4, i4 = [], n4 = -1, a2 = 0, r2 = e4.length; a2 < r2; a2++)
                if ("-" === e4.charAt(a2))
                  for (t4 = e4.charCodeAt(a2 + 1); ++n4 < t4; )
                    i4.push(String.fromCharCode(n4));
                else
                  n4 = e4.charCodeAt(a2), i4.push(e4.charAt(a2));
              return i4.join("");
            }
            return e3.match.def === t3.match.nativeDef || !(!(i3.regex || e3.match.fn instanceof RegExp && t3.match.fn instanceof RegExp) || true === e3.match.static || true === t3.match.static) && -1 !== n3(t3.match.fn.toString().replace(/[[\]/]/g, "")).indexOf(n3(e3.match.fn.toString().replace(/[[\]/]/g, "")));
          }
          function d(e3, t3, i3) {
            var n3, r2, o2 = this, s2 = this.dependencyLib, l2 = this.maskset, u2 = this.opts, d2 = this.el, p = l2.maskToken, h = t3 ? i3 : 0, v = t3 ? t3.slice() : [0], m = [], g = false, y = t3 ? t3.join("") : "";
            function k(t4, i4, r3, s3) {
              function c2(r4, s4, p3) {
                function v3(e4, t5) {
                  var i5 = 0 === t5.matches.indexOf(e4);
                  return i5 || t5.matches.every(function(n4, a2) {
                    return true === n4.isQuantifier ? i5 = v3(e4, t5.matches[a2 - 1]) : Object.prototype.hasOwnProperty.call(n4, "matches") && (i5 = v3(e4, n4)), !i5;
                  }), i5;
                }
                function x2(e4, t5, i5) {
                  var n4, a2;
                  if ((l2.tests[e4] || l2.validPositions[e4]) && (l2.tests[e4] || [l2.validPositions[e4]]).every(function(e5, r6) {
                    if (e5.mloc[t5])
                      return n4 = e5, false;
                    var o3 = void 0 !== i5 ? i5 : e5.alternation, s5 = void 0 !== e5.locator[o3] ? e5.locator[o3].toString().indexOf(t5) : -1;
                    return (void 0 === a2 || s5 < a2) && -1 !== s5 && (n4 = e5, a2 = s5), true;
                  }), n4) {
                    var r5 = n4.locator[n4.alternation];
                    return (n4.mloc[t5] || n4.mloc[r5] || n4.locator).slice((void 0 !== i5 ? i5 : n4.alternation) + 1);
                  }
                  return void 0 !== i5 ? x2(e4, t5) : void 0;
                }
                function P2(e4, t5) {
                  var i5 = e4.alternation, n4 = void 0 === t5 || i5 === t5.alternation && -1 === e4.locator[i5].toString().indexOf(t5.locator[i5]);
                  if (!n4 && i5 > t5.alternation) {
                    for (var a2 = t5.alternation; a2 < i5; a2++)
                      if (e4.locator[a2] !== t5.locator[a2]) {
                        i5 = a2, n4 = true;
                        break;
                      }
                  }
                  if (n4) {
                    e4.mloc = e4.mloc || {};
                    var r5 = e4.locator[i5];
                    if (void 0 !== r5) {
                      if ("string" == typeof r5 && (r5 = r5.split(",")[0]), void 0 === e4.mloc[r5] && (e4.mloc[r5] = e4.locator.slice()), void 0 !== t5) {
                        for (var o3 in t5.mloc)
                          "string" == typeof o3 && (o3 = o3.split(",")[0]), void 0 === e4.mloc[o3] && (e4.mloc[o3] = t5.mloc[o3]);
                        e4.locator[i5] = Object.keys(e4.mloc).join(",");
                      }
                      return true;
                    }
                    e4.alternation = void 0;
                  }
                  return false;
                }
                function w2(e4, t5) {
                  if (e4.locator.length !== t5.locator.length)
                    return false;
                  for (var i5 = e4.alternation + 1; i5 < e4.locator.length; i5++)
                    if (e4.locator[i5] !== t5.locator[i5])
                      return false;
                  return true;
                }
                if (h > e3 + u2._maxTestPos)
                  throw "Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. " + l2.mask;
                if (h === e3 && void 0 === r4.matches) {
                  if (m.push({
                    match: r4,
                    locator: s4.reverse(),
                    cd: y,
                    mloc: {}
                  }), !r4.optionality || void 0 !== p3 || !(u2.definitions && u2.definitions[r4.nativeDef] && u2.definitions[r4.nativeDef].optional || a.default.prototype.definitions[r4.nativeDef] && a.default.prototype.definitions[r4.nativeDef].optional))
                    return true;
                  g = true, h = e3;
                } else if (void 0 !== r4.matches) {
                  if (r4.isGroup && p3 !== r4)
                    return function() {
                      if (r4 = c2(t4.matches[t4.matches.indexOf(r4) + 1], s4, p3))
                        return true;
                    }();
                  if (r4.isOptional)
                    return function() {
                      var t5 = r4, a2 = m.length;
                      if (r4 = k(r4, i4, s4, p3), m.length > 0) {
                        if (m.forEach(function(e4, t6) {
                          t6 >= a2 && (e4.match.optionality = e4.match.optionality ? e4.match.optionality + 1 : 1);
                        }), n3 = m[m.length - 1].match, void 0 !== p3 || !v3(n3, t5))
                          return r4;
                        g = true, h = e3;
                      }
                    }();
                  if (r4.isAlternator)
                    return function() {
                      o2.hasAlternator = true;
                      var n4, a2, v4, y2 = r4, k2 = [], b2 = m.slice(), S = s4.length, M = false, _ = i4.length > 0 ? i4.shift() : -1;
                      if (-1 === _ || "string" == typeof _) {
                        var O, E = h, T = i4.slice(), j = [];
                        if ("string" == typeof _)
                          j = _.split(",");
                        else
                          for (O = 0; O < y2.matches.length; O++)
                            j.push(O.toString());
                        if (void 0 !== l2.excludes[e3]) {
                          for (var A = j.slice(), D = 0, B = l2.excludes[e3].length; D < B; D++) {
                            var C = l2.excludes[e3][D].toString().split(":");
                            s4.length == C[1] && j.splice(j.indexOf(C[0]), 1);
                          }
                          0 === j.length && (delete l2.excludes[e3], j = A);
                        }
                        (true === u2.keepStatic || isFinite(parseInt(u2.keepStatic)) && E >= u2.keepStatic) && (j = j.slice(0, 1));
                        for (var R = 0; R < j.length; R++) {
                          O = parseInt(j[R]), m = [], i4 = "string" == typeof _ && x2(h, O, S) || T.slice();
                          var L = y2.matches[O];
                          if (L && c2(L, [O].concat(s4), p3))
                            r4 = true;
                          else if (0 === R && (M = true), L && L.matches && L.matches.length > y2.matches[0].matches.length)
                            break;
                          n4 = m.slice(), h = E, m = [];
                          for (var F = 0; F < n4.length; F++) {
                            var I = n4[F], N = false;
                            I.match.jit = I.match.jit || M, I.alternation = I.alternation || S, P2(I);
                            for (var V = 0; V < k2.length; V++) {
                              var G = k2[V];
                              if ("string" != typeof _ || void 0 !== I.alternation && j.includes(I.locator[I.alternation].toString())) {
                                if (I.match.nativeDef === G.match.nativeDef) {
                                  N = true, P2(G, I);
                                  break;
                                }
                                if (f(I, G, u2)) {
                                  P2(I, G) && (N = true, k2.splice(k2.indexOf(G), 0, I));
                                  break;
                                }
                                if (f(G, I, u2)) {
                                  P2(G, I);
                                  break;
                                }
                                if (v4 = G, true === (a2 = I).match.static && true !== v4.match.static && v4.match.fn.test(a2.match.def, l2, e3, false, u2, false)) {
                                  w2(I, G) || void 0 !== d2.inputmask.userOptions.keepStatic ? P2(I, G) && (N = true, k2.splice(k2.indexOf(G), 0, I)) : u2.keepStatic = true;
                                  break;
                                }
                              }
                            }
                            N || k2.push(I);
                          }
                        }
                        m = b2.concat(k2), h = e3, g = m.length > 0, r4 = k2.length > 0, i4 = T.slice();
                      } else
                        r4 = c2(y2.matches[_] || t4.matches[_], [_].concat(s4), p3);
                      if (r4)
                        return true;
                    }();
                  if (r4.isQuantifier && p3 !== t4.matches[t4.matches.indexOf(r4) - 1])
                    return function() {
                      for (var a2 = r4, o3 = false, f2 = i4.length > 0 ? i4.shift() : 0; f2 < (isNaN(a2.quantifier.max) ? f2 + 1 : a2.quantifier.max) && h <= e3; f2++) {
                        var d3 = t4.matches[t4.matches.indexOf(a2) - 1];
                        if (r4 = c2(d3, [f2].concat(s4), d3)) {
                          if (m.forEach(function(t5, i5) {
                            (n3 = b(d3, t5.match) ? t5.match : m[m.length - 1].match).optionalQuantifier = f2 >= a2.quantifier.min, n3.jit = (f2 + 1) * (d3.matches.indexOf(n3) + 1) > a2.quantifier.jit, n3.optionalQuantifier && v3(n3, d3) && (g = true, h = e3, u2.greedy && null == l2.validPositions[e3 - 1] && f2 > a2.quantifier.min && -1 != ["*", "+"].indexOf(a2.quantifier.max) && (m.pop(), y = void 0), o3 = true, r4 = false), !o3 && n3.jit && (l2.jitOffset[e3] = d3.matches.length - d3.matches.indexOf(n3));
                          }), o3)
                            break;
                          return true;
                        }
                      }
                    }();
                  if (r4 = k(r4, i4, s4, p3))
                    return true;
                } else
                  h++;
              }
              for (var p2 = i4.length > 0 ? i4.shift() : 0; p2 < t4.matches.length; p2++)
                if (true !== t4.matches[p2].isQuantifier) {
                  var v2 = c2(t4.matches[p2], [p2].concat(r3), s3);
                  if (v2 && h === e3)
                    return v2;
                  if (h > e3)
                    break;
                }
            }
            function b(e4, t4) {
              var i4 = -1 != e4.matches.indexOf(t4);
              return i4 || e4.matches.forEach(function(e5, n4) {
                void 0 === e5.matches || i4 || (i4 = b(e5, t4));
              }), i4;
            }
            if (e3 > -1) {
              if (void 0 === t3) {
                for (var x, P = e3 - 1; void 0 === (x = l2.validPositions[P] || l2.tests[P]) && P > -1; )
                  P--;
                void 0 !== x && P > -1 && (v = function(e4, t4) {
                  var i4, n4 = [];
                  return Array.isArray(t4) || (t4 = [t4]), t4.length > 0 && (void 0 === t4[0].alternation || true === u2.keepStatic ? 0 === (n4 = c.call(o2, e4, t4.slice()).locator.slice()).length && (n4 = t4[0].locator.slice()) : t4.forEach(function(e5) {
                    "" !== e5.def && (0 === n4.length ? (i4 = e5.alternation, n4 = e5.locator.slice()) : e5.locator[i4] && -1 === n4[i4].toString().indexOf(e5.locator[i4]) && (n4[i4] += "," + e5.locator[i4]));
                  })), n4;
                }(P, x), y = v.join(""), h = P);
              }
              if (l2.tests[e3] && l2.tests[e3][0].cd === y)
                return l2.tests[e3];
              for (var w = v.shift(); w < p.length; w++) {
                if (k(p[w], v, [w]) && h === e3 || h > e3)
                  break;
              }
            }
            return (0 === m.length || g) && m.push({
              match: {
                fn: null,
                static: true,
                optionality: false,
                casing: null,
                def: "",
                placeholder: ""
              },
              locator: [],
              mloc: {},
              cd: y
            }), void 0 !== t3 && l2.tests[e3] ? r2 = s2.extend(true, [], m) : (l2.tests[e3] = s2.extend(true, [], m), r2 = l2.tests[e3]), m.forEach(function(e4) {
              e4.match.optionality = e4.match.defOptionality || false;
            }), r2;
          }
        },
        7215: function(e2, t2, i2) {
          Object.defineProperty(t2, "__esModule", {
            value: true
          }), t2.alternate = s, t2.checkAlternationMatch = function(e3, t3, i3) {
            for (var n3, a2 = this.opts.greedy ? t3 : t3.slice(0, 1), r2 = false, o2 = void 0 !== i3 ? i3.split(",") : [], s2 = 0; s2 < o2.length; s2++)
              -1 !== (n3 = e3.indexOf(o2[s2])) && e3.splice(n3, 1);
            for (var l2 = 0; l2 < e3.length; l2++)
              if (a2.includes(e3[l2])) {
                r2 = true;
                break;
              }
            return r2;
          }, t2.handleRemove = function(e3, t3, i3, o2, l2) {
            var c2 = this, u2 = this.maskset, f2 = this.opts;
            if ((f2.numericInput || c2.isRTL) && (t3 === a.keys.Backspace ? t3 = a.keys.Delete : t3 === a.keys.Delete && (t3 = a.keys.Backspace), c2.isRTL)) {
              var d2 = i3.end;
              i3.end = i3.begin, i3.begin = d2;
            }
            var p2, h2 = r.getLastValidPosition.call(c2, void 0, true);
            i3.end >= r.getBuffer.call(c2).length && h2 >= i3.end && (i3.end = h2 + 1);
            t3 === a.keys.Backspace ? i3.end - i3.begin < 1 && (i3.begin = r.seekPrevious.call(c2, i3.begin)) : t3 === a.keys.Delete && i3.begin === i3.end && (i3.end = r.isMask.call(c2, i3.end, true, true) ? i3.end + 1 : r.seekNext.call(c2, i3.end) + 1);
            if (false !== (p2 = v.call(c2, i3))) {
              if (true !== o2 && false !== f2.keepStatic || null !== f2.regex && -1 !== n2.getTest.call(c2, i3.begin).match.def.indexOf("|")) {
                var m = s.call(c2, true);
                if (m) {
                  var g = void 0 !== m.caret ? m.caret : m.pos ? r.seekNext.call(c2, m.pos.begin ? m.pos.begin : m.pos) : r.getLastValidPosition.call(c2, -1, true);
                  (t3 !== a.keys.Delete || i3.begin > g) && i3.begin;
                }
              }
              true !== o2 && (u2.p = t3 === a.keys.Delete ? i3.begin + p2 : i3.begin, u2.p = r.determineNewCaretPosition.call(c2, {
                begin: u2.p,
                end: u2.p
              }, false, false === f2.insertMode && t3 === a.keys.Backspace ? "none" : void 0).begin);
            }
          }, t2.isComplete = c, t2.isSelection = u, t2.isValid = f, t2.refreshFromBuffer = p, t2.revalidateMask = v;
          var n2 = i2(4713), a = i2(2839), r = i2(8711), o = i2(6030);
          function s(e3, t3, i3, a2, o2, l2) {
            var c2, u2, d2, p2, h2, v2, m, g, y, k, b, x = this, P = this.dependencyLib, w = this.opts, S = x.maskset, M = P.extend(true, [], S.validPositions), _ = P.extend(true, {}, S.tests), O = false, E = false, T = void 0 !== o2 ? o2 : r.getLastValidPosition.call(x);
            if (l2 && (k = l2.begin, b = l2.end, l2.begin > l2.end && (k = l2.end, b = l2.begin)), -1 === T && void 0 === o2)
              c2 = 0, u2 = (p2 = n2.getTest.call(x, c2)).alternation;
            else
              for (; T >= 0; T--)
                if ((d2 = S.validPositions[T]) && void 0 !== d2.alternation) {
                  if (T <= (e3 || 0) && p2 && p2.locator[d2.alternation] !== d2.locator[d2.alternation])
                    break;
                  c2 = T, u2 = S.validPositions[c2].alternation, p2 = d2;
                }
            if (void 0 !== u2) {
              m = parseInt(c2), S.excludes[m] = S.excludes[m] || [], true !== e3 && S.excludes[m].push((0, n2.getDecisionTaker)(p2) + ":" + p2.alternation);
              var j = [], A = -1;
              for (h2 = m; h2 < r.getLastValidPosition.call(x, void 0, true) + 1; h2++)
                -1 === A && e3 <= h2 && void 0 !== t3 && (j.push(t3), A = j.length - 1), (v2 = S.validPositions[h2]) && true !== v2.generatedInput && (void 0 === l2 || h2 < k || h2 >= b) && j.push(v2.input), delete S.validPositions[h2];
              for (-1 === A && void 0 !== t3 && (j.push(t3), A = j.length - 1); void 0 !== S.excludes[m] && S.excludes[m].length < 10; ) {
                for (S.tests = {}, r.resetMaskSet.call(x, true), O = true, h2 = 0; h2 < j.length && (g = O.caret || r.getLastValidPosition.call(x, void 0, true) + 1, y = j[h2], O = f.call(x, g, y, false, a2, true)); h2++)
                  h2 === A && (E = O), 1 == e3 && O && (E = {
                    caretPos: h2
                  });
                if (O)
                  break;
                if (r.resetMaskSet.call(x), p2 = n2.getTest.call(x, m), S.validPositions = P.extend(true, [], M), S.tests = P.extend(true, {}, _), !S.excludes[m]) {
                  E = s.call(x, e3, t3, i3, a2, m - 1, l2);
                  break;
                }
                var D = (0, n2.getDecisionTaker)(p2);
                if (-1 !== S.excludes[m].indexOf(D + ":" + p2.alternation)) {
                  E = s.call(x, e3, t3, i3, a2, m - 1, l2);
                  break;
                }
                for (S.excludes[m].push(D + ":" + p2.alternation), h2 = m; h2 < r.getLastValidPosition.call(x, void 0, true) + 1; h2++)
                  delete S.validPositions[h2];
              }
            }
            return E && false === w.keepStatic || delete S.excludes[m], E;
          }
          function l(e3, t3, i3) {
            var n3 = this.opts, r2 = this.maskset;
            switch (n3.casing || t3.casing) {
              case "upper":
                e3 = e3.toUpperCase();
                break;
              case "lower":
                e3 = e3.toLowerCase();
                break;
              case "title":
                var o2 = r2.validPositions[i3 - 1];
                e3 = 0 === i3 || o2 && o2.input === String.fromCharCode(a.keyCode.Space) ? e3.toUpperCase() : e3.toLowerCase();
                break;
              default:
                if ("function" == typeof n3.casing) {
                  var s2 = Array.prototype.slice.call(arguments);
                  s2.push(r2.validPositions), e3 = n3.casing.apply(this, s2);
                }
            }
            return e3;
          }
          function c(e3) {
            var t3 = this, i3 = this.opts, a2 = this.maskset;
            if ("function" == typeof i3.isComplete)
              return i3.isComplete(e3, i3);
            if ("*" !== i3.repeat) {
              var o2 = false, s2 = r.determineLastRequiredPosition.call(t3, true), l2 = r.seekPrevious.call(t3, s2.l);
              if (void 0 === s2.def || s2.def.newBlockMarker || s2.def.optionality || s2.def.optionalQuantifier) {
                o2 = true;
                for (var c2 = 0; c2 <= l2; c2++) {
                  var u2 = n2.getTestTemplate.call(t3, c2).match;
                  if (true !== u2.static && void 0 === a2.validPositions[c2] && true !== u2.optionality && true !== u2.optionalQuantifier || true === u2.static && e3[c2] !== n2.getPlaceholder.call(t3, c2, u2)) {
                    o2 = false;
                    break;
                  }
                }
              }
              return o2;
            }
          }
          function u(e3) {
            var t3 = this.opts.insertMode ? 0 : 1;
            return this.isRTL ? e3.begin - e3.end > t3 : e3.end - e3.begin > t3;
          }
          function f(e3, t3, i3, a2, o2, d2, m) {
            var g = this, y = this.dependencyLib, k = this.opts, b = g.maskset;
            i3 = true === i3;
            var x = e3;
            function P(e4) {
              if (void 0 !== e4) {
                if (void 0 !== e4.remove && (Array.isArray(e4.remove) || (e4.remove = [e4.remove]), e4.remove.sort(function(e5, t5) {
                  return g.isRTL ? e5.pos - t5.pos : t5.pos - e5.pos;
                }).forEach(function(e5) {
                  v.call(g, {
                    begin: e5,
                    end: e5 + 1
                  });
                }), e4.remove = void 0), void 0 !== e4.insert && (Array.isArray(e4.insert) || (e4.insert = [e4.insert]), e4.insert.sort(function(e5, t5) {
                  return g.isRTL ? t5.pos - e5.pos : e5.pos - t5.pos;
                }).forEach(function(e5) {
                  "" !== e5.c && f.call(g, e5.pos, e5.c, void 0 === e5.strict || e5.strict, void 0 !== e5.fromIsValid ? e5.fromIsValid : a2);
                }), e4.insert = void 0), e4.refreshFromBuffer && e4.buffer) {
                  var t4 = e4.refreshFromBuffer;
                  p.call(g, true === t4 ? t4 : t4.start, t4.end, e4.buffer), e4.refreshFromBuffer = void 0;
                }
                void 0 !== e4.rewritePosition && (x = e4.rewritePosition, e4 = true);
              }
              return e4;
            }
            function w(t4, i4, o3) {
              var s2 = false;
              return n2.getTests.call(g, t4).every(function(c2, f2) {
                var d3 = c2.match;
                if (r.getBuffer.call(g, true), false !== (s2 = (!d3.jit || void 0 !== b.validPositions[r.seekPrevious.call(g, t4)]) && (null != d3.fn ? d3.fn.test(i4, b, t4, o3, k, u.call(g, e3)) : (i4 === d3.def || i4 === k.skipOptionalPartCharacter) && "" !== d3.def && {
                  c: n2.getPlaceholder.call(g, t4, d3, true) || d3.def,
                  pos: t4
                }))) {
                  var p2 = void 0 !== s2.c ? s2.c : i4, h2 = t4;
                  return p2 = p2 === k.skipOptionalPartCharacter && true === d3.static ? n2.getPlaceholder.call(g, t4, d3, true) || d3.def : p2, true !== (s2 = P(s2)) && void 0 !== s2.pos && s2.pos !== t4 && (h2 = s2.pos), true !== s2 && void 0 === s2.pos && void 0 === s2.c ? false : (false === v.call(g, e3, y.extend({}, c2, {
                    input: l.call(g, p2, d3, h2)
                  }), a2, h2) && (s2 = false), false);
                }
                return true;
              }), s2;
            }
            void 0 !== e3.begin && (x = g.isRTL ? e3.end : e3.begin);
            var S = true, M = y.extend(true, {}, b.validPositions);
            if (false === k.keepStatic && void 0 !== b.excludes[x] && true !== o2 && true !== a2)
              for (var _ = x; _ < (g.isRTL ? e3.begin : e3.end); _++)
                void 0 !== b.excludes[_] && (b.excludes[_] = void 0, delete b.tests[_]);
            if ("function" == typeof k.preValidation && true !== a2 && true !== d2 && (S = P(S = k.preValidation.call(g, r.getBuffer.call(g), x, t3, u.call(g, e3), k, b, e3, i3 || o2))), true === S) {
              if (S = w(x, t3, i3), (!i3 || true === a2) && false === S && true !== d2) {
                var O = b.validPositions[x];
                if (!O || true !== O.match.static || O.match.def !== t3 && t3 !== k.skipOptionalPartCharacter) {
                  if (k.insertMode || void 0 === b.validPositions[r.seekNext.call(g, x)] || e3.end > x) {
                    var E = false;
                    if (b.jitOffset[x] && void 0 === b.validPositions[r.seekNext.call(g, x)] && false !== (S = f.call(g, x + b.jitOffset[x], t3, true, true)) && (true !== o2 && (S.caret = x), E = true), e3.end > x && (b.validPositions[x] = void 0), !E && !r.isMask.call(g, x, k.keepStatic && 0 === x)) {
                      for (var T = x + 1, j = r.seekNext.call(g, x, false, 0 !== x); T <= j; T++)
                        if (false !== (S = w(T, t3, i3))) {
                          S = h.call(g, x, void 0 !== S.pos ? S.pos : T) || S, x = T;
                          break;
                        }
                    }
                  }
                } else
                  S = {
                    caret: r.seekNext.call(g, x)
                  };
              }
              g.hasAlternator && true !== o2 && !i3 && (false === S && k.keepStatic && (c.call(g, r.getBuffer.call(g)) || 0 === x) ? S = s.call(g, x, t3, i3, a2, void 0, e3) : (u.call(g, e3) && b.tests[x] && b.tests[x].length > 1 && k.keepStatic || 1 == S && true !== k.numericInput && b.tests[x] && b.tests[x].length > 1 && r.getLastValidPosition.call(g, void 0, true) > x) && (S = s.call(g, true))), true === S && (S = {
                pos: x
              });
            }
            if ("function" == typeof k.postValidation && true !== a2 && true !== d2) {
              var A = k.postValidation.call(g, r.getBuffer.call(g, true), void 0 !== e3.begin ? g.isRTL ? e3.end : e3.begin : e3, t3, S, k, b, i3, m);
              void 0 !== A && (S = true === A ? S : A);
            }
            S && void 0 === S.pos && (S.pos = x), false === S || true === d2 ? (r.resetMaskSet.call(g, true), b.validPositions = y.extend(true, [], M)) : h.call(g, void 0, x, true);
            var D = P(S);
            void 0 !== g.maxLength && (r.getBuffer.call(g).length > g.maxLength && !a2 && (r.resetMaskSet.call(g, true), b.validPositions = y.extend(true, [], M), D = false));
            return D;
          }
          function d(e3, t3, i3) {
            for (var a2 = this.maskset, r2 = false, o2 = n2.getTests.call(this, e3), s2 = 0; s2 < o2.length; s2++) {
              if (o2[s2].match && (o2[s2].match.nativeDef === t3.match[i3.shiftPositions ? "def" : "nativeDef"] && (!i3.shiftPositions || !t3.match.static) || o2[s2].match.nativeDef === t3.match.nativeDef || i3.regex && !o2[s2].match.static && o2[s2].match.fn.test(t3.input, a2, e3, false, i3))) {
                r2 = true;
                break;
              }
              if (o2[s2].match && o2[s2].match.def === t3.match.nativeDef) {
                r2 = void 0;
                break;
              }
            }
            return false === r2 && void 0 !== a2.jitOffset[e3] && (r2 = d.call(this, e3 + a2.jitOffset[e3], t3, i3)), r2;
          }
          function p(e3, t3, i3) {
            var n3, a2, s2 = this, l2 = this.maskset, c2 = this.opts, u2 = this.dependencyLib, f2 = c2.skipOptionalPartCharacter, d2 = s2.isRTL ? i3.slice().reverse() : i3;
            if (c2.skipOptionalPartCharacter = "", true === e3)
              r.resetMaskSet.call(s2), l2.tests = {}, e3 = 0, t3 = i3.length, a2 = r.determineNewCaretPosition.call(s2, {
                begin: 0,
                end: 0
              }, false).begin;
            else {
              for (n3 = e3; n3 < t3; n3++)
                delete l2.validPositions[n3];
              a2 = e3;
            }
            var p2 = new u2.Event("keypress");
            for (n3 = e3; n3 < t3; n3++) {
              p2.key = d2[n3].toString(), s2.ignorable = false;
              var h2 = o.EventHandlers.keypressEvent.call(s2, p2, true, false, false, a2);
              false !== h2 && void 0 !== h2 && (a2 = h2.forwardPosition);
            }
            c2.skipOptionalPartCharacter = f2;
          }
          function h(e3, t3, i3) {
            var a2 = this, o2 = this.maskset, s2 = this.dependencyLib;
            if (void 0 === e3)
              for (e3 = t3 - 1; e3 > 0 && !o2.validPositions[e3]; e3--)
                ;
            for (var l2 = e3; l2 < t3; l2++) {
              if (void 0 === o2.validPositions[l2] && !r.isMask.call(a2, l2, false)) {
                if (0 == l2 ? n2.getTest.call(a2, l2) : o2.validPositions[l2 - 1]) {
                  var c2 = n2.getTests.call(a2, l2).slice();
                  "" === c2[c2.length - 1].match.def && c2.pop();
                  var u2, d2 = n2.determineTestTemplate.call(a2, l2, c2);
                  if (d2 && (true !== d2.match.jit || "master" === d2.match.newBlockMarker && (u2 = o2.validPositions[l2 + 1]) && true === u2.match.optionalQuantifier) && ((d2 = s2.extend({}, d2, {
                    input: n2.getPlaceholder.call(a2, l2, d2.match, true) || d2.match.def
                  })).generatedInput = true, v.call(a2, l2, d2, true), true !== i3)) {
                    var p2 = o2.validPositions[t3].input;
                    return o2.validPositions[t3] = void 0, f.call(a2, t3, p2, true, true);
                  }
                }
              }
            }
          }
          function v(e3, t3, i3, a2) {
            var o2 = this, s2 = this.maskset, l2 = this.opts, c2 = this.dependencyLib;
            function u2(e4, t4, i4) {
              var n3 = t4[e4];
              if (void 0 !== n3 && true === n3.match.static && true !== n3.match.optionality && (void 0 === t4[0] || void 0 === t4[0].alternation)) {
                var a3 = i4.begin <= e4 - 1 ? t4[e4 - 1] && true === t4[e4 - 1].match.static && t4[e4 - 1] : t4[e4 - 1], r2 = i4.end > e4 + 1 ? t4[e4 + 1] && true === t4[e4 + 1].match.static && t4[e4 + 1] : t4[e4 + 1];
                return a3 && r2;
              }
              return false;
            }
            var p2 = 0, h2 = void 0 !== e3.begin ? e3.begin : e3, v2 = void 0 !== e3.end ? e3.end : e3, m = true;
            if (e3.begin > e3.end && (h2 = e3.end, v2 = e3.begin), a2 = void 0 !== a2 ? a2 : h2, void 0 === i3 && (h2 !== v2 || l2.insertMode && void 0 !== s2.validPositions[a2] || void 0 === t3 || t3.match.optionalQuantifier || t3.match.optionality)) {
              var g, y = c2.extend(true, {}, s2.validPositions), k = r.getLastValidPosition.call(o2, void 0, true);
              for (s2.p = h2, g = k; g >= h2; g--)
                delete s2.validPositions[g], void 0 === t3 && delete s2.tests[g + 1];
              var b, x, P = a2, w = P;
              for (t3 && (s2.validPositions[a2] = c2.extend(true, {}, t3), w++, P++), g = t3 ? v2 : v2 - 1; g <= k; g++) {
                if (void 0 !== (b = y[g]) && true !== b.generatedInput && (g >= v2 || g >= h2 && u2(g, y, {
                  begin: h2,
                  end: v2
                }))) {
                  for (; "" !== n2.getTest.call(o2, w).match.def; ) {
                    if (false !== (x = d.call(o2, w, b, l2)) || "+" === b.match.def) {
                      "+" === b.match.def && r.getBuffer.call(o2, true);
                      var S = f.call(o2, w, b.input, "+" !== b.match.def, true);
                      if (m = false !== S, P = (S.pos || w) + 1, !m && x)
                        break;
                    } else
                      m = false;
                    if (m) {
                      void 0 === t3 && b.match.static && g === e3.begin && p2++;
                      break;
                    }
                    if (!m && r.getBuffer.call(o2), w > s2.maskLength)
                      break;
                    w++;
                  }
                  "" == n2.getTest.call(o2, w).match.def && (m = false), w = P;
                }
                if (!m)
                  break;
              }
              if (!m)
                return s2.validPositions = c2.extend(true, [], y), r.resetMaskSet.call(o2, true), false;
            } else
              t3 && n2.getTest.call(o2, a2).match.cd === t3.match.cd && (s2.validPositions[a2] = c2.extend(true, {}, t3));
            return r.resetMaskSet.call(o2, true), p2;
          }
        }
      }, t = {};
      function i(n2) {
        var a = t[n2];
        if (void 0 !== a)
          return a.exports;
        var r = t[n2] = {
          exports: {}
        };
        return e[n2](r, r.exports, i), r.exports;
      }
      var n = {};
      return function() {
        var e2, t2 = n;
        Object.defineProperty(t2, "__esModule", {
          value: true
        }), t2.default = void 0, i(7149), i(3194), i(9302), i(4013), i(3851), i(219), i(207), i(5296);
        var a = ((e2 = i(2394)) && e2.__esModule ? e2 : {
          default: e2
        }).default;
        t2.default = a;
      }(), n;
    }();
  });
})(inputmask);
var inputmaskExports = inputmask.exports;
const Inputmask = /* @__PURE__ */ getDefaultExportFromCjs(inputmaskExports);
var image = document.getElementsByClassName("thumbnail");
new SimpleParallax(image);
const iconMenu = document.querySelector(".menu__icon");
const menuBody = document.querySelector(".menu__body");
const headerMenu = document.querySelector(".header__menu");
if (iconMenu) {
  iconMenu.addEventListener("click", (e) => {
    headerMenu.classList.toggle("_active");
    document.body.classList.toggle("_lock");
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}
const menuLink = document.querySelectorAll(".menu__link");
const menuLogo = document.querySelectorAll(".menu__logo");
const menuAdress = document.querySelectorAll(".menu__info-adress");
const linkAction = () => {
  menuBody.classList.remove("_active");
  iconMenu.classList.toggle("_active");
  headerMenu.classList.toggle("_active");
  document.body.classList.toggle("_lock");
};
menuLink.forEach((n) => n.addEventListener("click", linkAction));
menuAdress.forEach((n) => n.addEventListener("click", linkAction));
menuLogo.forEach((n) => n.addEventListener("click", linkAction));
headerMenu.addEventListener("click", (e) => {
  if (e.target === headerMenu) {
    headerMenu.classList.remove("_active");
    menuBody.classList.remove("_active");
    iconMenu.classList.remove("_active");
    document.body.classList.toggle("_lock");
  }
});
const tabs = document.querySelectorAll(".tabs__item");
const contents = document.querySelectorAll(".tabs__content");
tabs.forEach((tab, index2) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab2) => tab2.classList.remove("_active"));
    tab.classList.add("_active");
    contents.forEach((c) => c.classList.remove("_active"));
    contents[index2].classList.add("_active");
  });
});
tabs[0].click();
const planItem = document.querySelectorAll(".plan__item");
const planContent = document.querySelectorAll(".plan__content");
planItem.forEach((tab, index2) => {
  tab.addEventListener("click", () => {
    planItem.forEach((tab2) => tab2.classList.remove("_active"));
    tab.classList.add("_active");
    planContent.forEach((c) => c.classList.remove("_active"));
    planContent[index2].classList.add("_active");
  });
});
planItem[1].click();
const modalBody = document.querySelector(".modal__body");
const genPlanLink = document.querySelectorAll(".genplan__link");
const attrPrice = document.querySelector(".attrprice");
const attrSquare = document.querySelector(".attrsquare");
const attrFlat = document.querySelector(".attrflat");
const attrNumber = document.querySelector(".attrnumber");
const attrImg = document.querySelector(".attrimg");
const modalContent = document.querySelector(".modal__content");
let genplanImg;
const closeModalGenplanImg = () => {
  genplanImg.classList.remove("_active");
};
const openModalGenplanImg = () => {
  genplanImg.classList.add("_active");
};
genPlanLink.forEach((link) => {
  link.addEventListener("click", () => {
    const dataAttributeValue = link.dataset.flat;
    if (!dataAttributeValue) {
      throw new Error("Invalid data property");
    }
    const { square, number, price, flat, imgplan, dataId } = JSON.parse(dataAttributeValue);
    attrSquare.innerHTML = square;
    attrPrice.innerHTML = price;
    attrFlat.innerHTML = flat;
    attrNumber.innerHTML = number;
    genplanImg = document.querySelector(`.c${flat}`);
    genplanImg.querySelectorAll("a").forEach((a) => {
      const polygon = a.querySelector(`polygon`);
      console.log(polygon, dataId, a.dataset.id);
      if (Number(a.dataset.id) === dataId) {
        polygon.classList.add("_active");
      } else {
        polygon.classList.remove("_active");
      }
    });
    console.log(`.c${flat}`, genplanImg);
    openModalGenplanImg();
    attrImg.setAttribute("src", imgplan);
    console.log(flat);
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
    modalBody.scrollTop = 0;
  });
});
new Swiper(".advantages__swiper", {
  spaceBetween: 10,
  grabCursor: true,
  centerSlides: true,
  slidesPerView: "auto",
  loop: true,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    320: {
      spaceBetween: 40
    },
    1e3: {
      spaceBetween: 90
    }
  }
});
function scrollHeader() {
  const header = document.getElementById("header");
  const headerLogo = document.getElementById("header-logo");
  const menuIcon = document.getElementById("menu-icon");
  const btnStroke = document.getElementById("btn--stroke");
  if (this.scrollY >= 50) {
    header.classList.add("scroll-header");
    headerLogo.classList.add("scroll-logo");
    menuIcon.classList.add("scroll-icon");
    btnStroke.classList.add("scroll-btn");
  } else {
    header.classList.remove("scroll-header");
    headerLogo.classList.remove("scroll-logo");
    menuIcon.classList.remove("scroll-icon");
    btnStroke.classList.remove("scroll-btn");
  }
}
window.addEventListener("scroll", scrollHeader);
new Swiper(".room__swiper", {
  spaceBetween: 10,
  slidesPerView: "auto",
  clickable: true,
  slideToClickedSlide: true,
  centeredSlides: false,
  grabCursor: true,
  loop: true,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    640: {
      slidesPerView: "auto",
      spaceBetween: 10,
      centeredSlides: false
    },
    1e3: {
      slidesPerView: "auto",
      spaceBetween: 15,
      centeredSlides: false
    },
    1300: {
      centeredSlides: false,
      slidesPerView: "auto",
      spaceBetween: 45
    }
  }
});
const modalClose = document.querySelector(".modal__close");
const slides = document.querySelectorAll(".room__card");
slides.forEach((slide2) => {
  slide2.addEventListener("click", () => {
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
    modalBody.scrollTop = 0;
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.body.classList.remove("_lock");
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
    modalContainer.classList.remove("_active");
  }
});
modalClose.addEventListener("click", (e) => {
  document.body.classList.remove("_lock");
  modalBody.classList.remove("_active");
  modalContent.classList.remove("_active");
  modalContainer.classList.remove("_active");
  closeModalGenplanImg();
});
function validatePhone(phone) {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length);
  console.log(cleanedPhone.length === 11, "partial");
  if (cleanedPhone.length === 11) {
    return true;
  } else {
    return false;
  }
}
function validateText(text2) {
  const trimmedText = text2.trim();
  if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}
const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;
  switch (dataType) {
    case "phone":
      res = validatePhone(input.value);
      break;
    case "text":
      res = validateText(input.value);
      break;
  }
  console.log(input, res, dataType);
  return res;
};
let forms = document.querySelectorAll(".js-form");
const modalSykesBody = document.querySelector(".sykes__body");
const sykesClose = document.querySelector(".sykes__close");
document.querySelectorAll(".validate__form-text--null");
document.querySelector(".validate__form-error--name");
document.querySelector(".validate__form-error--phone");
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
  formButton.addEventListener("click", (e) => {
    e.preventDefault();
    formButton.disabled = true;
    const inputs = form.querySelectorAll("input");
    const method = form.method;
    const action = form.action;
    let isValidated = true;
    let formData = [];
    inputs.forEach((input) => {
      formData.push({
        name: input.name,
        value: input.value,
        isValidate: validate(input)
      });
    });
    formData.forEach((item) => {
      const input = form.querySelector(`[name="${item.name}"]`);
      const wrapper = input.parentNode;
      const errorBlock = wrapper.querySelector(".js-error");
      if (!item.isValidate) {
        isValidated = false;
        errorBlock.classList.add("_active");
      } else {
        errorBlock.classList.remove("_active");
      }
    });
    if (!isValidated) {
      formButton.disabled = false;
      return false;
    }
    axios$1({
      method,
      url: action,
      data: formData
    }).then((response) => {
      console.log("success");
      formButton.disabled = false;
    }).catch((error) => {
      console.error(error);
      formButton.disabled = false;
      modalSykesBody.classList.add("_active");
      document.body.classList.add("_lock");
    });
  });
  sykesClose.addEventListener("click", () => {
    modalSykesBody.classList.remove("_active");
    document.body.classList.remove("_lock");
    console.log("click");
  });
});
const phones = document.querySelectorAll('[data-mask="phone"]');
let im = new Inputmask("+7 (999) 999-99-99");
im.mask(phones);
