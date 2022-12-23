import psycopg2
import pymysql

db = pymysql.connect(host='172.18.129.22',
                     user='lc',
                     password='Unifound2022',
                     database='uniic',
                     charset='utf8')

conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'#
                        )
# 创建表
insert_sql="""insert into postgres.intro_ai.need_discussion_time(sid, name, days, time_min) VALUES ({},'{}',{},{})"""

select_sql = '''with b as (select a.logon_name, a.true_name, sum(time_in) as minute_in_room from(select logon_name,
       true_name,
       resv_end_time,
       resv_begin_time,
       HOUR(TIMEDIFF(resv_end_time, resv_begin_time)) * 60 + MINUTE(TIMEDIFF(resv_end_time, resv_begin_time)) as time_in
from icreserve)a
group by logon_name,a.true_name)

select a.logon_name,a.true_name, days, b.minute_in_room from(select logon_name,
       true_name,
       count(resv_date) as days

from icreserve
group by logon_name, true_name
order by days desc )a left join b on a.logon_name = b.logon_name'''

mysql = db.cursor()
postgres = conn.cursor()
# 使用 execute()  方法执行 SQL 查询

postgres.execute('truncate table intro_ai.need_discussion_time')

if __name__ == '__main__':
    mysql.execute(select_sql)
    data = mysql.fetchall()

    for i in data:

        s = insert_sql.format(i[0],i[1],i[2],i[3])
        # print(s)
        check = None
        try:
            check = int(i[0])
        except:
            None
        if check !=None:
            postgres.execute(s)
        # else:
            # print(i[0])



        # print(i)
        # break

    print("Done")
    conn.commit()
    mysql.close()
    postgres.close()
    conn.close()
    db.close()