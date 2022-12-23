import pymysql
import psycopg2
import re

if __name__ == '__main__':
    db = pymysql.connect(host='172.18.129.22',
                         user='lc',
                         password='Unifound2022',
                         database='uniic',
                         charset='utf8')



    conn = psycopg2.connect(host="10.24.206.44", port=5432,
                            user="cs309_proj", password="123456",
                            database='postgres'#
                            )

    insert_sql="""insert into discussionroom_discussionroom(id, user_id, user_name, reserve_date, reserve_begin, reserve_end, dev_name, which_library) VALUES ({},'{}','{}','{}','{}','{}','{}','{}')"""

    select_sql = '''select logon_name,true_name,resv_date,resv_begin_time,resv_end_time,dev_name from icreserve'''

    postgres = conn.cursor()
    postgres.execute('truncate table discussionroom_discussionroom')

    mysql = db.cursor()
    mysql.execute(select_sql)
    data = mysql.fetchall()

    cnt = 0
    for line in data:
        lib=''
        if re.search('G\d+',line[5]) is not None or re.search('琳恩',line[5]) is not None:
            lib='琳恩'
        elif re.search('C\d+',line[5]) is not None :
            lib='涵泳'
        elif re.search('\d+',line[5]) is not None:
            lib='一丹'
        # s = insert_sql.format(cnt, line[0], line[1],line[2],line[3],line[4],line[5],lib)
        # print(line)
        s = insert_sql.format(cnt, line[0], line[1],line[2],line[3],line[4],line[5],lib)
        cnt += 1
        postgres.execute(s)
        # if cnt % 1000==0:
        #     print(cnt)
    
    conn.commit()
    print("Done")
    
    postgres.close()
    conn.close()
    mysql.close()
    db.close()
