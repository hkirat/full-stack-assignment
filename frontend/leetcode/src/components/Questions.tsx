import React,{useEffect, useState} from 'react'
import {questions} from "../api/api"
import "../Design/Questions.css"
function Questions() {
    interface question {
        title:string,
        description:string,
        testCases:{
            input:string;
            output:string
        }[],
        level:string
    }
  const [data, storedata] = useState<question[]>([]);
  useEffect(()=>{
    const fetchData = async () => {
      try{
        const dodo = await questions();///why am i using await function here as i have used await inside of the question funtion
        storedata(dodo);
          
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    console.log(data);
    fetchData();
  },[])
  console.log("hello");
  console.log(data);
  return (
    <div>
      {data.map((question,index)=>(
        <div className="container-fluide">
          <div className="row">
          <div className="col-md-12">
        <div className="kushal">{question.title}</div>
      </div>
      <div className="col-md-12">
        <div className={question.level === 'easy' ? 'green-text' : 'red-text'}>
          {question.level}
        </div>
      </div>
      </div>
          
        </div>
        
      ))}
    </div>
  )
}

export default Questions
