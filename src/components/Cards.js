import React from 'react'
import {Card , CardDeck} from 'react-bootstrap'
// import './index.css';
const Cards = (props)=> {
  const data = [0,1,2,3,4]
  const city =props.city
  console.log(props)
  console.log(props.icon)
    return (
      
      <CardDeck className="cards mt-5 mx-2">
         {props.city?data.map(el =>
       <Card>
       <Card.Body className ="card-body" style={{backgroundImage: "url(" + "data:image/jpeg;base64,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" + ")",

        boxShadow:"5px 10px 5px",  backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',borderRadius:"1px"}}>
      <Card.Title className="fs-4 ">{props.city} , {props.country[el]}</Card.Title>
        <h6>{props.Dates[el]}</h6>
        <Card.Text>
         <img src ={`http://openweathermap.org/img/w/${props.icon[el]}.png` } alt="wthr img" width="150" height="150"/>


       
        </Card.Text>
        {props.celsius ? <h1 className="py-2"> {props.celsius[el]}&deg;<em>C</em></h1>:null}
          {minmaxTemp(props.temp_max[el],props.temp_min[el])}

        {props.humidity ? <h4>Humidity {props.humidity[el]}</h4> :null}
        <h4 className="py-3"><em>{props.description[el]}</em></h4>
      </Card.Body>
      
    </Card>):null}
    </CardDeck>
    )

  
}
function minmaxTemp(min,max){
  if (min && max){
    return (
      <h3>
          <span className="px-2">{min}&deg;</span>
          <span className="px-1">{max}&deg;</span>
      </h3>
  )
  }
  
}
export default Cards
