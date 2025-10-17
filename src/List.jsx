import {  useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function List() {
        const url="/api/list";
        const [newTask, setNewTask] = useState(' ')

    const createTask = async ()=> {
        console.log(newTask);
        let taskRes = await fetch(url, {
            method: 'Post',
            body: JSON.stringify({task: newTask, status: "Incomplete"})
        });
        taskRes=await taskRes.json();
        if (newTask) {
            getList();
        }
    }
    const [complete, ToggleComplete] = useState(false);
    useEffect(()=>{
        getList();
    }, [])

    const [list, setlist] = useState([])
    const getList= async()=> {
        
    let response = await fetch(url)
    response=await response.json();
        setlist(response);
        console.log(response)
    }

    const delTask = async(id)=> {
        let response = await fetch(url+'/'+id, {
            method: 'delete'
        })
        response=response.json();
        if (response) {
            getList();
        }
    }

    const ToggleCompleteHandler=async (id, task,status)=>  {
        let newcomplete=(status==="Incomplete")?"Complete":"Incomplete"
        
        console.log(id, newcomplete)
        ToggleComplete(newcomplete)
        console.log(newcomplete)
        let response = await fetch(url+'/'+id, {
            method:'PUT',
            body: JSON.stringify({id, task, status: newcomplete})
        })
        if (response) {
           if (status==='Incomplete') alert('Congrats you completed the task 🎉');

           

            getList()
        }
        
    
    }

    return (
        <div>
            <h3>
                {
                    list.map((l)=>(
                        <ul className={l.status==="Complete"?"completeLi":"tasks"}>
                            
                            <li>{l.task}</li>
                            <li>{l.status}</li>
                            <li><button className="del" onClick={()=>delTask(l.id)}><img className="delIcon" src="/Bin-2-Alternate--Streamline-Ultimate.png"/></button></li>
                            <li><button className="completeBtn" onClick={()=>{ToggleCompleteHandler(l.id, l.task, l.status)}}>{l.status==="Complete"?"✅":"❌"}</button></li>
                        </ul>
                    ))
                }
            </h3>
                <div className="addingContainer">
                    <h3>Add tasks</h3>
                    <input className="addTaskName" type="text" placeholder="Enter task name" name="addtask"
                    onChange={(event)=>
                        setNewTask(event.target.value)
                    }/>
                    <button onClick={createTask} className="add">Add task</button>
                </div>
            
        </div>
    )
}