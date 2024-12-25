window.onload = function() {
    setTimeout(function() {
        document.getElementById("customPopup").style.display = "flex"; // Show the custom popup
    }, 1000);
};

function closePopup() {
    document.getElementById("customPopup").style.display = "none"; // Hide the custom popup
}

function loadTodos(){
    // this function will load todos from browser
    const todos=JSON.parse(localStorage.getItem("todos")) || {"todoList":[]};
    return todos;
}

function refreshTodos(todos){
    localStorage.setItem("todos",JSON.stringify(todos));
}

function addTodoToLocalStorage(todo){
    const todos=loadTodos();
    todos.todoList.push({...todo});
    localStorage.setItem("todos",JSON.stringify(todos));
}

function appendTodoToHtml(todo){
    
    const todoList=document.getElementById("todoList");

    const todoItem = document.createElement("li");

    todoItem.setAttribute("data-id",todo.id)

    const textDiv = document.createElement("div");

    if(todo.isCompleted){
        textDiv.classList.add("completed");
    }

    textDiv.textContent=todo.text;
    todoItem.classList.add("todoItem");

    const wrapper=document.createElement("div");
    wrapper.classList.add("todoButtons");

    // ----------------------------

    const editBtn=document.createElement("button");
    editBtn.textContent="Edit";
    editBtn.classList.add("editBtn");
    editBtn.addEventListener("click",editTodo);

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click",deleteTodo);

    const completedBtn=document.createElement("button");
    completedBtn.textContent=(todo.isCompleted)?"Reset":"Completed";
    completedBtn.classList.add("completedBtn");
    completedBtn.addEventListener("click",toggleTodo)

    // ---------------------------

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(completedBtn);
    
    todoItem.appendChild(textDiv);
    todoItem.appendChild(wrapper);

    todoList.appendChild(todoItem);
    
}
    
function executeFilterAction(event){
    const todoList=document.getElementById("todoList");
    const element=event.target;
    const value=element.getAttribute("data-filter");
    todoList.innerHTML="";
    const todos=loadTodos();
    if(value=="all"){
        todos.todoList.forEach(todo=>{
            appendTodoToHtml(todo);
        })
    }else if(value=="pending"){
        todos.todoList.forEach(todo=>{
        if(todo.isCompleted==false){
            appendTodoToHtml(todo);
        }
        })
    }else{
        todos.todoList.forEach(todo=>{
        if(todo.isCompleted==true){
            appendTodoToHtml(todo);
        }
        })
    }
}

function resetHtmlTodos(todos){
    const todoList=document.getElementById("todoList");
    todoList.innerHTML="";
    todos.todoList.forEach(todo=>{
        appendTodoToHtml(todo);
    });
}

function toggleTodo(event){
    const todoItem=event.target.parentElement.parentElement;
    const todoId=todoItem.getAttribute("data-id");
    const todos=loadTodos();
    todos.todoList.forEach(todo=>{
        if(todo.id==todoId){
            todo.isCompleted=!todo.isCompleted;
        }
    });
    refreshTodos(todos);
    resetHtmlTodos(todos);
}

function editTodo(event){
    const todoItem=event.target.parentElement.parentElement;
    const todoId=todoItem.getAttribute("data-id");
    const todos=loadTodos();
    const response=prompt("Enter the New Todo Value");
    if(response!=null){
        todos.todoList.forEach(todo=>{
            if(todo.id==todoId){
                if(response!=""&&response!=" "){
                    todo.text=response;
                }
            }
        });
    }
    refreshTodos(todos);
    resetHtmlTodos(todos);
}

function deleteTodo(event){
    const todoItem=event.target.parentElement.parentElement;
    const todoId=todoItem.getAttribute("data-id");
    let todos=loadTodos();
    todos.todoList=todos.todoList.filter(todo=>todo.id!=todoId);
    refreshTodos(todos);
    resetHtmlTodos(todos);
}

function addNewTodo(){
    const todoText=input1.value;
    if(todoText==""){
        alert("Please write something for todo");
    }
    else if(todoText==" "){
        alert("Please write something for todo");
    }
    else{
        todos=loadTodos();
        const id=todos.todoList.length;
        addTodoToLocalStorage({text:todoText,isCompleted:false,id});
        appendTodoToHtml({text:todoText,isCompleted:false,id});
        input1.value="";
    }
}

document.addEventListener("DOMContentLoaded",()=>{

    console.log("DOM loaded successfully");

    const todoInput=document.getElementById("input1");

    const submitButton=document.getElementById("addTodo");

    let todos=loadTodos();

    const todoList=document.getElementById("todoList");


    const filterBtns=document.getElementsByClassName("filter");

    for(const btn of filterBtns){
        btn.addEventListener("click",executeFilterAction);
    }


    submitButton.addEventListener("click", addNewTodo);

    todoInput.addEventListener("change",(event)=>{
        // this callback function is called for every change in the input tag 
        // console.log("changed",event.target.value);
        const todoText=event.target.value;
        event.target.value=todoText.trim();
    })
    
    todos.todoList.forEach(todo => {
        appendTodoToHtml(todo);
    });


});

document.addEventListener("keypress",(event)=>{
    if(event.code=="Enter"){
        addNewTodo();
    }
})
