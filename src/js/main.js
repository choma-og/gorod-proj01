import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '@/styles/style.scss';
import SimpleParallax from 'simple-parallax-js';
import axios from 'axios';
import Inputmask from 'inputmask';

var image = document.getElementsByClassName('thumbnail');
new SimpleParallax(image);

/*=============== BURGER ===============*/
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
const headerMenu = document.querySelector(".header__menu");
if (iconMenu) {
  iconMenu.addEventListener("click", e => {
    headerMenu.classList.toggle("_active");
    document.body.classList.toggle('_lock')
    iconMenu.classList.toggle('_active');
    menuBody.classList.toggle('_active');
  })
}

/*=============== REMOVE BURGER ===============*/
const menuLink = document.querySelectorAll('.menu__link')
const menuLogo = document.querySelectorAll('.menu__logo')
const menuAdress = document.querySelectorAll('.menu__info-adress')

const linkAction = () =>{
    menuBody.classList.remove('_active');
    iconMenu.classList.toggle('_active');
    headerMenu.classList.toggle("_active");
    document.body.classList.toggle('_lock')
}
menuLink.forEach(n => n.addEventListener('click', linkAction))
menuAdress.forEach(n => n.addEventListener('click', linkAction))
menuLogo.forEach(n => n.addEventListener('click', linkAction))

/*=============== REMOVE BURGER ESCAPE?? AND CLICK OUT ===============*/
headerMenu.addEventListener("click", (e) => {
  if (e.target === headerMenu) {
    // document.body.classList.remove("stop-scrolling");
    headerMenu.classList.remove("_active");
    menuBody.classList.remove("_active");
    iconMenu.classList.remove('_active');
    document.body.classList.toggle('_lock')
  }
})

/*=============== TABS ===============*/
const tabs = document.querySelectorAll(".tabs__item");
const contents = document.querySelectorAll(".tabs__content");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {

    tabs.forEach((tab) => tab.classList.remove("_active"))
    tab.classList.add("_active");

    contents.forEach(c => c.classList.remove("_active"));
    contents[index].classList.add("_active");
  });
});

tabs[0].click();

/*=============== PLAN TABS ===============*/
const planItem = document.querySelectorAll(".plan__item");
const planContent = document.querySelectorAll(".plan__content");

planItem.forEach((tab, index) => {
  tab.addEventListener("click", () => {

    planItem.forEach((tab) => tab.classList.remove("_active"))
    tab.classList.add("_active");

    planContent.forEach(c => c.classList.remove("_active"));
    planContent[index].classList.add("_active");
  });
});

planItem[1].click();

/*=============== SHOW MODAL FROM PLAN ===============*/
const modalBody = document.querySelector(".modal__body");
const genPlanLink = document.querySelectorAll('.genplan__link');
const attrPrice = document.querySelector(".attrprice");
const attrSquare = document.querySelector(".attrsquare");
const attrFlat = document.querySelector(".attrflat");
const attrNumber = document.querySelector(".attrnumber");
const attrImg = document.querySelector(".attrimg");
const modalContent = document.querySelector(".modal__content");
let genplanImg;




const closeModalGenplanImg = () => {
  genplanImg.classList.remove("_active");
}

const openModalGenplanImg = () => {
  genplanImg.classList.add("_active");
}



genPlanLink.forEach(link => {
  link.addEventListener('click', () => {
    const dataAttributeValue = link.dataset.flat;
    if(!dataAttributeValue) {
      throw new Error("Invalid data property")
    }
    const {square, number, price, flat, imgplan, dataId} = JSON.parse(dataAttributeValue);

    attrSquare.innerHTML = square;
    attrPrice.innerHTML = price;
    attrFlat.innerHTML = flat;
    attrNumber.innerHTML = number;
    genplanImg = document.querySelector(`.c${flat}`);


    genplanImg.querySelectorAll("a").forEach((a) => {
        const polygon = a.querySelector(`polygon`);
        console.log(polygon, dataId, a.dataset.id);
          if(Number(a.dataset.id) === dataId) {
            polygon.classList.add("_active")
          } else {
            polygon.classList.remove("_active")
          }
    })
    console.log(`.c${flat}`, genplanImg) 

    openModalGenplanImg();

    attrImg.setAttribute("src", imgplan);
    console.log(flat);
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
    modalBody.scrollTop = 0;
})
});

// /*=============== MODAL TABS ===============*/

/*=============== ADVANTAGES SLIDER ===============*/

const sliderFactory = (arrOfSelectors) => {
  const baseConfig = {
    loop: true, 
    spaceBetween: 10
  }

  arrOfSelectors.forEach(selector => {
    if( selector == "123") {

    } else {
      new Swiper(selector, {
        ...baseConfig,
        breakpoints: {
          320: {
            spaceBetween: 40,
          },
          1000: {
            spaceBetween: 90,
          },
        }
      })
        
    }
  })
  

}
var swiperAdvantages = new Swiper(".advantages__swiper", {
  spaceBetween: 10,
  grabCursor: true,
  centerSlides: true,
  slidesPerView: 'auto',
  loop: true,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: {
      spaceBetween: 40,
    },
    1000: {
      spaceBetween: 90,
    },
  }
});

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById('header')
  const headerLogo = document.getElementById('header-logo')
  const menuIcon = document.getElementById('menu-icon')
  const btnStroke = document.getElementById('btn--stroke')

  if (this.scrollY >= 50) 
  {
    header.classList.add('scroll-header');
    headerLogo.classList.add('scroll-logo');
    menuIcon.classList.add('scroll-icon');
    btnStroke.classList.add('scroll-btn');
    

  } else {
    header.classList.remove('scroll-header');
    headerLogo.classList.remove('scroll-logo');
    menuIcon.classList.remove('scroll-icon');
    btnStroke.classList.remove('scroll-btn');
  }
}
window.addEventListener('scroll', scrollHeader)

// ROOM SWIPER 
var swiperRoom = new Swiper(".room__swiper", {
  spaceBetween: 10,
  slidesPerView: 'auto',
  clickable: true,
  slideToClickedSlide: true,
  centeredSlides: false,
  grabCursor: true,
  loop: true,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
    breakpoints: {
    640: {
      slidesPerView: 'auto',
      spaceBetween: 10,
      centeredSlides: false,
    },
    1000: {
      slidesPerView: 'auto',
      spaceBetween: 15,
      centeredSlides: false,
    },
    1300: {
      centeredSlides: false,
      slidesPerView: 'auto',
      spaceBetween: 45,
    },
  }

});

/*=============== SHOW POP UP SLIDER===============*/
const modalClose = document.querySelector(".modal__close");
const slides = document.querySelectorAll('.room__card');

slides.forEach(slide => {
  slide.addEventListener('click', () => {
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
    modalBody.scrollTop = 0;
    // modalContainer.classList.remove("_active");
})
});

  window.addEventListener("keydown", (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove("_lock");
      modalBody.classList.remove("_active");
      modalContent.classList.remove("_active");
      modalContainer.classList.remove("_active");

    }
  })

  modalClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
    modalContainer.classList.remove("_active");

    closeModalGenplanImg();
  })


function validatePhone(phone)  {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length)
  console.log(cleanedPhone.length === 11, "partial")

  if(cleanedPhone.length === 11) {
    return true; 
  } else {
    return false;
  }
}
function validateText(text)  {
  const trimmedText = text.trim();

    if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}

const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;
  switch(dataType) {
      case "phone": 
      res = validatePhone(input.value)
      break;
      case "text": 
      res = validateText(input.value)
      break;
  }
  console.log(input, res, dataType)
  return res;
}

/*=============== AXIOS ===============*/ 
let forms = document.querySelectorAll('.js-form');
const modalSykesBody = document.querySelector('.sykes__body');
const sykesClose = document.querySelector('.sykes__close');
const validateTextNull = document.querySelectorAll('.validate__form-text--null');
const validateErrorName = document.querySelector('.validate__form-error--name');
const validateErrorPhone = document.querySelector('.validate__form-error--phone');
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");

  formButton.addEventListener("click", (e) => {
  e.preventDefault();
  formButton.disabled = true;
  const inputs = form.querySelectorAll("input");
  const method = form.method;
  const action = form.action;
  let isValidated = true;
  let formData = [];

  inputs.forEach(input => {
      formData.push({
        name: input.name,
        value: input.value,
        isValidate: validate(input),
      })  
  })

  formData.forEach(item => {
    const input = form.querySelector(`[name="${item.name}"]`);
    const wrapper = input.parentNode;
    const errorBlock = wrapper.querySelector('.js-error');
    // const inputName = document.querySelector(".feedback__name");
    // const inputTel = document.querySelector(".feedback__tel");
    if(!item.isValidate) {
        isValidated = false;
        errorBlock.classList.add("_active")
        // inputName.classList.add("_active");
        // inputTel.classList.add("_active");
    } else {
        errorBlock.classList.remove("_active")
        // inputName.classList.remove("_active");
        // inputTel.classList.remove("_active");
    }
  })

  if(!isValidated) {
    formButton.disabled = false;
    return false;
  }

    axios({
        method,
        url: action,
        data: formData,
    }).then((response) => {
        console.log("success");
        formButton.disabled = false;
    }).catch((error) => {
        console.error(error)
        formButton.disabled = false;
        modalSykesBody.classList.add("_active");
        document.body.classList.add("_lock");
      });
  
})
sykesClose.addEventListener('click' , () => {
  modalSykesBody.classList.remove("_active");
  document.body.classList.remove("_lock");
  console.log("click")
}) 
})

/*=============== MASK FORM TEL ===============*/ 
const phones = document.querySelectorAll('[data-mask="phone"]');
let im = new Inputmask('+7 (999) 999-99-99');
im.mask(phones);
// if(!phones) {
//   throw new Error("Invalid data property")
// }
// const phoneOptions = { // создаем объект параметров
//   mask: '+{7} (000) 000-00-00' // задаем единственный параметр mask
// }
// phones.forEach(el => { // для каждого найденного поля с атрибутом [data-mask="phone"]
//   IMask(el, phoneOptions) // инициализируем плагин с установленными выше параметрами
// })


