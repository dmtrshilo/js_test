(function() {

    function listFound(listNode) {
        for (var j = 0; j < listNode.length; j++) {
            addMapInfo(listNode[j]);	// добавим в каждую запись инф
        }
        elementObserver.observe(listNode.item(0).parentNode, {childList: true});

    }

	function addMapInfo(row) {
        var blocks = row.querySelectorAll('div');
        var titleNode;

        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].className.indexOf('address-links') > 0) {
                titleNode = blocks[i];
                break; 
            }
        }
        if (!titleNode) {
            return;
        }
        var link = document.createElement('div');
        link.textContent = 'TEST'; //Здесь будет инф о времени
		titleNode.appendChild(link);
    }

    	// вызывается, когда в список добавляются элементы
	function listModified(mutations) {
		for (var i = 0; i < mutations.length; i++) {
			var mut = mutations[i];
			// пройдем по добавленным записям
			for (var j = 0; j < mut.addedNodes.length; j++)
			{
				addMapInfo(mut.addedNodes[j]);
			}			
		}
    }
    
    //Обсервер следит за новыми элементами в доме
    var elementObserver = new MutationObserver(listModified);
    var elementClass = '_93444fe79c-card--2Jgih';
    var list = document.getElementsByClassName(elementClass);

    if (!list.length) {
        return;
    }

    listFound(list);

    
})();

