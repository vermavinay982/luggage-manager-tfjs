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

[Frontend Script]
// ENABLING USER TO PRESS ENTER TO ADD RECORD
// ADDING CROSS BUTTON TO EVERY ELEMENT IN LIST 
// ADDING CHECK BUTTON TO EVERY ELEMENT IN LIST, WHEN CLICKED 
// FUNCTIONALITY OF CLOSE BUTTON, TO HIDE CURRENT LIST ITEM
// CREATE A NEW LIST ITEM, WHEN "ADD" BUTTON CLICKED
// FUNCTION TO ACCESS ADD ELEMENT
// REMOVING REDUNDANCE, ADDING ONLY IF NOT PRESENT ALREADY

[ML Script]
// LINK TO YOUR MODE, PROVIDED BY TEACHABLE MACHINE EXPORT PANEL
// MAIN PROCESSING LOOP
// INITIALIZING MODEL, LOADING THE WEBCAM
// RUN THE IMAGE THROUGH THE MODEL
// ACTION AFTER PREDICTION

*/

/////////////////////////[Frontend Script]////////////////////////////
const allItems = new Set([])

// ENABLING USER TO PRESS ENTER TO ADD RECORD
const elem = document.getElementById("myInput");
elem.addEventListener("keypress", (event)=> {
    // addElement(`${event.key}`);
    if (event.key === "Enter") { // key code of the keybord key
      event.preventDefault();
      newElement();
    }
  });
  
// ADDING CROSS BUTTON TO EVERY ELEMENT IN LIST 
var myNodelist = document.getElementsByTagName("li");
var i;
var itemName;
for (i = 0; i < myNodelist.length; i++) {
  itemName = myNodelist[i].innerText
  allItems.add(itemName);

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

// FUNCTIONALITY OF CLOSE BUTTON, TO HIDE CURRENT LIST ITEM
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// CREATE A NEW LIST ITEM, WHEN "ADD" BUTTON CLICKED
function addElement(inputValue) {
  var li = document.createElement("li");
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if (inputValue === '') {
    // alert("You must write something!");
    document.getElementById("myInput").placeholder = "Write Here Bro!";
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

//capitalize only the first letter of the string. 
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var added = false
// FUNCTION TO ACCESS ADD ELEMENT
function newElement() {
  var inputValue = document.getElementById("myInput").value;
  console.log('Your Input is "',inputValue,'"');

  added = addElementOnce(inputValue);

  if (!added){
    document.getElementById("myInput").placeholder = "Already Added!";
    document.getElementById("myInput").value = "";
  }
}

// REMOVING REDUNDANCE, ADDING ONLY IF NOT PRESENT ALREADY
function addElementOnce(inputValue){
  inputValue = capitalizeFirstLetter(inputValue);
  if (!allItems.has(inputValue)) { 
    allItems.add(inputValue);
    addElement(inputValue);
    console.log('Adding Item',inputValue);
    return true;
  } else {
    console.log('Item Already Present',inputValue)
    return false;
  }
}

function downloadTextFile(text, filename) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function download_data(){
  var text = '';
  var itemArray = Array.from(allItems);
  let item;

  console.log("[[Showing the DATA Saved]]")
  for(let i=0;i<itemArray.length;i++){
    item = itemArray[i]
    text += `${i+1}. ${item}\n`;
  }

  console.log(text)
  downloadTextFile(text, 'My_Items.txt');
}
/////////////////////////[ML Script]////////////////////////////

// LINK TO YOUR MODE, PROVIDED BY TEACHABLE MACHINE EXPORT PANEL
// const URL = "https://teachablemachine.withgoogle.com/models/hBKYa4zJe/"; //Mask Model
const URL = "https://teachablemachine.withgoogle.com/models/PhQPhDmko/"; // Inventory Model

let model, webcam, labelContainer, maxPredictions;
let pred_class, pred_score;

// MAIN PROCESSING LOOP
async function loop() {
  webcam.update(); // FETCH THE NEW FRAME
  await predict(); // FETCH THE PREDICTION
  window.requestAnimationFrame(loop);
}

// INITIALIZING MODEL, LOADING THE WEBCAM
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    console.log('Please Wait! Loading the Model')
    // LOADING MODEL AND METADATA
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log('Model Loaded')

    console.log('Loading Webcam')
    // CONVENIENCE FUNCTION TO SETUP WEBCAM
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    console.log('Webcam Loaded')

    window.requestAnimationFrame(loop);

    // REMOVE START BUTTON, ONCE THE MODEL IS LOADED
    document.getElementById("start_button").classList.add('removed');

    // APPEND ELEMENTS TO DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { 
        // CREATING DIMS AS PER CLASSES
        labelContainer.appendChild(document.createElement("div"));
    }
}


// RUN THE IMAGE THROUGH THE MODEL
async function predict() {
    // PREDICT CAN ACCEPT (IMAGE, VIDEO, CANVAS HTML ELEMENT)
    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
        pred_class = prediction[i].className
        pred_score = prediction[i].probability.toFixed(2)
        const classPrediction = pred_class + ": " + pred_score;
        console.log(classPrediction)

        action(pred_class, pred_score);

        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// ACTION AFTER PREDICTION
function action(pred_class, pred_score){
  if (pred_score>0.9){
    addElementOnce(pred_class);
  }
}
