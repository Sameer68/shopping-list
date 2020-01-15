# Step by step guide to shopping list example

## Build a list

First we will get a very basic list working so we can add items to our list using javascript code.

We start with a blank template and add a single unordered list element (use an ordered list if you want numbering).
This element will become our shopping list.
The list is given the id `shopping` so we can select it by id.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopping list</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <ul id="shopping"></ul>
  <script src="js/scripts.js"></script>
</body>
</html>
```

## Adding items

Now in the linked file `js/shopping.js` we can get a handle to the list and write a simple function to add items to the list.

```Javascript
const listElement = document.getElementById('shopping');

function addItem(item) {
  const itemElement = document.createElement('li');
  itemElement.textContent = item;
  listElement.appendChild(itemElement);
};

```

We can add items by calling our function. Try this in the console.

```Javascript
addItem('rice');
addItem('pasta');
```

We can also add multiple items from an array using `Array.forEach`.

```Javascript
const list = ['rice', 'pasta', 'tea', 'coffee'];
list.forEach(item => {
  addItem(item);
});
```

## Clearing the list

We need a function to clear the entire list.
We could do this by replacing the content of the list element with an empty string.

```Javascript
function clearList() {
  listElement.innerHTML = "";
}
```

However, its more efficient to loop over the DOM and remove each element in turn.

```Javascript
function clearList() {
  while(listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
}
```

Calling this function in the console now clears the list as expected.

Finally, tidy up the whole lot by wrapping the list generation code in a reusable function.

```Javascript
function renderList(list) {
  list.forEach(item => {
    addItem(item);
  });
}
```

We will use this later to load data from local storage.

In your javascript file you should now have one variable declaration (`listElement`) and three functions (`addItem()`, `clearList()` and `renderList()`).

## Add some interaction

Now we have the tools to add items and clear the list, we need to build a simple user interface.
Add header and a footer elements before and after the list element.

In the header element add an input element and a button, in the footer element add a clear button as shown below.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopping list</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>Shopping list</h1>
    <input placeholder="new item" id="new-item">
    <button id="add">add</button>
  </header>
  <ul id="shopping"></ul>
  <footer>
    <button id="clear">clear</button>
  </footer>
  <script src="js/scripts.js"></script>
</body>
</html>
```

The input has a placeholder and id, the add button has an id and contains the text 'add'. The clear button has an id and contains the text 'clear'.

We need to create JavaScript handles to our buttons. Add these lines to the top of the file.

```Javascript
const addButton = document.getElementById('add');
const clearButton = document.getElementById('clear');
```

Now we can insert new elements in our list by adding an event listener to our 'add' button.

Our first version of the event listener can be added at the bottom of the file.

```Javascript
addButton.addEventListener('click', ev => {
  const InputElement = document.getElementById('new-item');
  addItem(InputElement.value);
})
```

Type some text into the input and click the add button. This works pretty well but it has some problems.

- What happens when the input is blank?
- What happens when we click the add button more than once?

We need to add a few lines of code to smooth out this interaction.

First, we check that the input has some text and only add the item if it does.

```Javascript
addButton.addEventListener('click', ev => {
  const InputElement = document.getElementById('new-item');
  if(InputElement.value) { //<- this
    addItem(InputElement.value);
  } //<- and this
})
```

Try it. No more blank entries in our list. Great. But we still add the same value multiple times when we click the button more than once.

So we clear the input by setting its value to `null` each time an item is successfully added to the list.

```Javascript
addButton.addEventListener('click', ev => {
  const InputElement = document.getElementById('new-item');
  if(InputElement.value) {
    addItem(InputElement.value);
    InputElement.value = null; //<- this
  }
})
```

To clear the whole list we add an event listener to the clear button.

```Javascript
clearButton.addEventListener('click', ev => {
  clearList();
});
```

## Removing individual items

The list is becoming useful but what if we make a mistake and want to remove an item from the list without starting from scratch?

We need a way to select an individual item for removal. For this, we need a button on each item. So we need to modify our `addItem` function.

```Javascript
function addItem(item) {
  const itemElement = document.createElement('li');
  itemElement.textContent = item;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  itemElement.appendChild(deleteButton);
  listElement.appendChild(itemElement);
};
```

We have created a new button for each element and appended it to the list item.
When we add new items, they now also contain a button.

We need this new button to delete the entire element. For this we use a closure.
We add an event listener to each button which removes the parent element from the list.

```Javascript
function addItem(item) {
  const itemElement = document.createElement('li');
  itemElement.textContent = item;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  itemElement.appendChild(deleteButton);
  deleteButton.addEventListener('click', ev => {
    listElement.removeChild(itemElement);
  });
  listElement.appendChild(itemElement);
};
```

## Saving the list

We now have a fairly functional shopping list app. The only problem is that if we close the page or reload it the list data is lost and we begin with a blank list each time.

We will load the list from local storage on opening the page and save the list back to local storage on closing the page.

First, we need to save the list to local storage.
We do this in an event listener we add to the window event handler [`onbeforeunload`][onbeforeunload] event.
This even will fire when the window is about to unload its resources in preparation to close the page.

```Javascript
window.addEventListener('beforeunload', ev => {
  const items = [...listElement.childNodes];
  if(items.length) {
    const list = items.map(item => {
      return item.textContent.slice(0, -1);
    });
    localStorage.setItem('shopping-list', list);
  } else {
    localStorage.removeItem('shopping-list');
  }
});

```

Here we are extracting our item data from the DOM.

First, we convert the list child nodes to an array using the spread operator. Then we check the length of the array. If the array is empty then we delete our local storage record.

If the list contains data then we extract the item text into an array using the [Array.prototype.map][Array.prototype.map] function. We call [Node.textContent][textContent] and [String.prototype.slice][String.prototype.slice] on each list element within the callback.

Our item text is contained within each list item element along with a delete button. Note that [Node.textContent][textContent] returns the concatenation of the [textContent][textContent] of every child node. So we get an extra 'x' from the delete button concatenated to the end of our string. We remove this with [String.prototype.slice][String.prototype.slice].

## Loading the list

With the list data from previous session stored in local storage we now just need to read these data back into the page when the page loads.

For this, we add an event listener to the window event handler [DOMContentLoaded][DOMContentLoaded] event. This event fires once the DOM is completely loaded so we can be sure the list element will be available.

```Javascript
window.addEventListener('DOMContentLoaded', ev => {
  const shoppingList = localStorage.getItem('shopping-list');
  if(shoppingList) {
    renderList(shoppingList.split(','));
  }
});
```

We extract the data from local storage as a comma-separated string. To convert this to an array we use the [String.prototype.split][String.prototype.split] method and pass the resultant array into our `renderList()` function.

Now the list will be remembered even if we close the page and open it again.

## Upgrade the interface

The list is nice and all but if you want to write a long list then you have to flip between using the keyboard to type and using the mouse to click. This is annoying and inefficient.

The following code adds a handler for the input element `keyup` event. The `keyup` event fires when a key is released.

```Javascript
document.getElementById('new-item').addEventListener("keyup", ev => {
  if (ev.keyCode === 13) {
    addButton.click();
  }
});
```

The handler is very simple. If the enter key (keyCode 13) is being released then we call `addButton.click()` to trigger the previously defined event handler for adding an item.

So now it is possible to add multiple items to the list without leaving the keyboard.

Another potential improvement is to allow comma-separated values to be entered into the input and separated out into items on the list.

To do this we can adjust the `addButton` event listener.

```Javascript
addButton.addEventListener('click', ev => {
  const InputElement = document.getElementById('new-item');
  if(InputElement.value) {
    InputElement.value.split(',').forEach(v => {
      addItem(v);
    });
    InputElement.value = null;
  }
});
```

Now the input value is split into an array of strings and each string is added to the list individually. Try this by entering multiple items separated by commas.

## Tidy up

Now we have a working system we will protect all our code inside a self-executing anonymous function.

```Javascript
(() => {
  // all existing code goes here
})()
```

This keeps all our variables cleanly outside of the global scope.

## Challenges

The shopping list app is now fairly functional. However, there are a few scenarios where it could be frustrating to work with and a few possible improvements.

### Multiple tabs

Think about what happens when the app is opened in two tabs simultaneously.

Try this:

1. Open the shopping list in a browser tab and add a few items

2. Open the shopping list in another tab, add a few more items and close the list.

3. Close the original tab.

4. Open the shopping list again.

What happened to your latest additions?

Try to implement an improvement to avoid this problem.

potential solutions:
 - allow a manual load/save option?
 - warn the user before editing the local storage?
 - work with the `storage` event?


### Multiple lists

If you have got this far then well done. This one is for experts only as it requires some fairly serious adaptations to the code. Though perhaps not as much as you might think.

Our list data are stored under the 'shopping-list' key in local storage.

Think about how you might allow for multiple shopping lists to be stored and managed.

What user interface changes would be required?

Try refactoring the code to allow the user to create and manage multiple named lists.

[Array.prototype.map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map "Array.prototype.map - MDN"

[String.prototype.split]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split "String.prototype.split - MDN"
[String.prototype.slice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice "String.prototype.slice - MDN"

[textContent]: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent "Node.textContent - MDN"
[onbeforeunload]: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload "beforeunload event - MDN"
[DOMContentLoaded]: https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event "DOMContentLoaded event - MDN"
