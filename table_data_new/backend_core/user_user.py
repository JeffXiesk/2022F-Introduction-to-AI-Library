import psycopg2




conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'#
                        )
# 创建表
insert_sql="""insert into user_user (id, user_id, user_name, reading, student_type, department_id, department_name, special_id, special_name, sex, college_id, college_name, grade_year, email) 
VALUES ({},'{}','{}',true,' ',' ',' ',' ',' ',true,' ',' ',0,' ')"""

insert_sql_new="""insert into user_user (id, user_id, user_name, reading, student_type, department_id, department_name, special_id, special_name, sex, college_id, college_name, grade_year, email) 
VALUES (%s,%s,%s,true,' ',' ',' ',' ',' ',true,' ',' ',0,' ')"""

select_sql = '''select sid,barcode,loan_date,return_date,patron_group,loans  from postgres.intro_ai.loan_data'''
postgres = conn.cursor()
postgres.execute('truncate table user_user')

def findres(line):
    if line == 'None':
        return 0
    else:
        return line

# 使用 execute()  方法执行 SQL 查询
if __name__ == '__main__':
    with open('./table/final.csv', 'r', encoding='utf-8') as f:
        data = f.readlines()
        cnt = 0
        args=[]
        for i in data:
            line = i.split(',')
            s = insert_sql.format(cnt, line[0], line[1])
            # args.append((cnt, line[0], line[1]))
            cnt += 1
            postgres.execute(s)

            # if cnt % 1000==0:
            #     print(cnt)
        # postgres.executemany(insert_sql_new,args)
        conn.commit()
        print("Done")
        postgres.close()
        conn.close()
