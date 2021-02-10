const priceWrap = document.querySelector('.main__price-wrap');
const hidePrice = document.querySelector('.hide__price');
const ticketsWrap = document.querySelector('.tickets__wrap');

priceWrap.addEventListener('click', () => {
 hidePrice.classList.toggle('active');
});

class Tickets {
 async getTickets() {
  try {
   let result = await fetch('tickets.json');
   let data = await result.json();
   let tickets = data.placesMap;
   tickets = tickets.map(ticket => {
    const { id } = ticket.sys;
    const { state } = ticket.free;
    const { priceGroup } = ticket.group;
    const { imagePosition, humanizedPosition } = ticket.fields;
    // const { imagePosition } = ticket.fields.imagePosition;
    // const { humanizedPosition } = ticket.fields.humanizedPosition;
    return { id, state, priceGroup, imagePosition, humanizedPosition };
   });
   return tickets;
   
  } catch (error) {
   console.log(error);
  }
 }
}

class UI {
 displayTickets(tickets) {
  let result = "";
  tickets.forEach(ticket => {
   result += `
   <div class="tickets__wrap-block-first">
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
   <div style="background-color: ${ticket.state = booked ? gray : green};top: ${imagePosition.x}px;left: ${imagePosition.y}px" class="tickets__item" data-id=${ticket.id}></div>
  </div>
   `
   
  });
  ticketsWrap.innerHTML = result;
 }

}

const tickets = new Tickets();
const ui = new UI();

tickets.getTickets().then(tickets => {
 ui.displayTickets(tickets);
 // console.log(tickets);
})




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