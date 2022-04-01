"use strict"

window.addEventListener('DOMContentLoaded', () => {
    let btnSubmit = document.getElementById('form-submit'),
        btnClear = document.getElementById('form-clear'),
        taskDesc = document.getElementById('task-descr'),
        taskDate = document.getElementById('task-date'),
        taskTime = document.getElementById('task-time'),
        savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // localStorage.clear();

    currentDate();
    clearForm();
    addTask();
    showTask();


    /*--==================== CLEAR FORM ====================-->*/
    function clearForm() {
        btnClear.addEventListener('click', () => {
            document.querySelector('form').reset();
        })
    }

    /*--==================== ADD TASK ====================-->*/
    function addTask() {
        btnSubmit.addEventListener('click', () => {
            let msg = document.getElementById('msg'),
                t = new Date(taskDate.value + ' ' + taskTime.value);

            if (taskDesc.value && taskDate.value && taskTime.value) {
                msg.innerHTML = '';
                savedTasks.push({
                    id: savedTasks.length,
                    descr: taskDesc.value,
                    date: t.getDate() + " " + t.toLocaleString('en-US', {
                        month: 'long'
                    }),
                    time: t.getHours() + ':' + t.getMinutes(),
                    timeLeft: getTimeRemainig(t)
                });

                localStorage.setItem("tasks", JSON.stringify(savedTasks));
                showTask();
                document.querySelector('form').reset();
            } else {
                msg.innerHTML = 'Please enter task ';
            }

            document.getElementById('task-descr').focus();
        });
    };

    /*--==================== SHOW TASK ====================-->*/
    function showTask() {
        let parent = document.querySelector('.task__container');
        parent.innerHTML = '';

        savedTasks.forEach(task => {
            let card = `
                <article class="task__card" id="task-card data-key="${task.id}">
                    <div class="shape shape__smaller"></div>
                    <div class="task__close" id="task-delete">
                        <i class="ri-close-line"></i>
                    </div>

                    <h3 class="task__title">${task.descr}</h3>

                    <div class="task__assigned">
                        <i class="ri-timer-2-line"></i>
                        <h3 class="task__assigned-day" id="adate">${task.date}</h3>
                        <h3 class="task__assigned-time">${task.time}</h3>                        
                    </div>    
                    <h3 class="task__error">not completed</h3>                
                </article>`
            parent.insertAdjacentHTML('beforeend', card);
        });
        deleteTask();
        cardScale();
    }

    /*--==================== DELETE TASK ====================-->*/
    function deleteTask() {
        let btnsDelete = document.querySelectorAll('#task-delete');
        let cards = document.querySelectorAll('.task__card');

        btnsDelete.forEach((item, i) => {
            item.addEventListener('click', () => {
                if (savedTasks[i].timeLeft.total <= 0) {
                    savedTasks.splice(i, 1);
                    localStorage.setItem("tasks", JSON.stringify(savedTasks));                    
                    showTask();                    
                } else {
                    cards[i].querySelector('.task__error').style.display = 'block';
                }
            })
        });
        
    }

    /*--==================== CARD SCALE ====================-->*/
    function cardScale() {
        let cards = document.querySelectorAll('.task__card');
        cards.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('card-scale');
            })
        })
    }


    /*--==================== ADD 0 BEFORE DATETIME ====================-->*/
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    /*--==================== Current Date ====================-->*/
    function currentDate() {
        let cTime = document.getElementById('ctime'),
            cDate = document.getElementById('cdate'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        // updates the time every second
        function updateClock() {
            let t = new Date(),
                day = t.toLocaleString('en-US', {
                    weekday: 'long'
                }),
                month = t.toLocaleString('en-US', {
                    month: 'long'
                }),
                hours = getZero(t.getHours()),
                minutes = getZero(t.getMinutes());

            cTime.innerHTML = `${hours}:${minutes}`;
            cDate.innerHTML = `${day}, ${month} ${t.getDate()}`;
        }
    }

    // /*--==================== DEADLINE ====================-->*/
    function getTimeRemainig(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / 1000 * 60 * 60) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
})