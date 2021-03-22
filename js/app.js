const priceWrap = document.querySelector('.main__price-wrap');
const hidePrice = document.querySelector('.hide__price');

priceWrap.addEventListener('click', () => {
  hidePrice.classList.toggle('active');
});

let cart = [];
// let seatsDOM = [];

class Seats {
  async loadSeats() {
    const response = await fetch('seats.json');
    const data = await response.json();
    let seats = data.placesMap;
    seats = seats.map(seat => {
      const {
        id,
        state,
        priceGroup,
        imagePosition,
        humanizedPosition,
        price
      } = seat;
      return {
        id,
        state,
        priceGroup,
        imagePosition,
        humanizedPosition,
        price
      };
    });
    
    this._seats = seats;
  }

  get() {

    return this._seats;
  }

  getSeat(id) {
    
    return this._seats.find(seat => seat.id == id);
  }
}

class SeatsRenderer {
  constructor(model) {
    this._model = model;
    this._seatsWrapper = document.querySelector('.tickets__wrap');
    this._ticketsWrap = document.querySelector('.payment-ticket-item-wrap');
    this._mainPayment = document.querySelector('.main__payment-reminders');
    this._cartTotal = document.querySelector('.main__payment-item-tickets-total');
    this._ticketPrice = document.querySelector('.main__payment-item-tickets');
    this._ticketTotal = document.querySelector('.main__payment-ticket-total');
    this._ticketService = document.querySelector('.main__payment-item-tickets-services');
  }

  render() {
    const seats = this._model.get();

    const seatsDomElements = seats.map(seat => {
      return this._renderSeats(seat);
    });

    seatsDomElements.forEach(element => {
      this._seatsWrapper.appendChild(element);
    });
  }

  _renderSeats(seat) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('tickets__item');
    wrapper.dataset.state = `${seat.state}`;
    wrapper.dataset.id = `${seat.id}`;
    wrapper.style.cssText = `
    background-color: ${seat.state == 'booked' ? 'gray' : 'green'};
    left: ${seat.imagePosition.x}px;
    top: ${seat.imagePosition.y}px;
    `;

    if (wrapper.dataset.state == 'booked') {
      wrapper.style.pointerEvents = 'none';
    }

    let id = wrapper.dataset.id;

    wrapper.addEventListener('click', e => {
      let cartItem = {...this._model.getSeat(id)};

      cart = [...cart, cartItem];

      Storage.saveCart(cart);

      this._addSeatIntoCart(cartItem);

      e.target.dataset.state = 'booked';
      e.target.style.backgroundColor = 'gray';
      e.target.style.pointerEvents = 'none';
      this._setCartValues(cart);
    });

    return wrapper;
  }

  _addSeatIntoCart(item) {
    const button = document.createElement('i');
    button.classList.add('fas', 'fa-times', 'exit-icon');
    button.dataset.id = item.id;
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
      `
    const ticketItem = this._ticketsWrap.appendChild(div);
    ticketItem.append(button);

    button.addEventListener('click', e => {
      // debugger;
      const removeItem = e.target;
      let id = removeItem.dataset.id;
      removeItem.parentElement.remove();
      this._removeItem(id);
    });

    // button.addEventListener('click', (e) => this._removeItem(id));

    this._mainPayment.style.display = 'none';
  }

  _setCartValues(cart) {
    let tempTotal = 0;
    let servicesTotal = 0;
      cart.map(item => {
        tempTotal += item.price;
        servicesTotal += item.price * 0.1;
      });
    this._cartTotal.innerText = tempTotal + servicesTotal;
    this._ticketPrice.innerText = tempTotal;
    this._ticketTotal.innerText = `${cart.length}`;
    this._ticketService.innerText = servicesTotal;
  }

  _removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    cart.length = cart.length - 1;
    Storage.saveCart(cart);

    this._setCartValues(cart);
  }
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

const seats = new Seats();
const seatsRenderer = new SeatsRenderer(seats);

seats.loadSeats().then(seats => {
  seatsRenderer.render(seats);
})
// class UI {
//   constructor({
//     seatsWrap,
//     ticketsWrap,
//     mainPayment,
//     cartTotal,
//     ticketTotal,
//     ticketPrice,
//     ticketService,
//     ticketDelete,
//   }) {
//     this.elements = {
//       seatsWrap: document.querySelector(seatsWrap),
//       ticketsWrap: document.querySelector(ticketsWrap),
//       mainPayment: document.querySelector(mainPayment),
//       cartTotal: document.querySelector(cartTotal),
//       ticketTotal: document.querySelector(ticketTotal),
//       ticketPrice: document.querySelector(ticketPrice),
//       ticketService: document.querySelector(ticketService),
//       ticketDelete: document.querySelector(ticketDelete),
//     }

//     // this.elements.ticketsItem.addEventListener('click', this.addClickListenerThatRemovesCartItem);
//   }

//   displaySeats(seats) {

//     let result = "";
//     seats.forEach(seat => {
//       result += `
//    <div style="background-color: ${seat.state == 'booked' ? 'gray' : 'green'};left: ${seat.imagePosition.x}px;top: ${seat.imagePosition.y}px" class="tickets__item" data-state=${seat.state} data-id=${seat.id}></div>
//    `
//     });

//     this.elements.seatsWrap.insertAdjacentHTML('afterbegin', result);

//     const seatsItem = [...document.querySelectorAll('.tickets__item')];

//     seatsDOM = seatsItem;

//     seatsItem.forEach(seat => {
//       if (seat.dataset.state == 'booked') seat.style.pointerEvents = 'none';

//       let id = seat.dataset.id;
//       seat.addEventListener('click', e => {
//         const target = e.target;
//         target.style.backgroundColor = '#00FF00';
//         target.dataset.state == 'booked';
//         target.style.pointerEvents = 'none';

//         let cartItem = {
//           ...Storage.getSeats(id),
//           amount: 1
//         };

//         cart = [...cart, cartItem];

//         Storage.saveCart(cart);

//         this.setCartValues(cart);

//         this.addTicket(cartItem);

//         this.showCart();
//       });
//     });
//   }

//   // addSeatIntoCart() {
//   // }

//   setCartValues(cart) {
//     let tempTotal = 0;
//     let servicesTotal = 0;
//     cart.map(item => {
//       tempTotal += item.price;
//       servicesTotal += item.price * 0.1;
//     });
//     this.elements.cartTotal.innerText = tempTotal + servicesTotal;
//     this.elements.ticketPrice.innerText = tempTotal;
//     this.elements.ticketTotal.innerText = `${cart.length}`;
//     this.elements.ticketService.innerText = servicesTotal;
//   }

//   addTicket(item) {
//     const i = document.createElement('i');
//     i.classList.add('fas', 'fa-times', 'exit-icon');
//     i.dataset.id = item.id;
//     const div = document.createElement('div');
//     div.classList.add('payment-ticket-item', 'animate__animated', 'animate__backInRight');
//     div.innerHTML = `
//   <div class="payment-ticket-item-title">
//         ПАРТЕР
//        </div>
//        <div class="payment-ticket-item-info">
//        <div class="payment-ticket-item-info-wrap">
//         <span class="payment-ticket-item-place">Место: ${item.humanizedPosition.place}</span>
//         <span class="payment-ticket-item-row">Ряд: ${item.humanizedPosition.row}</span>
//        </div>
//         <div class="payment-ticket-item-info-price">
//          ${item.price} грн
//         </div>
//        </div>
//   `
//     const ticketItem = this.elements.ticketsWrap.appendChild(div);
//     ticketItem.append(i);
//       i.addEventListener('click', (e) => {
//         const target = e.target;
//         let id = target.dataset.id;
//         target.parentElement.remove();
//       })

//   }

//   showCart() {
//     this.elements.mainPayment.style.display = 'none';
//   }


//   getSingleItem(id) {
//     return seatsDOM.find(seat => seat.dataset.id === id);
//   }
// }

// class Storage {
//   static saveSeats(seats) {
//     localStorage.setItem('seats', JSON.stringify(seats));
//   }

//   static getSeats(id) {
//     let seats = JSON.parse(localStorage.getItem('seats'));
//     return seats.find(seat => seat.id == id);
//   }

//   static saveCart(cart) {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }

//   static getCart() {
//     return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const seats = new Seats();
//   const ui = new UI({
//     seatsWrap: '.tickets__wrap-block-first',
//     ticketsWrap: '.payment-ticket-item-wrap',
//     mainPayment: '.main__payment-reminders',
//     cartTotal: '.main__payment-item-tickets-total',
//     ticketTotal: '.main__payment-ticket-total',
//     ticketPrice: '.main__payment-item-tickets',
//     ticketService: '.main__payment-item-tickets-services',
//     ticketDelete: '.exit-icon',
//   }
//   );
//   // ui.setupApp();

//   seats.loadSeats().then(seats => {
//     ui.displaySeats(seats);
//     Storage.saveSeats(seats);
//     //  ui.addSeatIntoCart();
//   }).then(() => {
//     // ui.addClickListenerThatRemovesCartItem();
//   })

//   window.startQuestionsModule();
// });