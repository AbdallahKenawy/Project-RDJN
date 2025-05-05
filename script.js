  function isMobile() {
      return window.innerWidth <= 768;
    }
    
  
  function checkMobile() {
    if (isMobile()) {
      console.log("User is on a mobile device");
    } else {
      console.log("User is not on a mobile device");
    }
  }
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
  document.getElementById("mySidenav").style.width = "200px";
  document.getElementById("shadow").style.display = 'block';
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("shadow").style.display = 'none';
}

let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();

  const calendarContainer = document.getElementById('calendar');
  const calendarTitle = document.getElementById('calendar-title');
  const contentContainer = document.getElementById('content');
  const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ]

  const clickableDates = [
    '15/02/2024','20/02/2024','22/02/2024','26/02/2024','28/02/2024','01/03/2024',
    ];

  function generateCalendar(year, month) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const monthinfrench=mois[month];
      calendarTitle.textContent = `${monthinfrench} ${year}`;

      let html = '<table>';
      html += '<tr><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th><th>Dim</th></tr><tr>';

      // Empty cells before the first day
      for (let i = 1; i < firstDay; i++) {
          html += '<td></td>';
      }

      // Fill in the days
      for (let day = 1; day <=daysInMonth; day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0); // Set time to midnight to avoid timezone issues
        const dateString = date.toLocaleDateString('fr-FR');
        const isToday = isSameDay(date, new Date());
        const isClickable = clickableDates.includes(dateString); // Check if the date is in clickableDates
    
        const classList = [];
        if (isToday) classList.push('today');
        if (isClickable) classList.push('clickable');
    
        html += `<td class="${classList.join(' ')}" data-date="${dateString}">
                    ${day}
                </td>`;
    
        if ((firstDay + day-1) % 7 === 0 || day === daysInMonth) {
            html += '</tr><tr>';
        }
    }

      html += '</tr></table>';
      calendarContainer.innerHTML = html;

      const clickableDays = document.querySelectorAll('.clickable');
      clickableDays.forEach(day => {
          day.addEventListener('click', function () {
              const divId = `content-${this.getAttribute('data-date')}`;
              const contentDiv = document.getElementById(divId);
              if (contentDiv) {
                  contentDiv.scrollIntoView({ behavior: 'smooth' });
              }
          });
      });
  }

  function isSameDay(date1, date2) {
      return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
      );
  }

  generateCalendar(currYear, currMonth);

  document.querySelectorAll(".calendarheader span").forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        generateCalendar(currYear,currMonth); // calling renderCalendar function
    });
});

function navigateToPole(poleId) {
  var url = 'poles/' + poleId + '.html'; // Construct the URL
  window.location.href = url; // Navigate to the URL
}

// Step 1: Get today's date and format it for comparison
const today = new Date();
today.setHours(0, 0, 0, 0); // Ignore time part for comparison

// Step 2: Select all event elements
const eventElements = document.querySelectorAll('.evenement');

// Step 3 and 4: Loop through each event element, parse its date, and compare
eventElements.forEach((element) => {
  // Assuming the date format in the id is DD/MM/YYYY
  const elementDateStr = element.id.split('-')[1]; // Extract the date part
  const [day, month, year] = elementDateStr.split('/');
  const elementDate = new Date(year, month - 1, day); // Months are 0-indexed in JavaScript Date
  
  // Step 5: Replace content if the event date is after today
  if (elementDate > today) {
    element.querySelector('H1').innerHTML = '???';
    element.querySelector('p').innerHTML='???????'
  }
});







