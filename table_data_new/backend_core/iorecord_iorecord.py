import psycopg2
import re
import cx_Oracle as cx     
con = cx.connect('EXTZNCARD', 'EXTZNCARDADMIN', '172.18.18.25:1521/ORCL11G') 
cursor = con.cursor()       
cursor.execute("""SELECT
EMPLOYEENO, 
EMPNAME,
OCCURTIME,
DEVICENO,
DEVICENAME,
FLAG
FROM SYNONYM_EMP_GUARD_DATA_9084
WHERE FLAG = 'I' 
AND (DEVICENAME LIKE '琳恩%'
OR DEVICENAME LIKE '一丹%'
OR DEVICENAME LIKE '涵泳%')
""")
data = cursor.fetchall()

conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'#
                        )

insert_sql="""insert into iorecord_iorecord (id, user_id, user_name, occur_time, device_id, device_name, which_library, is_in) values ({},'{}','{}','{}','{}','{}','{}',true)"""
insert_sql="""insert into iorecord_iorecord (id, user_id, user_name, occur_time, device_id, device_name, which_library, is_in) values ({},'{}','{}','{}','{}','{}','{}',true)"""

postgres = conn.cursor()
postgres.execute('truncate table iorecord_iorecord')
# print(data)
if __name__ == '__main__':

    cnt = 0
    for line in data:
        lib=''
        if re.search('琳恩',line[4]) is not None:
            lib='琳恩'
        elif re.search('涵泳',line[4]) is not None:
            lib='涵泳'
        elif re.search('一丹',line[4]) is not None:
            lib='一丹'

        s = insert_sql.format(cnt, line[0], line[1],line[2],line[3],line[4],lib)

        cnt += 1
        postgres.execute(s)
        if cnt % 1000==0:
            print(cnt)
    conn.commit()
    print("Done")
    postgres.close()
    conn.close()
