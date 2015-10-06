window.onload=getMyLocation;
function getMyLocation(){
  if(navigator.geolocation){                //判断浏览器是否支持地理定位API
    navigator.geolocation.getCurrentPosition(displayLocation,displayError); //getCurrentPosition() 方法获得用户的位置
  }else{
    alert("Oops,no geolocation support");
  }
}
function displayLocation(position){
  var latitude=position.coords.latitude;  //从positon.coords对象得到纬度
  var longitude=position.coords.longitude;  //从positon.coords对象得到经度
  var loc=document.getElementById('location');
  loc.innerHTML='you are at latitude:'+latitude+',longitude:'+longitude;
  var ourCoords={latitude:47.624851,longitude:-122.52099};
  var km=computeDistance(position.coords,ourCoords);
  var dis=document.getElementById('distance');
  dis.innerHTML='You are '+km+' km from the WickedlySmart HQ';
  showMap(position.coords);
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
var map;
function showMap(coords){
  var googleLatAndLong=new google.maps.LatLng(coords.latitude,coords.longitude);
  var mapOptions={
    zoom:10,
    center:googleLatAndLong,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var theMap=document.getElementById('map');
  map=new google.maps.Map(theMap,mapOptions);
}
