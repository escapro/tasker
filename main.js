document.addEventListener('DOMContentLoaded', function() {

    if (localStorage.getItem("data") == undefined) {
        initData();
    }

    // tasksInitialization();

    let workAddButton = document.getElementsByClassName('work-block__footer');

    for (let i = 0; i < workAddButton.length; i++) {
        workAddButton[i].addEventListener('click', function(event) {
            addTextInput(this, i + 1);
        })
    }

    function addTextInput(item, tableNumber) {
        let parentBlock = item.parentNode;
        let bodyBlock = item.parentNode.getElementsByClassName('work-block__body');

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
                if (JSON.parse(localStorage.getItem('data'))[tableNumber]['tasks'].length == 0) {
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

        let newTaskBlock = document.createElement('div');
        newTaskBlock.classList.add('task-block');

        let newWork = document.createElement('p');
        newWork.innerHTML = workValue;

        newTaskBlock.appendChild(newWork);

        bodyBlock.appendChild(newTaskBlock);

        let data = {
            table: tableNumber,
            value: workValue
        }

        save(data, 'task');
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
        localStorage.setItem("data", JSON.stringify(data));
    }

    function save(data, section) {
        if (section == 'task') {
            let value = data['value'];
            let tableNumber = data['table'];

            let storage = localStorage.getItem('data');
            storage = JSON.parse(storage);

            storage[tableNumber]['tasks'].push(value);
            localStorage.clear();
            localStorage.setItem('data', JSON.stringify(storage));
        }
    }

    function tasksInitialization() {
        let data = JSON.parse(localStorage.getItem('data'));

        let workList = document.getElementsByClassName('deal-list');

        for (let block in data) {

            let newWorkBlock = document.createElement('div');
            newWorkBlock.classList.add('work-block');

            let newWorkBlockHeader = document.createElement('div');
            newWorkBlockHeader.classList.add('work-block__header');
            newWorkBlockHeader.innerHTML = '<h3>' + data[block]['title'] + '</h3>';
            newWorkBlock.appendChild(newWorkBlockHeader);

            if (data[block]['tasks'].length !== 0) {
                let newWorkBlockBody = document.createElement('div');
                newWorkBlockBody.classList.add('work-block__body');

                for (let y in data[block]['tasks']) {
                    let task = data[block]['tasks'][y];
                    let newTaskBlock = document.createElement('div');
                    newTaskBlock.classList.add('task-block');
                    newTaskBlock.innerHTML = '<p>' + task + '</p>';
                    newWorkBlockBody.appendChild(newTaskBlock);
                }

                newWorkBlock.appendChild(newWorkBlockBody);
            }

            let newWorkBlockFooter = document.createElement('div');
            newWorkBlockFooter.classList.add('work-block__footer');
            newWorkBlockFooter.innerHTML = '<p>Добавить задачу</p>';
            newWorkBlock.appendChild(newWorkBlockFooter);


            workList[0].appendChild(newWorkBlock);


        }

        console.log(data);

    }
});