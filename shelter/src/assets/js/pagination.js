import {PageElement} from './page-element';
import {Card} from './card';

export class Pagination extends PageElement {
  constructor(parent, className, cardQuantity, arrayIndexes) {
    super(parent, 'div', className);

    this.paginationControls = new Controls(this.node, 'pagination-controls', this);
    this.paginationPets = new PageElement(this.node, 'div', 'pagination-pets');
    this.paginationPetsDouble = new PageElement(this.node, 'div', 'pagination-pets-double');

    this.isDouble = false;

    this.cardQuantity = cardQuantity;
    this.arrayIndexes = arrayIndexes;
    this.pageQuantity = Math.ceil(48 / this.cardQuantity);
    this.paginationControls.setpageQuantity(this.pageQuantity);
    this.offset = 0;

    this.cardList = this.createCards();

  }

  onChange(control) {
    this.setOffset(control);
    this.updateCards();
  }

  createCards() {

    this.setViewControls();
    let cardList = [];
    if (this.isDouble) {
      for (let i = 0; i < this.cardQuantity; i++) {
        cardList.push(new Card(this.paginationPetsDouble.node, 'card', this.arrayIndexes[i + this.offset]))
      }     
    } else {
      for (let i = 0; i < this.cardQuantity; i++) {
        cardList.push(new Card(this.paginationPets.node, 'card', this.arrayIndexes[i + this.offset]))
      }
    }
  
    return cardList
  }

  resizePagination(cardQuantity, arrayIndexes) {
    
      this.cardQuantity = cardQuantity;
      this.arrayIndexes = arrayIndexes;
      this.pageQuantity = Math.ceil(48 / this.cardQuantity);
      this.paginationControls.setpageQuantity(this.pageQuantity);
  
      this.offset = 0;
      this.isDouble = false;
      this.paginationPetsDouble.node.style.zIndex = -1;
      this.paginationPets.node.innerHTML = '';
      this.paginationPets.node.style.opacity = 1;
  
      this.cardList = this.createCards();
    
  }

  setViewControls() {
    this.paginationControls.setViewControls();
  }

  setOffset(key) {
    switch (key) {
      case 'leftScroll':
        this.offset = 0;
        break;
      case 'prev':
        this.offset = this.offset - this.cardQuantity;
        break;
      case 'next':
        this.offset = this.offset + this.cardQuantity;
        break;
      case 'rightScroll':
        this.offset = this.cardQuantity * (this.pageQuantity - 1);
        break;
    }
  }

  updateCards() {
    this.isDouble = !this.isDouble;
    if (this.isDouble) {

      this.paginationPetsDouble.node.innerHTML = '';
      this.cardList = this.createCards();

      this.paginationPetsDouble.node.style.zIndex = '2'

      this.paginationPets.node.style.opacity = 0;
      this.paginationPetsDouble.node.style.opacity = 1;

    } else {

      this.paginationPets.node.innerHTML = '';
      this.cardList = this.createCards();
      
      this.paginationPetsDouble.node.style.zIndex = '0'

      this.paginationPets.node.style.opacity = 1;
      this.paginationPetsDouble.node.style.opacity = 0;


    }
    
  }
}

class Controls extends PageElement {
  constructor(parent, className, parentInstance) {
    super(parent, 'div', className);
    this.listControls = {
      leftScroll: new PageElement(this.node, 'div', 'controls-button', '<<'),
      prev: new PageElement(this.node, 'div', 'controls-button', '<'),
      currentPage: new PageElement(this.node, 'div', 'controls-button', '1'),
      next: new PageElement(this.node, 'div', 'controls-button', '>'),
      rightScroll: new PageElement(this.node, 'div', 'controls-button', '>>'),
    };
    this.parentInstance = parentInstance;

    for (let control in this.listControls) {
      this.listControls[control].node.onclick = () => {
        this.parentInstance.onChange(control);
        this.handleChange(control);
      }
    }
  }

  handleChange(key) {
    let currentPage = this.listControls.currentPage.node;
    let numberPage = +this.listControls.currentPage.node.textContent;
    switch (key) {
      case 'leftScroll':
        currentPage.textContent = '1';
        this.setViewControls();
        break;
      case 'prev':
        currentPage.textContent = `${numberPage - 1}`;
        this.setViewControls();
        break;
      case 'next':
        currentPage.textContent = `${numberPage + 1}`;
        this.setViewControls();
        break;
      case 'rightScroll':
        let pageQuantity = this.getpageQuantity();
        currentPage.textContent = `${pageQuantity}`;
        this.setViewControls();
        break;
    }
  }
  

  setViewControls() {
    let currentPage = this.listControls.currentPage.node;
    let rightScroll = this.listControls.rightScroll.node;
    let leftScroll = this.listControls.leftScroll.node;
    let prev = this.listControls.prev.node;
    let next = this.listControls.next.node;

    currentPage.style.pointerEvents = 'none';
    currentPage.classList.add('active');

    if (currentPage.textContent === '1') {
      leftScroll.classList.add('inactive');
      prev.classList.add('inactive');
    } else {
      leftScroll.classList.remove('inactive');
      prev.classList.remove('inactive');
    }

    let pageQuantity = this.getpageQuantity();
    if (currentPage.textContent === `${pageQuantity}`) {
      rightScroll.classList.add('inactive');
      next.classList.add('inactive');
    } else {
      rightScroll.classList.remove('inactive');
      next.classList.remove('inactive');
    }
  }

  setpageQuantity(pageQuantity) {
    this.pageQuantity = pageQuantity
    let currentPage = this.listControls.currentPage.node;
    currentPage.textContent = '1';
    this.setViewControls();
  }

  getpageQuantity() {
    return this.pageQuantity
  }

  getListControls() {
    return this.listControls
  }
}

