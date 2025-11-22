import './index.css'
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '../services/supabase'


// Create, Read, Update, and Delete x Supabase

interface Task {
    id: number
    created_at: string
    title: string
    description: string

    // image and video reference
    image_url: string
    video_url: string
}

export default function App() {
    const [newTask, setNewTask] = useState({title: "", description: ""});
    const [showTask, setShowTask] = useState<Task[]>([]);
    const [newDesc, setNewDesc] = useState('');
    const [newTitle, setNewTitle] = useState('');

    const [taskVideo, setTaskVideo] = useState<File | null>(null);
    // const [taskImage, setTaskImage] = useState<File | null>(null); 


    const UploadVideo = async (file: File): Promise<string | null> => {
    
            // design a file path
            const filePath = `${file.name}-${Date.now()}`
    
            // upload to storage
            const {error} = await supabase  
                            .storage //storage
                            .from('notes-images') // bucket name
                            .upload(filePath, file)
    
            if (error) {
                console.error("Error update task", error.message)
                return null; 
            }
    
            // public url
            const {data} = await supabase
                            .storage
                            .from('notes-images')
                            .getPublicUrl(filePath)
    
            return data.publicUrl
        }
    
        // function where the user inputs 
    const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // useState respectively 
            setTaskVideo(e.target.files[0]);
        }
    }
    

    //Delete function:
    const deleteTask = async (id: number) => {
        const { error } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', id) // 'column' and 'value to target'

        if ( error ) {
            console.error("Error fetchtTask data", error.message);
            return; // to stop the function here
        }  

        // then the item is deleted

    }

    //Update fucntion:
    const updateTask = async (id: number) => {
        const { error } = await supabase
                        .from('tasks')
                        .update({title: newTitle, description: newDesc})
                        .eq('id', id) // 'column' and 'value to target'

        if ( error ) {
            console.error("Error fetchtTask data", error.message);
            return; // to stop the function here
        }  

        // then the item is deleted

    }

    // Read function:
    const fetchTask = async () => {
        const {error: fecthError, data} = await supabase
                        .from('tasks')
                        .select('*')  // all data to be "selected"
                        .order('created_at', {ascending: false})

        if ( fecthError ) {
            console.error("Error fetchtTask data", fecthError.message);
            return; // to stop the function here
        }

        setShowTask(data);
    }


    // Create function:
    const insertTask = async (e: any) => {
    e.preventDefault();

    let videoUrl: string | null = null;

    if(taskVideo) {
        videoUrl = await UploadVideo(taskVideo)
    }

    const { error } = await supabase
                //what table name?, what table name to target or use?
                //what table or table name?
                .from('tasks') 
                //unsa atong e insert sa table?, what do put inside the table and what to target?
                //target: 'column'
                .insert({...newTask, video_url: videoUrl}) 
                .single()

        if ( error ) {
            console.error("Error insertTask data", error.message);
            return; // to stop the function here
        }

        setNewTask({title: "", description: ""});
    }


    useEffect(() => {
        fetchTask();
    })

  return (
    <>
      <h1>Supabase x React js</h1>

      <form onSubmit={insertTask}>

        <input
          type="text"
          placeholder='Title Here'
          required
          // onChange // short-hand function: lambda function
          onChange={(e) => 
            setNewTask(
                (prev) => (
                    {...prev, title: e.target.value}
                )
            )
        }
        />
        <textarea
          name=''
          id=''
          placeholder='Description Here'
          required
          onChange={(e) => 
            setNewTask(
                (prev) => (
                    {...prev, description: e.target.value}
                )
            )
        }
        />

     <input type="file" accept='video/*' onChange={handleVideo}/>

        <button>Add Task</button>

      </form>

      {/* use useState and ReadTask function to display the tasks */}

      <ul>
        {/* displaying of the data */}
        {showTask.map((task, key) => (
        <li key={key}>
            <div>

                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <img src={task.image_url} width="640" />
                <video src={task.video_url} width="640" controls />

                <textarea
                placeholder='Edit title'
                onChange={(e: any) => {
                    setNewTitle(e.target.value)
                }}
                />
                <textarea
                placeholder='Edit description'
                onChange={(e: any) => {
                    setNewDesc(e.target.value)
                }}
                />
                <button onClick={() => updateTask(task.id)}>Update Task</button>
                <button onClick={() => deleteTask(task.id)}>Delete Task</button>

            </div>
        </li>
        ))}
      </ul>
    </>
  )
}