//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.2";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return arguments.length<2||r?n[j.random(n.length-1)]:j.shuffle(n).slice(0,Math.max(0,t))};var k=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=k(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={},i=null==r?j.identity:k(r);return A(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};j.groupBy=F(function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=w||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n"," ":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);


/*
 (c) 2013, Vladimir Agafonkin
 RBush, a JavaScript library for high-performance 2D spatial indexing of points and rectangles.
 https://github.com/mourner/rbush
*/
(function(){function rbush(maxEntries,format){if(!(this instanceof rbush)){return new rbush(maxEntries,format)}this._maxEntries=Math.max(4,maxEntries||9);this._minEntries=Math.max(2,Math.ceil(this._maxEntries*0.4));if(format){this._initFormat(format)}this.clear()}rbush.prototype={all:function(){return this._all(this.data,[])},search:function(bbox){var node=this.data,result=[];if(!this._intersects(bbox,node.bbox)){return result}var nodesToSearch=[],i,len,child,childBBox;while(node){for(i=0,len=node.children.length;i<len;i++){child=node.children[i];childBBox=node.leaf?this.toBBox(child):child.bbox;if(this._intersects(bbox,childBBox)){if(node.leaf){result.push(child)}else{if(this._contains(bbox,childBBox)){this._all(child,result)}else{nodesToSearch.push(child)}}}}node=nodesToSearch.pop()}return result},load:function(data){if(!(data&&data.length)){return this}if(data.length<this._minEntries){for(var i=0,len=data.length;i<len;i++){this.insert(data[i])}return this}var node=this._build(data.slice(),0);if(!this.data.children.length){this.data=node}else{if(this.data.height===node.height){this._splitRoot(this.data,node)}else{if(this.data.height<node.height){var tmpNode=this.data;this.data=node;node=tmpNode}this._insert(node,this.data.height-node.height-1,true)}}return this},insert:function(item){if(item){this._insert(item,this.data.height-1)}return this},clear:function(){this.data={children:[],leaf:true,bbox:this._empty(),height:1};return this},remove:function(item){if(!item){return this}var node=this.data,bbox=this.toBBox(item),path=[],indexes=[],i,parent,index,goingUp;while(node||path.length){if(!node){node=path.pop();parent=path[path.length-1];i=indexes.pop();goingUp=true}if(node.leaf){index=node.children.indexOf(item);if(index!==-1){node.children.splice(index,1);path.push(node);this._condense(path);return this}}if(!goingUp&&!node.leaf&&this._contains(node.bbox,bbox)){path.push(node);indexes.push(i);i=0;parent=node;node=node.children[0]}else{if(parent){i++;node=parent.children[i];goingUp=false}else{node=null}}}return this},toBBox:function(item){return item},compareMinX:function(a,b){return a[0]-b[0]},compareMinY:function(a,b){return a[1]-b[1]},toJSON:function(){return this.data},fromJSON:function(data){this.data=data;return this},_all:function(node,result){var nodesToSearch=[];while(node){if(node.leaf){result.push.apply(result,node.children)}else{nodesToSearch.push.apply(nodesToSearch,node.children)}node=nodesToSearch.pop()}return result},_build:function(items,level,height){var N=items.length,M=this._maxEntries,node;if(N<=M){node={children:items,leaf:true,height:1};this._calcBBox(node);return node}if(!level){height=Math.ceil(Math.log(N)/Math.log(M));M=Math.ceil(N/Math.pow(M,height-1));items.sort(this.compareMinX)}node={children:[],height:height};var N1=Math.ceil(N/M)*Math.ceil(Math.sqrt(M)),N2=Math.ceil(N/M),compare=level%2===1?this.compareMinX:this.compareMinY,i,j,slice,sliceLen,childNode;for(i=0;i<N;i+=N1){slice=items.slice(i,i+N1).sort(compare);for(j=0,sliceLen=slice.length;j<sliceLen;j+=N2){childNode=this._build(slice.slice(j,j+N2),level+1,height-1);node.children.push(childNode)}}this._calcBBox(node);return node},_chooseSubtree:function(bbox,node,level,path){var i,len,child,targetNode,area,enlargement,minArea,minEnlargement;while(true){path.push(node);if(node.leaf||path.length-1===level){break}minArea=minEnlargement=Infinity;for(i=0,len=node.children.length;i<len;i++){child=node.children[i];area=this._area(child.bbox);enlargement=this._enlargedArea(bbox,child.bbox)-area;if(enlargement<minEnlargement){minEnlargement=enlargement;minArea=area<minArea?area:minArea;targetNode=child}else{if(enlargement===minEnlargement){if(area<minArea){minArea=area;targetNode=child}}}}node=targetNode}return node},_insert:function(item,level,isNode){var bbox=isNode?item.bbox:this.toBBox(item),insertPath=[];var node=this._chooseSubtree(bbox,this.data,level,insertPath);node.children.push(item);this._extend(node.bbox,bbox);while(level>=0){if(insertPath[level].children.length>this._maxEntries){this._split(insertPath,level);level--}else{break}}this._adjustParentBBoxes(bbox,insertPath,level)},_split:function(insertPath,level){var node=insertPath[level],M=node.children.length,m=this._minEntries;this._chooseSplitAxis(node,m,M);var newNode={children:node.children.splice(this._chooseSplitIndex(node,m,M)),height:node.height};if(node.leaf){newNode.leaf=true}this._calcBBox(node);this._calcBBox(newNode);if(level){insertPath[level-1].children.push(newNode)}else{this._splitRoot(node,newNode)}},_splitRoot:function(node,newNode){this.data={};this.data.children=[node,newNode];this.data.height=node.height+1;this._calcBBox(this.data)},_chooseSplitIndex:function(node,m,M){var i,bbox1,bbox2,overlap,area,minOverlap,minArea,index;minOverlap=minArea=Infinity;for(i=m;i<=M-m;i++){bbox1=this._distBBox(node,0,i);bbox2=this._distBBox(node,i,M);overlap=this._intersectionArea(bbox1,bbox2);area=this._area(bbox1)+this._area(bbox2);if(overlap<minOverlap){minOverlap=overlap;index=i;minArea=area<minArea?area:minArea}else{if(overlap===minOverlap){if(area<minArea){minArea=area;index=i}}}}return index},_chooseSplitAxis:function(node,m,M){var compareMinX=node.leaf?this.compareMinX:this._compareNodeMinX,compareMinY=node.leaf?this.compareMinY:this._compareNodeMinY,xMargin=this._allDistMargin(node,m,M,compareMinX),yMargin=this._allDistMargin(node,m,M,compareMinY);if(xMargin<yMargin){node.children.sort(compareMinX)}},_allDistMargin:function(node,m,M,compare){node.children.sort(compare);var leftBBox=this._distBBox(node,0,m),rightBBox=this._distBBox(node,M-m,M),margin=this._margin(leftBBox)+this._margin(rightBBox),i,child;for(i=m;i<M-m;i++){child=node.children[i];this._extend(leftBBox,node.leaf?this.toBBox(child):child.bbox);margin+=this._margin(leftBBox)}for(i=M-m-1;i>=m;i--){child=node.children[i];this._extend(rightBBox,node.leaf?this.toBBox(child):child.bbox);margin+=this._margin(rightBBox)}return margin},_distBBox:function(node,k,p){var bbox=this._empty();for(var i=k,child;i<p;i++){child=node.children[i];this._extend(bbox,node.leaf?this.toBBox(child):child.bbox)}return bbox},_calcBBox:function(node){node.bbox=this._distBBox(node,0,node.children.length)},_adjustParentBBoxes:function(bbox,path,level){for(var i=level;i>=0;i--){this._extend(path[i].bbox,bbox)}},_condense:function(path){for(var i=path.length-1,siblings;i>=0;i--){if(path[i].children.length===0){if(i>0){siblings=path[i-1].children;siblings.splice(siblings.indexOf(path[i]),1)}else{this.clear()}}else{this._calcBBox(path[i])}}},_contains:function(a,b){return a[0]<=b[0]&&a[1]<=b[1]&&b[2]<=a[2]&&b[3]<=a[3]},_intersects:function(a,b){return b[0]<=a[2]&&b[1]<=a[3]&&b[2]>=a[0]&&b[3]>=a[1]},_extend:function(a,b){a[0]=Math.min(a[0],b[0]);a[1]=Math.min(a[1],b[1]);a[2]=Math.max(a[2],b[2]);a[3]=Math.max(a[3],b[3]);return a},_area:function(a){return(a[2]-a[0])*(a[3]-a[1])},_margin:function(a){return(a[2]-a[0])+(a[3]-a[1])},_enlargedArea:function(a,b){return(Math.max(b[2],a[2])-Math.min(b[0],a[0]))*(Math.max(b[3],a[3])-Math.min(b[1],a[1]))},_intersectionArea:function(a,b){var minX=Math.max(a[0],b[0]),minY=Math.max(a[1],b[1]),maxX=Math.min(a[2],b[2]),maxY=Math.min(a[3],b[3]);return Math.max(0,maxX-minX)*Math.max(0,maxY-minY)},_empty:function(){return[Infinity,Infinity,-Infinity,-Infinity]},_compareNodeMinX:function(a,b){return a.bbox[0]-b.bbox[0]},_compareNodeMinY:function(a,b){return a.bbox[1]-b.bbox[1]},_initFormat:function(format){var compareArr=["return a"," - b",";"];this.compareMinX=new Function("a","b",compareArr.join(format[0]));this.compareMinY=new Function("a","b",compareArr.join(format[1]));this.toBBox=new Function("a","return [a"+format.join(", a")+"];")}};if(typeof define==="function"&&define.amd){define(function(){return rbush})}else{if(typeof module!=="undefined"){module.exports=rbush}else{if(typeof self!=="undefined"){self.rbush=rbush}else{window.rbush=rbush}}}})();


// Buckets.js
// https://github.com/mauriciosantos/buckets/
// Downloaded April 2014
var buckets={defaultCompare:function(a,b){return a<b?-1:a===b?0:1},defaultEquals:function(a,b){return a===b},defaultToString:function(a){return null===a?"BUCKETS_NULL":buckets.isUndefined(a)?"BUCKETS_UNDEFINED":buckets.isString(a)?a:a.toString()},isFunction:function(a){return"function"===typeof a},isUndefined:function(a){return"undefined"===typeof a},isString:function(a){return"[object String]"===Object.prototype.toString.call(a)},reverseCompareFunction:function(a){return buckets.isFunction(a)?function(b,c){return -1*a(b,c)}:function(a,c){return a<c?1:a===c?0:-1}},compareToEquals:function(a){return function(b,c){return 0===a(b,c)}},arrays:{}};buckets.arrays.indexOf=function(a,b,c){c=c||buckets.defaultEquals;for(var d=a.length,e=0;e<d;e++){if(c(a[e],b)){return e}}return -1};buckets.arrays.lastIndexOf=function(a,b,c){c=c||buckets.defaultEquals;for(var d=a.length-1;0<=d;d--){if(c(a[d],b)){return d}}return -1};buckets.arrays.contains=function(a,b,c){return 0<=buckets.arrays.indexOf(a,b,c)};buckets.arrays.remove=function(a,b,c){b=buckets.arrays.indexOf(a,b,c);if(0>b){return !1}a.splice(b,1);return !0};buckets.arrays.frequency=function(a,b,c){c=c||buckets.defaultEquals;for(var d=a.length,e=0,f=0;f<d;f++){c(a[f],b)&&e++}return e};buckets.arrays.equals=function(a,b,c){c=c||buckets.defaultEquals;if(a.length!==b.length){return !1}for(var d=a.length,e=0;e<d;e++){if(!c(a[e],b[e])){return !1}}return !0};buckets.arrays.copy=function(a){return a.concat()};buckets.arrays.swap=function(a,b,c){if(0>b||b>=a.length||0>c||c>=a.length){return !1}var d=a[b];a[b]=a[c];a[c]=d;return !0};buckets.arrays.forEach=function(a,b){for(var c=a.length,d=0;d<c&&!1!==b(a[d]);d++){}};buckets.LinkedList=function(){this.lastNode=this.firstNode=null;this.nElements=0};buckets.LinkedList.prototype.add=function(a,b){buckets.isUndefined(b)&&(b=this.nElements);if(0>b||b>this.nElements||buckets.isUndefined(a)){return !1}var c=this.createNode(a);if(0===this.nElements){this.lastNode=this.firstNode=c}else{if(b===this.nElements){this.lastNode=this.lastNode.next=c}else{if(0===b){c.next=this.firstNode,this.firstNode=c}else{var d=this.nodeAtIndex(b-1);c.next=d.next;d.next=c}}}this.nElements++;return !0};buckets.LinkedList.prototype.first=function(){if(null!==this.firstNode){return this.firstNode.element}};buckets.LinkedList.prototype.last=function(){if(null!==this.lastNode){return this.lastNode.element}};buckets.LinkedList.prototype.elementAtIndex=function(a){a=this.nodeAtIndex(a);return null===a?void 0:a.element};buckets.LinkedList.prototype.indexOf=function(a,b){var c=b||buckets.defaultEquals;if(buckets.isUndefined(a)){return -1}for(var d=this.firstNode,e=0;null!==d;){if(c(d.element,a)){return e}e++;d=d.next}return -1};buckets.LinkedList.prototype.contains=function(a,b){return 0<=this.indexOf(a,b)};buckets.LinkedList.prototype.remove=function(a,b){var c=b||buckets.defaultEquals;if(1>this.nElements||buckets.isUndefined(a)){return !1}for(var d=null,e=this.firstNode;null!==e;){if(c(e.element,a)){return e===this.firstNode?(this.firstNode=this.firstNode.next,e===this.lastNode&&(this.lastNode=null)):(e===this.lastNode&&(this.lastNode=d),d.next=e.next,e.next=null),this.nElements--,!0}d=e;e=e.next}return !1};buckets.LinkedList.prototype.clear=function(){this.lastNode=this.firstNode=null;this.nElements=0};buckets.LinkedList.prototype.equals=function(a,b){var c=b||buckets.defaultEquals;return !(a instanceof buckets.LinkedList)||this.size()!==a.size()?!1:this.equalsAux(this.firstNode,a.firstNode,c)};buckets.LinkedList.prototype.equalsAux=function(a,b,c){for(;null!==a;){if(!c(a.element,b.element)){return !1}a=a.next;b=b.next}return !0};buckets.LinkedList.prototype.removeElementAtIndex=function(a){if(!(0>a||a>=this.nElements)){var b;1===this.nElements?(b=this.firstNode.element,this.lastNode=this.firstNode=null):(a=this.nodeAtIndex(a-1),null===a?(b=this.firstNode.element,this.firstNode=this.firstNode.next):a.next===this.lastNode&&(b=this.lastNode.element,this.lastNode=a),null!==a&&(b=a.next.element,a.next=a.next.next));this.nElements--;return b}};buckets.LinkedList.prototype.forEach=function(a){for(var b=this.firstNode;null!==b&&!1!==a(b.element);){b=b.next}};buckets.LinkedList.prototype.reverse=function(){for(var a=null,b=this.firstNode,c=null;null!==b;){c=b.next,b.next=a,a=b,b=c}c=this.firstNode;this.firstNode=this.lastNode;this.lastNode=c};buckets.LinkedList.prototype.toArray=function(){for(var a=[],b=this.firstNode;null!==b;){a.push(b.element),b=b.next}return a};buckets.LinkedList.prototype.size=function(){return this.nElements};buckets.LinkedList.prototype.isEmpty=function(){return 0>=this.nElements};buckets.LinkedList.prototype.nodeAtIndex=function(a){if(0>a||a>=this.nElements){return null}if(a===this.nElements-1){return this.lastNode}for(var b=this.firstNode,c=0;c<a;c++){b=b.next}return b};buckets.LinkedList.prototype.createNode=function(a){return{element:a,next:null}};buckets.Dictionary=function(a){this.table={};this.nElements=0;this.toStr=a||buckets.defaultToString};buckets.Dictionary.prototype.get=function(a){a=this.table[this.toStr(a)];return buckets.isUndefined(a)?void 0:a.value};buckets.Dictionary.prototype.set=function(a,b){if(!buckets.isUndefined(a)&&!buckets.isUndefined(b)){var c,d=this.toStr(a);c=this.table[d];buckets.isUndefined(c)?(this.nElements++,c=void 0):c=c.value;this.table[d]={key:a,value:b};return c}};buckets.Dictionary.prototype.remove=function(a){a=this.toStr(a);var b=this.table[a];if(!buckets.isUndefined(b)){return delete this.table[a],this.nElements--,b.value}};buckets.Dictionary.prototype.keys=function(){var a=[],b;for(b in this.table){this.table.hasOwnProperty(b)&&a.push(this.table[b].key)}return a};buckets.Dictionary.prototype.values=function(){var a=[],b;for(b in this.table){this.table.hasOwnProperty(b)&&a.push(this.table[b].value)}return a};buckets.Dictionary.prototype.forEach=function(a){for(var b in this.table){if(this.table.hasOwnProperty(b)){var c=this.table[b];if(!1===a(c.key,c.value)){break}}}};buckets.Dictionary.prototype.containsKey=function(a){return !buckets.isUndefined(this.get(a))};buckets.Dictionary.prototype.clear=function(){this.table={};this.nElements=0};buckets.Dictionary.prototype.size=function(){return this.nElements};buckets.Dictionary.prototype.isEmpty=function(){return 0>=this.nElements};buckets.MultiDictionary=function(a,b){this.parent=new buckets.Dictionary(a);this.equalsF=b||buckets.defaultEquals};buckets.MultiDictionary.prototype.get=function(a){a=this.parent.get(a);return buckets.isUndefined(a)?[]:buckets.arrays.copy(a)};buckets.MultiDictionary.prototype.set=function(a,b){if(buckets.isUndefined(a)||buckets.isUndefined(b)){return !1}if(!this.containsKey(a)){return this.parent.set(a,[b]),!0}var c=this.parent.get(a);if(buckets.arrays.contains(c,b,this.equalsF)){return !1}c.push(b);return !0};buckets.MultiDictionary.prototype.remove=function(a,b){if(buckets.isUndefined(b)){var c=this.parent.remove(a);return buckets.isUndefined(c)?!1:!0}c=this.parent.get(a);return buckets.arrays.remove(c,b,this.equalsF)?(0===c.length&&this.parent.remove(a),!0):!1};buckets.MultiDictionary.prototype.keys=function(){return this.parent.keys()};buckets.MultiDictionary.prototype.values=function(){for(var a=this.parent.values(),b=[],c=0;c<a.length;c++){for(var d=a[c],e=0;e<d.length;e++){b.push(d[e])}}return b};buckets.MultiDictionary.prototype.containsKey=function(a){return this.parent.containsKey(a)};buckets.MultiDictionary.prototype.clear=function(){return this.parent.clear()};buckets.MultiDictionary.prototype.size=function(){return this.parent.size()};buckets.MultiDictionary.prototype.isEmpty=function(){return this.parent.isEmpty()};buckets.Heap=function(a){this.data=[];this.compare=a||buckets.defaultCompare};buckets.Heap.prototype.leftChildIndex=function(a){return 2*a+1};buckets.Heap.prototype.rightChildIndex=function(a){return 2*a+2};buckets.Heap.prototype.parentIndex=function(a){return Math.floor((a-1)/2)};buckets.Heap.prototype.minIndex=function(a,b){return b>=this.data.length?a>=this.data.length?-1:a:0>=this.compare(this.data[a],this.data[b])?a:b};buckets.Heap.prototype.siftUp=function(a){for(var b=this.parentIndex(a);0<a&&0<this.compare(this.data[b],this.data[a]);){buckets.arrays.swap(this.data,b,a),a=b,b=this.parentIndex(a)}};buckets.Heap.prototype.siftDown=function(a){for(var b=this.minIndex(this.leftChildIndex(a),this.rightChildIndex(a));0<=b&&0<this.compare(this.data[a],this.data[b]);){buckets.arrays.swap(this.data,b,a),a=b,b=this.minIndex(this.leftChildIndex(a),this.rightChildIndex(a))}};buckets.Heap.prototype.peek=function(){if(0<this.data.length){return this.data[0]}};buckets.Heap.prototype.add=function(a){if(!buckets.isUndefined(a)){return this.data.push(a),this.siftUp(this.data.length-1),!0}};buckets.Heap.prototype.removeRoot=function(){if(0<this.data.length){var a=this.data[0];this.data[0]=this.data[this.data.length-1];this.data.splice(this.data.length-1,1);0<this.data.length&&this.siftDown(0);return a}};buckets.Heap.prototype.contains=function(a){var b=buckets.compareToEquals(this.compare);return buckets.arrays.contains(this.data,a,b)};buckets.Heap.prototype.size=function(){return this.data.length};buckets.Heap.prototype.isEmpty=function(){return 0>=this.data.length};buckets.Heap.prototype.clear=function(){this.data.length=0};buckets.Heap.prototype.forEach=function(a){buckets.arrays.forEach(this.data,a)};buckets.Stack=function(){this.list=new buckets.LinkedList};buckets.Stack.prototype.push=function(a){return this.list.add(a,0)};buckets.Stack.prototype.add=function(a){return this.list.add(a,0)};buckets.Stack.prototype.pop=function(){return this.list.removeElementAtIndex(0)};buckets.Stack.prototype.peek=function(){return this.list.first()};buckets.Stack.prototype.size=function(){return this.list.size()};buckets.Stack.prototype.contains=function(a,b){return this.list.contains(a,b)};buckets.Stack.prototype.isEmpty=function(){return this.list.isEmpty()};buckets.Stack.prototype.clear=function(){this.list.clear()};buckets.Stack.prototype.forEach=function(a){this.list.forEach(a)};buckets.Queue=function(){this.list=new buckets.LinkedList};buckets.Queue.prototype.enqueue=function(a){return this.list.add(a)};buckets.Queue.prototype.add=function(a){return this.list.add(a)};buckets.Queue.prototype.dequeue=function(){if(0!==this.list.size()){var a=this.list.first();this.list.removeElementAtIndex(0);return a}};buckets.Queue.prototype.peek=function(){if(0!==this.list.size()){return this.list.first()}};buckets.Queue.prototype.size=function(){return this.list.size()};buckets.Queue.prototype.contains=function(a,b){return this.list.contains(a,b)};buckets.Queue.prototype.isEmpty=function(){return 0>=this.list.size()};buckets.Queue.prototype.clear=function(){this.list.clear()};buckets.Queue.prototype.forEach=function(a){this.list.forEach(a)};buckets.PriorityQueue=function(a){this.heap=new buckets.Heap(buckets.reverseCompareFunction(a))};buckets.PriorityQueue.prototype.enqueue=function(a){return this.heap.add(a)};buckets.PriorityQueue.prototype.add=function(a){return this.heap.add(a)};buckets.PriorityQueue.prototype.dequeue=function(){if(0!==this.heap.size()){var a=this.heap.peek();this.heap.removeRoot();return a}};buckets.PriorityQueue.prototype.peek=function(){return this.heap.peek()};buckets.PriorityQueue.prototype.contains=function(a){return this.heap.contains(a)};buckets.PriorityQueue.prototype.isEmpty=function(){return this.heap.isEmpty()};buckets.PriorityQueue.prototype.size=function(){return this.heap.size()};buckets.PriorityQueue.prototype.clear=function(){this.heap.clear()};buckets.PriorityQueue.prototype.forEach=function(a){this.heap.forEach(a)};buckets.Set=function(a){this.dictionary=new buckets.Dictionary(a)};buckets.Set.prototype.contains=function(a){return this.dictionary.containsKey(a)};buckets.Set.prototype.add=function(a){if(this.contains(a)||buckets.isUndefined(a)){return !1}this.dictionary.set(a,a);return !0};buckets.Set.prototype.intersection=function(a){var b=this;this.forEach(function(c){a.contains(c)||b.remove(c)})};buckets.Set.prototype.union=function(a){var b=this;a.forEach(function(a){b.add(a)})};buckets.Set.prototype.difference=function(a){var b=this;a.forEach(function(a){b.remove(a)})};buckets.Set.prototype.isSubsetOf=function(a){if(this.size()>a.size()){return !1}var b=!0;this.forEach(function(c){if(!a.contains(c)){return b=!1}});return b};buckets.Set.prototype.remove=function(a){return this.contains(a)?(this.dictionary.remove(a),!0):!1};buckets.Set.prototype.forEach=function(a){this.dictionary.forEach(function(b,c){return a(c)})};buckets.Set.prototype.toArray=function(){return this.dictionary.values()};buckets.Set.prototype.isEmpty=function(){return this.dictionary.isEmpty()};buckets.Set.prototype.size=function(){return this.dictionary.size()};buckets.Set.prototype.clear=function(){this.dictionary.clear()};buckets.Bag=function(a){this.toStrF=a||buckets.defaultToString;this.dictionary=new buckets.Dictionary(this.toStrF);this.nElements=0};buckets.Bag.prototype.add=function(a,b){if(isNaN(b)||buckets.isUndefined(b)){b=1}if(buckets.isUndefined(a)||0>=b){return !1}this.contains(a)?this.dictionary.get(a).copies+=b:this.dictionary.set(a,{value:a,copies:b});this.nElements+=b;return !0};buckets.Bag.prototype.count=function(a){return this.contains(a)?this.dictionary.get(a).copies:0};buckets.Bag.prototype.contains=function(a){return this.dictionary.containsKey(a)};buckets.Bag.prototype.remove=function(a,b){if(isNaN(b)||buckets.isUndefined(b)){b=1}if(!(buckets.isUndefined(a)||0>=b)&&this.contains(a)){var c=this.dictionary.get(a);this.nElements=b>c.copies?this.nElements-c.copies:this.nElements-b;c.copies-=b;0>=c.copies&&this.dictionary.remove(a);return !0}return !1};buckets.Bag.prototype.toArray=function(){for(var a=[],b=this.dictionary.values(),c=b.length,d=0;d<c;d++){for(var e=b[d],f=e.value,e=e.copies,g=0;g<e;g++){a.push(f)}}return a};buckets.Bag.prototype.toSet=function(){for(var a=new buckets.Set(this.toStrF),b=this.dictionary.values(),c=b.length,d=0;d<c;d++){a.add(b[d].value)}return a};buckets.Bag.prototype.forEach=function(a){this.dictionary.forEach(function(b,c){for(var d=c.value,e=c.copies,f=0;f<e;f++){if(!1===a(d)){return !1}}return !0})};buckets.Bag.prototype.size=function(){return this.nElements};buckets.Bag.prototype.isEmpty=function(){return 0===this.nElements};buckets.Bag.prototype.clear=function(){this.nElements=0;this.dictionary.clear()};buckets.BSTree=function(a){this.root=null;this.compare=a||buckets.defaultCompare;this.nElements=0};buckets.BSTree.prototype.add=function(a){return buckets.isUndefined(a)?!1:null!==this.insertNode(this.createNode(a))?(this.nElements++,!0):!1};buckets.BSTree.prototype.clear=function(){this.root=null;this.nElements=0};buckets.BSTree.prototype.isEmpty=function(){return 0===this.nElements};buckets.BSTree.prototype.size=function(){return this.nElements};buckets.BSTree.prototype.contains=function(a){return buckets.isUndefined(a)?!1:null!==this.searchNode(this.root,a)};buckets.BSTree.prototype.remove=function(a){a=this.searchNode(this.root,a);if(null===a){return !1}this.removeNode(a);this.nElements--;return !0};buckets.BSTree.prototype.inorderTraversal=function(a){this.inorderTraversalAux(this.root,a,{stop:!1})};buckets.BSTree.prototype.preorderTraversal=function(a){this.preorderTraversalAux(this.root,a,{stop:!1})};buckets.BSTree.prototype.postorderTraversal=function(a){this.postorderTraversalAux(this.root,a,{stop:!1})};buckets.BSTree.prototype.levelTraversal=function(a){this.levelTraversalAux(this.root,a)};buckets.BSTree.prototype.minimum=function(){return this.isEmpty()?void 0:this.minimumAux(this.root).element};buckets.BSTree.prototype.maximum=function(){return this.isEmpty()?void 0:this.maximumAux(this.root).element};buckets.BSTree.prototype.forEach=function(a){this.inorderTraversal(a)};buckets.BSTree.prototype.toArray=function(){var a=[];this.inorderTraversal(function(b){a.push(b)});return a};buckets.BSTree.prototype.height=function(){return this.heightAux(this.root)};buckets.BSTree.prototype.searchNode=function(a,b){for(var c=null;null!==a&&0!==c;){c=this.compare(b,a.element),0>c?a=a.leftCh:0<c&&(a=a.rightCh)}return a};buckets.BSTree.prototype.transplant=function(a,b){null===a.parent?this.root=b:a===a.parent.leftCh?a.parent.leftCh=b:a.parent.rightCh=b;null!==b&&(b.parent=a.parent)};buckets.BSTree.prototype.removeNode=function(a){if(null===a.leftCh){this.transplant(a,a.rightCh)}else{if(null===a.rightCh){this.transplant(a,a.leftCh)}else{var b=this.minimumAux(a.rightCh);b.parent!==a&&(this.transplant(b,b.rightCh),b.rightCh=a.rightCh,b.rightCh.parent=b);this.transplant(a,b);b.leftCh=a.leftCh;b.leftCh.parent=b}}};buckets.BSTree.prototype.inorderTraversalAux=function(a,b,c){null===a||c.stop||(this.inorderTraversalAux(a.leftCh,b,c),c.stop||(c.stop=!1===b(a.element),c.stop||this.inorderTraversalAux(a.rightCh,b,c)))};buckets.BSTree.prototype.levelTraversalAux=function(a,b){var c=new buckets.Queue;for(null!==a&&c.enqueue(a);!c.isEmpty();){a=c.dequeue();if(!1===b(a.element)){break}null!==a.leftCh&&c.enqueue(a.leftCh);null!==a.rightCh&&c.enqueue(a.rightCh)}};buckets.BSTree.prototype.preorderTraversalAux=function(a,b,c){null===a||c.stop||(c.stop=!1===b(a.element),c.stop||(this.preorderTraversalAux(a.leftCh,b,c),c.stop||this.preorderTraversalAux(a.rightCh,b,c)))};buckets.BSTree.prototype.postorderTraversalAux=function(a,b,c){null===a||c.stop||(this.postorderTraversalAux(a.leftCh,b,c),c.stop||(this.postorderTraversalAux(a.rightCh,b,c),c.stop||(c.stop=!1===b(a.element))))};buckets.BSTree.prototype.minimumAux=function(a){for(;null!==a.leftCh;){a=a.leftCh}return a};buckets.BSTree.prototype.maximumAux=function(a){for(;null!==a.rightCh;){a=a.rightCh}return a};buckets.BSTree.prototype.successorNode=function(a){if(null!==a.rightCh){return this.minimumAux(a.rightCh)}for(var b=a.parent;null!==b&&a===b.rightCh;){a=b,b=a.parent}return b};buckets.BSTree.prototype.heightAux=function(a){return null===a?-1:Math.max(this.heightAux(a.leftCh),this.heightAux(a.rightCh))+1};buckets.BSTree.prototype.insertNode=function(a){for(var b=null,c=this.root,d=null;null!==c;){d=this.compare(a.element,c.element);if(0===d){return null}0>d?(b=c,c=c.leftCh):(b=c,c=c.rightCh)}a.parent=b;null===b?this.root=a:0>this.compare(a.element,b.element)?b.leftCh=a:b.rightCh=a;return a};buckets.BSTree.prototype.createNode=function(a){return{element:a,leftCh:null,rightCh:null,parent:null}};"undefined"!==typeof module&&(module.exports=buckets);






function TreeBase() {}

// removes all nodes from the tree
TreeBase.prototype.clear = function() {
    this._root = null;
    this.size = 0;
};

// returns node data if found, null otherwise
TreeBase.prototype.find = function(data) {
    var res = this._root;

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            return res.data;
        }
        else {
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// returns iterator to node if found, null otherwise
TreeBase.prototype.findIter = function(data) {
    var res = this._root;
    var iter = this.iterator();

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            iter._cursor = res;
            return iter;
        }
        else {
            iter._ancestors.push(res);
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// Returns an interator to the tree node at or immediately after the item
TreeBase.prototype.lowerBound = function(item) {
    var cur = this._root;
    var iter = this.iterator();
    var cmp = this._comparator;

    while(cur !== null) {
        var c = cmp(item, cur.data);
        if(c === 0) {
            iter._cursor = cur;
            return iter;
        }
        iter._ancestors.push(cur);
        cur = cur.get_child(c > 0);
    }

    for(var i=iter._ancestors.length - 1; i >= 0; --i) {
        cur = iter._ancestors[i];
        if(cmp(item, cur.data) < 0) {
            iter._cursor = cur;
            iter._ancestors.length = i;
            return iter;
        }
    }

    iter._ancestors.length = 0;
    return iter;
};

// Returns an interator to the tree node immediately after the item
TreeBase.prototype.upperBound = function(item) {
    var iter = this.lowerBound(item);
    var cmp = this._comparator;

    while(cmp(iter.data(), item) === 0) {
        iter.next();
    }

    return iter;
};

// returns null if tree is empty
TreeBase.prototype.min = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.left !== null) {
        res = res.left;
    }

    return res.data;
};

// returns null if tree is empty
TreeBase.prototype.max = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.right !== null) {
        res = res.right;
    }

    return res.data;
};

// returns a null iterator
// call next() or prev() to point to an element
TreeBase.prototype.iterator = function() {
    return new Iterator(this);
};

// calls cb on each node's data, in order
TreeBase.prototype.each = function(cb) {
    var it=this.iterator(), data;
    while((data = it.next()) !== null) {
        cb(data);
    }
};

// calls cb on each node's data, in reverse order
TreeBase.prototype.reach = function(cb) {
    var it=this.iterator(), data;
    while((data = it.prev()) !== null) {
        cb(data);
    }
};


function Iterator(tree) {
    this._tree = tree;
    this._ancestors = [];
    this._cursor = null;
}

Iterator.prototype.data = function() {
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns first node
// otherwise, returns next node
Iterator.prototype.next = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._minNode(root);
        }
    }
    else {
        if(this._cursor.right === null) {
            // no greater node in subtree, go up to parent
            // if coming from a right child, continue up the stack
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.right === save);
        }
        else {
            // get the next node from the subtree
            this._ancestors.push(this._cursor);
            this._minNode(this._cursor.right);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns last node
// otherwise, returns previous node
Iterator.prototype.prev = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._maxNode(root);
        }
    }
    else {
        if(this._cursor.left === null) {
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.left === save);
        }
        else {
            this._ancestors.push(this._cursor);
            this._maxNode(this._cursor.left);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

Iterator.prototype._minNode = function(start) {
    while(start.left !== null) {
        this._ancestors.push(start);
        start = start.left;
    }
    this._cursor = start;
};

Iterator.prototype._maxNode = function(start) {
    while(start.right !== null) {
        this._ancestors.push(start);
        start = start.right;
    }
    this._cursor = start;
};
function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}

Node.prototype.get_child = function(dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function(dir, val) {
    if(dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

function BinTree(comparator) {
    this._root = null;
    this._comparator = comparator;
    this.size = 0;
}

BinTree.prototype = new TreeBase();

// returns true if inserted, false if duplicate
BinTree.prototype.insert = function(data) {
    if(this._root === null) {
        // empty tree
        this._root = new Node(data);
        this.size++;
        return true;
    }

    var dir = 0;

    // setup
    var p = null; // parent
    var node = this._root;

    // search down
    while(true) {
        if(node === null) {
            // insert new node at the bottom
            node = new Node(data);
            p.set_child(dir, node);
            ret = true;
            this.size++;
            return true;
        }

        // stop if found
        if(this._comparator(node.data, data) === 0) {
            return false;
        }

        dir = this._comparator(node.data, data) < 0;

        // update helpers
        p = node;
        node = node.get_child(dir);
    }
};

// returns true if removed, false if not found
BinTree.prototype.remove = function(data) {
    if(this._root === null) {
        return false;
    }

    var head = new Node(undefined); // fake tree root
    var node = head;
    node.right = this._root;
    var p = null; // parent
    var found = null; // found item
    var dir = 1;

    while(node.get_child(dir) !== null) {
        p = node;
        node = node.get_child(dir);
        var cmp = this._comparator(data, node.data);
        dir = cmp > 0;

        if(cmp === 0) {
            found = node;
        }
    }

    if(found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));

        this._root = head.right;
        this.size--;
        return true;
    }
    else {
        return false;
    }
};






