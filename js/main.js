document.addEventListener('DOMContentLoaded', function() {

    let nightMode = 'false';
    
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    function addTextInput(item, tableNumber) {
        let parentBlock = item.parentNode.parentNode;
        let bodyBlock = item.parentNode.parentNode.getElementsByClassName('work-block__body');

        if (bodyBlock.length == 0) {
            let newBlock = document.createElement('div');
            newBlock.classList.add('work-block__body');

            let childEl = parentBlock.getElementsByClassName('work-block__footer');

            parentBlock.insertBefore(newBlock, childEl[0]);
        }

        let newTextarea = document.createElement('textarea');
        newTextarea.classList.add('block_textarea');

        bodyBlock[0].appendChild(newTextarea);

        newTextarea.focus();

        newTextarea.addEventListener('blur', () => {
            if (newTextarea.value == '') {
                newTextarea.remove();
                if (getStorage()[tableNumber]['tasks'].length == 0) {
                    bodyBlock[0].remove();
                }
            } else {
                addWork(bodyBlock[0], tableNumber);
                newTextarea.remove();
            }
        });
    }

    function addWork(bodyBlock, tableNumber) {
        let workValue = bodyBlock.getElementsByClassName('block_textarea')[0].value;

        let data = {
            table: tableNumber,
            value: workValue
        }

        let result = saveTask(data);

        let newTaskBlock = createTaskBlock(workValue);
        newTaskBlock.setAttribute('table-id', result.tableId);
        newTaskBlock.setAttribute('task-id', result.taskId);

        bodyBlock.appendChild(newTaskBlock);
        
    }

    function initData() {
        let data = {
            1: {
                title: 'Спиок дела',
                tasks: ['Вынести мусор', 'Позвонить другу']
            },
            2: {
                title: 'В процессе',
                tasks: ['Погулять']
            },
            3: {
                title: 'Завершённые',
                tasks: []
            }
        };

        setStorage(data);

        setCookie('nightMode', 'false', 60*3600);
    }

    function saveTask(data) {
        let value = data['value'];
        let tableNumber = data['table'];

        let storage = getStorage()

        let taskData = storage[tableNumber]['tasks'];

        taskData.push(value);
        setStorage(storage);

        return data = {
            tableId: tableNumber,
            taskId: taskData.length - 1
        }
    }

    function deleteTask(data) {
        let storage = getStorage();

        storage[data.tableId]['tasks'].splice(data.taskId, 1);
        
        setStorage(storage);
        tasksInitialization();
    }

    function createTaskBlock(task, firstTableId=null, lastTableId=null) {
        let a = parseInt(firstTableId);
        let b = parseInt(lastTableId);
        let newTaskBlock = document.createElement('div');
        newTaskBlock.classList.add('task-block');
        
        let actionBlock = document.createElement('div');
        actionBlock.className = 'actions hidden';

        let prev = document.createElement('div');
        let trash = document.createElement('div');
        let next = document.createElement('div');
        
        if(a !== 1) {
            prev.className = 'prev';
            prev.innerHTML = '<span></span>';
        }

        if(a !== b) {
            next.className = 'next';
            next.innerHTML = '<span></span>';
        }
       
        trash.className = 'trash';
        trash.innerHTML = '<span></span>';

        actionBlock.appendChild(prev);
        actionBlock.appendChild(trash);
        actionBlock.appendChild(next);
        newTaskBlock.appendChild(actionBlock);
        newTaskBlock.innerHTML += "<span class='task-text'>"+ task +"</span>";

        firstTableId++;

        return newTaskBlock;
    }

    function moveTask(data, to) {

        let position = 0;

        if(to == 'next') {
            position = data.tableId + 1;
        }else if(to == 'prev') {
            position = data.tableId - 1;
        }

        let newData = getStorage();

        newData[data.tableId]['tasks'].splice(data.taskId, 1);
        newData[position]['tasks'].unshift(data.value);
        
        setStorage(newData);
        tasksInitialization();
    }

    function getStorage() {
        return JSON.parse(localStorage.getItem('data'));
    }

    function setStorage(data) {
        localStorage.clear();
        localStorage.setItem('data', JSON.stringify(data));
    }

    function tasksInitialization() {
        let storage = getStorage();

        if(nightMode == 'true') {
            $('.page').addClass('night-mode');
        }else if (nightMode == 'false') {
            $('.page').removeClass('night-mode');
        }

        $('div').remove(".work-block");

        let workList = document.getElementsByClassName('deal-list');

        for (let block in storage) {

            let newWorkBlock = document.createElement('div');
            newWorkBlock.classList.add('work-block');
            newWorkBlock.setAttribute('table-id', block);

            let newWorkBlockHeader = document.createElement('div');
            newWorkBlockHeader.classList.add('work-block__header');
            newWorkBlockHeader.innerHTML = '<h3>' + storage[block]['title'] + '</h3>';
            newWorkBlock.appendChild(newWorkBlockHeader);

            if (storage[block]['tasks'].length !== 0) {
                let newWorkBlockBody = document.createElement('div');
                newWorkBlockBody.classList.add('work-block__body');

                for (let y in storage[block]['tasks']) {
                    let task = storage[block]['tasks'][y];

                    let newTaskBlock = createTaskBlock(task, block, Object.keys(storage).length);
                    newTaskBlock.setAttribute('table-id', block);
                    newTaskBlock.setAttribute('task-id', y);
                    newWorkBlockBody.appendChild(newTaskBlock);
                }

                newWorkBlock.appendChild(newWorkBlockBody);
            }

            let newWorkBlockFooter = document.createElement('div');
            newWorkBlockFooter.classList.add('work-block__footer');
            newWorkBlockFooter.innerHTML = '<button class="add-task">Добавить задачу</button>';
            newWorkBlock.appendChild(newWorkBlockFooter);


            workList[0].appendChild(newWorkBlock);


        }
    }

    // First initialization
    if (getStorage() == undefined) {
        initData();
    }else {
        nightMode = getCookie('nightMode');
    }

    // Initialization tasks from local storage
    tasksInitialization();

    let workAddButton = document.getElementsByClassName('add-task');

    for (let i = 0; i < workAddButton.length; i++) {
        $(document).on('click', '.add-task', function(e) {   
            addTextInput(e.currentTarget, parseInt($(this).parent().parent().attr('table-id')));        
        })
    }

    $(document).on({
        mouseenter: function () {
            $(this).find('.actions').removeClass('hidden');
        },
        mouseleave: function () {
            $(this).find('.actions').addClass('hidden');
        }
    }, '.task-block');

    $(document).on('click', '.trash', function() {
        let data = {
            tableId: $(this).parent().parent().attr('table-id'),
            taskId: $(this).parent().parent().attr('task-id')
        };
        deleteTask(data);
    });

    $(document).on('click', '.prev, .next', (e) => {

        let target = e.currentTarget.classList.value;
        
        let data = {
            tableId: parseInt($(e.currentTarget).parent().parent().attr('table-id')),
            taskId: parseInt($(e.currentTarget).parent().parent().attr('task-id')),
            value: $(e.currentTarget).parent().parent().find(".task-text")[0].innerText
        };

        moveTask(data, target);
    });

    $('.button-night_mode').on('click', function () {
        
        if(nightMode == 'false') {
            nightMode = 'true';
            setCookie('nightMode', 'true', 3600*60);
            $('.page').addClass('night-mode');
        }else if (nightMode == 'true') {
            nightMode = 'false';
            setCookie('nightMode', 'false', 3600*60);
            $('.page').removeClass('night-mode');
        }
    })
});