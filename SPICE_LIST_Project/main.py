#from pickle import FALSE
import sys
from PyQt5 import QtCore, QtWidgets
from PyQt5.QtWidgets import QMainWindow, QWidget, QLabel, QLineEdit, QGraphicsView, QTableWidget
from PyQt5.QtWidgets import QPushButton
from PyQt5.QtCore import QSize  
from PyQt5.QtGui import *
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.QtWidgets import QMainWindow, QApplication, QWidget, QAction, QTableWidget,QTableWidgetItem,QVBoxLayout
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import pyqtSlot



import schemdraw
import schemdraw.elements as elm


class App(QMainWindow):
    def __init__(self):
        super().__init__()
        self.title = 'CMOS Circuit SPICE Generator'
        self.left = 0
        self.top = 0
        self.width = 1000
        self.height = 850
        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)
  
        
        self.nameLabel = QLabel(self)
        self.nameLabel.setText('Enter Boolean Expression:')
        self.nameLabel.resize(300, 32)
        
        self.user_input= QLineEdit(self)
        self.user_input.move(180, 20)
        self.user_input.resize(200, 32)
        self.nameLabel.move(20, 20)

        result = []
        def mainF (input):
                copy = input
                parts = []
                flag = False

                #vector <string> parts;
                #int index;
                #string temp;


                #if there are no plus signs, then just put the whole thing as one part
                for i in range(0, len(copy)):#in copy: #(let i=0; i<copy.length; i++){ //index = copy.find('|');{    
                    if copy[i]=='|':
                        index =i;
                        flag = True;
                        break;
                        #index = copy.index('|');

                if flag == False:
                    parts.append(copy);
                
                else:
                    #otherwise find the first location of the |, once found add the substring before the | to the parts vector. Then make the equation start from after the plus so we can look for the next | and repeat the  process. Once no plus is found, this means that there is still one more term remaining, so just put it all   in the parts vector.
                    u = 1
                    while flag ==True:
                        u+=1
                        temp = copy[0:index];
                        if (temp == ""): #Check the term is not empty correct
                            print("Wrong Input 1")
                            return 0;
                            
                        parts.append(temp);
                        flag = False
                        copy = copy[index+1:len(copy)]#.substr(index + 1, copy.length() - index);
                        for i in range(0, len(copy)):#in copy: #(let i=0; i<copy.length; i++){ //index = copy.find('|');{    
                            if copy[i]=='|':
                                index =i;
                                flag = True;
                        
                        
                    
                            
                    if (copy == ""): #Check the term is not empty correct
                        print("Wrong Input 2")
                        return 0;
                        
                    parts.append(copy);
                    


                #PRINTING EACH PART

                for  i in range(0, len(parts)):#parts:
                    print(parts[i])
                


                #FORMING THE PUN. CALLING THE AND FUNCTION

                AND(parts)
                return result
                #to form the PDN, we need to find YBAR, and then switch each and with an or and do the exact same code. (I think).

        def AND(parts):

            MOSCOUNT = 0

            # if len(parts) == 1 & len(parts[0])==1:
            #     print("No spice netlists, output equals the input") 
            #     return


            for i in range(0, len(parts)):#parts:

                #divide each part into a vector, where each slot in the vector will have everything before and after every &.
                temp = parts[i]
                flag = False;
                
                #look for &. if none are found then there is only one transistor in this branch. Make flag true if an & is found, otherwise, skip the big if statement and go down to the else. 
                for x in range(0, len(temp)):#temp:
                    if temp[x] == '&':
                        flag = True;
                        break;
                    

                #This code works by adding the characters to a string, once an & is found, add that string to the subs vector and then hold that & location and then set string to "" and look for the next and. 
                # For the last and, the final characters after it will not be counted by that for loop, so we add to the subs vector the last character by using the last & location.

                if flag:

                    subs = []
                    something = ""
                    andlocation = 0;
                    
                    
                    for j in range(0, len(temp)):#temp: #range(0,temp.length()):
                        if temp[j] != '&':
                            something = something + temp[j];
                        else :
                            if something == "":#Check the term is not empty correct
                                print("Wrong Input 1")
                                return

                            subs.append(something);
                            something = "";
                            andlocation = j;
                        
                        
                    if temp[andlocation: len(temp)] == "": #Check the term is not empty correct
                        print("Wrong Input 2")
                        return

                    subs.append(temp[andlocation + 1 : len(temp)]);
                    
                    
                    #complement all subs. Each sub is either a letter or a complement of a letter. If there is only a letter, add a complement. If there is a complement, then remove it.
                    for b in range (0,len(subs)):
                        if len(subs[b]) == 1:
                            print("m" + str(MOSCOUNT) + " " + str(subs[b]) + "'" + " " + str(subs[b]) + " " + "VDD" + " " + "VDD" + " " + "PMOS" +"\t\t not gate")
                            MOSCOUNT+=1
                            print("m" + str(MOSCOUNT) + " " + str(subs[b]) + "'" + " " + str(subs[b]) + " " + "0" + " " + "0" + " " + "NMOS" +"\t\t not gate")
                            MOSCOUNT+=1

                            subs[b] = subs[b]+"'"
                            
                        elif len(subs[b]) == 2: 
                            subs[b] = subs[b][0: 1];



                    #now do the loop that will go on the subs.size() and make the first one connected to VDD, the ones in the middle connected to each other, and the last one connected to y. The way this works is that it simply goes to the sub that is before it and the one after it if it is in between anything.
                    for a in range(0, len(subs)): #in subs: #(int a = 0; a < subs.size(); a++) {
                        if a == 0:
                            print("m" + str(MOSCOUNT) + " " + str(subs[a + 1]) + "SOURCE" + " " + str(subs[a]) + " " + "VDD" + " " + "VDD" + " " + "PMOS")

                        elif a == len(subs) - 1:
                            print("m" + str(MOSCOUNT) + " " + "Y" + " " + str(subs[a]) + " " + str(subs[a - 1]) + "DRAIN " + str(subs[a - 1]) + "DRAIN " + "PMOS")
                        
                        else:
                            print("m"+ str(MOSCOUNT)+ " "+ str(subs[a+1])+ "Source"+ " "+ str(subs[a])+ " "+ str(subs[a-1])+ "DRAIN"+ str(subs[a-1]) + "DRAIN "+ " PMOS")
                        
                        MOSCOUNT+=1


                else:
                    #only have 1 mosfet. Before printing, complement the input.
                    if len(temp) == 1:
                        print("m" + str(MOSCOUNT) + " " + str(temp) + "'" + " " + str(temp) + " " + "VDD" + " " + "VDD" + " " + "PMOS" + "\t\t not gate")
                        MOSCOUNT+=1
                        print("m" + str(MOSCOUNT) + " " + str(temp) + "'" + " " + str(temp) + " " + "0" + " " + "0" + " " + "NMOS" + "\t\t not gate")
                        MOSCOUNT+=1
                        temp = temp + "'"

                    elif len(temp) == 2:
                        temp = temp[0: 1];

                    print("m" + str(MOSCOUNT) + " " + "Y" + " " + str(temp) + " " + "VDD" + " " + "VDD" + " " + "PMOS");
                    MOSCOUNT+=1
            
            NMOS(parts,MOSCOUNT)
        
        def NMOS(parts, MOSCOUNT):
                node = 1; # nodes between the transistors
                for i in range(0, len(parts)): #in parts: #(int i = 0; i < parts.size(); i++)#loop over all the terms
                    term = parts[i]
                    term = term + '&';
                    temp = ""
                    src = ""
                    drn = ""
                    #specify the drain and sirce for each term since they are all ANDed.
                    if i == 0:
                        if i == (len(parts) - 1):
                            src = "0"
                            drn = "Y"
                        else:
                            src = node
                            drn = "Y"


                    else:
                        if i == (len(parts) - 1):
                            src = "0"
                            drn = node
                            node+=1
                            
                        else:
                            src = node + 1
                            drn = node
                            node+=1
                    
                    
                    # loop over the inputs in the term and cout its drain and source. they all have the same source and drain since they are all ORed.

                    for j in range (0, len(term)): #term: #(int j = 0; j < term.size(); j++) 
                        if term[j] != '&':
                            temp = temp + term[j]
                        else:
                            if len(temp) == 1:
                                temp = temp + "'"
                                
                            elif len(temp) == 2:
                                temp = temp[0: 1]

                            print("m" + str(MOSCOUNT) + " " + str(drn) +" " + str(temp) + " " + str(src) + " " + str(src) + " " + "NMOS")
                            MOSCOUNT+=1
                            temp = ""
                        
        #Define Table



        # self.tableWidgetR = QTableWidget()
        # self.layout = QVBoxLayout()
        # self.layout.addWidget(self.tableWidgetR) 
        # self.setLayout(self.layout)
            
        
        def clickMethod():  
            mainF(self.user_input.text())

            # list3 = result
            # #Row and Column count
            # self.tableWidgetR.setRowCount(len(list3)+1) 
            # self.tableWidgetR.setColumnCount(1)  

            # self.tableWidgetR.setItem(0,0, QTableWidgetItem("SPICE NetList Generator"))
            
        
            # for i in range(len(list3)):
            #     item = list3[i]
            #     for j in range(1):
            #         value = item[j]
            #         self.tableWidgetR.setItem(i+1,j, QTableWidgetItem(value))

    
            # #Table will fit the screen horizontally
            # self.tableWidgetR.horizontalHeader().setStretchLastSection(True)
            # self.tableWidgetR.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch) 

            
            
            
            
            
        
            
        pybutton = QPushButton('OK', self)
        pybutton.clicked.connect(clickMethod)
        
        pybutton.resize(200,32)
        pybutton.move(180, 60)
        
    # with schemdraw.Drawing() as d:
    #     d.add(elm.Resistor())
    #     d.add(elm.Capacitor())
    #     d.add(elm.Diode())
        
        
        
        


    

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    mainWin = App()
    mainWin.show()
    sys.exit( app.exec_() )