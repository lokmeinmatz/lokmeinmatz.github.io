parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QCba":[function(require,module,exports) {
function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,r,o){return(e="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var o=n(t,e);if(o){var a=Object.getOwnPropertyDescriptor(o,e);return a.get?a.get.call(r):a.value}})(t,r,o||t)}function n(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=l(t)););return t}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t){var e=c();return function(){var n,r=l(t);if(e){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?u(e):n}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function c(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function l(t){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function h(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}function y(t,e){return p(t)||v(t,e)||b(t,e)||d()}function d(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function v(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=t[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(c){o=!0,a=c}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return n}}function p(t){if(Array.isArray(t))return t}function m(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=b(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==n.return||n.return()}finally{if(u)throw a}}}}function b(t,e){if(t){if("string"==typeof t)return g(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?g(t,e):void 0}}function g(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var w,S=Date.now()+1e4;function M(t,e,n){var r,o,a,i,u,c,l,f;switch(c=n*(1-e),l=n*(1-(u=6*t-(i=Math.floor(6*t)))*e),f=n*(1-(1-u)*e),i%6){case 0:r=n,o=f,a=c;break;case 1:r=l,o=n,a=c;break;case 2:r=c,o=n,a=f;break;case 3:r=c,o=l,a=n;break;case 4:r=f,o=c,a=n;break;case 5:r=n,o=c,a=l}return{r:Math.round(255*r),g:Math.round(255*o),b:Math.round(255*a)}}window.onload=function(){console.log("loaded");var t="00:00";w=document.querySelectorAll("#fireworks #year h1");requestAnimationFrame(function e(){for(var n=S-Date.now(),r="".concat(Math.floor(n/6e4).toString().padStart(2,"0"),":").concat(Math.floor(n/1e3%60).toString().padStart(2,"0")),o=new Map,a=0;a<r.length;a++)r[a]!=t[a]&&o.set(a,r[a]);var i,u=document.querySelector("#countdown").getElementsByTagName("h1"),c=m(o);try{var l=function(){var t=y(i.value,2),e=t[0],n=t[1],r=0,o=u[e];if(!o)return"continue";var a=!1;!function t(){var e=2*(r<.5?r:r-1);o.style.transform="translateY(".concat(e,"em)"),o.style.opacity=Math.abs(1-2*r).toString(),r>.5&&!a&&(a=!0,o.textContent=n),(r+=.05)<=1?requestAnimationFrame(t):(o.style.opacity="1",o.style.transform="")}()};for(c.s();!(i=c.n()).done;)l()}catch(f){c.e(f)}finally{c.f()}t=r,n>1e3?requestAnimationFrame(e):(document.querySelector("#countdown").style.transform="translateY(100vh)",R())})};var x=[142,1142,412,813],k=function(){function t(e,n){f(this,t),this.x=e,this.y=n}return h(t,[{key:"step",value:function(t){this.x+=this.vx*t,this.y+=this.vy*t,this.vx*=1-t,this.vy*=1-t}}]),t}(),O=function(t){r(o,k);var n=a(o);function o(t,e){var r;return f(this,o),(r=n.call(this,t,e)).vx=0,r.vy=-100,r.maxHeight=100*Math.random()+200,r}return h(o,[{key:"step",value:function(t){e(l(o.prototype),"step",this).call(this,t),this.vy-=10}},{key:"draw",value:function(t){t.strokeStyle="rgb(255, 100, 70)",t.beginPath(),t.moveTo(this.x,this.y),t.lineTo(this.x,this.y+10),t.stroke()}},{key:"shouldExplode",value:function(){return this.y<this.maxHeight}}]),o}(),j=function(t){r(o,k);var n=a(o);function o(t,e,r){var a;f(this,o),(a=n.call(this,t,e)).age=0;var i=Math.random()*Math.PI*2,u=200*Math.pow(Math.random(),2);return a.vx=Math.sin(i)*u,a.vy=Math.cos(i)*u,a.color=r,a.lifetime=3*Math.pow(Math.random(),1)+1,a}return h(o,[{key:"draw",value:function(t){t.fillStyle=this.color.toString(),t.fillRect(this.x,this.y,2,2)}},{key:"step",value:function(t){e(l(o.prototype),"step",this).call(this,t),this.vy+=1,this.age+=t;var n=1-this.age/this.lifetime;this.color.a=n}}]),o}(),A=function(){function t(e,n,r,o){f(this,t),this.r=e,this.g=n,this.b=r,this.a=o||1}return h(t,[{key:"toString",value:function(){return 1==this.a?"rgb(".concat(Math.round(this.r),", ").concat(Math.round(this.g),", ").concat(Math.round(this.b),")"):"rgba(".concat(Math.round(this.r),", ").concat(Math.round(this.g),", ").concat(Math.round(this.b),", ").concat(this.a,")")}}]),t}();function R(){console.log("fw");var t=document.querySelector("#fireworks canvas");t.width=window.innerWidth,t.height=window.innerHeight;for(var e=t.getContext("2d"),n=function(t){setTimeout(function(){w[t].style.transform=""},x[t])},r=0;r<x.length;r++)n(r);var o=[],a=[];function i(e){a.push(new O(e,t.height+20))}for(var u=0;u<4;u++)i(Math.random()*t.width);e.strokeStyle="red",e.fillRect(100,100,100,100),console.log(a);var c=1/60;requestAnimationFrame(function n(){e.fillStyle="rgba(0, 0, 0, 0.1)",e.fillRect(0,0,t.width,t.height);var r,u=m(a);try{for(u.s();!(r=u.n()).done;){var l=r.value;if(l.draw(e),l.step(c),l.shouldExplode())for(var f=M(Math.random(),.5,1),s=new A(f.r,f.g,f.b),h=0;h<100;h++)o.push(new j(l.x,l.y,s))}}catch(p){u.e(p)}finally{u.f()}a=a.filter(function(t){return!t.shouldExplode()}),Math.random()>.95&&i(Math.random()*t.width);var y,d=m(o);try{for(d.s();!(y=d.n()).done;){var v=y.value;v.draw(e),v.step(c)}}catch(p){d.e(p)}finally{d.f()}o=o.filter(function(t){return t.age<t.lifetime}),requestAnimationFrame(n)})}
},{}]},{},["QCba"], null)
//# sourceMappingURL=sylvester.e47287dc.js.map