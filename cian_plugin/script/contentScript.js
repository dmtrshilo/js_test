'use strict';

(function() {

    var script = document.createElement('script');
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=8a7f47b0-eef1-4158-8b49-16495fd4fc15";
    script.onload = start;

    document.getElementsByTagName('head')[0].appendChild(script);    

    function start() {
        ymaps.ready(init);

        function init() {
            ymaps.route([
                'Москва, улица Крылатские холмы',
                {
                    point: 'Москва, метро Молодежная',
                    // метро "Молодежная" - транзитная точка
                    // (проезжать через эту точку, но не останавливаться в ней).
                    type: 'viaPoint'
                },
                [55.731272, 37.447198], // метро "Кунцевская".
                'Москва, метро Пионерская'
            ]).then(function() {
                console.log(arguments);
            });
        }
    
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
    }


    
})();

