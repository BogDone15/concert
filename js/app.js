const priceWrap = document.querySelector('.main__price-wrap');
const hidePrice = document.querySelector('.hide__price');

priceWrap.addEventListener('click', () => {
  hidePrice.classList.toggle('active');
});

let cart = [];
let seatsDOM = [];

class Seats {

  async getSeats() {
    try {
      let result = await fetch('seats.json');
      let data = await result.json();
      let seats = data.placesMap;
      seats = seats.map(ticket => {
        const {
          id,
          state,
          priceGroup,
          imagePosition,
          humanizedPosition,
          price
        } = ticket;
        return {
          id,
          state,
          priceGroup,
          imagePosition,
          humanizedPosition,
          price
        };
      });
      return seats;

    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  constructor({
    seatsWrap,
    ticketsWrap,
    mainPayment,
    cartTotal,
    ticketTotal,
    ticketPrice,
    ticketService,
    ticketDelete,
    ticketsItem,
  }) {
    this.elements = {
      seatsWrap: document.querySelector(seatsWrap),
      ticketsWrap: document.querySelector(ticketsWrap),
      mainPayment: document.querySelector(mainPayment),
      cartTotal: document.querySelector(cartTotal),
      ticketTotal: document.querySelector(ticketTotal),
      ticketPrice: document.querySelector(ticketPrice),
      ticketService: document.querySelector(ticketService),
      ticketDelete: document.querySelector(ticketDelete),
      ticketsItem: document.querySelector(ticketsItem),
    }
  }

  displaySeats(seats) {

    let result = "";
    seats.forEach(seat => {
      result += `
   <div style="background-color: ${seat.state == 'booked' ? 'gray' : 'green'};left: ${seat.imagePosition.x}px;top: ${seat.imagePosition.y}px" class="tickets__item" data-state=${seat.state} data-id=${seat.id}></div>
   `
    });

    this.elements.seatsWrap.insertAdjacentHTML('afterbegin', result);

    const seatsItem = [...document.querySelectorAll('.tickets__item')];

    seatsDOM = seatsItem;

    seatsItem.forEach(seat => {
      if (seat.dataset.state == 'booked') seat.style.pointerEvents = 'none';

      let id = seat.dataset.id;
      seat.addEventListener('click', e => {
        const target = e.target;
        target.style.backgroundColor = '#00FF00';
        target.dataset.state == 'booked';
        target.style.pointerEvents = 'none';

        let cartItem = {
          ...Storage.getSeats(id),
          amount: 1
        };

        cart = [...cart, cartItem];

        Storage.saveCart(cart);

        this.setCartValues(cart);

        this.addTicket(cartItem);

        this.showCart();
      });
    });
  }

  // addSeatIntoCart() {
  // }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    let servicesTotal = 0;
    cart.map(item => {
      tempTotal += item.price;
      itemsTotal += item.amount;
      servicesTotal += item.price * 0.1;
    });
    this.elements.cartTotal.innerText = tempTotal + servicesTotal;
    this.elements.ticketPrice.innerText = tempTotal;
    this.elements.ticketTotal.innerText = itemsTotal;
    this.elements.ticketService.innerText = servicesTotal;
  }

  addTicket(item) {
    const div = document.createElement('div');
    div.classList.add('payment-ticket-item', 'animate__animated', 'animate__backInRight');
    div.innerHTML = `
  <div class="payment-ticket-item-title">
        ПАРТЕР
       </div>
       <div class="payment-ticket-item-info">
       <div class="payment-ticket-item-info-wrap">
        <span class="payment-ticket-item-place">Место: ${item.humanizedPosition.place}</span>
        <span class="payment-ticket-item-row">Ряд: ${item.humanizedPosition.row}</span>
       </div>
        <div class="payment-ticket-item-info-price">
         ${item.price} грн
        </div>
       </div>
       <span class="exit-icon"><i class="fas fa-times"></i></span>
  `

    this.elements.ticketsWrap.appendChild(div);
  }

  showCart() {
    this.elements.mainPayment.style.display = 'none';
  }

  // setupApp() {
  //   cart = Storage.getCart();
  //   this.setCartValues(cart);
  //   this.populateCart(cart);
  //   this.elements.ticketDelete.addEventListener('click', this.hideTicket);
  // }


  hideTicket() {
    this.elements.ticketsItem.style.display = 'none';
  }

  cartItemRemove() {
    this.elements.ticketsItem.addEventListener('click', e => {
      console.log(e.target);
    })
  }
}

class Storage {
  static saveSeats(seats) {
    localStorage.setItem('seats', JSON.stringify(seats));
  }

  static getSeats(id) {
    let seats = JSON.parse(localStorage.getItem('seats'));
    return seats.find(seat => seat.id == id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const seats = new Seats();
  const ui = new UI({
    seatsWrap: '.tickets__wrap-block-first',
    ticketsWrap: '.payment-ticket-item-wrap',
    ticketsItem: '.payment-ticket-item',
    mainPayment: '.main__payment-reminders',
    cartTotal: '.main__payment-item-tickets-total',
    ticketTotal: '.main__payment-ticket-total',
    ticketPrice: '.main__payment-item-tickets',
    ticketService: '.main__payment-item-tickets-services',
    ticketDelete: '.exit-icon',
  });
  // ui.setupApp();

  seats.getSeats().then(seats => {
    ui.displaySeats(seats);
    Storage.saveSeats(seats);
    //  ui.addSeatIntoCart();
  }).then(() => {
    ui.cartItemRemove();
  })
});




// const priceGroupById = {
//  'parter-row-1-2': {
//   price: 200,
//   style: '#aa0'
//  },
//  'parter-row-3-4': {
//   price: 100,
//   style: '#dee'
//  }
// }