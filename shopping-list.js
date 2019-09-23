// our data
let shoppingList;

// Get some references to the DOM
let listElement = document.getElementById('shopping-list');
let itemInput = document.getElementById('new-item');
let submitButton = document.getElementById('submit');
let clearButton = document.getElementById('clear');
let saveButton = document.getElementById('save');
let revertButton = document.getElementById('revert');

// We build the DOM for the shopping list by creating an element for each item
let renderList = (list) => {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
  list.forEach(renderItem);
};

// Each element in the list contains a span with the item as text and a delete button
let renderItem = (item, index) => {

  // create the DOM elements <li><span>item</span><button>x</button></li>
  let listItem = document.createElement('li');
  let listText = document.createElement('span');
  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  listText.textContent = `${item} `;
  listItem.appendChild(listText);
  listItem.appendChild(deleteButton);

  // This is a closure, the index value is accessed from the enclosing scope
  // It adds a unique event listener to each button
  // so each button deletes the correct item
  deleteButton.addEventListener('click', ev => {
    shoppingList.splice(index, 1);
    renderList(shoppingList);
  });

  // Append the new elements to the DOM
  listElement.appendChild(listItem);
};

// take the value from our input
let newItem = (ev) => {
  shoppingList = shoppingList.concat(itemInput.value.split(',')); // add the new value to the list
  itemInput.value = null;            // clear the input ready for another value
  renderList(shoppingList);          // rebuild the DOM from the new list
};

// clear the list and rebuild the DOM
let clearList = () => {
  shoppingList = [];
  renderList(shoppingList);
};

// Get our data from local storage
let loadFromStorage = () => {
  shoppingList = localStorage.getItem('shopping-list');
  if(shoppingList) {
    // data are stored as a comma-separated string so need to be split
    shoppingList = shoppingList.split(',');
  } else {
    shoppingList = [];
  }
  renderList(shoppingList);
};

// Save our data or clear from local storage if the list is empty
let saveToStorage = () => {
  if(shoppingList.length) {
    localStorage.setItem('shopping-list', shoppingList);
  } else {
    localStorage.removeItem('shopping-list');
  }
};

// event listeners for main buttons
clearButton.addEventListener('click', clearList);
submitButton.addEventListener('click', newItem);
saveButton.addEventListener('click', saveToStorage);
revertButton.addEventListener('click', loadFromStorage);

// initialise the list by loading in any data from local storage
loadFromStorage();
