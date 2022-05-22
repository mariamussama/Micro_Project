//#include <stdio.h>

function mainF(){
    // string input = "";
    // cin >> input;
    var input = document.getElementById("Boolean Expression").value;
    window.alert("No spice netlists, output equals the input");

    document.getElementById("result").innerHTML = "No spice netlists, output equals the input";
    //look for | sign to divide the equation into parts.
    let copy = input;
    var parts = [];
    let  index, temp;
    let npos;
    //if there are no plus signs, then just put the whole thing as one part
  
    index = copy.find('|');
  
    if (index === npos) { //string::{
        parts.push_back(copy);
    }
  
    else {
        //otherwise find the first location of the |, once found add the substring before the | to the parts vector. Then make the equation start from after the plus so we can look for the next | and repeat the  process. Once no plus is found, this means that there is still one more term remaining, so just put it all   in the parts vector.
        let i = 1;
        while (index !== npos) { //string::
            i++;
            temp = copy.substr(0, index);
            if (temp === "")//Check the term is not empty correct
            {
              document.write("Wrong Input");
            }
            parts.push_back(temp);
            copy = copy.substr(index + 1, copy.length() - index);
            index = copy.find('|');
        }            
        if (copy === "")//Check the term is not empty correct
        {
          document.write("Wrong Input");
        }
        parts.push_back(copy);
        
    }
  
  
    //PRINTING EACH PART
  
    for (let i = 0; i < parts.size(); i++) {
        document.write( parts[i]);
    }
  
  
    //FORMING THE PUN. CALLING THE AND FUNCTION
  
    AND(parts);
}



function AND(parts) {

    let MOSCOUNT = 0;
  
    if (parts.size() === 1 && parts[0].size()===1)
    {
          document.write("No spice netlists, output equals the input");
    }
  
    for (let i = 0; i < parts.size(); i++) {
  
        //divide each part into a vector, where each slot in the vector will have everything before and after every &.
        let temp = parts[i];
        let flag = false;
        //look for &. if none are found then there is only one transistor in this branch. Make flag true if an & is found, otherwise, skip the big if statement and go down to the else. 
        for (let x = 0; x < temp.length(); x++) {
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
            for (let j = 0; j < temp.length(); j++) {
                if (temp[j] !== '&')
                    something = something + temp[j];
                else {
                    if (something === "")//Check the term is not empty correct
                    {
                      document.write("Wrong Input");
                    }
                    subs.push_back(something);
                    something = "";
                    andlocation = j;
                }
            }
            if (temp.substr(andlocation + 1, temp.length() - andlocation) === "")//Check the term is not empty correct
            {
              document.write("Wrong Input");
            }
            subs.push_back(temp.substr(andlocation + 1, temp.length() - andlocation));
  
  
            //complement all subs. Each sub is either a letter or a complement of a letter. If there is only a letter, add a complement. If there is a complement, then remove it.
            for (let b = 0; b < subs.size(); b++) {
                if (subs.at(b).length() === 1) {
                    document.write("m", MOSCOUNT, " ", subs[b] + "'", " ", subs[b], " ", "VDD", " " , "VDD" , " " , "PMOS" ,"\t\t not gate");
                    MOSCOUNT++;
                    document.write("m" , MOSCOUNT , " " , subs[b] + "'" , " " , subs.at(b) , " " , "0" , " " , "0" , " " , "NMOS" , "\t\t not gate");
                    MOSCOUNT++;
  
                    subs[b] = subs[b]+"'";
                }
                else if (subs[b].length() === 2) {
                    subs[b] = subs[b].substr(0, 1);
                }
            }
  
            //now do the loop that will go on the subs.size() and make the first one connected to VDD, the ones in the middle connected to each other, and the last one connected to y. The way this works is that it simply goes to the sub that is before it and the one after it if it is in between anything.
  
            for (let a = 0; a < subs.size(); a++) {
                if (a === 0) {
                    document.write( "m" , MOSCOUNT , " " , subs[a + 1] , "SOURCE" , " " , subs[a] , " " , "VDD" , " " , "VDD" , " " , "PMOS");
                }
                else if (a === subs.size() - 1) {
                    document.write( "m" , MOSCOUNT , " " , "Y" , " " , subs[a] , " " , subs[a - 1] , "DRAIN " , subs[a - 1] , "DRAIN " , "PMOS");
                }
                else {
                    document.write( "m" , MOSCOUNT , " " , subs[a + 1] , "SOURCE" , " " , subs[a] , " " , subs[a - 1] , "DRAIN " , subs[a - 1] , "DRAIN " , "PMOS");
                }
                MOSCOUNT++;
            }
  
        }
        else {
            //only have 1 mosfet. Before printing, complement the input.
            if (temp.length() === 1) {
                document.write( "m" , MOSCOUNT , " " , temp + "'" , " " , temp , " " , "VDD" , " " , "VDD" , " " , "PMOS" , "\t\t not gate");
                MOSCOUNT++;
                document.write( "m" , MOSCOUNT , " " , temp + "'" , " " , temp , " " , "0" , " " , "0" , " " , "NMOS" , "\t\t not gate");
                MOSCOUNT++;
                temp = temp + "'";
            }
            else if (temp.length() === 2) {
                temp = temp.substr(0, 1);
            }
            document.write( "m" , MOSCOUNT , " " , "Y" , " " , temp , " " , "VDD" , " " , "VDD" , " " , "PMOS" );
            MOSCOUNT++;
        }
       
    }
    NMOS(parts,MOSCOUNT);
}
  
  
function NMOS(parts, MOSCOUNT)
  {
    let node = 1;// nodes between the transistors
    for (let i = 0; i < parts.size(); i++)//loop over all the terms
    {
        let term = parts[i];
        term = term + '&';
        let temp = "";
        let src = "", drn = "";
        //specify the drain and sirce for each term since they are all ANDed.
        if (i === 0)
        {
            if (i === (parts.size() - 1))
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
            if (i === (parts.size() - 1))
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
  
        for (let j = 0; j < term.size(); j++) 
        {
            if (term[j] !== '&')
            {
                temp = temp + term[j];
            }
            else
            {
                if (temp.length() === 1) {
                    temp = temp + "'";
                }
                else if (temp.length() === 2) {
                    temp = temp.substr(0, 1);
                }
                document.write( "m" , MOSCOUNT , " " , drn ," " , temp , " " , src , " " , src , " " , "NMOS");
                MOSCOUNT++;
                temp = "";
            }
  
        }
    }
  
   
  
  }