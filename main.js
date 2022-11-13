// -- Variables that have access to the element IDs in the HTML file --
let form = document.getElementById("form");
let textInput = document.getElementById("text-input");
let msg = document.getElementById("msg");
let dateInput = document.getElementById("date-input");
let textArea = document.getElementById("textarea");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// -- Event Listeners --
form.addEventListener("submit", (e) => {
    // use this to prevent default response, to refresh the page
    e.preventDefault();
    formValidation();
});
// this listener keeps the post on the todo list when you close the form popup
form.addEventListener("cancel", (e) => {
    e.preventDefault();
    formValidation();
})

// -- Form Validation --
let formValidation = () => {
    // -- Failure State --
    // if the input value is blank then it will fail, otherwise it will succeed
    if (textInput.value === "") {
        console.log("failure");
        msg.innerHTML = "Task cannot be blank";
    } else {
        // -- Success State --
        console.log("success");
        msg.innerHTML = "";
        acceptData();
        // set the attribute and value onto a element from the HTML document (attribute, value)
        add.setAttribute("data-bs-dismiss", "modal");
        // simulating a button click - this is required to invoke the attribute set above
        add.click();
 
        // IIFE = immediately invoke functional expression
         (() => {
             add.setAttribute("data-bs-dismiss", "");
         })();
    }
};

// -- Empty array to hold objects for our data to be stored into --
let data = [];

// -- Collecting the data from the inputs --
let acceptData = () => {
    data.push({
        title: textInput.value,
        date: dateInput.value,
        description: textArea.value,
    });
    // adding an object to the local sotrage - (key, value)
    localStorage.setItem("data", JSON.stringify(data));
    //console.log(data);
    createTasks();
};

// -- Use the objects data to apply to the HTML
let createTasks = () => {
    // when adding a new task, this will clear everything and re-add all from local storage and the new task
    tasks.innerHTML = "";
    // x = total indexes, y = counts to the value of x
    data.map((x,y) => {
        // task card template that incorporates the data that was stored
        return (tasks.innerHTML += `
            <div id=${y}>
                <span class="fw-bold">${x.title}</span>
                <span class="small text-secondary">${x.date}</span>
                <p>${x.description}</p>
                <span class="options">
                    <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                    <i onClick="deleteTask(this);createTask()" class="fas fa-trash-alt"></i>
                </span>
            </div>
        `);
    });

    resetForm();
};

// -- Delete a Task --
let deleteTask = (e) => {
    // This removes the grandparent element which is the div that holds the card
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
};

// -- Update a Task --
let editTask = (e) => {
    // variable to access the values
    let selectedTask = e.parentElement.parentElement;
    // adding the values to the form popup for us to edit
    textInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    textArea.value = selectedTask.children[2].innerHTML;
    // removes the task - will be readded when we edit the task and select add
    deleteTask(e);
};

// -- Resets the form to remove the value from the previous input --
let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textArea.value = "";
};

// -- IIFE (Immediately Invoked Function Expression) - to retrive objects from the local storage
(() => {
    // retrieve data and add it the object to our array - (key) <- this must be same as value in localStorage.setItem(key, value) 
    data = JSON.parse(localStorage.getItem("data")) || [];
    // invoke the create tasks for the data pulled in from the local storage
    createTasks();
})();