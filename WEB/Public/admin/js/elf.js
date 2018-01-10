var elf=window.elf||{};
elf.util={};
elf.util.Browser=(function(c){var e=c.split("|");
var b={};
for(var d=e.length-1;
d>=0;
d--){b[e[d]]=0
}var a=navigator.userAgent.match(new RegExp("("+c+")[ \\/](\\d+(\\.\\d+)?)"));
if(a&&a.length){b[a[1]]=parseFloat(a[2])
}return b
})("IE|Firefox|Safari|Chrome|Opera");
elf.util.Browser.fixer={};
elf.util.Browser.fixer.ieBackgoundCache=function(){if(elf.util.Browser.IE<=6){try{document.execCommand("BackgroundImageCache",false,true)
}catch(a){}}};
elf.util.Browser.fixer.ieStringTrim=function(){if(!String.prototype.trim){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")
}
}};
elf.util.Browser.fixer.JSON=function(){window.JSON=window.JSON||{parse:function(a){return(new Function("return ("+a+");"))()
},stringify:(function(){var b={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function a(f){if(/["\\\x00-\x1f]/.test(f)){f=f.replace(/["\\\x00-\x1f]/g,function(g){var h=b[g];
if(h){return h
}h=g.charCodeAt();
return"\\u00"+Math.floor(h/16).toString(16)+(h%16).toString(16)
})
}return'"'+f+'"'
}function d(m){var g=["["],h=m.length,f,j,k;
for(j=0;
j<h;
j++){k=m[j];
switch(typeof k){case"undefined":case"function":case"unknown":break;
default:if(f){g.push(",")
}g.push(JSON.stringify(k));
f=1
}}g.push("]");
return g.join("")
}function c(f){return f<10?"0"+f:f
}function e(f){return'"'+f.getFullYear()+"-"+c(f.getMonth()+1)+"-"+c(f.getDate())+"T"+c(f.getHours())+":"+c(f.getMinutes())+":"+c(f.getSeconds())+'"'
}return function(k){switch(typeof k){case"undefined":return"undefined";
case"number":return isFinite(k)?String(k):"null";
case"string":return a(k);
case"boolean":return String(k);
default:if(k===null){return"null"
}else{if(k instanceof Array){return d(k)
}else{if(k instanceof Date){return e(k)
}else{var g=["{"],j=JSON.stringify,f,i;
for(var h in k){if(k.hasOwnProperty(h)){i=k[h];
switch(typeof i){case"undefined":case"unknown":case"function":break;
default:if(f){g.push(",")
}f=1;
g.push(j(h)+":"+j(i))
}}}g.push("}");
return g.join("")
}}}}}
})()}
};
elf.util.Browser.fix=function(){var b={};
var a=Array.prototype.slice.call(arguments,0);
if(a.length){for(var d=a.length-1;
d>=0;
d++){var c=a[d],e=this.fixer[c];
if(e){b[c]=e
}}}else{b=this.fixer
}for(var d in b){b[d]()
}};
elf.util.Browser.fix();
elf.util.extend=function(e,c,g){var e=e||(c instanceof Array?[]:(c instanceof Function?c:{}));
for(var f in c){if(f&&f!="constructor"&&f!="prototype"){if(g&&c[f]&&typeof(c[f])=="object"){e[f]=e[f]||(c[f].constructor==Array?[]:{});
elf.util.extend(e[f],c[f],g)
}else{if(typeof c[f]!="undefined"){if(c[f]!==null){e[f]=c[f]
}else{e[f]=null;
delete e[f]
}}}}}if(c&&c.hasOwnProperty("toString")){e.toString=c.toString
}return e
};
elf.util.namespace=function(b,f,d){var e=window;
if(b){switch(typeof(f)){case"object":e=f;
break;
case"string":e=elf.util.namespace(f);
break;
default:break
}var b=b.split(".");
for(var c=0,a=b.length;
c<a;
c++){if(!b[c]){continue
}if(!e[b[c]]){if(d){e[b[c]]=c<a-1?{}:(d===true?{}:d)
}else{e=(function(){})();
break
}}e=e[b[c]]
}}else{e=(function(){})()
}return e
};
elf.util.Class={create:function(b,a){var c=function(){return this.initialize&&this.initialize.apply(this,arguments)
};
for(var d in b){c.prototype[d]=b[d]
}this._fixIEToString(c.prototype,b);
return a?this.inherit(c,a):c
},inherit:function(a,b){var c=a.prototype;
var e={};
for(var f in a){if(f!="prototype"){e[f]=a[f]
}}this._fixIEToString(e,a);
var d=function(){};
d.prototype=b.prototype;
a.prototype=new d();
for(var f in c){a.prototype[f]=c[f]
}this._fixIEToString(a.prototype,c);
for(var f in b){if(f!="prototype"){a[f]=b[f]
}}this._fixIEToString(a,b);
for(var f in e){a[f]=e[f]
}this._fixIEToString(a,e);
a.prototype.superClass=b;
a.prototype.constructor=a;
return a
},_fixIEToString:function(d,c){if(!d.hasOwnProperty("toString")&&c.hasOwnProperty("toString")){d.toString=c.toString
}}};
elf.util.using=function(e,b){var d=e.match(/\.(\w+|\*)$/)[1];
if(d=="*"){var c=e.slice(0,-2);
var f=elf.util.namespace(c);
for(var a in f){if(a!="prototype"){elf.util.using(c+"."+a)
}}}else{d=b||d;
if(!window[d]){window[d]=elf.util.namespace(e)
}}};
elf.util.nothing=function(){};
elf.util.guid=function(a){return(a||"")+(this.i?++this.i:(this.i=1))
};
elf.util.template=function(g,h){var j=Array.prototype.slice.call(arguments,1);
if(j.length>0){if(g instanceof Function){return g.apply(null,j)
}var b=elf.util.template,d=/([.*+?^=!:${}()|\[\]\/\\])/g,c=b.LEFT_DELIMITER.replace(d,"\\$1"),a=b.RIGHT_DELIMITER.replace(d,"\\$1");
if(typeof(h)=="object"&&!(h instanceof String)){var i=b._oTpl||(b._oTpl=new RegExp(c+"(.+?)"+a,"g"));
return g.replace(i,function(k,m){var l=h[m];
if(typeof l=="function"){l=l(m)
}return typeof(l)=="undefined"?"":l
})
}else{if(typeof(h)!="undefined"){var e=b._dTpl||(b._dTpl=new RegExp(c+"(\\d+)"+a,"g"));
var f=j.length;
return g.replace(e,function(k,l){l=parseInt(l,10);
return(l>f)?k:j[l]
})
}}}return g
};
elf.util.extend(elf.util.template,{LEFT_DELIMITER:"#{",RIGHT_DELIMITER:"}"});
elf.util.Map=elf.util.Class.create({get:function(a){return typeof a!="undefined"?this.map[a]:this.map
},update:function(d,c,e){if(typeof c!="undefined"){var g=this.constructor.updataMethod;
var f=this.map;
if(typeof e=="undefined"){if(c.constructor==this.constructor){if(c==this){return this
}else{return g[d].update.call(this,c.get())
}}else{var b=c;
if(typeof b=="string"){b=this.constructor.parseJSON(b)
}for(var a in b){g[d].updateValue.call(this,a,b[a])
}}}else{if(typeof c=="string"&&c!=""){g[d].updateValue.call(this,c,e)
}}}return this
},remove:function(a){if(a){delete this.map[a]
}else{this.map={}
}return this
},addValue:function(a,b){return this.setValue(a,b)
},add:function(a,b){return this.update(this.constructor.UPDATE_TYPE_ADD,a,b)
},setValue:function(a,b){var c=this.map;
if(b===null){delete c[a]
}else{c[a]=b
}return this
},set:function(a,b){return this.update(this.constructor.UPDATE_TYPE_SET,a,b)
},toString:function(){return JSON.stringify(this.map)
},initialize:function(){this.map={};
return this.set.apply(this,arguments)
}});
elf.util.extend(elf.util.Map,{UPDATE_TYPE_ADD:"add",UPDATE_TYPE_SET:"set",updataMethod:{add:{update:function(a,b){return this.add(a,b)
},updateValue:function(a,b){return this.addValue(a,b)
}},set:{update:function(a,b){return this.set(a,b)
},updateValue:function(a,b){return this.setValue(a,b)
}}},parseJSON:function(a){return JSON.parse(a)
}});
elf.util.Type={BOOLEAN:"boolean",NUMBER:"number",STRING:"string",FUNCTION:"function",OBJECT:"object",UNDEFINED:"undefined",isBoolean:function(a){return(typeof a==elf.util.Type.BOOLEAN)||(a instanceof Boolean)
},isFunction:function(a){return Object.prototype.toString.call(a)=="[object Function]"
},isNull:function(a){return a===null
},isNumber:function(a){return(typeof a==elf.util.Type.NUMBER)||(a instanceof Number)
},isObject:function(a){return typeof a=="object"&&a!==null
},isString:function(a){return(typeof a==elf.util.Type.STRING)||(a instanceof String)
},isUndefined:function(a){return typeof a==elf.util.Type.UNDEFINED
},isDefined:function(a){return !elf.util.Type.isUndefined(a)
}};
elf.dom={};
elf.dom.ClassName=elf.util.Class.create({add:function(a){this.name=this.constructor.add(this.name,a);
return this
},remove:function(a){this.name=this.constructor.remove(this.name,a);
return this
},toggle:function(b,a){this.name=this.constructor.toggle(this.name,b,a);
return this
},change:function(a,b){this.name=this.constructor.change(this.name,a,b);
return this
},has:function(a){return this.constructor.has(this.name,a)
},toString:function(){return this.name
},initialize:function(a){this.name="";
a&&this.add(a)
}});
elf.util.extend(elf.dom.ClassName,{add:function(f,c){var b=elf.util.Type.isString(f);
var d=b?f:f.className;
var c=c instanceof Array?c:c.split(/ +/);
d=" "+d+" ";
for(var e=0,a=c.length;
e<a;
e++){if(d.indexOf(" "+c[e]+" ")<0){d=" "+(d+=(d?" ":"")+c[e])+" "
}}d=d.trim();
if(!b){f.className=d
}return d
},remove:function(d,b){var a=elf.util.Type.isString(d);
var c=a?d:d.className;
var b=b instanceof Array?b:b.split(/\s+/);
c=c.replace(new RegExp("(^| +)("+b.join("|")+")( +|$)","g")," ");
if(!a){d.className=c
}return c
},has:function(f,b){var d=elf.util.Type.isString(f)?f:f.className;
var b=b instanceof Array?b:b.split(/\s+/);
var c=" "+d+" ";
var g=true;
for(var e=0,a=b.length;
e<a;
e++){if(c.indexOf(" "+b[e]+" ")<0){g=false;
break
}}return g
},toggle:function(d,b,a){var c="";
if(elf.util.Type.isUndefined(a)){this.toggle(d,b,!this.has(d,b))
}else{if(a){c=this.add(d,b)
}else{c=this.remove(d,b)
}}return c
},change:function(a,b,c){this.remove(a,b);
return this.add(a,c)
}});
elf.dom.query=function(q,n){var s=elf.dom.query._;
n=n||document;
n=n instanceof Array?n:[n];
var k=[],t;
var p=(q.substr(1).search(/[ >]/)+1)||q.length;
var r=q.substr(0,p);
var f=q.substr(p);
var h=r.match(s.T);
var u=h[3]||"*";
r=h[4]&&u=="*"?r:r.replace(s.T,(h[1]||" ")+u+(h[4]||""));
for(var e=0,g=n.length;
e<g;
e++){h=s.W.exec(r);
t=s.G[h[1]].call(n[e],h[2]);
s.W.lastIndex=0;
for(var d=0,b=t.length;
d<b;
d++){var m=true;
while(h=s.W.exec(r)){var o=s.E[h[1]];
if(o&&!o.call(t[d],h[2],n[e])){m=false;
break
}}m&&k.push(t[d]);
s.A="";
s.W.lastIndex=0
}}return s.U(f&&k.length&&elf.dom.query(f,k)||k)
};
elf.dom.query._={W:/([ >#\.\[\]]|[~^!]?=)([\w\-]*|\*)?/g,T:/^([ >]?)((\w*|\*)?([#]\w+)?)/,G:{" ":function(a){return(this||document).getElementsByTagName(a||"*")
},">":function(a){return this.childNodes
},"#":function(a){return[document.getElementById(a)]
}},E:{">":function(b,a){return this.parentNode==a&&(b=="*"||this.nodeName==b.toUpperCase())
},"#":function(a){return this.getAttribute("id")==a
},".":function(a){return(" "+this.className+" ").indexOf(" "+a+" ")>=0
},"[":function(a){return this.getAttribute(elf.dom.query._.A=a)!==null
},"=":function(a){return this.getAttribute(elf.dom.query._.A)==a
}},A:"",U:function(a){for(var c=0;
c<a.length-1;
c++){for(var b=c+1;
b<a.length;
b++){if(a[c]==a[b]){a.splice(b--,1)
}}}return a
}};
elf.dom.Style=elf.util.Class.create({toString:function(){var a=[];
var c=this.map;
for(var b in c){a.push(b+":"+c[b])
}return a.join(";")
}},elf.util.Map);
elf.util.extend(elf.dom.Style,{parseJSON:function(e){var b={};
var a=e.split(/\s*;\s*/);
for(var d=a.length-1;
d>=0;
d--){var g=a[d].split(/\s*\:\s*/);
var c=g[0],f=g[1];
b[g[0]]=g[1]
}return b
},toCamelCase:function(a){return String(a).replace(/[-_][a-z]/g,function(b){return b.charAt(1).toUpperCase()
})
},get:function(c,b){var b=this.toCamelCase(b);
var f=c.style[b];
if(!f){var a=this.fixer[b],e=c.currentStyle||(elf.util.Browser.IE?c.style:(document.defaultView.getComputedStyle(c,null)||{}));
if("string"==typeof a){f=e[a]
}else{if(a&&a.get){f=a.get(e,b)
}else{f=e[b]
}}}var d=this.filter[b];
if(d){f=d(f)
}return f
},set:function(d,c,e){if(elf.util.Type.isUndefined(e)&&elf.util.Type.isObject(c)){for(var b in c){this.set(d,b,c[b])
}}else{var c=this.toCamelCase(c);
var a=this.fixer[c];
(a&&a.set)?a.set(d,e):(d.style[a||c]=e)
}},fixer:{opacity:elf.util.Browser.IE?{get:function(b){var a=b.filter;
return a&&a.indexOf("opacity=")>=0?(parseFloat(a.match(/opacity=([^)]*)/)[1])/100)+"":"1"
},set:function(a,c){var b=a.style;
b.filter=(b.filter||"").replace(/alpha\([^\)]*\)/gi,"")+("alpha(opacity="+c*100+")");
b.zoom=1
}}:null,"float":elf.util.Browser.IE?"styleFloat":"cssFloat"},filter:{background:function(a){return this.color.get(a)
},backgroundColor:function(a){return this.color.get(a)
},color:function(e){var c=e,b;
if(b=e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i)){c="#";
for(var d=1;
d<4;
d++){var a=parseInt(b[d]).toString(16);
c+=a.length>1?"0"+a:a
}}return c
}}});
elf.dom.Event={regList:{},uniqueName:elf.util.guid("Event_"),browserType:document.addEventListener?1:0,compatibleEventMap:{input:["propertychange","input"]},parseEvent:function(c){var a=c||window.event;
var d={};
for(var b in a){d[b]=a[b]
}d.target=d.srcElement=d.target||d.srcElement;
d.keyCode=d.which||d.keyCode;
d.rightClick=d.which==3||d.button==2;
d.preventDefault=function(){a.preventDefault&&a.preventDefault()||(a.returnValue=false)
};
d.stopPropagation=function(){a.stopPropagation&&a.stopPropagation()||(a.cancelBubble=true)
};
return d
},add:function(h,e,d,c){var b=this.compatibleEventMap[e];
var e=b&&b[this.browserType]||e;
var a=this.uniqueName;
d[a]||(d[a]=elf.util.guid());
if(!h[a]){h[a]={}
}var g=h[a];
if(!g[e]){g[e]={}
}var f=g[e];
if(f[d[a]]==d){return
}else{f[d[a]]=d
}this._GV_helper=function(j){var j=elf.dom.Event.parseEvent(j);
if(c){for(var i=j.target;
i&&i!=h;
i=i.parentNode){if(Object.prototype.toString.call(c)=="[object Function]"&&c(i)){if(d.call(i,j)===false){j.preventDefault&&j.preventDefault();
break
}}}}else{return d.call(h,j)
}};
this._GV_helper[a]=d[a];
this.regList[d[a]]=this._GV_helper;
if(this.browserType){h.addEventListener(e,this._GV_helper,false)
}else{h.attachEvent("on"+e,this._GV_helper)
}},remove:function(a,f,g){var b,k;
var h=this.uniqueName;
var j=a[h]||{};
if(f){var c=this.compatibleEventMap[f];
var f=c&&c[this.browserType]||f;
k=j[f]||{};
if(g){var e=g[h];
if(e){b=this.regList[e];
if(b){if(this.browserType){a.removeEventListener(f,b,false)
}else{a.detachEvent("on"+f,b)
}delete k[e];
delete this.regList[e]
}}}else{for(var d=k.length-1;
d>=0;
d--){this.remove(a,f,k[d])
}}}else{for(var f in j){k=j[f]||{};
for(var d in k){this.remove(a,f,k[d])
}}}}};
elf.dom.getPosition=function(c,b){var e={x:0,y:0};
var a=c.currentStyle||document.defaultView.getComputedStyle(c,null);
if(!b){if(a.position=="absolute"){e.x=c.offsetLeft-(parseInt(a.marginLeft)||0);
e.y=c.offsetTop-(parseInt(a.marginTop)||0)
}else{if(a.position=="relative"){e.x=(parseInt(a.left)||0);
e.y=(parseInt(a.top)||0)
}}}else{for(var d=c;
d.offsetParent&&d!=b;
d=d.offsetParent){e.x+=d.offsetLeft;
e.y+=d.offsetTop
}if(a.position=="static"&&c.currentStyle){e.x+=(parseInt(document.body.currentStyle.marginLeft)||0)*2;
e.y+=(parseInt(document.body.currentStyle.marginTop)||0)*2
}}return e
};
elf.dom.isVisible=function(b,a){var e=true;
var d=a||document.documentElement;
for(var c=b;
c&&c!=d;
c=c.parentNode){if(elf.dom.Style.get(c,"display")=="none"){e=false;
break
}}return e
};
elf.net={};
elf.net.URLParameter=elf.util.Class.create({addValue:function(c,d){var e=this.map;
if(!e[c]){e[c]={}
}var g=e[c];
var f={};
if(d instanceof Array){for(var b=0,a=d.length;
b<0;
b++){this.add(c,d[b])
}}else{if(d!==null){g[d]=1
}}return this
},remove:function(a,b){if(a){if(typeof b!="undefined"){delete this.map[a][b]
}else{delete this.map[a]
}}else{this.map={}
}return this
},get:function(c){var a=[];
var f=this.map;
if(c){var e=f[c];
if(e){for(var b in e){a.push(b)
}}a=a.length?a.length==1?a[0]:a:null
}else{a={};
for(var b in f){var d=this.get(b);
if(d!==null){a[b]=d
}}}return a
},setValue:function(c,d){if(d===null){this.remove(c)
}else{var e={};
if(d instanceof Array){for(var b=0,a=d.length;
b<a;
b++){e[d[b]]=1
}}else{e[d]=1
}this.map[c]=e
}return this
},toString:function(e){var g=this.map;
var c=[];
var b=typeof e=="function";
for(var d in g){if(d.toString().length&&typeof(g[d])!="undefined"&&g[d]!=null){var f=g[d];
for(var a in f){if(f[a]){c.push("&",d,"=",b?e(a):a)
}}}}c.shift();
return c.join("")
}},elf.util.Map);
elf.net.URLParameter.parseJSON=function(b,c){var d={};
if(b.indexOf("?")==0){b=b.substr(1)
}b=b.replace(/^[\?&]*|&*$/,"").split("&");
var a={};
for(var g=0,e=b.length;
g<e;
g++){if(b[g]){var f=b[g].split("=");
var j=f[0],h=f[1];
h=typeof c=="function"?c(h):h;
if(!a[j]){d[j]=[h];
a[j]=1
}else{d[j].push(h)
}}}return d
};
elf.net.URL=function(a){this.initialize(a)
};
elf.util.extend(elf.net.URL.prototype,{initialize:function(a){var a=a||window.location.href;
elf.util.extend(this,this.constructor.option);
elf.util.extend(this,elf.util.Type.isString(a)?this.constructor.parseJSON(a):a);
this.parameter=new elf.net.URLParameter(this.parameter);
return this
},getProtocol:function(){var a="";
if(this.getHost()){a=(this.protocol||this.constructor.PROTOCOL_HTTP)+"://"
}return a
},getHost:function(){var a="";
if(this.hostname){a=this.hostname;
if(this.port&&this.port!=this.constructor.DEFAULT_PORT_HTTP){a+=":"+this.port
}}return a
},setParameter:function(a,b){this.parameter.set(a,b);
return this
},getParameter:function(a){return this.parameter.get(a)
},getParameterString:function(a){var b=this.parameter.toString(a);
b=b?"?"+b:"";
return b
},getHash:function(){return this.hash?"#"+this.hash:""
},toString:function(a){return elf.util.template(this.constructor.URL_TEMPLATE,{protocol:this.getProtocol(),host:this.getHost(),path:this.path,param:this.getParameterString(a),hash:this.getHash()})
}});
elf.util.extend(elf.net.URL,{DEFAULT_PORT_HTTP:80,PROTOCOL_HTTP:"http",PROTOCOL_HTTPS:"https",URL_TEMPLATE:"#{protocol}#{host}#{path}#{param}#{hash}",option:{protocol:"",hostname:"",port:"",path:"",parameter:"",hash:""},parseJSON:function(c){var d=elf.util.extend({},this.option);
if(!c||c==location.href||c===location){var c=location;
d=elf.util.extend(d,{protocol:c.protocol.replace(":",""),hostname:c.hostname,port:c.port,path:c.pathname,parameter:c.search.slice(1),hash:c.hash.slice(1)})
}else{if(elf.util.Type.isObject(c)){d=elf.util.extend(d,c)
}else{if(elf.util.Type.isString(c)){var b=c;
var f=c.match(/^(([a-z]+):\/\/)((([a-z0-9]+-?)*[a-z0-9]+\.)*([a-z0-9]+-?)*[a-z0-9]+)(\:(\d+))?\//i);
if(f){d.protocol=f[2];
d.hostname=f[3];
d.port=f[8]||"";
b=c.replace(f[0],"/")
}var g=b.indexOf("?");
var e=b.indexOf("#");
var a=b.length;
d.path=b.substring(0,g>=0?g:e>=0?e:a);
d.parameter=b.substring(g>=0?g:a,e>=0?e:a);
d.hash=b.substring(e>=0?e:a,a)
}}}return d
}});
elf.net.Loader=elf.util.Class.create({initialize:function(a){elf.util.extend(this,a)
},load:function(){this.constructor.load(this)
},onLoad:function(a){}});
elf.net.Ajax=function(a){this.initialize(a)
};
elf.util.extend(elf.net.Ajax.prototype,{initialize:function(a){var d=this;
var c=this.constructor.option;
elf.util.extend(this,c);
for(var b in c){var e=a[b];
if(elf.util.Type.isDefined(e)){if(elf.util.Type.isNull(e)){this[b]=null;
delete this[b]
}else{this[b]=a[b]
}}}this.method=this.method.toUpperCase();
this.httpRequest=this.constructor.createRequest();
this.data=new elf.net.URLParameter(this.data);
this.httpRequest.onreadystatechange=function(){d.onreadystatechange()
}
},getHttpRequest:function(){return this.httpRequest
},load:function(){var b=this.httpRequest;
var a=new elf.net.URL(this.url);
var c=this.data;
if(this.noCache){a.setParameter("@",(new Date()).valueOf())
}if(this.method==this.constructor.HTTP_GET){a.setParameter(c.get());
c=null
}else{c=c.toString(this.encoder)
}b.open(this.method,a.toString(),this.async);
c&&b.setRequestHeader("Content-type",this.contentType);
b.send(c)
},abort:function(){var a=this.httpRequest;
if(a.readyState!=this.constructor.STATE_COMPLETE){a.abort()
}}});
elf.util.extend(elf.net.Ajax,{HTTP_GET:"GET",HTTP_POST:"POST",STATE_UNINITIALIZE:0,STATE_LOADING:1,STATE_LOADED:2,STATE_INTERACTIVE:3,STATE_COMPLETE:4,DATA_TYPE_JSON:"json",DATA_TYPE_TEXT:"text",DATA_TYPE_XML:"xml",createRequest:function(){return window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest()
},load:function(a){var b=new this(a);
b.load(a.data);
return b.httpRequest
},get:function(a){a.method=this.HTTP_GET;
return this.load(a)
},post:function(a){a.method=this.HTTP_POST;
return this.load(a)
}});
elf.net.Ajax.option={url:"",method:elf.net.Ajax.HTTP_GET,async:true,noCache:false,contentType:"application/x-www-form-urlencoded",encoding:"utf-8",data:{},responseType:elf.net.Ajax.DATA_TYPE_TEXT,encoder:encodeURIComponent,onSuccess:elf.util.nothing,onFail:elf.util.nothing,onComplete:elf.util.nothing,onJSONError:elf.util.nothing,onreadystatechange:function(){var e=this.constructor;
var d=this.httpRequest;
if(d.readyState==e.STATE_COMPLETE){if(d.status>=200&&d.status<300){if(this.onSuccess){var a=d.responseText;
switch(this.responseType){case e.DATA_TYPE_XML:a=d.responseXML;
break;
case e.DATA_TYPE_JSON:var c=a;
try{c=(new Function("return ("+a+");"))()
}catch(b){this.onJSONError&&this.onJSONError(b,a)
}finally{a=c
}break;
default:break
}this.onSuccess(a)
}}else{this.onFail&&this.onFail(d)
}this.onComplete&&this.onComplete()
}}};
elf.net.AjaxJSONLoader=elf.util.Class.create({_onLoad:function(b){var d=b;
if(this.dataLevel){d=elf.util.namespace(this.dataLevel,b)
}var c="";
var a=this.varName.match(/^((?:\w+\.)*)(\w+)$/);
if(a[1]){c=elf.util.namespace(a[1].slice(0,-1),window,true)
}else{c=window
}c[a[2]]=d;
this.onLoad&&this.onLoad(d)
}},elf.net.Loader);
elf.util.extend(elf.net.AjaxJSONLoader,{load:function(a){var a=a;
elf.util.extend(a,{onSuccess:function(b){a._onLoad.call(a,b)
},responseType:elf.net.Ajax.DATA_TYPE_JSON});
elf.net.Ajax.load(a)
}});
elf.net.HTMLLoader=elf.util.Class.create({_onLoad:function(b){var a=this;
document.getElementById(this.wrapId).innerHTML=b;
this.onLoad&&setTimeout(function(){a.onLoad()
},0)
}},elf.net.Loader);
elf.util.extend(elf.net.HTMLLoader,{load:function(a){a.onSuccess=function(b){a._onLoad.call(a,b)
};
elf.net.Ajax.load(a)
}});
elf.net.StyleLoader=elf.util.Class.create({},elf.net.Loader);
elf.util.extend(elf.net.StyleLoader,{load:function(c){var a=(new elf.net.URL(c.url)).toString();
if(c.noCache){a.setParameter((new Date()).valueOf(),Math.random())
}var b=document.createElement("link");
b.type="text/css";
b.rel="stylesheet";
b.href=a.toString();
document.getElementsByTagName("head")[0].appendChild(b);
b=null;
c.onLoad&&setTimeout(function(){c.onLoad()
},0)
}});
elf.net.ScriptLoader=elf.util.Class.create({},elf.net.Loader);
elf.util.extend(elf.net.ScriptLoader,{load:function(c){var b=new elf.net.URL(c.url);
if(c.noCache){b.setParameter("@",(new Date()).valueOf())
}var a=document.createElement("script");
a.type="text/javascript";
a[elf.util.Browser.IE?"onreadystatechange":"onload"]=function(d){if(elf.util.Browser.IE&&this.readyState=="loaded"||!elf.util.Browser.IE){c.onLoad&&c.onLoad();
this.onreadystatechange=this.onload=null
}};
document.body.appendChild(a);
a.src=b.toString();
a=null
}});
elf.net.LoaderCreator={ASSET_TYPE_HTML_TEXT:"html",ASSET_TYPE_STYLE_SHEET:"css",ASSET_TYPE_JAVASCRIPT:"js",ASSET_TYPE_JSON:"json",loaderMap:{html:elf.net.HTMLLoader,css:elf.net.StyleLoader,js:elf.net.ScriptLoader,json:elf.net.AjaxJSONLoader},create:function(a){return new elf.net.LoaderCreator.loaderMap[a.type](a)
}};
elf.net.LoaderQueue=elf.util.Class.create({initialize:function(a,b){this.queue=a;
this.onLoad=b
},load:function(){this.queue.length&&this.constructor.load(this.queue,this.onLoad)
}},elf.net.Loader);
elf.util.extend(elf.net.LoaderQueue,{onSingleLoad:function(){if(this.next){this.next.load()
}},load:function(b,d){var a=b.length-1;
for(var c=a;
c>0;
c--){if(c){var e=b[c-1];
e.next=b[c];
e.onLoad=this.onSingleLoad
}}b[a].onLoad=d;
b[0].load()
}});
elf.validation={};
elf.validation.RuleExp={};
elf.validation.RuleExp.domain=/^(([a-z0-9]([-a-z0-9]*[a-z0-9])?|)\.)+[a-z]{2,6}$/i;
elf.validation.RuleExp.email=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
elf.validation.RuleExp.number=/[-+]?(?:(\d+(\.\d*)?)|(?:(\d*\.)?\d+))/;
elf.validation.RuleExp.integer=/([-+]?)(\d+)/;
elf.validation.RuleExp.floatNumber=/([-+]?)(\d*)\.(\d+)/;
elf.validation.RuleExp.emailComplex=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
elf.validation.RuleExp.digit=/[0-9]+/;
elf.validation.RuleExp.alphaDigit=/[a-z0-9]+/i;
elf.validation.RuleExp.floatNumberOnly=/^[-+]?[0-9]*\.[0-9]+$/;
elf.validation.RuleExp.alphaDigitOnly=/^[a-z0-9]+$/i;
elf.validation.RuleExp.numberOnly=/^[-+]?((\d+(\.\d*)?)|((\d*\.)?\d+))$/;
elf.validation.RuleExp.digitOnly=/^[0-9]+$/;
elf.validation.RuleExp.integerOnly=/^[-+]?[0-9]+$/;
elf.validation.RuleExp.alpha=/[a-z]+/i;
elf.validation.RuleExp.alphaLowerCase=/[a-z]+/;
elf.validation.RuleExp.alphaOnly=/^[a-z]+$/i;
elf.validation.RuleExp.alphaLowerCaseOnly=/^[a-z]+$/;
elf.validation.RuleExp.alphaUpperCaseOnly=/^[A-Z]+$/;
elf.validation.RuleExp.alphaUpperCase=/[A-Z]+/;
elf.validation.RuleExp.cnIDCard=/^(\d{14}|\d{17})[0-9xX]$/;
elf.validation.RuleExp.cnCellphone=/^1\d{10}$/;
elf.validation.RuleExp.cnTelephone=/^\d{3}\d?(\-?\d+){1,2}$/;
elf.validation.RuleExp.hexRGBColor=/[0-9a-f]{6}/i;
elf.validation.Verifier={};
elf.validation.Verifier.equal=function(c,b){var a=typeof b=="function"?b():b;
return c==b
};
elf.validation.Verifier.notEqual=function(b,a){return b!=a
};
elf.validation.Verifier.testRegExp=function(c,a){var b=elf.util.Type.isString(a)?new RegExp(a):a;
return b.test(c)
};
elf.validation.Verifier.lengthBetween=function(d,c,b){var a=d.length;
return c<=a&&a<=b
};
elf.validation.Verifier.isNumber=function(a){return elf.validation.RuleExp.numberOnly.test(a)
};
elf.validation.Verifier.isNull=function(a){return !a
};
elf.validation.Verifier.isInteger=function(a){return elf.validation.RuleExp.integerOnly.test(a)
};
elf.validation.Verifier.isDate=function(c,d){var b=false;
if(d){b=!!d(c)
}else{var a=c.match(/^(\d{4})-([01])?(\d)-([0123])?(\d)$/);
if(a&&Date.parse([a[1],(a[2]||"0")+a[3],(a[4]||"0")+a[5]].join(elf.util.Browser.IE?"/":"-"))){b=true
}}return b
};
elf.validation.Verifier.isFloatNumber=function(a){return elf.validation.RuleExp.floatNumberOnly.test(a)
};
elf.validation.Verifier.notNull=function(a){return !!a
};
elf.validation.Verifier.isDigit=function(a){return elf.validation.RuleExp.digitOnly.test(a)
};
elf.validation.Verifier.inDateRange=function(d,c){var b=false;
if((d=Date.parse(d))||(Number(d)&&(d=new Date(d)))){var e=Date.parse(c.start)||-Infinity;
if(e instanceof Date){e=new Date(e.getFullYear(),e.getMonth(),e.getDate())
}var a=Date.parse(c.end)||Infinity;
if(a instanceof Date){a=new Date(a.getFullYear(),a.getMonth(),a.getDate()+1)
}if(d>=e&&d<=a){b=true
}}return b
};
elf.validation.Verifier.notLongerThan=function(b,a){return b.length<=a
};
elf.validation.Verifier.isEmail=function(a){return elf.validation.RuleExp.email.test(a)
};
elf.validation.Verifier.inRange=function(d,e){var c=false;
var a=e.match(/^(?:(\[)|\()([^,]*),([^\)\]]*)(?:(\])|\))$/);
if(a){var f=a[2]?Number(a[2]):-Infinity;
isNaN(f)&&(f=-Infinity);
var b=a[3]?Number(a[3]):Infinity;
isNaN(b)&&(b=Infinity);
if((d>f||(a[1]&&d==f))&&(d<b||(a[4]&&d==b))){c=true
}}return c
};
elf.validation.Verifier.isAlphaDigit=function(a){return elf.validation.RuleExp.alphaDigitOnly.test(a)
};
elf.validation.Verifier.containAlphaDigitCase=function(b){var a=elf.validation.Verifier;
return a.containAlphaLowerCase(b)&&a.containAlphaUpperCase(b)&&a.containDigit(b)
};
elf.validation.Verifier.containAlphaLowerCase=function(a){return elf.validation.RuleExp.alphaLowerCase.test(a)
};
elf.validation.Verifier.containAlphaUpperCase=function(a){return elf.validation.RuleExp.alphaUpperCase.test(a)
};
elf.validation.Verifier.containDigit=function(a){return elf.validation.RuleExp.digit.test(a)
};
elf.validation.Verifier.startWith=function(b,d,c){var a=c?b.toLowerCase.indexOf(d.toLowerCase):b.indexOf(d);
return !a
};
elf.validation.Verifier.isHexRGBColor=function(a){return elf.validation.RuleExp.hexRGBColor.test(a)
};
elf.validation.Exit={SUCCESS:1,FAIL:-1,NEXT:0,SHORT_CIRCUIT:{"true":1,"false":-1},TRY_UNTIL_SUCCESS:{"true":1,"false":0},NOT_ALLOW_ERROR:{"true":0,"false":-1},RUN_ALL:{"true":0,"false":0},getResult:function(b,a){switch(b){case this.SUCCESS:return true;
case this.FAIL:return false;
case this.NEXT:return a?a():true
}}};
elf.validation.Rule=function(a){this.initialize(a)
};
elf.validation.Rule.prototype.initilize=function(a){this.rule=a
};
elf.validation.Rule.prototype.validate=function(a){return this.constructor.validate(a,this.rule)
};
elf.validation.Rule.option={exit:elf.validation.Exit.NOT_ALLOW_ERROR};
elf.validation.Rule.validate=function(f,g){var e=elf.util.extend({},this.option,1);
elf.util.extend(e,g);
var h=e.trim?f.trim():f;
var a=e.param;
var b=[h].concat(a?((a instanceof Array)?a:[a]):[]);
for(var d=b.length-1;
d>=0;
d--){var c=b[d];
if(Object.prototype.toString.call(c)=="[object Function]"){b[d]=c()
}}var j=e.method.apply(this,b);
if(e.opposite){j=!j
}return{result:e.exit[j],error:j?"":e.error}
};
elf.validation.RuleGroup=function(a){this.initialize(a)
};
elf.util.extend(elf.validation.RuleGroup.prototype,{initialize:function(a){elf.util.extend(this,a)
},getFieldValue:function(a){return document.getElementsByName(a)[0].value
},validate:function(){var b={value:this.getFieldValue(this.field),rules:this.rules,exit:this.exit};
if(typeof this.ultimate!="undefined"){b.ultimate=this.ultimate
}var a=this.constructor.validate(b);
return a
}});
elf.validation.RuleGroup.option={exit:elf.validation.Exit.NOT_ALLOW_ERROR,ultimate:true};
elf.validation.RuleGroup.validate=function(f){var c=elf.util.extend({},this.option,1);
elf.util.extend(c,f);
var k=c.rules;
var g=c.field;
var j="";
switch(typeof g){case"undefined":j=typeof c.value=="function"?c.value():c.value;
break;
case"function":j=g();
break;
case"string":j=document.getElementsByName(g)[0].value;
break;
case"object":j=g.value;
break;
default:break
}var h={result:0,error:[]};
for(var b=0,d=k.length;
b<d;
b++){var f=k[b];
if(typeof f=="number"&&f){h.result=f;
if(f>0){h.error=[]
}break
}else{var e=elf.validation.Rule.validate(j,f);
e.error&&h.error.push(e.error);
if(e.result){h.result=e.result;
if(e.result>0){h.error=[]
}break
}}}var a=h.result;
h.result=c.exit[a?a>0:c.ultimate];
return h
};
elf.validation.Validator=function(a){this.initialize(a)
};
elf.util.extend(elf.validation.Validator.prototype,{initialize:function(a){elf.util.extend(this,this.constructor.option);
elf.util.extend(this,a)
},validate:function(){return this.constructor.validate(this)
}});
elf.validation.Validator.option={exit:elf.validation.Exit.SHORT_CIRCUIT,ultimate:true};
elf.validation.Validator.validate=function(b){var d=elf.util.extend({},this.option,1);
d=elf.util.extend(d,b);
var h={result:0,error:[]};
var j=d.rules;
for(var c=0,e=j.length;
c<e;
c++){var g=j[c];
if(typeof g=="number"&&g){h.result=g;
if(g>0){h.error=[]
}break
}else{var f=elf.validation.RuleGroup.validate(g);
if(f.error.length){h.error.push({field:g.field,error:f.error})
}if(f.result){h.result=f.result;
if(f.result>0){h.error=[]
}break
}}}var a=h.result;
h.result=d.exit[a?a>0:d.ultimate];
return h
};
elf.transition={};
elf.transition.Easing={};
elf.transition.Easing.cos=function(a){return Math.cos(2*Math.PI*a)
};
elf.transition.Easing.sin=function(a){return Math.sin(2*Math.PI*a)
};
elf.transition.Easing.linear=function(a){return a
};
elf.transition.Easing.quadInAndOut=function(a){var b=elf.transition.Easing;
return a<0.5?b.quadIn(a):b.quadOut(a)
};
elf.transition.Easing.quadIn=function(a){return a*a
};
elf.transition.Easing.quadOut=function(a){return(2-a)*a
};
elf.transition.Tween=function(a){this.initialize(a)
};
elf.util.extend(elf.transition.Tween.prototype,{getPercent:function(){return this.percent||0
},getDirection:function(){return this.direction
},start:function(a){if(!this.running){this.running=true;
this.interval=this.constructor.transform(elf.util.extend({element:this.element,fps:this.fps,property:this.property,duration:this.duration,startOffset:this.startOffset,direction:this.direction,loop:this.loop,ease:this.ease,onStart:this._onStart,onFirstFrame:this._onFirstFrame,onEnterFrame:this._onEnterFrame,onComplete:this._onComplete},a||{}))
}},stop:function(){if(this.running){this.constructor.stop(this.interval)
}this.running=false
},resume:function(a){this.start(elf.util.extend(a||{},{startOffset:this.duration*this.percent}))
},turn:function(a){var b=this.direction==a;
this.direction=a;
if(!b&&this.running){this.stop();
this.start({startOffset:this.duration*(1-this.getPercent())})
}},reverse:function(){this.turn(this.direction*=-1)
},initialize:function(a){var b=this;
this.interval=null;
this.running=false;
this.percent=0;
elf.util.extend(this,this.constructor.option);
elf.util.extend(this,a);
this._onStart=function(){b.onStart&&b.onStart()
},this._onFirstFrame=function(){b.onFirstFrame&&b.onFirstFrame()
},this._onEnterFrame=function(c){b.percent=c;
b.onEnterFrame&&b.onEnterFrame(c)
};
this._onComplete=function(){b.percent=1;
b.running=false;
b.onComplete&&b.onComplete()
}
}});
elf.util.extend(elf.transition.Tween,{DIRECTION_FORWARD:1,DIRECTION_BACKWARD:-1});
elf.util.extend(elf.transition.Tween,{option:{fps:50,speed:1,duration:500,startOffset:0,direction:elf.transition.Tween.DIRECTION_FORWARD,loop:1,ease:function(a){return a
}},running:{},parseFloat:function(b){var a=(b+"").match(/-?\d+(\.\d+)?/);
return parseFloat(a&&a[0]||0)
},transform:function(l){var l=elf.util.extend(elf.util.extend({},this.option),l);
var k=l.element,e=1/l.fps*1000,i=l.duration,n=l.startOffset,q=l.direction,f=l.speed,m=l.loop,r=l.property||{},h=l.ease;
for(var a in r){var b=r[a];
if(typeof b.ease!="function"){b.ease=h
}if(typeof b.unit=="undefined"){b.unit=""
}var j=typeof b.from!="undefined";
if(!j){b.from=this.parseFloat(elf.dom.Style.get(k,a))
}b.distance=b.to-b.from;
if(j){elf.dom.Style.set(k,a,this.step(b,n/i,q))
}}var d=0;
var c=(new Date()).valueOf();
var o=m>=0?m*i:Number.POSITIVE_INFINITY;
var g=setInterval(function(){var t=(new Date()-c+n)*f;
if(!d++&&typeof l.onFirstFrame=="function"){l.onFirstFrame()
}if(t<o){var p=(t%i)/i;
for(var s in r){elf.dom.Style.set(k,s,elf.transition.Tween.step(r[s],p,q))
}if(typeof l.onEnterFrame=="function"){l.onEnterFrame(p)
}}else{elf.transition.Tween.stop(g);
for(var s in r){elf.dom.Style.set(k,s,elf.transition.Tween.step(r[s],m%1||1,q))
}if(typeof l.onComplete=="function"){l.onComplete()
}}},e);
this.running[g]=true;
if(typeof l.onStart=="function"){l.onStart()
}return g
},step:function(c,a,b){return((b>0?c.from:c.to)+c.distance*c.ease(a)*b)+c.unit
},order:function(a,c){var b=a.length-1;
a[b].onComplete=c;
for(b--;
b>=0;
b--){a[b].next=a[b+1];
a[b].onComplete=function(){elf.transition.Tween.transform(this.next)
}
}this.transform(a[0])
},stop:function(a){clearInterval(a);
delete this.running[a]
},stopAll:function(){var a=this.running;
for(var b in a){this.stop(b)
}}});