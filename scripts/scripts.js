"use strict";angular.module("nextBartApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngTouch","ngAnimate","ui.router"]).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){b.otherwise("/"),a.state("dashboard",{url:"/",views:{"HomeView@":{templateUrl:"/views/dashboard.html",controller:"DashboardCtrl"}}}).state("details",{url:"/details/:id",views:{"HomeView@":{templateUrl:"/views/route-details.html",controller:"RouteDetailsCtrl"}}}).state("stations",{url:"/stations/:mode",views:{"HomeView@":{templateUrl:"/views/station-list.html",controller:"StationListCtrl"}}}).state("fare",{url:"/fare",views:{"HomeView@":{templateUrl:"/views/fare-calculator.html",controller:"FareCalculatorCtrl"}}}).state("location",{url:"/locate",views:{"HomeView@":{templateUrl:"/views/find-bart-station.html",controller:"FindBartStationCtrl"}}}).state("menu",{url:"/menu",views:{"HomeView@":{templateUrl:"/views/menu-panel.html",controller:"MenuPanelCtrl"}}}).state("schedules",{url:"/schedules",views:{"HomeView@":{templateUrl:"/views/schedules.html",controller:"SchedulesCtrl"}}}).state("routes",{url:"/routes",views:{"HomeView@":{templateUrl:"/views/route-map.html",controller:"RouteMapCtrl"}}}),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|javascript):/)}]).run(["$rootScope","$state",function(a,b){a.$state=b,a.back=function(){},document.addEventListener("menubutton",function(a){a.preventDefault(),b.go("menu")},!1),document.body.style.minHeight=document.body.clientHeight+"px"}]),angular.module("nextBartApp").service("$api",function(){var a="ZMLV-UA93-ILNQ-DT35",b={count:function(){return"http://api.bart.gov/api/bsa.aspx?cmd=count&key="+a},routes:function(){return"http://api.bart.gov/api/route.aspx?cmd=routes&key="+a},routeInfo:function(b){return b||(b=6),"http://api.bart.gov/api/route.aspx?cmd=routeinfo&route="+b+"&key="+a},schedule:{arrive:function(b,c){return b||(b="ASHB"),c||(c="CIVC"),"http://api.bart.gov/api/sched.aspx?cmd=arrive&orig="+b+"&dest="+c+"&date=now&key="+a},depart:function(b,c){return b||(b="ASHB"),c||(c="CIVC"),"http://api.bart.gov/api/sched.aspx?cmd=arrive&orig="+b+"&arrive="+c+"&date=now&key="+a}},fare:function(b,c){return b||(b="12th"),c||(c="embr"),"http://api.bart.gov/api/sched.aspx?cmd=fare&orig="+b+"&dest="+c+"&date=today&key="+a},stations:function(){return"http://api.bart.gov/api/stn.aspx?cmd=stns&key="+a},schedules:function(b){return b||(b="12th"),"http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig="+b+"&key="+a},estimate:function(b){return b||(b="RICH"),"http://api.bart.gov/api/etd.aspx?cmd=etd&orig="+b+"&key="+a},planner:function(b,c,d,e){var f="";return b||(b="12th"),c||(c="embr"),d||(d="arrive"),e&&(void 0!==e.before&&(f+="&before="+e.before),e.after&&(f+="&after="+e.after)),"http://api.bart.gov/api/sched.aspx?cmd="+d+"&orig="+b+"&dest="+c+f+"&key="+a}};return b}),angular.module("nextBartApp").controller("DashboardCtrl",["$scope","$activeSearch","$favorite","$estimate","$timeout",function(a,b,c,d,e){function f(){b.from()&&(k.origin=b.from()),b.to()&&(k.destination=b.to()),k.origin||k.destination||(k.origin=j.origin,k.destination=j.destination),a.travel=k,k.origin&&k.destination&&g()}function g(){e(function(){d.planner(a.travel.origin.abbr,a.travel.destination.abbr,"depart",i).then(function(c){a.loading=!1,a.travel.results=c.data.root;try{if(b.setRoutes(c.data.root.schedule.request.trip),a.travel.results.schedule.request.trip.length){var d=a.travel.results.schedule.request.trip[0].leg;d.length&&(d=d[0]);var e=new Date(d._origTimeDate+" "+d._origTimeMin),f=new Date,g=Math.round((e-f)/1e3),h=g/60;a.travel.timer=h>0?Math.round(h):"Missed? Search again!"}}catch(i){a.travel.timer="Scheduler not loaded"}}),c.set({origin:a.travel.origin,destination:a.travel.destination})})}function h(){var c=a.travel.origin;a.travel.origin=a.travel.destination,a.travel.destination=c,a.travel.results=[],b.setFrom(a.travel.origin),b.setTo(a.travel.destination)}var i={before:0,after:4},j=c.get(),k={origin:null,destination:null,results:[]};a.loading=!0,f(),a.travel.search=g,a.travel.swap=h,a.$on("Recall",function(){}),a.$on("Next",function(){}),a.$on("Lapsed",function(){})}]),angular.module("nextBartApp").controller("MenuPanelCtrl",["$scope",function(a){a.menus=[{title:"Dashboard",icon:"fa-bus",state:"dashboard"},{title:"Nearest",icon:"fa-map-marker",state:"location"},{title:"Schedules",icon:"fa-map-marker",state:"schedules"},{title:"Route Map",icon:"fa-map-marker",state:"routes"}]}]),angular.module("nextBartApp").controller("NextScheduleCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").controller("RouteScheduleCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").controller("RouteFavoriteCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").service("$utilities",["$http","$q","$storage",function(a,b,c){function d(a,b,c){var d=Math.PI*a.latitude/180,e=Math.PI*b.latitude/180,f=a.longitude-b.longitude,g=Math.PI*f/180,h=Math.sin(d)*Math.sin(e)+Math.cos(d)*Math.cos(e)*Math.cos(g);return h=Math.acos(h),h=180*h/Math.PI,h=60*h*1.1515,"K"===c&&(h=1.609344*h),"N"===c&&(h=.8684*h),h}function e(d){var e=b.defer();if(d.cache){var h=d.url,i=c.getData(h);if(i)return e.resolve({data:i,status:200}),e.promise}return a.get(d.url,{transformResponse:function(a){return f=g.xml_str2json(a)}}).success(function(a,b){e.resolve({data:a,status:b}),d.cache&&c.storeData(d.url,a)}).error(function(a,b){e.reject({data:a,status:b})}),e.promise}var f,g=new X2JS;return{$ajax:e,$distance:d}}]),angular.module("nextBartApp").service("$storage",[function(){function a(a){if(!a)return null;if("string"==typeof a)try{a=JSON.parse(a)}catch(b){}return a}function b(a){if(!a)return null;if("string"==typeof a)return a;try{a=JSON.stringify(a)}catch(b){}return a}function c(a,b,c){var e;return(e=d[b].getItem(a))?(f.storeData(a,e,c),f.removeData(a,b),!0):!1}var d,e,f;f=this,d={0:window.sessionStorage,1:window.localStorage},f.SESSION=0,f.PERSISTENT=1,f.storeData=function(a,c,g){e=f.SESSION,g===f.PERSISTENT&&(e=g),d[e].setItem(a,b(c))},f.getData=function(b,c){var g;return e=f.SESSION,c&&(e=c),(g=d[e].getItem(b))?a(g):(e=f.PERSISTENT,g=d[e].getItem(b),a(g))},f.removeData=function(a,b){return e=f.SESSION,b&&(e=b),d[e].removeItem(a),!0},f.removeAll=function(){function a(a){for(var b in d[a])d[a].removeItem(d[a].key(b))}a(f.SESSION),a(f.PERSISTENT)},f.makePersistent=function(a){return c(a,f.SESSION,f.PERSISTENT)},f.makeTemporary=function(a){return c(a,f.PERSISTENT,f.SESSION)}}]),angular.module("nextBartApp").service("$trainInfo",["$api","$utilities",function(a,b){return{count:function(){return b.$ajax({url:a.count()})}}}]),angular.module("nextBartApp").service("$trainRoute",["$api","$utilities",function(a,b){return{routes:function(){return b.$ajax({url:a.routes()})},routeInfo:function(c){return b.$ajax({url:a.routeInfo(c)})}}}]),angular.module("nextBartApp").service("$trainSchedule",["$api","$utilities",function(a,b){return{arrive:function(c,d){return b.$ajax({url:a.schedule.arrive(c,d)})},depart:function(c,d){return b.$ajax({url:a.schedule.depart(c,d)})}}}]),angular.module("nextBartApp").service("$station",["$api","$utilities",function(a,b){return{stations:function(){return b.$ajax({url:a.stations(),cache:!0})},schedules:function(){return b.$ajax({url:a.schedules()})}}}]),angular.module("nextBartApp").service("$fare",["$api","$utilities",function(a,b){return{fares:function(c,d){return b.$ajax({url:a.fare(c,d)})}}}]),angular.module("nextBartApp").controller("StationListCtrl",["$scope","$station","$activeSearch","$storage","$state","$stateParams",function(a,b,c,d,e,f){var g=f.mode;a.stations={list:d.getData("station-list",d.PERSISTENT)},a.stations.list||b.stations().then(function(b){a.stations.list=b.data.root.stations.station,d.storeData("station-list",b.data.root.stations.station,d.PERSISTENT)}),a.stations.select=function(a){"origin"===g?c.setFrom(a):"destination"===g&&c.setTo(a),e.go("dashboard")}}]),angular.module("nextBartApp").service("$favorite",["$storage","$station",function(a){function b(b){a.storeData("favorites",b,a.PERSISTENT)}function c(){return d||(d={}),d}var d=a.getData("favorites",a.PERSISTENT);return{get:c,set:b}}]),angular.module("nextBartApp").service("ActiveRouteService",[function(){}]),angular.module("nextBartApp").controller("FareCalculatorCtrl",["$scope","$favoriteService","$fare",function(a,b,c){var d=b.favorite();c.fares(d.origin,d.destination).then(function(b){a.fare=b.data.root.trip.fare})}]),angular.module("nextBartApp").service("$geocode",["$q",function(a){return{geocode:function(b){var c=a.defer();return navigator&&navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){b.$apply(function(){c.resolve(a)})},function(a){switch(a.code){case 1:b.$apply(function(){c.reject("You have rejected access to your location")});break;case 2:b.$apply(function(){c.reject("Unable to determine your location")});break;case 3:b.$apply(function(){c.reject("Service timeout has been reached")})}}):b.$apply(function(){c.reject("Browser does not support location services")}),c.promise}}}]),angular.module("nextBartApp").controller("FindBartStationCtrl",["$scope","$geocode","$station","$calculator",function(a,b,c,d){function e(a){c.stations().then(function(b){g=b.data.root.stations.station,a()})}function f(){var b={position:h,stations:g};d.$nearest(b),a.bart=b,a.loading=!1}var g,h;a.loading=!0,b.geocode(a).then(function(a){h=a.coords,e(f)},function(b){a.loading=!1,a.reason=b})}]),angular.module("nextBartApp").factory("$calculator",["$utilities",function(a){function b(){var b,c;for(var g in f)b=d,c={latitude:f[g].gtfs_latitude,longitude:f[g].gtfs_longitude},e=a.$distance(b,c),f[g].distance=e;return f.sort(function(a,b){return a.distance-b.distance}),f}function c(a){return f=a.stations,d=a.position,b()}var d,e,f=[];return{$nearest:c}}]),angular.module("nextBartApp").directive("timeLapse",["$interval",function(a){return{templateUrl:"/views/directives/time-lapse.html",restrict:"E",scope:{timer:"@"},link:function(b,c,d){function e(a){var c=0,d=0;60>a?d=a:(c=parseInt(a/60),d=a%60),d="00"+d,b.show={min:c,sec:d.slice(-2)}}function f(){function c(){return 520===h&&b.$emit("Recall"),0>=h?(a.cancel(g),void b.$emit("Lapsed")):(h-=1,b.time=h,void e(h))}return k.test(j)?(i=60*parseInt(j),h=i,e(h),void(g=a(c,1e3))):(b.$emit("Next"),void(b.passed=j))}var g,h,i,j=b.timer,k=/^\d+$/;f(),d.$observe("timer",function(b){j=b,a.cancel(g),f()})}}}]),angular.module("nextBartApp").service("$estimate",["$api","$utilities",function(a,b){return{estimate:function(c){return b.$ajax({url:a.estimate(c)})},planner:function(c,d,e,f){return b.$ajax({url:a.planner(c,d,e,f)})}}}]),angular.module("nextBartApp").service("$activeSearch",[function(){var a,b=null,c=null;return{from:function(){return b},to:function(){return c},setFrom:function(a){b=a},setTo:function(a){c=a},getRoutes:function(){return a},getRoute:function(b){return a[b]},setRoutes:function(b){a=b}}}]),angular.module("nextBartApp").directive("watchClock",["$interval",function(a){return{templateUrl:"/views/directives/clock.html",restrict:"E",link:function(b){function c(a){var b=a.getHours(),c=a.getMinutes(),d=b>=12?"pm":"am";return b%=12,b=b?b:12,c="00"+c,c=c.slice(-2),{hours:b,minutes:c,mode:d}}function d(){e=new Date,g=c(e),b.time={hours:g.hours,minutes:g.minutes,mode:g.mode,seconds:e.getSeconds()}}var e,f,g;b.time={},d(),f=a(d,1e3),b.$on("$destroy",function(){a.cancel(f)})}}}]),angular.module("nextBartApp").directive("baDepartInfo",function(){return{templateUrl:"/views/directives/ba-depart-info.html",restrict:"E",replace:!0,scope:{trip:"="},link:function(){}}}),angular.module("nextBartApp").filter("distance",function(){return function(a){return a.toFixed(2)+" miles"}}),angular.module("nextBartApp").controller("RouteDetailsCtrl",["$scope","$state","$stateParams","$activeSearch",function(a,b,c,d){var e=c.id,f=d.getRoute(e);a.trip=f,console.log(f)}]),angular.module("nextBartApp").directive("backButton",function(){return{templateUrl:"/views/directives/back-button.html",restrict:"E",link:function(a,b,c){a.back=function(){a.$eval(c.go)}}}}),angular.module("nextBartApp").controller("SchedulesCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);