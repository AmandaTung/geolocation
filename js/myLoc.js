window.onload=getMyLocation;
function getMyLocation(){
  if(navigator.geolocation){                //判断浏览器是否支持地理定位API
    navigator.geolocation.getCurrentPosition(displayLocation,displayError); //getCurrentPosition() 方法获得用户的位置
    var watchButton=document.getElementById('watch');
    watchButton.onclick=watchLocation;
    var clearWatchButton=document.getElementById('clearWatch');
    clearWatchButton.onclick=clearWatch;
  }else{
    alert("Oops,no geolocation support");
  }
}
var watchId=null;
function watchLocation(){
  watchId=navigator.geolocation.watchPosition(displayLocation,displayError);
}
function clearWatch(){
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
  var km=computeDistance(position.coords,ourCoords);
  var dis=document.getElementById('distance');
  dis.innerHTML='You are '+km+' km from the WickedlySmart HQ';
  if(map==null){
    showMap(position.coords);
  }
}
function displayError(error){
  var errorTypes={
    0:'Unknown error',
    1:'Permission denied by user',
    2:'Position is not available',
    3:'Request timed out'
  };
  var errorMessage= errorTypes[error.code];
  if(error.code==0||error.code==2){
    errorMessage=errorMessage+' '+errorMessage;
  }
  var loc=document.getElementById('location');
  loc.innerHTML=errorMessage;
}
function computeDistance(startCoords,destCoords){
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
var map=null;
function showMap(coords){
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
function addMarker(map,latlong,title,content){
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
