# shopping-list
A simple shopping list app for demonstrating local storage

## A basic HTML template

Begin with a basic HTML template.

```html

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Local storage</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <header>
      <h1>Shopping list</h1>
      <label for="new-item">New item</label> <input type="text" id="new-item">
      <button id="submit">add</button>
    </header>
    <ul id="shopping-list"></ul>
    <footer>
      <button id="clear">Clear all</button><br><br>
      <button id="save">Save</button>
      <button id="revert">Revert</button>
    </footer>
    <script src="shopping-list.js"></script>
  </body>
</html>

```

The template has a header, an unordered list and a footer.

The header contains a label, input and button.
This is the main input where the shopping list entries will be added.

The unordered list is where the shopping list entries will be displayed.
In each entry we will include a button to delete an individual entry.

The footer contains three buttons.
The "clear all" button will clear the list.
The "Save" and "Revert" buttons will control saving the list to local storage and replacing the list with the contents from local storage in the event of a mistake.

## Javascript


For the purposes of this project we are thinking of the problem in two steps.
First we need code to manage the list in memory as a javascript array, then we need to manage the list in local storage.

### A javascript array

Our shopping list will be stored in a simple javascript array of strings.
We can declare this up front to make sure it is available as an empty list.

```javascript
// our data
let shoppingList;
```

We also need to access a few of the DOM elements in our code so we will define some variables here.

```javascript

// Get some references to the DOM
let listElement = document.getElementById('shopping-list');
let itemInput = document.getElementById('new-item');
let submitButton = document.getElementById('submit');
let clearButton = document.getElementById('clear');
let saveButton = document.getElementById('save');
let revertButton = document.getElementById('revert');
```


#### Rendering the list

In order to render the list within the DOM we define the function `renderList`.

```javascript

// We build the DOM for the shopping list by creating an element for each item
let renderList = (list) => {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
  list.forEach(renderItem)
}

```

This function clears any child nodes from the DOM `listElement` and then calls `Array.prototype.forEach` on our array and passes another function `renderItem` as a callback. This function will be called once for each element in our array.

The `renderItem` function is where all the work is done.
It receives the array item (a string) and an index as inputs.

```javascript
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
}

```

It begins by creating the necessary DOM elements, an `li` to contain the entry, a `span` for the item text and a `button` for deleting the item from the list.

We add an `'x'` as the button text, the list entry itself as the span text and we compose these elements into the list item.

Then we do something a bit funky.
We add an event listener to the `deleteButton` 'click' event which removes the `shoppingList` item at the given index (using the `Array.prototype.splice` method) and calls `renderList` again to rebuild the list from scratch.

Finally, we add the newly created `listItem` into the `listElement` in the DOM.
So each item in the `shoppingList` array is rendered as something like this.

```HTML
<li><span>item text</span><button>x</button></li>`
```
With an event listener on the button click event which will remove the item from our array and rebuild the list.

#### Adding items to the list

Adding items to the list is relatively simple.

```javascript
// take the value from our input
let newItem = (ev) => {
  shoppingList = shoppingList.concat(itemInput.value.split(',')) // add the new value to the list
  itemInput.value = null;            // clear the input ready for another value
  renderList(shoppingList);          // rebuild the DOM from the new list
}

submitButton.addEventListener('click', newItem);
```

The `newItem` function is set as an event listener on the `submitButton` element.
When `submitButton` is clicked we take the contents of the `itemInput` element and call `String.prototype.split` on it to divide up any comma-separated values.
This creates an array of strings.
We then call `Array.prototype.concat` to concatenate this new array onto the end of the existing list.
We tidy up by clearing the contents of the input and then call `renderList` to rebuild our list against the newly extended array.


#### Clearing the list

We have seen how the `deleteButton` event listener handles deleting individual items.
Clearing the entire list is easy, we simply set the `shoppingList` variable to a blank array and call our familiar `renderList` function.

```javascript
// clear the list and rebuild the DOM
let clearList = () => {
  shoppingList = [];
  renderList(shoppingList);
}

clearButton.addEventListener('click', clearList);
```

### Local Storage

OK, so now we can finally start working with the local storage API.
We do this by defining two functions, `saveToStorage` and `loadFromStorage`.

#### Saving to local storage

We can save the list to local storage by calling the `localStorage.setItem` method.

```javascript

// Save our data or clear from local storage if the list is empty
let saveToStorage = () => {
  if(shoppingList.length) {
    localStorage.setItem('shopping-list', shoppingList);
  } else {
    localStorage.removeItem('shopping-list');
  }
}

saveButton.addEventListener('click', saveToStorage);
```

When saving to local storage the list is converted into a JSON string.
Note that if the list is empty, we have chosen to simply remove the `'shopping-list'` key using the `localStorage.removeItem` method.
This avoids us placing an empty string into local storage and keeps the loading code simple.

#### Loading from local storage

To load from storage we need to split the string back into an array of strings.
We do this as above using the `String.prototype.split` method.
If the stored key is empty then we can easily detect this and simply return an empty list.

```javascript

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
}

revertButton.addEventListener('click', loadFromStorage);
```
