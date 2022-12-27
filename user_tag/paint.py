import numpy as np  
import matplotlib.mlab as mlab  
import matplotlib.pyplot as plt  

data = list()
with open("./loan_output.csv", "r", encoding='gbk') as file:
    data = file.readlines()


 
X=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']

Y=[0] * 22  

for i in range(1, len(data)):
    for j in range(22):
        d_list = data[i].split(",")
        Y[j] += int(d_list[j+3])

fig = plt.figure()
plt.bar(X,Y,0.4,color="green")
plt.xlabel("type")
plt.ylabel("count")
plt.title("type-count")
  
 
plt.show()  
plt.savefig("barChart.jpg")