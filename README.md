# shopping-list
A simple shopping list app for demonstrating local storage

## A basic template

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
