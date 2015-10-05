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
