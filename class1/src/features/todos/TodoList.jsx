import {
        useGetTodosQuery,
		 useAddTodoMutation,
        useUpdateTodoMutation,
        useDeleteTodoMutation
    } from '../api/apiSlice'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'


const TodoList = () => {
	const [newTodo, setNewTodo] = useState('') ;

	const canSave = Boolean(newTodo);


		const {
		data: todos,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetTodosQuery()

	const [addTodo] = useAddTodoMutation()
	const [updateTodo] = useUpdateTodoMutation()
	const [deleteTodo] = useDeleteTodoMutation()


	const handleSubmit = (e) =>{
		e.preventDefault()
		//addTodo
		addTodo({userId:1, title: newTodo, completed: false})
		setNewTodo('')
	}


	const newItemSection =
		<form onSubmit={handleSubmit}>
			<label htmlFor="new-todo">Enter a todo item</label>
			<div className="new-todo">
				<input type="text" id="new-todo" value={newTodo} onChange={(e)=> setNewTodo(e.target.value)} placeholder="Enter a todo item"/>
			</div>

			<button className='submit' disabled={!canSave}>
				<FontAwesomeIcon icon={faUpload}/>
			</button>
		</form>

		let content;
		// Define conditional content
		if(isLoading){
			content = <p>Loading...</p>
		} else if(isSuccess){
		content = todos.length ? (
			todos.map(todo =>{
				return (
					<article key={todo.id}>
						<div className='todo'>
							<input type="checkbox" checked={todo.completed} id={todo.id}
							onChange={()=> updateTodo({...todo, completed: !todo.completed})}/>

							<label style={(todo.completed) ? {textDecoration: "line-through"}: null} htmlFor={todo.id}>{todo.title}</label>
						</div>
						<button className="trash" onClick={()=> deleteTodo({id: todo.id})} >
							<FontAwesomeIcon icon={faTrash}/>
						</button>
					</article>
				)
			}))
			:
			(<p>No todos to display</p>)
		} else if(isError){
			content = <p>{error.message}</p>
		}

		
  return (
	<main>
		<h1>Todo List</h1>
		{newItemSection}
		{content}
	</main>
  )
}

export default TodoList