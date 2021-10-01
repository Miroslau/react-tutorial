import TodoList from './Todo/TodoList'
import React, {useState, useEffect} from 'react'
import Context from './context'
import Loader from './Loader'
import Modal from './Modal/Modal.js'

const AddTodo = React.lazy(() => new Promise(resolve => {
    setTimeout(() => {
        resolve(import('./Todo/AddTodo'))
    }, 4000)
}))

function App() {
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
            .then(response => response.json())
            .then(todos => {
                setTimeout(() => {
                    setTodos(todos)
                    setLoading(false)
                },3000)
            })
    }, [])

    const toggleTodo = (id) => {
        setTodos(
            todos.map(todo => {
                todo.completed = todo.id === id ? !todo.completed : false
                return todo
            })
        )
    }

    function removeTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const addTodo = (title) => {
        setTodos(todos.concat([{
            title: title,
            id: Date.now(),
            completed: false
        }]))
    }

    return (
        <Context.Provider value={{removeTodo}}>
            <div className="wrapper">
                <h1>React tutorial</h1>
                <Modal/>

                <React.Suspense fallback={<Loader/>}>
                    <AddTodo onCreate={addTodo}/>
                </React.Suspense>
                {
                    loading && <Loader/>
                }
                {
                    todos.length ? (<TodoList todos={todos} onToggle={toggleTodo} />)
                        :(loading ? null : <p>You don't have todos</p>)
                }
            </div>
        </Context.Provider>
    );
}

export default App;
