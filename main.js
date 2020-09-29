// Initialize Firebase (ADD YOUR OWN DATA)
var config = {
  apiKey: "AIzaSyBO9QueJL21b8oh4w_BoIp4PJXm1tup3LA",
  authDomain: "eventspage-6bfe2.firebaseapp.com",
  databaseURL: "https://eventspage-6bfe2.firebaseio.com",
  projectId: "eventspage-6bfe2",
  storageBucket: "eventspage-6bfe2.appspot.com",
  messagingSenderId: "930597125548"
};
firebase.initializeApp(config);

// Reference messages collection
var messagesRef = firebase.database().ref().child('messages');

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var eventTitle = getInputVal('eventTitle');
  var date = getInputVal('date');
  var time = getInputVal('time');
  var playerFill = getInputVal('playerFill');
  var experimentalIndex = getInputVal('experimentalIndex');
  var gamemode = getInputVal('gamemode');
  var gameType = getInputVal('gameType');
  var teamSize = getInputVal('teamSize');
  var scenarios = task_array.toString();
  var message = getInputVal('message');

  // Save message
  saveMessage(name, eventTitle, date, time, playerFill, experimentalIndex, gamemode, gameType, teamSize, scenarios, message);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('contactForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, eventTitle, date, time, playerFill, experimentalIndex, gamemode, gameType, teamSize, scenarios, message){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    name: name,
    eventTitle:eventTitle,
    date:date,
    time:time,
    playerFill:playerFill,
    experimentalIndex:experimentalIndex,
    gamemode:gamemode,
    gameType:gameType,
    teamSize:teamSize,
    scenarios:scenarios,
    message:message
  });
}

const search = document.getElementsByClassName('search')[0];
const matchList = document.getElementById('match-list');
const taskData = document.getElementById('task_description');

const scenarioDescription = async displayText => {
  const res = await fetch('scenarios.json');
  const scenarios = await res.json();

  let matches = scenarios.filter(scenario => {
    const regex = new RegExp(`^${displayText}`)
    return scenario.description.match(regex);
  });
  outputScenarios(taskData);
}

const outputScenarios = matches => {
  if(matches.length > 0) {
    const html = matches.map(match => `
      <p>${match.description}</p>
    `)
    .join('');

    taskData.innerHTML = html;
  }
}

// Searches scenario.sjson and filters it
const searchScenarios = async searchText => {
  const res = await fetch('scenarios.json');
  const scenarios = await res.json();

  // Get matches to current text input
  let matches = scenarios.filter(scenario => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return scenario.name.match(regex);
  });

  if(searchText.length == 0) {
    matches = [];
    $("#match-list").fadeOut("slow", function() {});
  }

  if(searchText.length > 0) {
    $("#match-list").fadeIn("slow", function() {});
  }

  outputHtml(matches); 
};

// Show results in HTML
const outputHtml = matches => {
  if(matches.length > 0) {
    const html = matches.map(match => `
      <a class="card card-body mb-1 onclick="newElement()">
        <h4>${match.name}</h4>
        <small>${match.description}</small>   
      </a>
    `)
    .join('');

    matchList.innerHTML = html;
  }
}

search.addEventListener('input', () => searchScenarios(search.value));
search.addEventListener('input', () => scenarioDescription(search.value));

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [] };

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  addItem(e) {
    // Prevent button click from submitting form
    e.preventDefault();

    // Create variables for our list, the item to add, and our form
    let list = this.state.list;
    const newItem = document.getElementsByClassName("addInput")[0];
    const form = document.getElementById("addItemForm");

    // If our input has a value
    if (newItem.value != "") {
      // Add the new item to the end of our list array
      list.push(newItem.value);
      // Then we use that to set the state for list
      this.setState({
        list: list });

      // Finally, we need to reset the form
      newItem.classList.remove("is-danger");
      form.reset();
    } else {
      // If the input doesn't have a value, make the border red since it's required
      newItem.classList.add("is-danger");
    }
  }

  removeItem(item) {
    // Put our list into an array
    const list = this.state.list.slice();
    // Check to see if item passed in matches item in array
    list.some((el, i) => {
      if (el === item) {
        // If item matches, remove it from array
        list.splice(i, 1);
        return true;
      }
    });
    // Set state to list
    this.setState({
      list: list });

  }
  
  render() {
    return (
      React.createElement("div", { className: "content" },
      React.createElement("div", { className: "container" },
      React.createElement("section", { className: "section" },
      React.createElement(List, { items: this.state.list, delete: this.removeItem })),
      React.createElement("form", { className: "form", id: "addItemForm" },
      React.createElement("input", {
        name: "scenarios",
        placeholder: "Something that needs to be done..." }),

      React.createElement("button", { className: "button is-info", onClick: this.addItem }, "Add Item")))));
  
  }}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [] };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      filtered: this.props.items });

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filtered: nextProps.items });

  }

  handleChange(e) {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      // Assign the original list to currentList
      currentList = this.props.items;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
    } else {
      // If the search bar is empty, set newList to original task list
      newList = this.props.items;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList });

  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("ul",
      this.state.filtered.map((item) =>
      React.createElement("li", { key: item },
      item, " \xA0",
      React.createElement("span", {
        className: "delete",
        onClick: () => this.props.delete(item) }))))));
  }}


var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  matchList.innerHTML = '';
  var li = document.createElement("li");
  li.id = "scenarios";
  var inputValue = document.getElementsByClassName("myInput")[0].value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementsByClassName("myUL")[0].appendChild(li);
  }
  document.getElementsByClassName("myInput")[0].value = "";

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

function add_task(){
  input_box = document.getElementById("input_box");
  if(input_box.value.length != 0){
    // our boxes have data and we take database
    var key = firebase.database().ref().child("unfinished_task").push().key;
    var task = {
      title: search.value
    };

    var updates = {};
    updates["/unfinished_task/" + key] = task;
    firebase.database().ref().update(updates);
    create_unfinished_task();
  }
}

function create_unfinished_task(){
  unfinished_task_container = document.getElementsByClassName("container-tasks")[0];
  unfinished_task_container.innerHTML = "";

  task_array = [];
  firebase.database().ref("unfinished_task").once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      task_array.push(Object.values(childData));
    });

    for(var i, i = 0; i < task_array.length; i++){
      task_title = task_array[i][0];
      var key = firebase.database().ref().child("unfinished_task").key;

      task_container = document.createElement("div");
      task_container.setAttribute("class", "task_container");
      task_container.setAttribute("data-key", key);

      // TASK DATA
      task_data = document.createElement('div');
      task_data.setAttribute('id', 'task_data');

      title = document.createElement('p');
      title.setAttribute('class', 'task_title');
      title.setAttribute('id', 'task_title');
      title.setAttribute('contenteditable', false);
      title.innerHTML = task_title;

      //description = document.createElement('p');
      //description.setAttribute('id', 'task_description');
      //description.setAttribute('contenteditable', false);
      //description.innerHTML = task_description;

      // TASK TOOLS
      task_tool = document.createElement('div');
      task_tool.setAttribute('id', 'task_tool');

      task_delete_button = document.createElement('button');
      task_delete_button.setAttribute('id', 'task_delete_button');
      task_delete_button.setAttribute('onclick', "task_delete(this.parentElement.parentElement)");
      fa_delete = document.createElement('i');
      fa_delete.setAttribute('class', 'fa fa-trash');


      unfinished_task_container.append(task_container);
      task_container.append(task_data);
      task_data.append(title);

      task_container.append(task_tool);
      task_tool.append(task_delete_button);
      task_delete_button.append(fa_delete);
    }

  });

}
function create_finished_task(){

  finished_task_container = document.getElementsByClassName("container")[1];
  finished_task_container.innerHTML = "";

  finished_task_array = [];
  firebase.database().ref("finished_task").once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      finished_task_array.push(Object.values(childData));
    });
    for(var i, i = 0; i < finished_task_array.length; i++){
      task_key = finished_task_array[i][0];
      task_title = finished_task_array[i][1];

      task_container = document.createElement("div");
      task_container.setAttribute("class", "task_container");
      task_container.setAttribute("data-key", task_key);

      // TASK DATA
      task_data = document.createElement('div');
      task_data.setAttribute('id', 'task_data');

      title = document.createElement('p');
      title.setAttribute('id', 'task_title');
      title.setAttribute('contenteditable', false);
      title.innerHTML = task_title;

      // TASK TOOLS
      task_tool = document.createElement('div');
      task_tool.setAttribute('id', 'task_tool');

      task_delete_button = document.createElement('button');
      task_delete_button.setAttribute('id', 'task_delete_button');
      task_delete_button.setAttribute('onclick', "task_finished_delete(this.parentElement.parentElement)");
      fa_delete = document.createElement('i');
      fa_delete.setAttribute('class', 'fa fa-trash');

      finished_task_container.append(task_container);
      task_container.append(task_data);
      task_data.append(title);

      task_container.append(task_tool);
      task_tool.append(task_delete_button);
      task_delete_button.append(fa_delete);
    }

  });

}

function task_done(task, task_tool){
  finished_task_container = document.getElementsByClassName("container")[1];
  task.removeChild(task_tool);
  finished_task_container.append(task);

  var key = task.getAttribute("data-key");
  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[1].innerHTML,
    key: key
  };

  var updates = {};
  updates["/finished_task/" + key] = task_obj;
  firebase.database().ref().update(updates);

  // delete our task from unfinished
  task_delete(task);
  create_finished_task();
}

function task_edit(task, edit_button){
  edit_button.setAttribute("id", "task_edit_button_editing");
  edit_button.setAttribute("onclick", "finish_edit(this.parentElement.parentElement, this)");

  title = task.childNodes[0].childNodes[0];
  title.setAttribute("contenteditable", true);
  title.setAttribute("id", "title_editing");
  title.focus();

  date = task.childNodes[0].childNodes[1];
  date.setAttribute("contenteditable", true);
  date.setAttribute("id", "date_editing");

}
function finish_edit(task, edit_button){
  edit_button.setAttribute("id", "task_edit_button");
  edit_button.setAttribute("onclick", "task_edit(this.parentElement.parentElement, this)");

  title = task.childNodes[0].childNodes[0];
  title.setAttribute("contenteditable", false);
  title.setAttribute("id", "task_title");

  date = task.childNodes[0].childNodes[1];
  date.setAttribute("contenteditable", false);
  date.setAttribute("id", "task_date");

  // change in firebase to
  var key = task.getAttribute("data-key");
  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[1].innerHTML,
    key: key
  };

  var updates = {};
  updates["/unfinished_task/" + key] = task_obj;
  firebase.database().ref().update(updates);

}

function task_delete(task){
  var key = firebase.database().ref().child("unfinished_task").key;
  task_to_remove = firebase.database().ref(key);
  task_to_remove.remove();

  // remove from html view or whatevesss
  task.remove();

}

function task_finished_delete(task){
  key = task.getAttribute("data-key");
  task_to_remove = firebase.database().ref("finished_task/" + key);
  task_to_remove.remove();

  // remove from html view or whatevesss
  task.remove();

}

function onSubmit() {
  task_delete(task);
}

