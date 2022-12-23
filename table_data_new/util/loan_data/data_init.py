import json
import psycopg2
import requests
from bs4 import BeautifulSoup
import xmltodict
import json
import chardet

api_key = 'l8xx5e5a435e5b384f6ab5d935eabe882afd'

url = 'https://api-cn.hosted.exlibrisgroup.com.cn/almaws/v1/analytics/reports?path=/shared/South%20University%20of' \
      '%20Science%20and%20Technology%20of%20China/loan%20list/loan%20list&apikey={}&limit=1000'.format(api_key)

is_finished = False
resumption_token = ''

types = {
    'A': '马克思主义、列宁主义、毛泽东思想、邓小平理论',
    'B': '哲学、宗教',
    'C': '社会科学总论',
    'D': '政治、法律',
    'E': '军事',
    'F': '经济',
    'G': '文化、科学、教育、体育',
    'H': '语言、文字',
    'I': '文学',
    'J': '艺术',
    'K': '历史、地理',
    # 'L': 'Unknown',
    # 'M': 'Unknown',
    'N': '自然科学总论',
    'O': '数理科学和化学',
    'P': '天文学、地球科学',
    'Q': '生物科学',
    'R': '医药、卫生',
    'S': '农业科学',
    'T': '工业技术',
    'U': '交通运输',
    'V': '航空、航天',
    # 'W': 'Unknown',
    'X': '环境科学、安全科学',
    # 'Y': 'Unknown',
    'Z': '综合性图书'
}

loan_data = []
labels = {}
label_list = []
while not is_finished:
    # print(url)
    response = requests.get(url)
    d = xmltodict.parse(response.text, encoding='utf-8')
    if len(label_list) == 0:
        label_list = d['report']['QueryResult']['ResultXml']['rowset']['xsd:schema']['xsd:complexType']['xsd:sequence'][
            'xsd:element']
        for i in label_list:
            labels[i['@name']] = i['@saw-sql:columnHeading'].strip()
    loan_list = d['report']['QueryResult']['ResultXml']['rowset']['Row']

    for i in loan_list:
        data = {}
        flag = False
        for key in i.keys():
            data[labels[key]] = i[key]
            if labels[key] == 'EVALUATE(\'regexp_substr(%1,\'\'[0-9A-Za-z[:space:]\/\.\:\(\)\#\+\-]+\'\', ' \
                              '1,1)\', Permanent Call Number)':
                i[key] = i[key].strip()
                if i[key] == 'Unknown':
                    # print(i[key])
                    flag = True
                    break
                # print(i[key])
                if len(i[key]) > 4 and (i[key][:4] == 'CTC:' or i[key][:4] == 'MCC:'):
                    data['type'] = types[i[key][4]]
                    continue
                if len(i[key]) < 3 and str.isalpha(i[key]):
                    data['type'] = types['I']
                    continue
                if len(i[key]) >= 3 and str.isalpha(i[key][:3]):
                    data['type'] = types['I']
                    continue
                if len(i[key]) > 4 and (i[key][:4] == 'OC/E' or i[key][:4] == 'VI/E'):
                    data['type'] = types['I']
                    continue
                # if i[key][:4] == 'ER/E':
                #     print(i)
                if len(i[key]) > 4 and i[key][3] == ':':
                    data['type'] = types[i[key][4]]
                    continue
                t = i[key][0]
                # print(i)
                data['type'] = types[t]
        if flag:
            continue
        loan_data.append(data)
    if resumption_token == '':
        resumption_token = d['report']['QueryResult']['ResumptionToken']
        url = 'https://api-cn.hosted.exlibrisgroup.com.cn/almaws/v1/analytics/reports?token={}&apikey={}&li' \
              'mit=1000'.format(resumption_token, api_key)
    if d['report']['QueryResult']['IsFinished'] == 'true':
        is_finished = True

print(len(loan_data))

dic = {'loan_data': loan_data}

# filename = 'loan_data{}.json'.format('total')

# with open(filename, 'w', encoding='utf-8') as f:
#     f.write(json.dumps(dic, ensure_ascii=False))


"""
databse name: postgres
schema name: intro_ai
sql of creating table:
create table loan_data (
    id int primary key,
    sid int,
    last_name varchar,
    title varchar,
    loan_date date,
    return_date date,
    type varchar,
    patron_group varchar,
    barcode varchar,
    loans int,
    evaluate varchar
);
"""
# Connecting datebase config
conn = psycopg2.connect(database="postgres",
                        host="10.24.206.44",
                        user="cs309_proj",
                        password='123456',
                        port="5432")
cursor = conn.cursor()
cursor.execute('truncate table intro_ai.loan_data')

# Read date
# f = open('./loan_datatotal.json','rb')
data = dic

sql = "insert into intro_ai.loan_data (id, sid, last_name, title, loan_date, return_date, type, patron_group, barcode, loans, evaluate) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"
count = 0
for i in data['loan_data']:
    # Assign the value
    id=count
    count=count+1
    sid=None
    if 'Primary Identifier' in i.keys():
        sid = i['Primary Identifier']
    else:
        sid = i['User Primary Identifier']
    last_name=i['Last Name']
    title=i['Title']
    loan_date=i['Loan Date']
    type=i['type']
    barcode=i['Barcode']
    loans=i['Loans (In House + Not In House)']
    evaluate=i['EVALUATE(\'regexp_substr(%1,\'\'[0-9A-Za-z[:space:]\\/\\.\\:\\(\\)\\#\\+\\-]+\'\', 1,1)\', Permanent Call Number)']
    # return_date and patron_group may be null 
    try:    
       return_date=i['Return Date']
    except:
        return_date=None
    try:
        patron_group=i['Patron Group']
    except:
        patron_group=None
        
    # Execute sql
    cursor.execute(sql,(id,sid,last_name,title,loan_date,return_date,type,patron_group,barcode,loans,evaluate))
    
# f.close()
# Commit change
conn.commit()
# Close the connection
conn.close()
    