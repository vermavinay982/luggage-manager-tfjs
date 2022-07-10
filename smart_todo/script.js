/*
write add functionality
  - add new value clicking add button
  - add new value pressing enter key
  - warn user if no value entered
write remove functionality
  - when cross button is clicked
write checked functionality
write editing functionality (not required as of now)
write re-ordering functionality (not required as of now)


*/

// ENABLING USER TO PRESS ENTER TO ADD RECORD
const elem = document.getElementById("myInput");
elem.addEventListener("keypress", (event)=> {
    // addElement(`${event.key}`);
    if (event.key === "Enter") { // key code of the keybord key
      // event.preventDefault();
      newElement();
    }
  });
  
  
// ADDING CROSS BUTTON TO EVERY ELEMENT IN LIST 
var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// ADDING CHECK BUTTON TO EVERY ELEMENT IN LIST, WHEN CLICKED 
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Function of close button, to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Create a new list item when clicking on the "Add" button
function addElement(inputValue) {
  var li = document.createElement("li");
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if (inputValue === '') {
    // alert("You must write something!");
    document.getElementById("myInput").placeholder = "Write Here Bro !!";
  } else {
    document.getElementById("myUL").appendChild(li);
    document.getElementById("myInput").placeholder = "Title...";
    document.getElementById("myInput").value = "";
  }

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementById("myInput").value;
  console.log('Your Input is ',inputValue);
  addElement(inputValue);
}

