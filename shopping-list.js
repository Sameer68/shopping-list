// our data
let shoppingList;

// Get some references to the DOM
let listElement = document.getElementById('shopping-list');
let itemInput = document.getElementById('new-item');
let submitButton = document.getElementById('submit');
let clearButton = document.getElementById('clear');
let saveButton = document.getElementById('save');
let revertButton = document.getElementById('revert');

// We build the DOM by creating a list item for each of our data elements
let renderList = (list) => {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
  list.forEach(renderItem)
}

// Each element in the list contains a span with the item as text and a delete button
let renderItem = (item, index) => {
  let listItem = document.createElement('li');
  let listText = document.createElement('span');
  let deleteButton = document.createElement('button');
  listText.textContent = `${item} `;
  deleteButton.textContent = 'x';
  // This is a closure
  deleteButton.addEventListener('click', ev => {
    shoppingList.splice(index, 1);
    renderList(shoppingList);
  });
  listElement.appendChild(listItem);
  listItem.appendChild(listText);
  listItem.appendChild(deleteButton);
}

// take the value from our input
let newItem = (ev) => {
  shoppingList = shoppingList.concat(itemInput.value.split(',')) // add the new value to the list
  itemInput.value = null;            // clear the input ready for another value
  renderList(shoppingList);          // rebuild the DOM from the new list
}

// clear the list and rebuild the DOM
let clearList = () => {
  shoppingList = [];
  renderList(shoppingList);
}

// Get our data from local storage
let loadFromStorage = () => {
  shoppingList = localStorage.getItem('shopping-list');
  if(shoppingList) {
    shoppingList = shoppingList.split(','); // data are saved as a string so need to be split
  } else {
    shoppingList = [];
  }
  renderList(shoppingList);
}

// Save our data to local storage
let saveToStorage = () => {
  console.log(shoppingList.length);
  console.log(!!shoppingList.length);
  if(shoppingList.length) {
    localStorage.setItem('shopping-list', shoppingList);
  } else {
    localStorage.removeItem('shopping-list');
  }
}


clearButton.addEventListener('click', clearList);
submitButton.addEventListener('click', newItem);
saveButton.addEventListener('click', saveToStorage);
revertButton.addEventListener('click', loadFromStorage);

loadFromStorage();
