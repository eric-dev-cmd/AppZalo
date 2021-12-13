let iceList;
function videoCall(id) {
  $(`#video-${id}`)
    .off('click')
    .on('click', function () {
      let callerName = $('#userName').val();
      let dataToEmit = {
        listenerId: id,
        callerName: callerName,
      };
      socket.emit('caller-check-listener-online', dataToEmit);
    });
  $.ajax({
    url: "https://global.xirsys.net/_turn/appChat",
    type: "PUT",
    dataType: 'json',
    headers: {
      "Authorization": "Basic " + "Y2F0bHV5bmg6MzJlNjgyYzYtNGI3My0xMWVjLWI5NDUtMDI0MmFjMTMwMDAz",
    },
    success: function (data, status) {
      iceList = data.v;
    },
    async: false,
  });
}

let peerId;
const peer = new Peer({
  key: 'peerjs',
  host: 'ec2-13-251-157-126.ap-southeast-1.compute.amazonaws.com',
  port: 9000,
  path: '/myapp',
  config: iceList
});

var MediaStream;
$(document).ready(function () {
  //02
  socket.on('server-send-listener-is-offline', function () {
    Swal.fire({
      title: $('#name-conversation').text() + ` đang offline`,
      timer: 1000,
      allowOutsideClick: false,
      willOpen: (ele) => {
        $(ele).find('button.swal2-confirm.swal2-styled').hide();
        $('#btn-cancel-call')
          .off('click')
          .on('click', function () {
            Swal.close();
          });
      },
    }).then((result) => {
      return false;
    });
  });

  peer.on('open', function (id) {
    peerId = id;
  });
  //03
  socket.on('server-request-peerId-to-listener', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: $('#userName').val(),
      listenerPeerId: peerId,
    };
    //04
    socket.emit('listener-emit-peerId-to-server', dataToEmit);
  });
  //05
  socket.on('server-send-peerId-of-listener-to-caller', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };
    //06
    socket.emit('caller-request-call-to-server', dataToEmit);
    showModalOfCaller(dataToEmit);
  });
  //08
  socket.on('server-send-request-call-to-listener', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };
    showModalOfListener(dataToEmit);
  });
});

async function showModalOfCaller(dataToEmit) {
  let listener = await $.get(http + `/users/${dataToEmit.listenerId}`);
  let timerInterval;
  Swal.fire({
    title: `<img src="${s3}/${listener.user.avatar}" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover;
        cursor: pointer; position: relative">`,
    html: `
            ${dataToEmit.listenerName}
            <br/><br/>
            Đang đổ chuông
            <br/><br/>
            <button type="button" class="btn btn-danger avatar-sm rounded-circle" id="btn-cancel-call">
                <span class="avatar-title bg-transparent font-size-20">
                    <i class="fal fa-times"></i> 
                </span>
            </button>
            `,
    timer: 30000,
    allowOutsideClick: false,
    willOpen: (ele) => {
      $(ele).find('button.swal2-confirm.swal2-styled').hide();
      $('#btn-cancel-call')
        .off('click')
        .on('click', function () {
          socket.emit('caller-cancel-request-call-to-server', dataToEmit);
          stopVideo();
          Swal.close();
          clearInterval(timerInterval);
        });
      Swal.showLoading();
    },
    didOpen: () => {
      //12
      socket.on('server-send-deny-call-to-caller', function (response) {
        Swal.close();
        stopVideo();
        clearInterval(timerInterval);
        Swal.fire({
          type: 'info',
          title: `${response.listenerName} đã từ chối cuộc gọi.`,
        });
        stopVideo();
      });

      //13
      socket.on('server-send-accept-call-to-caller', function (response) {
        Swal.close();
        clearInterval(timerInterval);
        showModalVideoCaller(dataToEmit);
      });
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    return false;
  });
}

function showModalVideoCaller(dataToEmit) {
  Swal.fire({
    title: `info`,
    html: `${dataToEmit.callerName}<br>
        <video id="localStream" width="200" controls> </video> <br/><br/>
        ${dataToEmit.listenerName}<br>
        <video id="remoteStream" width="300" controls> </video>
        <br/><br/>
        <button type="button" class="btn btn-danger avatar-sm rounded-circle" id="btn-cancel-called">
            <span class="avatar-title bg-transparent font-size-20">
                    <i class="fal fa-times"></i> 
            </span>
        </button>
        `,
    allowOutsideClick: false,
    willOpen: (ele) => {
      $(ele).find('button.swal2-confirm.swal2-styled').hide();
      $('#btn-cancel-called')
        .off('click')
        .on('click', function () {
          socket.emit('caller-cancel-request-call-to-server', dataToEmit);
          stopVideo();
          Swal.close();
        });
    },
    didOpen: () => {
      openVideo().then((stream) => {
        playVideo('localStream', stream);
        const call = peer.call(dataToEmit.listenerPeerId, stream);
        call.on('stream', (remoteStream) => {
          playVideo('remoteStream', remoteStream);
        });
      });
    },
  }).then((result) => {
    return false;
  });
}

async function showModalOfListener(dataToEmit) {
  let caller = await $.get(http + `/users/${dataToEmit.callerId}`);
  let timerInterval;
  Swal.fire({
    title: `<img src="${s3}/${caller.user.avatar}" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover;
        cursor: pointer; position: relative">`,
    html: `
            ${dataToEmit.callerName}
            <br/><br/>
            Cuộc gọi video đến
            <br/><br/>
            <button type="button" class="btn btn-danger avatar-sm rounded-circle" id="btn-deny-call">
                <span class="avatar-title bg-transparent font-size-20">
                    <i class="fal fa-times"></i> 
                </span>
            </button>
            &emsp;&emsp;&emsp;
            <button type="button" class="btn btn-success avatar-sm rounded-circle" id="btn-accept-call">
                <span class="avatar-title bg-transparent font-size-20">
                    <i class="fal fa-video"></i>
                </span>
            </button>
            `,
    timer: 30000,
    allowOutsideClick: false,
    willOpen: (ele) => {
      $(ele).find('button.swal2-confirm.swal2-styled').hide();
      $('#btn-deny-call')
        .off('click')
        .on('click', function () {
          Swal.close();
          clearInterval(timerInterval);
          //10
          socket.emit('listener-deny-request-call-to-server', dataToEmit);
        });
      $('#btn-accept-call')
        .off('click')
        .on('click', function () {
          Swal.close();
          clearInterval(timerInterval);

          //11
          socket.emit('listener-accept-request-call-to-server', dataToEmit);
        });
      Swal.showLoading();
    },
    didOpen: () => {
      //09
      socket.on(
        'server-send-cancel-request-call-to-listener',
        function (response) {
          Swal.close();
          stopVideo();
          clearInterval(timerInterval);
        }
      );
      //14
      socket.on('server-send-accept-call-to-listener', function (response) {
        Swal.close();
        clearInterval(timerInterval);
        showModalVideoListener(dataToEmit);
      });
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    return false;
  });
}

function showModalVideoListener(dataToEmit) {
  Swal.fire({
    title: `info`,
    html: `${dataToEmit.listenerName}<br>
        <video id="localStream" width="200" controls> </video>
        ${dataToEmit.callerName}<br>
        <video id="remoteStream" width="300" controls> </video>
        <br/><br/>
        <button type="button" class="btn btn-danger avatar-sm rounded-circle" id="btn-cancel-called">
            <span class="avatar-title bg-transparent font-size-20">
                <i class="fal fa-times"></i> 
            </span>
         </button>
        `,
    allowOutsideClick: false,
    willOpen: (ele) => {
      $(ele).find('button.swal2-confirm.swal2-styled').hide();
      $('#btn-cancel-called')
        .off('click')
        .on('click', function () {
          socket.emit('listener-deny-request-call-to-server', dataToEmit);
          stopVideo();
          Swal.close();
        });
    },
    didOpen: (ele) => {
      $(ele).find('button.swal2-confirm.swal2-styled').hide();
      peer.on('call', function (call) {
        openVideo().then((stream) => {
          call.answer(stream);
          playVideo('localStream', stream);
          call.on('stream', (remoteStream) => {
            playVideo('remoteStream', remoteStream);
          });
        });
      });
    },
  }).then((result) => {
    return false;
  });
}

function openVideo() {
  navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  const config = {
    audio: true,
    video: true,
  };
  return navigator.mediaDevices.getUserMedia(config);
}

function playVideo(idVideo, stream) {
  const video = document.getElementById(idVideo);
  video.srcObject = stream;
  let playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then((_) => { }).catch((error) => { });
  }
}

function stopVideo() {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
  });
}
