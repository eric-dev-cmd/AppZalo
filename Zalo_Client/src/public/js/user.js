const birthday = document.getElementById('birthday').value;
const day = birthday.split('/')[0];
const month = birthday.split('/')[1];
const year = birthday.split('/')[2];

const gender = document.getElementById('gender').value;
if (gender === 'male') {
  document.getElementById('radio1').setAttribute('checked', 'checked');
} else {
  document.getElementById('radio2').setAttribute('checked', 'checked');
}

// Do du lieu vao ddl Nam
function loadYear() {
  // Gan bien Nam thanh tag <select> co id ddlNam
  const Nam = document.getElementById('ddlNam');
  // Reset lai kich thuoc cua ddlNam
  // Tranh truong hop bi du lieu rac moi khi goi ham
  Nam.length = 0;
  // Khai bao bien cuc bo dung de chay vong for
  var iNam = 0;
  // Khai bao bien today kieu Date
  var today = new Date();
  // Cho vong for lap tu 1950 cho den nam hien hanh
  for (iNam = 1950; iNam <= today.getFullYear(); iNam++) {
    // Khai bao va gan bien optNam la kieu du lieu tag <option>
    var optNam = document.createElement('option');
    // Gan thuoc tinh cho tag <option> ten optNam
    // Text: Du lieu hien thi tren ddl

    optNam.text = iNam;
    // Value: Gia tri cua du lieu tren
    optNam.value = iNam;
    if (iNam == year) {
      optNam.selected = true;
    }
    // Them tag <option> ten optNam vao tag <select> ten Nam
    Nam.options.add(optNam);
  }
}
// Load Thang
function loadMonth() {
  const Thang = document.getElementById('ddlThang');
  Thang.length = 0;
  var iThang = 0;
  for (iThang = 1; iThang <= 12; iThang++) {
    var optThang = document.createElement('option');
    optThang.text = iThang;
    optThang.value = iThang;
    if (iThang == month) {
      optThang.selected = true;
    }
    Thang.options.add(optThang);
  }
}
// Load Ngay
function loadDay() {
  const Ngay = document.getElementById('ddlNgay');
  const Thang = document.getElementById('ddlThang');
  const Nam = document.getElementById('ddlNam');
  Ngay.length = 0;
  // parseInt: chuyen kieu Thang.value tu String sang Int
  var value = parseInt(Thang.value);
  // Dat bien SoNgay de lam gia tri cuoi cho dong lap phat sinh ngay
  var SoNgay = 0;
  // Thuc hien cac dong lenh sau dua tren viec so sanh gia tri Thang
  switch (value) {
    // Truong hop thang 2
    case 2:
      // Lay gia tri Nam dang duoc chon trong ddlNam
      var gtNam = parseInt(Nam.value);
      console.log(gtNam);
      // Thuat toan tinh nam nhuan
      if (gtNam % 4 == 0 && (gtNam % 100 != 0 || gtNam % 400 == 0)) {
        // La nam nhuan
        SoNgay = 29;
      } else {
        // Khong la nam nhuan
        SoNgay = 28;
      }
      break;
    // Truong hop cac thang 1, 3, 5, 7, 8, 10, 12
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      SoNgay = 31;
      break;
    // Truong hop cac thang 4, 6, 9, 11
    case 4:
    case 6:
    case 9:
    case 11:
      SoNgay = 30;
      break;
  }
  var iNgay = 0;
  for (iNgay = 1; iNgay <= SoNgay; iNgay++) {
    var optNgay = document.createElement('option');
    optNgay.text = iNgay;
    optNgay.value = iNgay;
    if (iNgay == day) {
      optNgay.selected = true;
    }
    Ngay.options.add(optNgay);
  }
}

//load ngay truyen vao view
function loadBirthday() {
  const Ngay = document.getElementById('ddlNgay');
  const Thang = document.getElementById('ddlThang');
  const Nam = document.getElementById('ddlNam');
  const updateBirthday = Ngay.value + '/' + Thang.value + '/' + Nam.value;
  document.getElementById('birthday').value = updateBirthday;
}

//thay doi avatar
function preview_image(event) {
  var reader = new FileReader();
  var fileData = event.target.files[0];
  if (fileData['type'].split('/')[0] !== 'image') {
    //alertify.notify('Không đúng định dạng', 'error', 7);
    alert('Không đúng định dạng');
    fileData = null;
    return false;
  }
  if (fileData['size'] > 1048576) {
    //1MB
    alert('Kích cỡ file phải nhỏ hơn 1MB');
    fileData = null;
    return false;
  } else {
    reader.onload = function () {
      document.getElementById('avatar').src = reader.result;
    };
    const file = reader.readAsDataURL(fileData);
  }

  let userAvatar = null;
  let formData = new FormData();
  formData.append('avatar', fileData);
  userAvatar = formData;
  console.log(userAvatar);
  const file = reader.readAsDataURL(fileData);
}

// console.log(editorParent.style)
const editorName = document.querySelector('.txt-name-default');
const editorParent = document.querySelector('#editor-name-parent');
editorName.onclick = function () {
  var input = editorName.innerHTML;
  // console.log(input)
  var preEntry = input.substring(0, input.indexOf('<span> ') + 7);
  // console.log(preEntry)
  var entry = input.substring(
    input.indexOf('<span> ') + 6,
    input.indexOf('</span>')
  );
  // console.log(entry)
  var postEntry = input.substring(input.indexOf('</span>'));
  editorParent.innerHTML =
    '<input name="userName" type="text" value="' + entry + '">' + postEntry;

  Object.assign(editorParent.style, {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  });
};
// More in form add
let i = 0;
let readMore = document.querySelector('#more');
let readLess = document.querySelector('#read');

function read() {
  if (!i) {
    readMore.style.display = 'inline';
    readLess.innerHTML = 'Less';
    i = 1;
  } else {
    readMore.style.display = 'none';
    readLess.innerHTML = 'More';
    i = 0;
  }
}
let btnAddFriend = document.querySelectorAll('.btn-add-friend-click');
btnAddFriend.forEach((e) => {
  e.addEventListener('click', function () {
    if (e.innerText === 'Kết bạn') {
      e.innerText = 'Huỷ kết bạn';
    } else {
      e.innerText = 'Kết bạn';
    }
  });
});
