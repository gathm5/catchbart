"use strict";angular.module("nextBartApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngTouch","ngAnimate","angularMoment","ui.router"]).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){b.otherwise("/"),a.state("dashboard",{url:"/",views:{"HomeView@":{templateUrl:"/views/dashboard.html",controller:"DashboardCtrl"}}}).state("details",{url:"/details/:id",views:{"HomeView@":{templateUrl:"/views/route-details.html",controller:"RouteDetailsCtrl"}}}).state("stations",{url:"/stations/:mode",views:{"HomeView@":{templateUrl:"/views/station-list.html",controller:"StationListCtrl"}}}).state("fare",{url:"/fare",views:{"HomeView@":{templateUrl:"/views/fare-calculator.html",controller:"FareCalculatorCtrl"}}}).state("location",{url:"/locate",views:{"HomeView@":{templateUrl:"/views/find-bart-station.html",controller:"FindBartStationCtrl"}}}).state("menu",{url:"/menu",views:{"HomeView@":{templateUrl:"/views/menu-panel.html",controller:"MenuPanelCtrl"}}}).state("schedules",{url:"/schedules",views:{"HomeView@":{templateUrl:"/views/schedules.html",controller:"SchedulesCtrl"}}}).state("routes",{url:"/routes",views:{"HomeView@":{templateUrl:"/views/route-map.html"}}}),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|javascript):/)}]).run(["$rootScope","$state","$deviceEvents","$station",function(a,b,c,d){a.$state=b,d.stations().then(function(a){d.cachedStations=a}),c.init(),document.body.style.minHeight=document.body.clientHeight+"px"}]),angular.module("nextBartApp").service("$api",function(){var a="ZMLV-UA93-ILNQ-DT35",b={count:function(){return"http://api.bart.gov/api/bsa.aspx?cmd=count&key="+a},routes:function(){return"http://api.bart.gov/api/route.aspx?cmd=routes&key="+a},routeInfo:function(b){return b||(b=6),"http://api.bart.gov/api/route.aspx?cmd=routeinfo&route="+b+"&key="+a},schedule:{arrive:function(b,c){return b||(b="ASHB"),c||(c="CIVC"),"http://api.bart.gov/api/sched.aspx?cmd=arrive&orig="+b+"&dest="+c+"&date=now&key="+a},depart:function(b,c){return b||(b="ASHB"),c||(c="CIVC"),"http://api.bart.gov/api/sched.aspx?cmd=arrive&orig="+b+"&arrive="+c+"&date=now&key="+a}},fare:function(b,c){return b||(b="12th"),c||(c="embr"),"http://api.bart.gov/api/sched.aspx?cmd=fare&orig="+b+"&dest="+c+"&date=today&key="+a},stations:function(){return"http://api.bart.gov/api/stn.aspx?cmd=stns&key="+a},schedules:function(b){return b||(b="12th"),"http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig="+b+"&key="+a},estimate:function(b){return b||(b="RICH"),"http://api.bart.gov/api/etd.aspx?cmd=etd&orig="+b+"&key="+a},planner:function(b,c,d,e){var f="";return b||(b="12th"),c||(c="embr"),d||(d="arrive"),e&&(void 0!==e.before&&(f+="&before="+e.before),e.after&&(f+="&after="+e.after),e.date&&(f+="&date="+e.date),e.time&&(f+="&time="+e.time)),"http://api.bart.gov/api/sched.aspx?cmd="+d+"&orig="+b+"&dest="+c+f+"&key="+a}};return b}),angular.module("nextBartApp").controller("DashboardCtrl",["$scope","$activeSearch","$favorite","$estimate","$trainRoute","$timeout",function(a,b,c,d,e,f){function g(){b.from()&&(l.origin=b.from()),b.to()&&(l.destination=b.to()),l.origin||l.destination||(l.origin=k.origin,l.destination=k.destination),a.travel=l,l.origin&&l.destination&&h()}function h(g){f(function(){var f=moment(a.advanced.date);j.date=f.format("MM/DD/YYYY"),j.time=f.format("h:mm+a"),e.routes().then(function(b){a.routes=b}),d.planner(a.travel.origin.abbr,a.travel.destination.abbr,"depart",j).then(function(c){a.loading=!1,a.travel.results=c.data.root;try{if(b.setRoutes(c.data.root.schedule.request.trip),a.travel.results.schedule.request.trip.length){var d=a.travel.results.schedule.request.trip[0].leg;d.length&&(d=d[0]),a.travel.timer={success:!0,date:d._origTimeDate,time:d._origTimeMin,message:"Missed?",blink:"Arriving"}}}catch(e){a.travel.timer={success:!1,message:"no timer",display:!0},g&&(a.travel.timer.blink=!0,a.travel.timer.message="arriving")}}),c.set({origin:a.travel.origin,destination:a.travel.destination})})}function i(){var c=a.travel.origin;a.travel.origin=a.travel.destination,a.travel.destination=c,a.travel.results=[],b.setFrom(a.travel.origin),b.setTo(a.travel.destination)}var j={before:0,after:4,date:null},k=c.get(),l={origin:null,destination:null,results:[],routes:null};a.loading=!0,g(),a.travel.search=h,a.travel.swap=i,a.advanced={show:!1,date:new Date},a.showAdvancedOptions=function(){a.advanced.show=!a.advanced.show},a.$on("CHECK",function(){h(!0)}),a.$on("Recall",function(){}),a.$on("Next",function(){}),a.$on("Lapsed",function(){})}]),angular.module("nextBartApp").controller("MenuPanelCtrl",["$scope",function(a){a.menus=[{title:"Dashboard",icon:"fa-bus",state:"dashboard"},{title:"Nearest",icon:"fa-map-marker",state:"location"},{title:"Route Map",icon:"fa-map-marker",state:"routes"}]}]),angular.module("nextBartApp").controller("NextScheduleCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").controller("RouteScheduleCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").controller("RouteFavoriteCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").service("$utilities",["$http","$q","$storage",function(a,b,c){function d(a,b,c){var d=Math.PI*a.latitude/180,e=Math.PI*b.latitude/180,f=a.longitude-b.longitude,g=Math.PI*f/180,h=Math.sin(d)*Math.sin(e)+Math.cos(d)*Math.cos(e)*Math.cos(g);return h=Math.acos(h),h=180*h/Math.PI,h=60*h*1.1515,"K"===c&&(h=1.609344*h),"N"===c&&(h=.8684*h),h}function e(d){var e=b.defer();if(d.cache){var h=d.url,i=c.getData(h);if(i)return e.resolve({data:i,status:200}),e.promise}return a.get(d.url,{transformResponse:function(a){return f=g.xml_str2json(a)}}).success(function(a,b){e.resolve({data:a,status:b}),d.cache&&c.storeData(d.url,a)}).error(function(a,b){e.reject({data:a,status:b})}),e.promise}var f,g=new X2JS;return{$ajax:e,$distance:d}}]),angular.module("nextBartApp").service("$storage",[function(){function a(a){if(!a)return null;if("string"==typeof a)try{a=JSON.parse(a)}catch(b){}return a}function b(a){if(!a)return null;if("string"==typeof a)return a;try{a=JSON.stringify(a)}catch(b){}return a}function c(a,b,c){var e;return(e=d[b].getItem(a))?(f.storeData(a,e,c),f.removeData(a,b),!0):!1}var d,e,f;f=this,d={0:window.sessionStorage,1:window.localStorage},f.SESSION=0,f.PERSISTENT=1,f.storeData=function(a,c,g){e=f.SESSION,g===f.PERSISTENT&&(e=g),d[e].setItem(a,b(c))},f.getData=function(b,c){var g;return e=f.SESSION,c&&(e=c),(g=d[e].getItem(b))?a(g):(e=f.PERSISTENT,g=d[e].getItem(b),a(g))},f.removeData=function(a,b){return e=f.SESSION,b&&(e=b),d[e].removeItem(a),!0},f.removeAll=function(){function a(a){for(var b in d[a])d[a].removeItem(d[a].key(b))}a(f.SESSION),a(f.PERSISTENT)},f.makePersistent=function(a){return c(a,f.SESSION,f.PERSISTENT)},f.makeTemporary=function(a){return c(a,f.PERSISTENT,f.SESSION)}}]),angular.module("nextBartApp").service("$trainInfo",["$api","$utilities",function(a,b){return{count:function(){return b.$ajax({url:a.count()})}}}]),angular.module("nextBartApp").service("$trainRoute",["$api","$utilities",function(a,b){return{routes:function(){return b.$ajax({url:a.routes(),cache:!0})},routeInfo:function(c){return b.$ajax({url:a.routeInfo(c)})}}}]),angular.module("nextBartApp").service("$trainSchedule",["$api","$utilities",function(a,b){return{arrive:function(c,d){return b.$ajax({url:a.schedule.arrive(c,d)})},depart:function(c,d){return b.$ajax({url:a.schedule.depart(c,d)})}}}]),angular.module("nextBartApp").service("$station",["$api","$utilities",function(a,b){var c;return{stations:function(){return b.$ajax({url:a.stations(),cache:!0})},schedules:function(){return b.$ajax({url:a.schedules()})},cachedStations:c}}]),angular.module("nextBartApp").service("$fare",["$api","$utilities",function(a,b){return{fares:function(c,d){return b.$ajax({url:a.fare(c,d)})}}}]),angular.module("nextBartApp").controller("StationListCtrl",["$scope","$station","$activeSearch","$trainRoute","$storage","$geocode","$calculator","$state","$stateParams","$rootScope",function(a,b,c,d,e,f,g,h,i,j){function k(){var b={position:l,stations:a.stations.list};g.$nearest(b),a.stations.list=b.stations,a.loading=!1}var l,m=i.mode;a.stations={list:e.getData("station-list",e.PERSISTENT)},a.stations.list||b.stations().then(function(b){a.stations.list=b.data.root.stations.station,e.storeData("station-list",b.data.root.stations.station,e.PERSISTENT)}),a.stations.select=function(a){"origin"===m?c.setFrom(a):"destination"===m&&c.setTo(a),h.go("dashboard")},a.locateStation=function(){j.$broadcast("$alert",{message:"sorting stations by your location..",showTime:5e3}),f.geocode(a,{timeout:1e4}).then(function(a){l=a.coords,k()},function(b){a.loading=!1,a.reason=b,j.$broadcast("$alert",{message:b,showTime:3e3})})},d.routes()}]),angular.module("nextBartApp").service("$favorite",["$storage","$station",function(a){function b(b){a.storeData("favorites",b,a.PERSISTENT)}function c(){return d||(d={}),d}var d=a.getData("favorites",a.PERSISTENT);return{get:c,set:b}}]),angular.module("nextBartApp").service("ActiveRouteService",[function(){}]),angular.module("nextBartApp").controller("FareCalculatorCtrl",["$scope","$favoriteService","$fare",function(a,b,c){var d=b.favorite();c.fares(d.origin,d.destination).then(function(b){a.fare=b.data.root.trip.fare})}]),angular.module("nextBartApp").service("$geocode",["$q",function(a){return{geocode:function(b,c){var d=a.defer(),e={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};return c&&c.timeout&&(e.timeout=c.timeout),navigator&&navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){b.$apply(function(){d.resolve(a)})},function(a){switch(a.code){case 1:b.$apply(function(){d.reject("You have rejected access to your location!")});break;case 2:b.$apply(function(){d.reject("Unable to determine your location. Please try again!")});break;case 3:b.$apply(function(){d.reject("Unable to determine your location. Please make sure your GPS is enabled!")})}},e):b.$apply(function(){d.reject("Browser does not support location services")}),d.promise}}}]),angular.module("nextBartApp").controller("FindBartStationCtrl",["$scope","$geocode","$station","$calculator","$window",function(a,b,c,d,e){function f(a){c.stations().then(function(b){i=b.data.root.stations.station,a()})}function g(){var b={position:j,stations:i};d.$nearest(b),a.bart=b,a.loading=!1}function h(a){e.open("https://www.google.com/maps/place/"+a.name+"+bart+station","_system")}var i,j;a.loading=!0,a.openInMaps=h,b.geocode(a).then(function(a){j=a.coords,f(g)},function(b){a.loading=!1,a.reason=b})}]),angular.module("nextBartApp").factory("$calculator",["$utilities",function(a){function b(){var b,c;for(var g in f)b=d,c={latitude:f[g].gtfs_latitude,longitude:f[g].gtfs_longitude},e=a.$distance(b,c),f[g].distance=e;return f.sort(function(a,b){return a.distance-b.distance}),f}function c(a){return f=a.stations,d=a.position,b()}var d,e,f=[];return{$nearest:c}}]),angular.module("nextBartApp").directive("timeLapse",["$timeout","$interval",function(a,b){return{templateUrl:"/views/directives/time-lapse.html",restrict:"E",scope:{timer:"="},link:function(a){function c(){var c=new Date(e.date+" "+e.time),f=new Date,g=c-f,h=moment.duration(g,"ms"),i=1e3;d=b(function(){h=moment.duration(h-i,"ms");h.milliseconds();return 30===h.seconds()?a.$emit("CHECK"):h.seconds()<30&&(a.message=e.blink,a.blink=!0),h.milliseconds()<0?(a.message=e.message,void b.cancel(d)):void(a.time={hours:h.hours(),minutes:h.minutes(),seconds:("00"+h.seconds()).slice(-2)})},i)}var d,e=a.timer;return e.success?(a.$on("$destroy",function(){b.cancel(d)}),void a.$watch("timer",function(f){f&&(a.blink=!1,e=f,a.message=null,b.cancel(d),c())})):(e.display&&(a.message=e.message),void a.$emit("Next"))}}}]),angular.module("nextBartApp").service("$estimate",["$api","$utilities",function(a,b){return{estimate:function(c){return b.$ajax({url:a.estimate(c)})},planner:function(c,d,e,f){return b.$ajax({url:a.planner(c,d,e,f)})}}}]),angular.module("nextBartApp").service("$activeSearch",[function(){var a,b=null,c=null;return{from:function(){return b},to:function(){return c},setFrom:function(a){b=a},setTo:function(a){c=a},getRoutes:function(){return a},getRoute:function(b){return a[b]},setRoutes:function(b){a=b}}}]),angular.module("nextBartApp").directive("watchClock",["$interval",function(a){return{templateUrl:"/views/directives/clock.html",restrict:"E",link:function(b){function c(a){var b=a.getHours(),c=a.getMinutes(),d=b>=12?"pm":"am";return b%=12,b=b?b:12,c="00"+c,c=c.slice(-2),{hours:b,minutes:c,mode:d}}function d(){e=new Date,g=c(e),b.time={hours:g.hours,minutes:g.minutes,mode:g.mode,seconds:e.getSeconds()}}var e,f,g;b.time={},d(),f=a(d,1e3),b.$on("$destroy",function(){a.cancel(f)})}}}]),angular.module("nextBartApp").directive("baDepartInfo",function(){return{templateUrl:"/views/directives/ba-depart-info.html",restrict:"E",replace:!0,scope:{trip:"="},link:function(){}}}),angular.module("nextBartApp").filter("distance",function(){return function(a){return a.toFixed(2)+" miles"}}),angular.module("nextBartApp").controller("RouteDetailsCtrl",["$scope","$state","$stateParams","$activeSearch","$trainRoute",function(a,b,c,d,e){function f(){e.routes().then(function(a){i.routes=a.data.root.routes.route})}var g=c.id,h=d.getRoute(g),i={};a.trip=h,a.getColor=function(a){for(var b in i.routes)if(i.routes[b].routeID===a._line)return{color:i.routes[b].color};return{display:"none"}},f()}]),angular.module("nextBartApp").directive("backButton",function(){return{templateUrl:"/views/directives/back-button.html",restrict:"E",link:function(a,b,c){a.back=function(){a.$eval(c.go)}}}}),angular.module("nextBartApp").controller("SchedulesCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("nextBartApp").filter("travelTimeFilter",function(){return function(a){if(a){var b=moment(a._origTimeDate+" "+a._origTimeMin),c=moment(a._destTimeDate+" "+a._destTimeMin),d=c.diff(b),e=moment.duration(d);return{hours:Math.floor(e.asHours()),minutes:moment.utc(d).format(":mm:ss")}}}}),angular.module("nextBartApp").directive("webIntent",["$timeout",function(a){return{templateUrl:"/views/directives/web-intent.html",restrict:"E",replace:!0,controller:["$scope",function(b){var c;b.$on("$alert",function(d,e){var f=1e4;e.showTime&&(f=e.showTime),b.message=e.message,a.cancel(c),c=a(function(){b.message=null},f)})}]}}]),angular.module("nextBartApp").service("$deviceEvents",["$rootScope","$state","$timeout",function(a,b,c){function d(){var d=0,e=3e3;document.addEventListener("menubutton",function(a){a.preventDefault(),b.go("menu")},!1),document.addEventListener("backbutton",function(f){switch(f.preventDefault(),b.current.name){case"details":case"stations":case"fare":case"location":case"schedules":case"menu":return void b.go("dashboard")}1===d&&navigator.app.exitApp(),a.$broadcast("$alert",{message:"Press back again to exit!",showTime:e}),d+=1,c(function(){d=0},e)},!1)}this.init=function(){document.addEventListener("deviceready",function(){d()})}}]),angular.module("nextBartApp").directive("appLoadCloak",function(){return{restrict:"A",link:function(a,b){a.$evalAsync(function(){b.removeAttr("data-app-load-cloak")})}}}),angular.module("nextBartApp").directive("viewPortControl",["$document",function(a){return{restrict:"E",link:function(b){var c=a.getElementById("viewport");c.setAttribute("content","width=device-width,, height=device-height, initial-scale=1, maximum-scale=1"),b.$on("$destroy",function(){c.setAttribute("content","width=device-width, height=device-height, maximum-scale=1")})}}}]),angular.module("nextBartApp").directive("travelTimeDisplay",function(){return{templateUrl:"/views/directives/travel-time-display.html",restrict:"E",replace:!0,scope:{trip:"="},link:function(a){var b=a.trip;if(b){var c=moment(b._origTimeDate+" "+b._origTimeMin),d=moment(b._destTimeDate+" "+b._destTimeMin),e=d.diff(c),f=moment.duration(e);a.hours=Math.floor(f.asHours())%25,a.mins=moment.utc(e).format("mm")}}}}),angular.module("nextBartApp").directive("colorRoutes",["$trainRoute",function(a){return{templateUrl:"/views/directives/color-routes.html",restrict:"E",replace:!0,link:function(b){function c(a){e=a.data.root.routes.route,d()}function d(){for(var a={},c=0;c<e.length;c+=1)a[e[c].color]={trip:e[c].name,color:e[c].color};b.codes=a}var e;a.routes().then(function(a){c(a)})}}}]),angular.module("nextBartApp").filter("stationName",["$station",function(a){return function(b){for(var c=a.cachedStations.data.root.stations.station,d=0;d<c.length;d+=1)if(c[d].abbr===b)return c[d].name;return b}}]);