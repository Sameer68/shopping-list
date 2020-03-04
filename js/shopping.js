"use strict";

(() => {
  const listElement = document.getElementById('shopping');
  const newInput = document.getElementById('newItem');
  const addBtn = document.getElementById('addBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Add an item to the list
  function addItem(item) {
    if(!item) return;
    const itemElement = document.createElement('li');
    itemElement.textContent = item;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    itemElement.appendChild(deleteButton);
    deleteButton.addEventListener('click', ev => {
      listElement.removeChild(itemElement);
      save();
    });
    listElement.appendChild(itemElement);
  };

  // populate the list from an array
  function addList(list) {
    list.forEach(addItem);
  }

  // Clear the list
  function clearList() {
    while(listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
  }

  function save() {
    const items = [...listElement.childNodes];
    if(items.length) {
      const list = items.map(item => {
        return item.textContent.slice(0, -1);
      });
      localStorage.setItem('shopping-list', list);
    } else {
      localStorage.removeItem('shopping-list');
    }
  }

  function load() {
    const shoppingList = localStorage.getItem('shopping-list');
    if(shoppingList) {
      addList(shoppingList.split(','));
    }
  }

  // Add button
  addBtn.addEventListener('click', ev => {
    addList(newInput.value.split(','));
    newInput.value = null;
    save();
  });

  // submit on enter
  newInput.addEventListener("keyup", ev => {
    if (ev.key === "Enter") {
      addBtn.click();
    }
  });

  // Clear button
  clearBtn.addEventListener('click', ev => {
    clearList();
    save();
  });

  // Saving data for later use
  window.addEventListener('beforeunload', save);

  // Loading data from local storage
  window.addEventListener('DOMContentLoaded', load);

  window.addEventListener('storage', ev => {
    if(ev.key == "shopping-list") {
      clearList();
      load();
    }
  })

})();
