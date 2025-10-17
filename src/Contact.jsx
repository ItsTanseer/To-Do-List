import './App.css'
export default function Contact() {
        return (
           <div>
            <h4>Contact me</h4>
            <div className="contactContainer">
                
               <button  className="contactBtn" onClick={()=>{
               window.open('https://www.instagram.com/_tanseer_ahmad_?igsh=d2NuN2kybm80b2Ny', '_blank')}}><img className="contactIcon" src='./instagram.png'/></button>
               <button className="contactBtn" onClick={()=>{
               
                window.open('https://www.linkedin.com/in/tanseer-ahmad-a5a01831b/', '_blank')}
               }
               ><img className="contactIcon" src='./linkedin.png'/></button>
               <button className="contactBtn" onClick={()=>{
               window.open('https://github.com/ItsTanseer/To-Do-List', '_blank')}
               }><img className="contactIcon" src='./github.png'/></button>
               
            </div>
           </div> 

        )
}