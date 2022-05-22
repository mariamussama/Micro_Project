import logo from './logo1.png';
import foot from './logo2.png';
import './App.css';
import {useState} from "react";
import ReactDOM from 'react-dom/client';

//import main from main.js;

//#include <stdio.h>


let output =[];

function App() {
  const [exp, setEXP] = useState('');
  const [result, setResult] = useState([]);
  // const root = ReactDOM.createRoot(
  //   document.getElementById('result')
  // );


  function AND(parts) {

    let MOSCOUNT = 0;

    //console.log(parts.length);
    if (parts.length === 1 && parts[0].length===1)
    {
          output.push("No spice netlists, output equals the input");
          setResult([...result,output]);
          return;
    }
    //output =parts.length, "hope this works for parts");
    
    for (let i = 0; i < parts.length; i++) {
  
        //divide each part into a vector, where each slot in the vector will have everything before and after every &.
        let temp = parts[i];
        let flag = false;
    
        //look for &. if none are found then there is only one transistor in this branch. Make flag true if an & is found, otherwise, skip the big if statement and go down to the else. 
        for (let x = 0; x < temp.length; x++) {
            if (temp[x] === '&') {
                flag = true;
                break;
            }
        }
  
        //This code works by adding the characters to a string, once a & is found, add that string to the subs vector and then hold that & location and then set string to "" and look for the next and. For the last and, the final characters after it will not be counted by that for loop, so we add to the subs vector the last character by using the last & location.
  
        if (flag) {
  
            let subs = [];
            let something = "";
            let andlocation = 0;
            for (let j = 0; j < temp.length; j++) {
                if (temp[j] !== '&')
                    something = something + temp[j];
                else {
                    if (something === "")//Check the term is not empty correct
                    {
                      output.push("Wrong Input 3");
                      setResult([...result,output]);
                    }
                    subs.push(something);
                    something = "";
                    andlocation = j;
                }
            }
  
            //output =something, "hello");
  
            if (temp.substring(andlocation, temp.length) === "")//Check the term is not empty correct
            {
              output.push("Wrong Input 4");
              setResult([...result,output]);

            }

             //console.log(temp, "HERE IS TEMP");


            subs.push(temp.substring(andlocation + 1 , temp.length));
              //A&B
            //console.log(subs, "Ya rab");
            //complement all subs. Each sub is either a letter or a complement of a letter. If there is only a letter, add a complement. If there is a complement, then remove it.
            for (let b = 0; b < subs.length; b++) {
                if (subs[b].length === 1) {
                    output.push( `m ${MOSCOUNT} ${subs[b]} ' ${subs[b]} VDD   VDD   PMOS   not gate`);
                    setResult([...result,output]);
                    MOSCOUNT++;
                    output.push( "m" + MOSCOUNT + "   " + subs[b] + "'" + "   " + subs[b] + "   " + "0  " + " " + "0  " + " " + "NMOS " + "not gate");
                    setResult([...result,output]);

                    MOSCOUNT++;
  
                    subs[b] = subs[b]+"'";
                   // console.log(subs, "HERE");
                }
                else if (subs[b].length === 2) {
                    subs[b] = subs[b].substring(0, 1);
                }
            }
  
            //now do the loop that will go on the subs.size() and make the first one connected to VDD, the ones in the middle connected to each other, and the last one connected to y. 
            //The way this works is that it simply goes to the sub that is before it and the one after it if it is in between anything.
              //output ="SUBS LENGTH", subs.length, "MOS COUNT", MOSCOUNT);
            for (let a = 0; a < subs.length; a++) {
                if (a === 0) {
                  output.push( "m" + MOSCOUNT + "   " + subs[a + 1] + " SOURCE" + "  " + subs[a] + "  " + "VDD  " + " " + " VDD" + " " + "  PMOS");
                  setResult([...result,output]);

                }

                else if (a === subs.length-1) {
                  output.push( "m" + MOSCOUNT + "   " + "Y" + "  " + subs[a] + "  " + subs[a - 1] + " DRAIN   " + subs[a - 1] + " DRAIN " + " PMOS");
                  setResult([...result,output]);

                }
                else {
                  output.push( "m" + MOSCOUNT + "  " + subs[a + 1] + "  SOURCE" + "   " + subs[a] + "   " + subs[a - 1] + " DRAIN " + subs[a - 1] + " DRAIN " + " PMOS");
                  setResult([...result,output]);

                }
                MOSCOUNT++;

                //output =subs[a], "WE ARE AT SUBS OF");
            }
          }
        else {
            //only have 1 mosfet. Before printing, complement the input.
            if (temp.length === 1) {
                output.push( "m" + MOSCOUNT + "  " + temp + "'" + "  " + temp + "  " + "  VDD" + " " + "  VDD" + "   " + "  PMOS" + "  not gate");
                setResult([...result,output]);

                MOSCOUNT++;
                output.push( "m" + MOSCOUNT + "  " + temp + "'" + "  " + temp + "   " + " 0" + " " + "  0" + " " + "  NMOS" + "  not gate");
                setResult([...result,output]);

                MOSCOUNT++;
                temp = temp + "'";
            }
            else if (temp.length === 2) {
                temp = temp.substring(0, 1);
            }
            output.push( "m" + MOSCOUNT + "  " + "Y" + "  " + temp + "  " + " VDD" + "  " + " VDD" + "  " + " PMOS" );
            setResult([...result,output]);

            MOSCOUNT++;
        }
       
    }
    NMOS(parts,MOSCOUNT);
  }
  
  
  function NMOS(parts, MOSCOUNT)
  {
    let node = 1;// nodes between the transistors
    for (let i = 0; i < parts.length; i++)//loop over all the terms
    {
        let term = parts[i];
        term = term + '&';
        let temp = "";
        let src = "", drn = "";

        //specify the drain and sirce for each term since they are all ANDed.
        if (i === 0)
        {
            if (i === (parts.length - 1))
            {
                src = "0"; drn = "Y";
            }
            else
            {
                src = node; drn = "Y";
            }
        }
        else
        {
            if (i === (parts.length - 1))
            {
                src = "0"; drn = node;
                node++;
            }
            else
            {
                src = node + 1; drn = node;
                node++;
            }
        }
        // loop over the inputs in the term and cout its drain and source. they all have the same source and drain since they are all ORed.
  
        for (let j = 0; j < term.length; j++) 
        {
            if (term[j] !== '&')
            {
                temp = temp + term[j];
            }
            else
            {
                if (temp.length === 1) {
                    temp = temp + "'";
                }
                else if (temp.length === 2) {
                    temp = temp.substring(0, 1);
                }
                output.push( "m" + MOSCOUNT + "   " + drn +"   " + temp + "   " + src + "   " + src + "  " + "  NMOS");
                setResult([...result,output]);

                MOSCOUNT++;
                temp = "";
            }
  
        }
    }
  
   
  
  }

  
  function mainF(input)
        { 


          
          //look for | sign to divide the equation into parts.
          let copy = input; //string
          let parts = [];
          let  index, temp;
          let flag = false;

          //output =copy, "NO DATA IN");
          //if there are no plus signs, then just put the whole thing as one part
          
          for(let i=0; i<copy.length; i++){ //index = copy.find('|');{    
            if(copy[i]==='|')
              {
                index =i;
                flag = true;
                break;
                //output ="Found OR GATE");
              }


          }
        
          //console.log(copy, "NA7NO HONA", index);
          
          if (flag === false) { //No OR Gate
              //output =copy, "No error yet")
              // for(let i = 0; i<copy.length; i++)
              //   parts[i].push(copy[i]);
              parts.push(copy);
              ////output =parts, "After error")

              //output ="NO OR GATE WE ARE HERE");
          }
        
          else {

              //otherwise find the first location of the |, once found add the substring before the | to the parts vector. Then make the equation start from after the plus so we can look for the next | and repeat the  process. Once no plus is found, this means that there is still one more term remaining, so just put it all   in the parts vector.
              let u = 1;
              while (flag === true) { //string::
                  u++;
                  temp = copy.substring(0, index);

                  //output =temp, "1stQ");
                  if (temp === "")//Check the term is not empty correct
                  {
                    output.push("Wrong Input 1");
                    setResult([...result,output]);
                    return;

                  } 
                  parts.push(temp);
                  copy = copy.substring(index + 1, copy.length);
                  //A|B|C
                  //console.log(copy, "WE ARE HERE");
                  flag = false;
                  for(let i=0; i<copy.length; i++){ //index = copy.find('|');{    
                    {
                      if(copy[i]==='|')
                      {
                        index =i;
                        flag = true;
    
                      }
                      //output.push(copy[i]);
                    }
                      
                  }

              }            
              if (copy === "")//Check the term is not empty correct
              {
                output.push("Wrong Input 2");
                setResult([...result,output]);

              }
              parts.push(copy);
              
          }
        
          
          // //PRINTING EACH PART
          //     output =parts;

        
        
        
          //FORMING THE PUN. CALLING THE AND FUNCTION
        
          AND(parts);
         // console.log(result, "WE ARE HERE");
        }

 
  return (
    <div className="App"> 

      <header className  = "head">
        <div className = "image">        
          <img  src={logo} width={150} height={150} alt="fireSpot"/>
        </div>

        <div className = "header">
          <h1>SPICE NetList Generator</h1>
        </div>
      </header>
      <div className="site">
      <div className = "page">
        <label>Enter Boolean Expression:</label>

        <div className = "expression">
          <label> Y = </label>
           <input 
              type = "text" 
              value = {exp}
              onChange = {(e) => setEXP(e.target.value)}
              exp = "Boolean Expression"/>
        </div>
        <div>
          
          <button onClick= {()=> mainF(exp)}>Submit</button> 
          {/* <p><div id = "result"> </div></p>  */}
            
          <div id="result" className='result'>

          <h2>SPICE NetList Generator:</h2>
          <br></br>
            <ul className='list'>
              {result.map((res) => (
                <>
                  {res.map((r) => (
                    <li>{r}</li>
                  ))}
                  <br />
                  <hr />
                  <br />
                </>
              ))}
            </ul>
          </div>


        <br></br>
            
            
            
            
          </div>
        

      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <br></br>
      <footer className='foot'> 

    <div className = "image1">        
          <img  src={foot} width={300} height={150} alt="fireSpot"/>
        </div>
        <div className='Credits'>
             <p>Collaborators: Maya Hussein  UID:900201198 - 
                            Mariam Ussama UID:900196082 -
                            Omar Miniesy  UID: 900202087 </p>
              <p>CSCE 3303</p>
              <p>Instructor: Dr. Dalia Selim</p>
              <p>The American University In Cairo</p>
        </div>
    </footer>
    </div>
      <br></br>
    
    </div>
  );
}



export default App;
