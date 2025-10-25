import { supabase } from "./services/supabase";
import { useState, useEffect, type ChangeEvent } from "react";
import './index.css'

// needed for useState as references
interface Tasks {
    id: number,
    created_at: string,
    title: string,
    description: string,
    
    // image and video
    image_url: string,
    video_url: string,
}

export default function Demo() {
    const [newTask, setNewTask] = useState({title: "", description: ""});
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [newDescription, setNewDescription] = useState("");

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
                        .from('notes-images') // bucket name
                        .upload(filePath, file) // 3rd: argrumnet optional

        if (error) {
            console.error("Error update task", error.message)
            return null; 
        }

        //create public url
        const {data} = await supabase
                        .storage // select the 'storage'
                        .from('notes-images') // bucket name
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
                        .from('notes-images')
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


     //Update Function
    const UpdateFunction = async (id: number) => {
        const {error} = await supabase
                    .from('tasks')
                    //     ({target the column, reference what to change 'data'})
                    .update({description: newDescription})
                    .eq('id', id)

        if (error) {
            console.error("Error update task", error.message)
            return 0;
        }

        // if no error detected, run ang code
    }


    // Delete Function
    const DeleteFunction = async (id: number) => {
        const {error} = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', id)

        if (error) {
            console.error("Error delete task", error.message)
            return 0;
        }

        // if no error detected, run ang code
    }


    // Read Function
    const ReadFunction = async () => {
        const {error, data} = await supabase
                        .from('tasks')
                        .select('*')
                        .order('created_at', {ascending: true})

        if (error) {
            console.error("Error read task", error.message)
            return 0;
        }
        // show the data
        setTasks(data);
    }

    

    // Create Function
    const CreateTask = async (e: any) => {
        e.preventDefault();

        // add for imageurl and videourl
        let imageUrl: string | null = null;
        let videoUrl: string | null = null;

        // call the 'useState' -> taskImage to reference the users inputs
        // then put it in the functions parameters
        if (taskImage) {
            imageUrl = await UploadImage(taskImage)
        }

        if (taskVideo) {
            videoUrl = await UploadVideo(taskVideo)
        }

        const {error} = await supabase
                    .from('tasks')
                    // {newTask} -> {...newTask}: title, description, image_url, and video_url
                    .insert({...newTask, image_url: imageUrl, video_url: videoUrl})
                    .select()
                    .single()

        if (error) {
            console.error("Error create task", error.message)
            return 0;
        }

        setNewTask({title: "", description: ""});
    }

    // to auto update the list
    useEffect(()=> {
        ReadFunction();
    })

  return (
    <div className="bg-[#242424] min-h-screen min-w-screen">
        <h1>
            Demo Supabase
        </h1>

        <form className="" onSubmit={CreateTask}  action="">

            <input 
                type="text"
                placeholder="Title Here"
                // onChange 
                onChange={(intxt) =>
                    setNewTask((prev) => ({...prev, title: intxt.target.value}))
                }
                className="p-4"
            />

            <textarea 
                name="" 
                id="" 
                placeholder="Description Here"

                //onChange
                onChange={(intxt) =>
                    setNewTask((prev) => ({...prev, description: intxt.target.value}))
                }
                className="p-4"
            />

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

            <button className="bg-lime-500"><p className="font-semibold">Add Task </p></button>

        </form>

        <ul>
            {tasks.map((task, key) => (
                <li key={key}>
                    <div>
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>

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

                        <div>
                            <textarea 
                                name="" 
                                id=""
                                placeholder="Edit description here"

                                // onChange
                                onChange={(intxt: any) => {
                                    setNewDescription(intxt.target.value)
                                }}
                            />

                            <div>
                                <button onClick={() => UpdateFunction(task.id)}>Update</button>
                                <button onClick={() => DeleteFunction(task.id)}>Delete</button>
                            </div>

                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  )
}
