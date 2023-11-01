import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '@/styles/style.scss';
import SimpleParallax from 'simple-parallax-js';

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
const free = document.querySelector(".free");
const modalContent = document.querySelector(".modal__content");
let genplanImg;

const modalClose = document.querySelector(".modal__close");


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
    // document.body.classList.add("_lock");
    // modalBody.classList.add("_active");
    // modalContent.classList.add("_active");
    // modalOffice.classList.remove("_none");
    // modalContainer.classList.remove("_active");
    // sykes.classList.remove("_active");
})
});
// /*=============== MODAL TABS ===============*/
// const modalItem = document.querySelectorAll(".modal__plan-item");
// const modalPlanContent = document.querySelectorAll(".modal__plan-content");

// modalItem.forEach((tab, index) => {
//   tab.addEventListener("click", () => {

//     modalItem.forEach((tab) => tab.classList.remove("_active"))
//     tab.classList.add("_active");

//     modalPlanContent.forEach(c => c.classList.remove("_active"));
//     modalPlanContent[index].classList.add("_active");
//   });
// });

// modalItem[2].click();

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

  // const header = document.getElementById('header')
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
  // if (this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

// ROOM SWIPER 
var swiperRoom = new Swiper(".room__swiper", {
  spaceBetween: 10,
  slidesPerView: 'auto',
  clickable: true,
  slideToClickedSlide: true,
  centeredSlides: false,
  // slidesPerView: 3,
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
// const modalBody = document.querySelector(".modal__body");
// const slides = document.querySelectorAll('.room__card');
// const modalContent = document.querySelector(".modal__content");
// const modalClose = document.querySelector(".modal__close");
const slides = document.querySelectorAll('.room__card');

slides.forEach(slide => {
  slide.addEventListener('click', () => {
    const slideId = slide.id;
    console.log(slideId);
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
    modalOffice.classList.remove("_none");
    modalContainer.classList.remove("_active");
    sykes.classList.remove("_active");
})
});

  // popupBody.addEventListener("click", (e) => {
  //   if (e.target === popupBody) {
  //     document.body.classList.remove("stop-scrolling");
  //     modalBody.classList.remove("_active");
  //     popupContent.classList.remove("_active");
  //   }
  // })
  window.addEventListener("keydown", (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove("_lock");
      modalBody.classList.remove("_active");
      modalContent.classList.remove("_active");
      modalOffice.classList.remove("_none");
      modalContainer.classList.remove("_active");
      sykes.classList.remove("_active");
    }
  })

  modalClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
    modalOffice.classList.remove("_none");
    modalContainer.classList.remove("_active");
    sykes.classList.remove("_active");
    
    closeModalGenplanImg();
  })

/*=============== SHOW SYKES ===============*/
const sykes = document.querySelector('.sykes');
const sykesBtn = document.querySelector('.lease__submit');
const modalOffice = document.querySelector(".modal__office");
const modalContainer = document.querySelector(".modal__container");
// const modalLease = document.querySelector(".modal__lease");
// const modalPlan = document.querySelector(".modal__plan");
if (sykesBtn) {
  sykesBtn.addEventListener("click", e => {
    modalOffice.classList.add("_none");
    sykes.classList.add("_active");
    modalContainer.classList.add("_active");
  })
}
