import { supabase } from "./services/supabase"
import { useState, useEffect } from "react"
import './App.css'

// reference for task
interface Task {
  id: number,
  created_at: string,
  title: string,
  description: string,
}

export default function App() {
  const [newTask, setNewTask] = useState({title: "", description: ""});
  const [tasks, setTasks] = useState<Task[]>([]); // useState for displaying the task
  const [newDescription, setNewDescription] = useState("");

  //Update Function
  const UpdateFunction = async (id: number) => {
    const {error} = await supabase
                  .from('tasks') // table name
                  .update({description: newDescription})
                  .eq('id', id)

    if (error) {
      console.error("Error update task", error.message);
      return 0;
    }
    // if no error, this will finish running
  }

  //Delete Function
  const DeleteFunction = async (id: number) => {
    const {error} = await supabase
                  .from('tasks')
                  .delete()
                  .eq('id', id)

    if (error) {
      console.error("Error delete task", error.message);
      return 0;
    }
    // if no error, this will finish running
  }

  // Read Function
  const ReadFunction = async () => {
    const {error, data} = await supabase
                    .from('tasks')
                    .select('*') // 'column', all: *
                    .order('created_at', {ascending: false})
                    // column, 'id': {ascending: true ? false}

    if (error) { // catch the error
      console.error("Error read task", error.message);
      return 0;
    }

    // fetch the data
    setTasks(data);
  }


  // Create Function
  const CreateFunction = async (e: any) => {
    e.preventDefault();

    const {error} = await supabase  
                .from('tasks') // table name
                .insert(newTask) // insert fucntion
                .single() // single 

    if (error) {
      console.error("Error create task", error.message);
      return 0; // return 0
    }

    setNewTask({title: "", description: ""});
  }

  // useEffect
  useEffect(()=> {
    ReadFunction();
  }, [])

  return (
    <>
    <h1>Supabase React js</h1>


    <form onSubmit={CreateFunction} action="">

    <input 
      type="text" 
      placeholder="Title Here"

      //onChange
      onChange={(e) => 
        setNewTask((prev) => ({...prev, title: e.target.value}))
      }
    />

    <textarea 
      name="" 
      id=""
      placeholder="Description Here"

      //onChange
      onChange={(e) => 
        setNewTask((prev) => ({...prev, description: e.target.value}))
      }

    >
    </textarea>

    <button>Add Task</button>

    </form>


    <ul>
      {/*call useState 'tasks' */}
      {tasks.map((task, key) => (
        <li key={key}>
          <div>
            <h1>{task.title}</h1>
            <p>{task.description}</p>

            <textarea 
              name="" 
              id=""
              placeholder="Edit description"

              //onChange
              onChange={(e) => 
                setNewDescription(e.target.value)
              } 

            >
            </textarea>

            <button onClick={() => UpdateFunction(task.id)}>Update</button>
            <button onClick={() => DeleteFunction(task.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
    </>
  )
}
