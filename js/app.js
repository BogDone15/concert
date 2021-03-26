const priceWrap = document.querySelector('.main__price-wrap');
const hidePrice = document.querySelector('.hide__price');
const mainPriceBefore = document.querySelector('.main__price');

priceWrap.addEventListener('click', () => {
  hidePrice.classList.toggle('active');
  mainPriceBefore.classList.toggle('rotate');
});

let cart = [];

class Seats {
  constructor() {
    this._renderer = new SeatsRenderer(this);
  }
  
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
    this._renderer.render();
  }

  get() {

    return this._seats;
  }

  changeState(id, state) {
    const seat = this._seats.find(seat => seat.id == id);
    seat.state = state;
    this._renderer._renderCorrectSeat(seat);
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
    this._arrangeBtn = document.querySelector('.payment__button');
    this._seatDOMsById = {};
  }
  
  render() {
    const seats = this._model.get();

    const seatsDomElements = seats.map(seat => {
      return this._renderSeat(seat);
    });

    seatsDomElements.forEach(element => {
      this._seatsWrapper.appendChild(element);
    });
  }

  _renderCorrectSeat(seat) {

    const renderResumeSeat = this._renderSeat(seat);
    this._seatsWrapper.appendChild(renderResumeSeat);
  }

  _renderSeat(seat) {
    const wrapper = this._seatDOMsById[seat.id] || document.createElement('div');
    wrapper.innerHTML = '';
    wrapper.classList.add('tickets__item');
    wrapper.dataset.state = `${seat.state}`;
    wrapper.style.cssText = `
    background-color: ${seat.color};
    left: ${seat.imagePosition.x}px;
    top: ${seat.imagePosition.y}px;
    `;
    this._arrangeBtn.disabled = true;

    this._seatDOMsById[seat.id] = wrapper;

    if (wrapper.dataset.state == 'booked') {
      wrapper.style.pointerEvents = 'none';
      wrapper.style.backgroundColor = 'gray';
    } else if (wrapper.dataset.state == 'available') {
      wrapper.style.pointerEvents = 'auto';
      wrapper.classList.remove('booked');
    }

    wrapper.addEventListener('click', e => {
      const cartItem = {
        id: `${(Math.random() * 1e8).toFixed()}`,
        seatId: seat.id,
        seat: seat
      };

      cart = [...cart, cartItem];

      this._addSeatIntoCart(cartItem);
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
      const removeItem = e.target;
      const id = item.id;
      removeItem.parentElement.remove();
      this._removeItem(id);

      this._model.changeState(item.seatId, 'available');
    });

    this._mainPayment.style.display = 'none';

    if (cart.length >= 1) this._arrangeBtn.disabled = false;
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
    cart = cart.filter(item => item.id != id);
    this._setCartValues(cart);

    cart.length >= 1 ? this._mainPayment.style.display = 'none' : this._mainPayment.style.display = 'block';
    cart.length >= 1 ? this._arrangeBtn.disabled = true : this._arrangeBtn.disabled = false;
  }
}

const seats = new Seats();

seats.loadSeats();