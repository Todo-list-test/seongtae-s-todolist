const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const todoAddBtn = document.querySelector('.add-item');

let todos = [];
let id = 0;

const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos;
}

const appendTodos = (text) => {
    if(text) {
        const newId = id++;
        const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
        setTodos(newTodos)
        paintTodos();
    }else{
        return alert("내용을 입력해주세요")
    }
}

const deleteTodo = (todoId) => {
	const newTodos = getAllTodos().filter(todo => todo.id !== todoId); //id가 같지 않은 것만 필터링
	setTodos(newTodos); //todo 배열 새로 설정
	paintTodos(); // 배열 표시
}

const completeTodo = (todoid) => {
	const newTodos = getAllTodos().map(todo => todo.id === todoid ? {...todo, isCompleted: !todo.isCompleted} : todo )
	setTodos(newTodos);
	paintTodos();
}

const onDbclickTodo = (e, todoId) => {
	const todoElem = e.target;
	const inputText = e.target.innerText;
	const todoItemElem = todoElem.parentNode;
	const inputElem = document.createElement('input');
	inputElem.value = inputText;
	inputElem.classList.add('edit-input');

	inputElem.addEventListener('keypress', (e) => {
		if(e.key === 'Enter') {
			updateTodo(e.target.value, todoId); // todo 수정
			document.body.removeEventListener("click", onClickBody);
		}
	});

	// todoItemElem 요소를 제외한 영역을 클릭 시, 수정모드 종료
	const onClickBody = (e) => {
		if(e.target !== inputElem) {
			updateTodo(inputElem.value, todoId); // todo 수정
			todoItemElem.removeChild(inputElem);
			document.body.removeEventListener('click', onClickBody);
		}
	}

	document.body.addEventListener('click', onClickBody)
	todoItemElem.appendChild(inputElem);
}

const updateTodo = (text, todoId) => {
	const newTodos = getAllTodos().map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
	setTodos(newTodos);
	paintTodos();
}
const paintTodos = () => {
  todoListElem.innerHTML = null; //todoListElem 요소 안의 HTML 초기화
  const allTodos = getAllTodos() // todos 배열 가져오기

  allTodos.forEach(todo => { 
  const todoItemElem = document.createElement('li');
  todoItemElem.classList.add('todo-item');

  const checkboxElem = document.createElement('div');
  checkboxElem.classList.add('checkbox');
	checkboxElem.addEventListener('click', () => completeTodo(todo.id))

  const todoElem = document.createElement('div');
  todoElem.classList.add('todo');
	todoElem.addEventListener("dblclick", (event) => {
		onDbclickTodo(event, todo.id);
	}); // 더블 클릭 이벤트
  todoElem.innerText = todo.content;

  const delBtnElem = document.createElement('button');
  delBtnElem.classList.add('delBtn');
	delBtnElem.addEventListener('click', () => deleteTodo(todo.id)) // 'click 이벤트 발생시, 해당 할 일 삭제
  delBtnElem.innerHTML = 'X';

	if(todo.isCompleted) {
    todoItemElem.classList.add('checked');
    checkboxElem.innerText = '✔';
  }

  todoItemElem.appendChild(checkboxElem);
  todoItemElem.appendChild(todoElem);
  todoItemElem.appendChild(delBtnElem);

  todoListElem.appendChild(todoItemElem);
  })
}

const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })
}

function AddItem() {
	appendTodos(todoInputElem.value); 
	todoInputElem.value ='';
}

init()