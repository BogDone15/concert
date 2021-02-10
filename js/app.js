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
  ticketItem
 }) {
  this.elements = {
   seatsWrap: document.querySelector(seatsWrap),
   ticketsWrap: document.querySelector(ticketsWrap),
   mainPayment: document.querySelector(mainPayment),
   ticketItem: document.querySelector(ticketItem),
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
 }

 getSeat() {
  const seats = [...document.querySelectorAll('.tickets__item')];
  seatsDOM = seats;
  seats.forEach(seat => {
   let id = seat.dataset.id;
   seat.addEventListener('click', e => {

    const target = e.target;
    target.style.backgroundColor = '#00FF00';
    target.dataset.state == 'booked';
    if (target.dataset.state == 'booked') {
     target.style.backgroundColor = 'gray';
    }

    let cartItem = {...Storage.getSeats(id)};
    
    cart = [...cart, cartItem];

    Storage.saveCart(cart);

    this.addTicket(cartItem);

    this.showCart();

   });
   seat.addEventListener('mouseenter', e => {
    if (e.target.dataset.state == 'available') {
     e.target.style.transform = 'scale(1.1)';
    }
   });

   seat.addEventListener('mouseleave', e => {
    if (e.target.dataset.state == 'available') {
     e.target.style.transform = 'scale(1)';
    }
   });
  });
 }

 addTicket(item) {
  const div = document.createElement('div');
  div.classList.add('payment-ticket-item');
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
  this.elements.ticketsWrap.appendChild(div);
 }

 showCart() {
   this.elements.mainPayment.style.display = 'none';   
   this.elements.ticketItem.style.transform = 'translateX(0)';
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
}

const seats = new Seats();
const ui = new UI({
 seatsWrap: '.tickets__wrap-block-first',
 ticketsWrap: '.payment-ticket-item-wrap',
 mainPayment: '.main__payment-reminders',
 ticketItem: '.payment-ticket-item',
});


seats.getSeats().then(seats => {
 ui.displaySeats(seats);
 Storage.saveSeats(seats);
}).then(() => {
 ui.getSeat();
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