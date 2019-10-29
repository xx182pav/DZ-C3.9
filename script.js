function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    'max-age': 3600,
    expires: new Date(),
  };

  if (options.expires) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

function disableCheckboxes() {
  $('.check').each(function() {
    $(this).attr('disabled', true);
  });
  $('.save-btn').text('Очистить хранилище').click(() => {
    localStorage.clear();
    location.reload();
  });
}

function disableInput() {
  let cityName = `${getCookie('city').charAt(0).toUpperCase() + getCookie('city').slice(1).toLowerCase()}`;
  console.log(cityName);
  $('#cityInput').val(cityName);
  $('#cityInput').attr('disabled', true);
}
// проверки при загрузке страницы
$(document).ready(function() {
  // задание 1
  // если есть запись в куки, убрать поле ввода и показать город из куки
  if(getCookie('city')) {
    disableInput();
    
    // показать кнопку Удалить данные
    $('.submit-btn').text('Сбросить куки').click(() => {
      deleteCookie('city');
      location.reload();
    });
  }

  // задание 2
  // мотаем по всем ключам в localStorage
  if (localStorage.key('checked')) disableCheckboxes();

  $.each(localStorage, function(key, value='checked') {
    // если есть ключи со значением 'checked'
    if (localStorage.key(value)) {
      // присваиваем property элементу с id=key
      $(`#${key}`).attr(value, true);
    };
  });
});

// обработка Enter на поле ввода
$('#cityInput').on('keypress', function(event) {
if (event.keyCode === 13) {
  // отменить действие по умолчанию, если есть
  event.preventDefault();
  // триггер для кнопки Submit (Отправить)
  $('.submit-btn').click();
}
});

// записать название города в куки (или Enter или Click)
$('.submit-btn').click(() => {
  setCookie('city', $('#cityInput').val());
  location.reload();
});

// сохранить состояние галочек в localStorage
$('.save-btn').click(() => {
  $('.check').each(function() {
    if ($(this).prop('checked')) {
      console.log(this.id);
      localStorage.setItem(this.id, 'checked');
    };
    disableCheckboxes();
  });
});
