/* myLoc.js */

var options={enableHighAccuravy:true,timeout:3000,maximumAge:60000};    //精确定位
var watchId=null;
var map=null;
window.onload=getMyLocation;
function getMyLocation(){   //获取d地理位置
  if(navigator.geolocation){  //判断浏览器是否支持地理定位API
    navigator.geolocation.getCurrentPosition(displayLocation,displayError,options); //getCurrentPosition() 方法获得用户的位置
    var watchButton=document.getElementById('watch');
    watchButton.onclick=watchLocation;    //点击触发跟踪定位
    var clearWatchButton=document.getElementById('clearWatch');
    clearWatchButton.onclick=clearWatch;    //点击取消跟踪定位
  }else{
    alert("Oops,no geolocation support");
  }
}
function watchLocation(){   //跟踪获取
  watchId=navigator.geolocation.watchPosition(displayLocation,displayError);
}
function clearWatch(){    //取消跟踪
  if(watchId){
    navigator.geolocation.clearWatch(watchId);
    watchId=null;
  }
}
function displayLocation(position){
  var latitude=position.coords.latitude;  //从positon.coords对象得到纬度
  var longitude=position.coords.longitude;  //从positon.coords对象得到经度
  var loc=document.getElementById('location');
  loc.innerHTML='you are at latitude:'+latitude+',longitude:'+longitude;
  loc.innerHTML+='(with'+position.coords.accuracy+'meters accuracy)'
  var ourCoords={latitude:47.624851,longitude:-122.52099};
  var km=computeDistance(position.coords,ourCoords);    //计算两者距离
  var dis=document.getElementById('distance');
  dis.innerHTML='You are '+km+' km from the WickedlySmart HQ';
  if(map==null){    // 若map为无，运行加载地图，若已有，无需加载
    showMap(position.coords);
  }else {
    scrollMapToPosition(position.coords);   //获取非首次新定位后，地图在此居中，并放置一个标记
  }
}
function displayError(error){   //当无法定位时，问题处理程序
  var errorTypes={
    0:'Unknown error',
    1:'Permission denied by user',
    2:'Position is not available',
    3:'Request timed out'
  };
  var errorMessage= errorTypes[error.code];
  if(error.code==0||error.code==2){
    errorMessage=errorMessage+' '+error.Message;    //对于0/2，有时error.message会有一些额外信息，所以把这些信息增加到errorMessage中
  }
  var loc=document.getElementById('location');
  loc.innerHTML=errorMessage;
}
function computeDistance(startCoords,destCoords){   //计算两地距离
  var startLatRads=degreesToRadians(startCoords.latitude);
  var startLongRads=degreesToRadians(startCoords.longitude);
  var destLatRads=degreesToRadians(destCoords.latitude);
  var destLongRads=degreesToRadians(destCoords.longitude);
  var Radius=6371;
  var distance=Math.acos(Math.sin(startLatRads)*Math.sin(destLatRads)+
                         Math.cos(startLatRads)*Math.cos(destLatRads)*
                         Math.cos(startLongRads-destLongRads))*Radius;
  return distance;
}
function degreesToRadians(degrees){
  var radians=(degrees*Math.PI)/180;
  return radians;
}
function showMap(coords){   //加载地图
  var googleLatAndLong=new google.maps.LatLng(coords.latitude,coords.longitude);
  var mapOptions={
    zoom:10,
    center:googleLatAndLong,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var theMap=document.getElementById('map');
  map=new google.maps.Map(theMap,mapOptions);
  var title='Your location';
  var content='<h1>You are here</h1>';
  addMarker(map,googleLatAndLong,title,content);
}
function addMarker(map,latlong,title,content){    //添加标记
  var markerOptions={
    position:latlong,
    map:map,
    title:title,
    clickable:true
  };
  var marker=new google.maps.Marker(markerOptions);
  var infoWindowOptions={
    content:content,
    position:latlong
  };
  var infoWindow=new google.maps.InfoWindow(infoWindowOptions);
  google.maps.event.addListener(marker,'click',function(){
    infoWindow.open(map);
  });
}
function scrollMapToPosition(coords){
  var latitude=coords.latitude;
  var longitude=coords.longitude;
  var latlong=new google.maps.LatLng(latitude,longitude);
  map.panTo(latlong);
  addMarker(map,latlong,'Your new location','You moved to here')
}
