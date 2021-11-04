function sendRoomEvent(roomEvent) {
  console.log(roomEvent);
  var hitnpadIp = "";

  // wrongAnswerImg.visible = true;

  var data = JSON.stringify( {"data":{"content": roomEvent, "origin":"MyEscapeRoomDevice"}} );
  var xhr  = new XMLHttpRequest();

  xhr.open("POST", 'http://'+hitnpadIp+':4010/api/external-logs', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
}

function restartGame(){
  window.location.reload();
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}
