#include <iostream>
#include <string>
#include <vector>

using namespace std;

void AND(vector <string>& parts);
void NMOS(vector <string>& parts, int MOSCOUNT);

int main() {

    //inputting the equation.
    cout << "Enter boolean function (DO NOT INCLUDE SPACES):  y = ";
    string input = "";
    cin >> input;

    //look for | sign to divide the equation into parts.
    string copy = input;
    vector <string> parts;
    int index;
    string temp;

    //if there are no plus signs, then just put the whole thing as one part

    index = copy.find('|');

    if (index == string::npos) {
        parts.push_back(copy);
    }
    else {
        //otherwise find the first location of the |, once found add the substring before the | to the parts vector. Then make the equation start from after the plus so we can look for the next | and repeat the  process. Once no plus is found, this means that there is still one more term remaining, so just put it all   in the parts vector.
        int i = 1;
        while (index != string::npos) {
            i++;
            temp = copy.substr(0, index);
            if (temp == "")//Check the term is not empty correct
            {
                 cout << "Wrong Input" << endl; return 0;
            }
            parts.push_back(temp);
            copy = copy.substr(index + 1, copy.length() - index);
            index = copy.find('|');
        }            
        if (copy == "")//Check the term is not empty correct
        {
            cout << "Wrong Input" << endl; return 0;
        }
        parts.push_back(copy);
        
    }


    //PRINTING EACH PART

    for (int i = 0; i < parts.size(); i++) {
        cout << parts[i] << endl;
    }


    //FORMING THE PUN. CALLING THE AND FUNCTION

    AND(parts);

    //to form the PDN, we need to find YBAR, and then switch each and with an or and do the exact same code. (I think).

}

void AND(vector <string>& parts) {

    int MOSCOUNT = 0;

    if (parts.size() == 1 && parts[0].size()==1)
    {
        cout << "No spice netlists, output equals the input" << endl; return;
    }

    for (int i = 0; i < parts.size(); i++) {

        //divide each part into a vector, where each slot in the vector will have everything before and after every &.
        string temp = parts[i];
        bool flag = false;
        //look for &. if none are found then there is only one transistor in this branch. Make flag true if an & is found, otherwise, skip the big if statement and go down to the else. 
        for (int x = 0; x < temp.length(); x++) {
            if (temp[x] == '&') {
                flag = true;
                break;
            }
        }

        //This code works by adding the characters to a string, once a & is found, add that string to the subs vector and then hold that & location and then set string to "" and look for the next and. For the last and, the final characters after it will not be counted by that for loop, so we add to the subs vector the last character by using the last & location.

        if (flag) {

            vector <string> subs;
            string something = "";
            int andlocation = 0;
            for (int j = 0; j < temp.length(); j++) {
                if (temp[j] != '&')
                    something = something + temp[j];
                else {
                    if (something == "")//Check the term is not empty correct
                    {
                        cout << "Wrong Input" << endl; return ;
                    }
                    subs.push_back(something);
                    something = "";
                    andlocation = j;
                }
            }
            if (temp.substr(andlocation + 1, temp.length() - andlocation) == "")//Check the term is not empty correct
            {
                cout << "Wrong Input" << endl; return;
            }
            subs.push_back(temp.substr(andlocation + 1, temp.length() - andlocation));


            //complement all subs. Each sub is either a letter or a complement of a letter. If there is only a letter, add a complement. If there is a complement, then remove it.
            for (int b = 0; b < subs.size(); b++) {
                if (subs.at(b).length() == 1) {
                    cout << "m" << MOSCOUNT << " " << subs.at(b) + "'" << " " << subs.at(b) << " " << "VDD" << " " << "VDD" << " " << "PMOS" <<"\t\t not gate" << endl;
                    MOSCOUNT++;
                    cout << "m" << MOSCOUNT << " " << subs.at(b) + "'" << " " << subs.at(b) << " " << "0" << " " << "0" << " " << "NMOS" <<"\t\t not gate" << endl;
                    MOSCOUNT++;

                    subs.at(b) = subs.at(b)+"'";
                }
                else if (subs.at(b).length() == 2) {
                    subs.at(b) = subs.at(b).substr(0, 1);
                }
            }

            //now do the loop that will go on the subs.size() and make the first one connected to VDD, the ones in the middle connected to each other, and the last one connected to y. The way this works is that it simply goes to the sub that is before it and the one after it if it is in between anything.

            for (int a = 0; a < subs.size(); a++) {
                if (a == 0) {
                    cout << "m" << MOSCOUNT << " " << subs[a + 1] << "SOURCE" << " " << subs[a] << " " << "VDD" << " " << "VDD" << " " << "PMOS" << endl;
                }
                else if (a == subs.size() - 1) {
                    cout << "m" << MOSCOUNT << " " << "Y" << " " << subs[a] << " " << subs[a - 1] << "DRAIN " << subs[a - 1] << "DRAIN " << "PMOS" << endl;
                }
                else {
                    cout << "m" << MOSCOUNT << " " << subs[a + 1] << "SOURCE" << " " << subs[a] << " " << subs[a - 1] << "DRAIN " << subs[a - 1] << "DRAIN " << "PMOS" << endl;
                }
                MOSCOUNT++;
            }

        }
        else {
            //only have 1 mosfet. Before printing, complement the input.
            if (temp.length() == 1) {
                cout << "m" << MOSCOUNT << " " << temp + "'" << " " << temp << " " << "VDD" << " " << "VDD" << " " << "PMOS" << "\t\t not gate" << endl;
                MOSCOUNT++;
                cout << "m" << MOSCOUNT << " " << temp + "'" << " " << temp << " " << "0" << " " << "0" << " " << "NMOS" << "\t\t not gate" << endl;
                MOSCOUNT++;
                temp = temp + "'";
            }
            else if (temp.length() == 2) {
                temp = temp.substr(0, 1);
            }
            cout << "m" << MOSCOUNT << " " << "Y" << " " << temp << " " << "VDD" << " " << "VDD" << " " << "PMOS" << endl;
            MOSCOUNT++;
        }
       
    }
    NMOS(parts,MOSCOUNT);
}
void NMOS(vector <string>& parts, int MOSCOUNT)
{
    int node = 1;// nodes between the transistors
    for (int i = 0; i < parts.size(); i++)//loop over all the terms
    {
        string term = parts[i];
        term = term + '&';
        string temp = "";
        string src = "", drn = "";
        //specify the drain and sirce for each term since they are all ANDed.
        if (i == 0)
        {
            if (i == (parts.size() - 1))
            {
                src = "0"; drn = "Y";
            }
            else
            {
                src = to_string(node); drn = "Y";
            }
        }
        else
        {
            if (i == (parts.size() - 1))
            {
                src = "0"; drn = to_string(node);
                node++;
            }
            else
            {
                src = to_string(node + 1); drn = to_string(node);
                node++;
            }
        }
        // loop over the inputs in the term and cout its drain and source. they all have the same source and drain since they are all ORed.

        for (int j = 0; j < term.size(); j++) 
        {
            if (term[j] != '&')
            {
                temp = temp + term[j];
            }
            else
            {
                if (temp.length() == 1) {
                    temp = temp + "'";
                }
                else if (temp.length() == 2) {
                    temp = temp.substr(0, 1);
                }
                cout << "m" << MOSCOUNT << " " << drn <<" " << temp << " " << src << " " << src << " " << "NMOS" << endl;
                MOSCOUNT++;
                temp = "";
            }

        }
    }

   

}