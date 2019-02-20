'use strict';
var movedItems = [],
   movedItemsSavedCoord = [],
   startSelectedX,
   startSelectedY,
   selectedFrame,
   draggedItem,
   items,
   clickPoint;

document.onmousedown = function(event) {
   //нажатие на пкм не обрабатываем
   if (event.which !== 1) {
      return false;
   }

   startSelectedX = event.pageX;
   startSelectedY = event.pageY;
   selectedFrame.style.visibility = 'visible';

   var box = event.target.classList.contains('box') ? event.target : null;

   //всегда очищяем при лкм, кроме когда было нажатие на выделенный элемент
   if (movedItems.indexOf(box) === -1) {
      clearSelectedClass();
   }

   // если кликнули не по боксу - то не обрабатываем
   if (!box) {
      return;
   }

   clickPoint = {
      x: event.pageX,
      y: event.pageY
   }

   addSelectedClass(box);
   draggedItem = box;
};

//очистка буфера двигаемых элементов
document.onmouseup = function() {
   selectedFrame.style.visibility = 'hidden';
   selectedFrame.style.width = 0;
   selectedFrame.style.height = 0;
   draggedItem = null;
};

//Расчет всех нужных координат для выделяемого поля
function getSelectFramePos(event) {
   var _endSelectedX,
      _endSelectedY,
      _startSelectedX,
      _startSelectedY;

   if (event.pageY < startSelectedY) {
      _endSelectedY = startSelectedY - event.pageY;
      _startSelectedY = event.pageY;
   } else {
      _endSelectedY = event.pageY - startSelectedY;
   }

   if (event.pageX < startSelectedX) {
      _endSelectedX = startSelectedX - event.pageX;
      _startSelectedX = event.pageX;
   } else {
      _endSelectedX = event.pageX - startSelectedX;

   }

   return {
      height: _endSelectedY,
      width: _endSelectedX,
      top: _startSelectedY || startSelectedY,
      left: _startSelectedX || startSelectedX
   }
}

function checkInSelectFrameEl(el, selectFramePos) {
   return (el.offsetLeft >= selectFramePos.left &&
   el.offsetTop >= selectFramePos.top &&
   el.offsetLeft + el.clientWidth <= selectFramePos.width + selectFramePos.left &&
   el.offsetTop + el.clientHeight <= selectFramePos.height + selectFramePos.top)
}

function addItemSaveCoord() {
   movedItemsSavedCoord = [];
   movedItems.forEach(function(el) {
      movedItemsSavedCoord.push({
         id: el.id,
         offsetTop: el.offsetTop,
         offsetLeft: el.offsetLeft
      });
   });
}

function addSelectedClass(el) {
   if (movedItems.indexOf(el) === -1) {
      el.classList.add('selected');
      movedItems.push(el);
   }
   addItemSaveCoord();
}

function clearSelectedClass() {
   movedItems.forEach(function(item) {
      item.classList.remove('selected');
   });
   movedItems = [];
   movedItemsSavedCoord = [];
}

function fillMovedItems(selectFramePos) {
   clearSelectedClass();
   for (var el of items) {
      if (checkInSelectFrameEl(el, selectFramePos)) {
         addSelectedClass(el);
      }
   }
}
document.onmousemove = function(event) {
   if (selectedFrame.style.visibility === 'visible' && !draggedItem) {
      var selectFramePos = getSelectFramePos(event);
      selectedFrame.style.height = selectFramePos.height;
      selectedFrame.style.width = selectFramePos.width;
      selectedFrame.style.top = selectFramePos.top;
      selectedFrame.style.left = selectFramePos.left;
      fillMovedItems(selectFramePos);
   } else if (draggedItem) {
      //перемещать будем относительно прошлых координат на разнице движения мышки
      movedItems.forEach(function(elem) {
         var savedElem = movedItemsSavedCoord.find(function(item) {
            return elem.id === item.id
         });
         elem.style.left = (event.pageX - clickPoint.x) + savedElem.offsetLeft;
         elem.style.top = (event.pageY - clickPoint.y) + savedElem.offsetTop;

      });
   }
};

function generateId() {
   return Math.random()
}
//добавим всем боксам позицию в контейнере и повесим каждому идентификатор
window.onload = function() {
   var container = document.getElementById('container'),
      leftShift = 10,
      topShift = 15;

   items = document.getElementsByClassName('box');
   leftShift = leftShift - items[0].clientWidth;

   selectedFrame = document.getElementById('selectFrame');

   for (var el of items) {
      leftShift = leftShift + el.clientWidth + 5;
      if (leftShift + el.clientWidth > container.clientWidth) {
         leftShift = 15;
         topShift = topShift + el.clientHeight + 5;
      }
      el.style.left = leftShift;
      el.style.top = topShift;

      el.id = generateId();
   }
};

//отменяем html5 cобытие, иначе может временами пролагивать
document.ondragstart = function() {
   console.log('paw');
   return false;
};

