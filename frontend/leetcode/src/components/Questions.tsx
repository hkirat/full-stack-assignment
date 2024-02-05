import React,{useEffect, useState} from 'react'
import {questions} from "../api/api"
function Questions() {
    interface question {
        title:string,
        description:string,
        testCases:{
            input:string;
            output:string
        }[],
        difficulty?:string
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
      Questions
      {data.map((question,index)=>(
        <div key={index}>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
            <ul>
            {question.testCases.map((testCase, i) => (
              <li key={i}>
                Input: {testCase.input}, Output: {testCase.output}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Questions
