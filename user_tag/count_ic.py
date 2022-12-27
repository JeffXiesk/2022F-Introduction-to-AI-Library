from datetime import datetime
import csv

data = list()
with open("./loan_data.csv", "r", encoding='gbk') as file:
    data = file.readlines()

count_dic = dict()  # sid : [count, [type], patron_group]

index = {
    '马克思主义、列宁主义、毛泽东思想、邓小平理论': 0,
    '哲学、宗教': 1,
    '社会科学总论': 2,
    '政治、法律': 3,
    '军事': 4,
    '经济': 5,
    '文化、科学、教育、体育': 6,
    '语言、文字': 7,
    '文学': 8,
    '艺术': 9,
    '历史、地理': 10,
    '自然科学总论': 11,
    '数理科学和化学': 12,
    '天文学、地球科学': 13,
    '生物科学': 14,
    '医药、卫生': 15,
    '农业科学': 16,
    '工业技术': 17,
    '交通运输': 18,
    '航空、航天': 19,
    '环境科学、安全科学': 20,
    '综合性图书': 21
}

for i in range(1, len(data)):
    line = data[i]
    temp = line.split(",")
    sid = temp[1]
    book_type = temp[6]
    patron_group = temp[7]
    if sid in count_dic.keys():
        count_dic[sid][0] += 1
        count_dic[sid][1][index[book_type]] += 1
    else:
        info = []
        info.append(1)
        info.append([0]*22)
        info[1][index[book_type]] += 1
        info.append(patron_group)
        count_dic[sid] = info

# print(count_dic)

with open("./loan_output.csv", "w", newline='', encoding='utf-8') as output:
    # fieldnames = ['sid',
    # 'count', 
    # 'patron',
    # '马克思主义、列宁主义、毛泽东思想、邓小平理论', 
    # '哲学、宗教',
    # '社会科学总论',
    # '政治、法律',
    # '军事',
    # '经济',
    # '文化、科学、教育、体育',
    # '语言、文字',
    # '文学',
    # '艺术',
    # '历史、地理',
    # '自然科学总论',
    # '数理科学和化学',
    # '天文学、地球科学',
    # '生物科学',
    # '医药、卫生',
    # '农业科学',
    # '工业技术',
    # '交通运输',
    # '航空、航天',
    # '环境科学、安全科学',
    # '综合性图书']

    fieldnames = ['sid',
    'count', 
    'patron', 
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 
    17, 18, 19, 20, 21]

    csvwriter = csv.DictWriter(output, fieldnames=fieldnames)
    csvwriter.writeheader()
    for sid in count_dic.keys():
        temp_dict = dict()
        temp_dict['sid'] = sid
        temp_dict['count'] = count_dic[sid][0]
        temp_dict['patron'] = count_dic[sid][2]
        for i in range(3, len(fieldnames)):
            temp_dict[fieldnames[i]] = count_dic[sid][1][i-3]
        csvwriter.writerow(temp_dict)


# for sid in count_dic.keys():
#     count_dic[sid][1] = str(count_dic[sid][1])
# header = []
# count_type = {}
# group = {}
# for key in count_dic.keys():
#     header.append(key)
#     count_type[key] = count_dic[key][1]
#     group[key] = count_dic[key][2]

# # print(count_dic.values())
# with open("./loan_output.csv", "w", newline='', encoding='gbk') as outfile:
#     csvwriter = csv.DictWriter(outfile, fieldnames=header)
#     csvwriter.writeheader()
#     csvwriter.writerow(count_type)
#     csvwriter.writerow(group)
# print(count_dic)




