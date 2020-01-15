(() => {
  const listElement = document.getElementById('shopping');
  const addButton = document.getElementById('add');
  const clearButton = document.getElementById('clear');

  // Add an item to the list
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

  // populate the list from an array
  function renderList(list) {
    list.forEach(item => {
      addItem(item);
    });
  }

  // Clear the list
  function clearList() {
    while(listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
  }

  // Add button
  addButton.addEventListener('click', ev => {
    const InputElement = document.getElementById('new-item');
    if(InputElement.value) {
      InputElement.value.split(',').forEach(v => {
        addItem(v);
      });
      InputElement.value = null;
    }
  });

  // submit on enter
  document.getElementById('new-item').addEventListener("keyup", ev => {
    if (ev.keyCode === 13) {
      addButton.click();
    }
  });

  // Clear button
  clearButton.addEventListener('click', ev => {
    clearList();
  });

  // Saving data for later use
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

  // Loading data from local storage
  window.addEventListener('DOMContentLoaded', ev => {
    const shoppingList = localStorage.getItem('shopping-list');
    if(shoppingList) {
      renderList(shoppingList.split(','));
    }
  });

})();
