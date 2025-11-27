import { useState, useEffect, type ChangeEvent } from 'react'
import './App.css'
import { supabase } from '../services/supabase'

interface Task {
  id: number
  title: string
  description: string
  created_at: string

  // image and video reference
  image_url: string
  video_url: string
}

export default function App() {
  const tableName = import.meta.env.VITE_TABLE_NAME
  const storageName = import.meta.env.VITE_STORAGE_NAME

  const [newTask, setNewTask] = useState({ title: "", description: ""})
  const [tasks, setTasks] = useState<Task[]>([])
  const [newDescription, setNewDescription] = useState("")

  //New: video and image useState
    const [taskVideo, setTaskVideo] = useState<File | null>(null); // useState for Image
    const [taskImage, setTaskImage] = useState<File | null>(null); // useState for Image


    // Upload Image/Video
    //New: Upload Image Function
    const UploadImage = async (file: File): Promise<string | null> => {

        // design a file path
        const filePath = `${file.name}-${Date.now()}`

        // upload to storage
        const {error} = await supabase  
                        .storage // storage 
                        .from(storageName) // bucket name
                        .upload(filePath, file) // 3rd: argrumnet optional

        if (error) {
            console.error("Error update task", error.message)
            return null; 
        }

        //create public url
        const {data} = await supabase
                        .storage // select the 'storage'
                        .from(storageName) // bucket name
                        .getPublicUrl(filePath)

        // return data -> publicUrl
        return data.publicUrl
    }

    // Upload Image Function
    const UploadVideo = async (file: File): Promise<string | null> => {

        // design a file path
        const filePath = `${file.name}-${Date.now()}`

        // upload to storage
        const {error} = await supabase  
                        .storage
                        .from(storageName)
                        .upload(filePath, file)

        if (error) {
            console.error("Error update task", error.message)
            return null; 
        }

        // public url
        const {data} = await supabase
                        .storage
                        .from(storageName)
                        .getPublicUrl(filePath)

        return data.publicUrl
    }

    // function where the user inputs 
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // useState respectively 
            setTaskImage(e.target.files[0]);
        }
    }

    const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setTaskVideo(e.target.files[0]);
        }
    }
  
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

    // add for imageurl and videourl
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    if (taskImage) {
        imageUrl = await UploadImage(taskImage)
    }

    if (taskVideo) {
        videoUrl = await UploadVideo(taskVideo)
    }

    const { error } = await supabase                      // connecting with supabase
        .from(tableName)                                  // table name
        .insert({...newTask, image_url: imageUrl, video_url: videoUrl}) // insert the data to the table, with new add image and video
        .select()
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

         <div className="flex border-2 p-4 m-4">
              <div>
                  <p className="font-semibold">Image Upload</p>
                  {/* handleImage */}
                  <input type="file" accept="image/*" onChange={handleImage}/>
              </div>

              <div>
                  <p className="font-semibold">Video Upload</p>
                  {/* handleVideo*/}
                  <input type="file" accept="video/*" onChange={handleVideo}/>
              </div>
          </div>

        <button>Add Task</button>

      </form>

      <ul>
        {tasks.map((task, key) => (                       // using map() to display the tasks
        <li key={key}>
          <div className='flex flex-col m-2'>

            <h3 className='text-3xl font-bold text-purple-400'>{task.title}</h3>
            <p className='text-[24px] text-lime-400 italic'>{task.description}</p>

            {task.image_url == null ? (
                  <>
                      <img hidden/>
                  </>
              ) : (
                  <>
                      <img src={task.image_url} width="640" alt="" />
                  </>
              )}

              {task.video_url == null ? (
                  <>
                      <video hidden />
                  </>
              ) : (
                  <>
                      <video src={task.video_url} controls width="640"></video>
                  </>
              )}

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