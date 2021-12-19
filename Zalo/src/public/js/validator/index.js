// Đối tượng `Validator`
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);
    var errorMessage;

    // Lấy ra các rules của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule & kiểm tra
    // Nếu có lỗi thì dừng việc kiểm
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        'invalid'
      );
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove(
        'invalid'
      );
    }

    return !errorMessage;
  }

  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // Lặp qua từng rules và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Trường hợp submit với javascript
        if (typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]');
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = '';
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case 'file':
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});
          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove(
            'invalid'
          );
        };
      });
    });
  }
}

// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Vui lòng nhập trường này';
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || 'Trường này phải là email';
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || 'Giá trị nhập vào không chính xác';
    },
  };
};
const form = document.getElementById('formInfo');
const username = document.getElementById('username');
const password = document.getElementById('passwordInfor');
const password2 = document.getElementById('passwordInforConfirm');
// Nhan value tu input
const show = document.getElementById('showNotification');
let error = '';
var illegalChars = /\W /;
// USERNAME
username.addEventListener('blur', () => {
  const usernameValue = username.value;
  isUsernameValid(usernameValue);
});
handleOnInputUsername(username);
// PASSWORD
function handleOnInputUsername(inputElement) {
  const show = document.getElementById('showNotification');
  inputElement.oninput = function () {
    error = '';
    show.classList.remove('alert-danger');
    show.style.display = 'none';
    show.innerHTML = error;
  };
}
function isUsernameValid(str) {
  console.log('USERNAME isvalid');
  // cho phép các chữ cái, số và dấu gạch dưới
  if (str == '') {
    isShowError('Vui lòng nhập Username<br>');
  } else if (str.length < 2 || str.length > 45) {
    isShowError('Tên người dùng phải có 2-45 ký tự<br>');
  } else if (illegalChars.test(removeAscent(str))) {
    isShowError('Username không hợp lệ. Vui lòng sử dụng bảng chữ cái<br>');
  } else {
    error = '';
    show.classList.remove('alert-danger');
    show.style.display = 'none';
    show.innerHTML = error;
  }
  return error;
}
function isShowSuccess(messageError) {
  error = messageError;
  show.classList.remove('alert-danger');
  show.style.display = 'block';
  show.classList.add('alert-success');
  show.innerHTML = error;
}
function isShowError(messageError) {
  error = messageError;
  show.classList.remove('alert-success');
  show.style.display = 'block';
  show.classList.add('alert-danger');
  show.innerHTML = error;
}
function removeAscent(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}
var myInput = document.getElementById('passwordInfor');
var letter = document.getElementById('letter');
var capital = document.getElementById('capital');
var number = document.getElementById('number');
var length = document.getElementById('length');
// When the user clicks on the password field, show the message box
myInput.onfocus = function () {
  document.getElementById('message').style.display = 'block';
};

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function () {
  document.getElementById('message').style.display = 'none';
};

// When the user starts to type something inside the password field
myInput.onkeyup = function () {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if (myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove('invalid');
    letter.classList.add('valid');
  } else {
    letter.classList.remove('valid');
    letter.classList.add('invalid');
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if (myInput.value.match(upperCaseLetters)) {
    capital.classList.remove('invalid');
    capital.classList.add('valid');
  } else {
    capital.classList.remove('valid');
    capital.classList.add('invalid');
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if (myInput.value.match(numbers)) {
    number.classList.remove('invalid');
    number.classList.add('valid');
  } else {
    number.classList.remove('valid');
    number.classList.add('invalid');
  }

  // Validate length
  if (myInput.value.length >= 8) {
    length.classList.remove('invalid');
    length.classList.add('valid');
  } else {
    length.classList.remove('valid');
    length.classList.add('invalid');
  }
};

function validatePassword() {
  if (password.value != password2.value) {
    isShowError('Mật khẩu không khớp');
  } else {
    console.log('Dung mk');
    isShowSuccess('Mật khẩu khớp');
    // password2.setCustomValidity('');
  }
}
password.onchange = validatePassword;
password2.onkeyup = validatePassword;
function showPassword() {
  var x = document.getElementById('passwordInfor');
  var y = document.getElementById('passwordInforConfirm');

  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
  if (y.type === 'password') {
    y.type = 'text';
  } else {
    y.type = 'password';
  }
}
