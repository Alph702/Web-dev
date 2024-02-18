import React from 'react'
import "./Card.css"

const Card = (props) => {
  return (
    <div className='card' style={{overflow:"hidden"}}>
        <img src="https://th.bing.com/th/id/OIP.SvrKieHcH0VI7PaXzoFZbAHaE8?rs=1&pid=ImgDetMain" alt="" width={233} style={{border: "2px solid black"}}/>
      <h1>{props.title}</h1>
      <p> {props.description}</p>
    </div>
  )
}

export default Card
