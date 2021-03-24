const priceWrap = document.querySelector('.main__price-wrap');
const hidePrice = document.querySelector('.hide__price');
const mainPriceBefore = document.querySelector('.main__price');

priceWrap.addEventListener('click', () => {
  hidePrice.classList.toggle('active');
  mainPriceBefore.classList.toggle('rotate');
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
        price,
        color
      } = seat;
      return {
        id,
        state,
        priceGroup,
        imagePosition,
        humanizedPosition,
        price,
        color
      };
    });

    this._seats = seats;
  }

  get() {

    return this._seats;
  }

  // getSeat(id) {

  //   return this._seats.find(seat => seat.id == id);
  // }
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
    wrapper.style.cssText = `
    background-color: ${seat.color};
    left: ${seat.imagePosition.x}px;
    top: ${seat.imagePosition.y}px;
    `;

    if (wrapper.dataset.state == 'booked') {
      wrapper.style.pointerEvents = 'none';
      wrapper.style.backgroundColor = 'gray';
    }

    wrapper.addEventListener('click', e => {
      const cartItem = {
        id: `${(Math.random() * 1e8).toFixed()}`,
        seatId: seat.id,
        seat: seat
     };

      cart = [...cart, cartItem];
      // Storage.saveCart(cart);

      this._addSeatIntoCart(cartItem);
     console.log(cart);
      e.target.dataset.state = 'booked';
      e.target.classList.add('booked');
      this._setCartValues(cart);
    });

    return wrapper;
  }

  _addSeatIntoCart(item) {
    const button = document.createElement('i');
    button.classList.add('fas', 'fa-times', 'exit-icon');
    const element = document.createElement('div');
    element.classList.add('payment-ticket-item', 'animate__animated', 'animate__backInRight');
    element.innerHTML = `
      <div class="payment-ticket-item-title">
            ПАРТЕР
           </div>
           <div class="payment-ticket-item-info">
           <div class="payment-ticket-item-info-wrap">
            <span class="payment-ticket-item-place">Место: ${item.seat.humanizedPosition.place}</span>
            <span class="payment-ticket-item-row">Ряд: ${item.seat.humanizedPosition.row}</span>
           </div>
            <div class="payment-ticket-item-info-price">
             ${item.seat.price} грн
            </div>
           </div>
      `
    const ticketItem = this._ticketsWrap.appendChild(element);
    ticketItem.append(button);

    button.addEventListener('click', e => {
      // debugger;
      const removeItem = e.target;
      const id = item.id;
      console.log(id);
      removeItem.parentElement.remove();
      this._removeItem(id);
    });
    
    this._mainPayment.style.display = 'none';
  }

  _setCartValues(cart) {
    let tempTotal = 0;
    let servicesTotal = 0;
    cart.map(item => {
      tempTotal += item.seat.price;
      servicesTotal += item.seat.price * 0.1;
    });
    this._cartTotal.innerText = tempTotal + servicesTotal;
    this._ticketPrice.innerText = tempTotal;
    this._ticketTotal.innerText = `${cart.length}`;
    this._ticketService.innerText = servicesTotal;
  }

  _removeItem(id) {
    // debugger;
    cart = cart.filter(item => item.id != id);
    // Storage.saveCart(cart);
    console.log(cart);
    this._setCartValues(cart);
    cart.length >=1 ? this._mainPayment.style.display = 'none' : this._mainPayment.style.display = 'block';
  }
}

// class Storage {
//   static saveCart(cart) {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }
// }

const seats = new Seats();
const seatsRenderer = new SeatsRenderer(seats);

seats.loadSeats().then(seats => {
  seatsRenderer.render(seats);
});