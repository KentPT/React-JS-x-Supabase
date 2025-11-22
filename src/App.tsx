import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from '../services/supabase'

interface Task {
  id: number
  title: string
  description: string
  created_at: string
}

export default function App() {
  const tableName = import.meta.env.VITE_TABLE_NAME

  const [newTask, setNewTask] = useState({ title: "", description: ""})
  const [tasks, setTasks] = useState<Task[]>([])
  const [newDescription, setNewDescription] = useState("")
  
  // CRUD {Create , Read , Update and Delete}

  // Delete function
  const deleteTask = async (id: number) => {
    const { error } = await supabase
                    .from(tableName)
                    .delete()
                    .eq("id", id)

    if (error) {                                   
      console.error("Error delete task", error.message)
      return;
    } else {
      console.log("Succesfull delete")                   
    }   

  }

  // Update function
  const updateTask = async (id: number) => {
    const { error } = await supabase
                    .from(tableName)
                    .update({description: newDescription})
                    .eq("id", id)

    if (error) {                                   
      console.error("Error update task", error.message)
      return;
    } else {
      console.log("Succesfull update")                   
    }   

  }

  // Read function
  const fetchTask = async () => {

    const { data, error } = await supabase
                .from(tableName)
                .select("*")
                .order("created_at", {ascending: true})

    if (error) {                                   
      console.error("Error fetch task", error.message)
      return;
    } else {
      console.log("Succesfull fetch")                   
    }

    setTasks(data)                                        // usestate setTasks to put it in the data in []
  }

  // Create function
  const sumbitTask = async () => {                        // create function with 'async'

    const { error } = await supabase                      // connecting with supabase
        .from(tableName)                                  // table name
        .insert(newTask)                                  // insert the data to the table
        .single()                                         // once insert 

    if (error) {                                          // check if there is an error
      console.error("Error insert task", error.message)
      return;
    } else {
      console.log("Succesfull insert")                    // succesfull
    }

    setNewTask({title: "", description: ""});             // calling setNewTask to empty input, when succesfull
  }


  useEffect(() => {                                       // useEffect for displaying the tasks
    fetchTask();
  })


  return (
    <>
      <h1 className='font-bold underline text-blue-500'>Supabase x React js</h1>

      <form action={sumbitTask} className='mb-5'> 
        <div className='flex flex-col m-4 p-4'>
          <input
            className='p-4 m-2'
            type="text"
            placeholder='Title Here'
            required
            onChange={ (e) => {                             // onChange lamda function
              setNewTask( (prev) =>  ({...prev, title: e.target.value}))
            }}
          />

          <textarea
            className='p-4 m-2'
            placeholder='Description Here'
            required
            onChange={ (e) => {                             // onChange lamda function
              setNewTask( (prev) =>  ({...prev, description: e.target.value}))
            }}
          />
        </div>
        <button>Add Task</button>

      </form>

      <ul>
        {tasks.map((task, key) => (                       // using map() to display the tasks
        <li key={key}>
          <div className='flex flex-col m-2'>

            <h3 className='text-3xl font-bold text-purple-400'>{task.title}</h3>
            <p className='text-[24px] text-lime-400 italic'>{task.description}</p>
            <textarea
              className='p-3 m-4'
              placeholder='Edit description'
              onChange={(e) => {
                setNewDescription(e.target.value)
              }}
            />

            <button className='m-1' onClick={() => updateTask(task.id)}>Update Task</button>
            <button className='m-1' onClick={() => deleteTask(task.id)}>Delete Task</button>

          </div>
        </li>
        ))}
      </ul>
    </>
  )
}