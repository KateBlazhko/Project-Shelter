import {PageElement, Button} from './page-element';
import * as myFunc from './function';
import {Card} from './card';

export class Slider extends PageElement {
    constructor(parent, className, cardQuantity, cardGap) {
      super(parent, 'div', className);
      const sliderWrap = new PageElement(this.node, 'div', 'slider-wrap');
      const prev = new PageElement(this.node, 'div', 'button-arrow left');
      const next = new PageElement(this.node, 'div', 'button-arrow right');
      this.slider = new PageElement(sliderWrap.node, 'div', 'slider');
      this.cardQuantity = cardQuantity;
      this.gap = cardGap;
      this.offset = 0;
      this.slideList = [];
      this.delay = 0.5;
      
      let clickTimeoutPrev;
      prev.node.onclick = () => {
        if (!clickTimeoutPrev) {
          this.toSlidePrev(0.4);
          clickTimeoutPrev = setTimeout(() => {
            clickTimeoutPrev = null;
          }, 400)
        }
      }

      let clickTimeoutNext;
      next.node.onclick = () => {
        if (!clickTimeoutNext) {
          this.toSlideNext(0.4);
          clickTimeoutNext = setTimeout(() => {
            clickTimeoutNext = null;
          }, 400)
        }
      }

    }

    createSlides() {
      this.sliderMain = new PageElement(this.slider.node, 'div', 'slider-main');

      for (let i = 0; i < 3; i++) {
        this.slideList.push(new PageElement(this.sliderMain.node, 'div', 'slide'))
      }

      this.indexMovedSlide = this.slideList.length - 1;
      this.indexVisibleSlide = 0;
      this.indexesVisibleCard = [];
      this.slideSize = this.cardQuantity / 3;

  

      const slide = this.slideList[this.indexVisibleSlide]
      this.createCards(slide);
      this.translateSlides();
    } 

    createCards(slide) {
      const array = [1, 2, 3, 4, 5, 6, 7, 8];
      const arrayNew = array.filter(item => !this.indexesVisibleCard.includes(item))
      const arrayIndexes = myFunc.randomSort(arrayNew);

      slide.node.innerHTML = '';
      this.indexesVisibleCard = []
      
      for (let i = 0; i < this.slideSize; i++) {
        new Card(slide.node, 'card', arrayIndexes[i])
        this.indexesVisibleCard.push(arrayIndexes[i])
      } 

    }

    translateSlides() {
      this.slideList.forEach((slide, i) => {
        const delay = this.getDelay(i);
        const position = this.getPosition(i);

        if (position === 0) {
          slide.node.style.transform = `translate(${position * 100}%)`;
          slide.node.style.transitionDuration = `${delay}s`;
        } else if (position === this.slideList.length - 1) {
          slide.node.style.transform = `translate(calc(-100% - ${this.gap}px))`;
          slide.node.style.transitionDuration = `${delay}s`;
          } else {
            slide.node.style.transform = `translate(calc(${position * 100}% + ${position * this.gap}px))`;
            slide.node.style.transitionDuration = `${delay}s`;
          }
      })   
    }

    toSlidePrev(delay) {
        this.slider.node.style.overflow = 'hidden';
        setTimeout (() => {
          this.slider.node.style.overflow = 'visible';
        }, 400)

        this.indexVisibleSlide = myFunc.increaseCircle(this.indexVisibleSlide, this.slideList.length - 1, 0)
        this.updateSlides();

        this.isPrev = true;
        this.delay = delay;

        this.offset = myFunc.decreaseCircle(this.offset, this.slideList.length - 1)

        this.indexMovedSlide = myFunc.increaseCircle(this.indexMovedSlide, this.slideList.length, 1)

        this.translateSlides();
     
    }

    toSlideNext(delay) {
        this.slider.node.style.overflow = 'hidden';
        setTimeout (() => {
          this.slider.node.style.overflow = 'visible';
        }, 400)

        this.indexVisibleSlide = myFunc.decreaseCircle(this.indexVisibleSlide, this.slideList.length - 1)
        this.updateSlides();

        this.isPrev = false;
        this.delay = delay;

        this.offset = myFunc.increaseCircle(this.offset, this.slideList.length - 1, 0)

        this.indexMovedSlide = myFunc.decreaseCircle(this.indexMovedSlide, this.slideList.length - 1)

        this.translateSlides();

    }

    updateSlides() {
      this.createCards(this.slideList[this.indexVisibleSlide])
    }

    resizeSlider(cardQuantity, cardGap) {
      if (this.cardQuantity !== cardQuantity) {
        this.sliderMain.node.remove();
        this.cardQuantity = cardQuantity;
        this.gap = cardGap;
        this.offset = 0;
        this.slideList = [];
        this.createSlides();
      } else {
        this.gap = cardGap;
        this.translateSlides();
      }
    }

    getDelay(i) {
      const delay = this.delay

      if (this.isPrev) {
        if (i === this.indexMovedSlide - 1) {
          delay = 0;
        }
      } else {
        if (i === this.indexMovedSlide) {
          delay = 0;
        }
      }
      return delay
    }

    getPosition(i) {
      const position = 0;
        if ((i + this.offset) < this.slideList.length) {
          position = i + this.offset
        }
        if ((i + this.offset) > this.slideList.length) {
          position = i + this.offset - this.slideList.length
        }
      return position
    }
}


export class SliderModel {
  constructor() {
    this.cardQuantity = this.getcardQuantity();
    this.cardGap = this.getCardGap();
    this.slider = new Slider(contentSlider, 'slider-container', this.cardQuantity, this.cardGap);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (!resizeTimeout) {
        this.cardQuantity = this.getcardQuantity();
        this.cardGap = this.getCardGap();
        this.slider.resizeSlider(this.cardQuantity, this.cardGap);
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
        }, 66)
      } 
    })

  }

  getcardQuantity(){
    return (window.innerWidth >= 1280) ? 9 :
           (window.innerWidth >= 768) ? 6 : 3
  }

  getCardGap(){
    return (window.innerWidth >= 1024) ? 90 : 40
  }

  createSlider() {
    this.slider.createSlides();
  }

}


const contentSlider = document.querySelector('.pets-content');

