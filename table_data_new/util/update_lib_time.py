import _locale

import psycopg2

_locale._getdefaultlocale = (lambda *args: ['zh_CN', 'utf8'])

import cx_Oracle as cx

con = cx.connect('EXTZNCARD', 'EXTZNCARDADMIN', '172.18.18.25:1521/ORCL11G')
oracle = con.cursor()
conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'  #
                        )
postgres = conn.cursor()
oracle.execute("""with aa as (SELECT EMPLOYEENO, EMPNAME, count(LIBDATE) as LIBCOUNT
            from (SELECT EMPLOYEENO, EMPNAME, LIBDATE
                  FROM (SELECT EMPLOYEENO, -- 编号
                               EMPNAME,    -- 姓名
                               OCCURTIME,  -- 刷卡时间
                               DEVICENO,   -- 刷卡编号
                               (to_date(substr(OCCURTIME, 0, 10))) as LIBDATE,
                               DEVICENAME, -- 设备名称
                               FLAG        -- 进出标志
                        FROM SYNONYM_EMP_GUARD_DATA_9084
                        where (DEVICENAME like '琳恩%'
                            or DEVICENAME like '一丹%'
                            or DEVICENAME like '涵泳%')
                          and OCCURTIME >= (select TRUNC(SYSDATE - 1) from dual)
                          and OCCURTIME < (select TRUNC(SYSDATE) from dual)
                       )

                  group by EMPLOYEENO, EMPNAME, LIBDATE
                  order by LIBDATE asc)
            group by EMPLOYEENO, EMPNAME
            order by EMPLOYEENO DESC),
     bb as (SELECT EMPLOYEENO, EMPNAME, sum(ATTIME_min) as LIBTIME
            FROM (SELECT EMPLOYEENO,
                         EMPNAME,
                         OCCURTIME,
                         DEVICENO,
                         DEVICENAME,
                         FLAG,
                         pre,
                         PREFLAG,
                         (ROUND(TO_NUMBER(OCCURTIME - pre) * 24 * 60)) as ATTIME_min
                  FROM (SELECT EMPLOYEENO, -- 编号
                               EMPNAME,    -- 姓名
                               OCCURTIME,  -- 刷卡时间
                               DEVICENO,   -- 刷卡编号
                               DEVICENAME, -- 设备名称
                               FLAG,       -- 进出标志

                               lag(OCCURTIME, 1) over (partition by EMPLOYEENO order by OCCURTIME asc) as pre,
                               lag(FLAG, 1) over (partition by EMPLOYEENO order by OCCURTIME asc)      as PREFLAG

                        FROM SYNONYM_EMP_GUARD_DATA_9084
                        WHERE OCCURTIME >= (select TRUNC(SYSDATE - 1) from dual)
                          and OCCURTIME < (select TRUNC(SYSDATE) from dual)
                        order by EMPLOYEENO, OCCURTIME asc)
                  where FLAG = 'O'
                    and PREFLAG = 'I')
            where ATTIME_min < 1440
            GROUP BY EMPLOYEENO, EMPNAME
            ORDER BY EMPLOYEENO DESC)
SELECT aa.EMPLOYEENO, aa.EMPNAME, aa.LIBCOUNT, bb.LIBTIME
from aa
         left join bb on aa.EMPLOYEENO = bb.EMPLOYEENO
order by aa.EMPLOYEENO""")

update_sql = "update postgres.intro_ai.library_time set days_in_lib ={} , time_in_lib_min ={} where sid ={}"
data = oracle.fetchall()

select_sql = "select * from postgres.intro_ai.library_time where sid = {}"

insert_sql = "insert into postgres.intro_ai.library_time (sid, name, days_in_lib, time_in_lib_min) VALUES ({},'{}',{},{})"

if __name__ == '__main__':

    for line in data:
        sel = select_sql.format(str(line[0]))
        postgres.execute(sel)
        check = postgres.fetchone()

        if check == None:

            s = insert_sql.format(str(line[0]), str(line[1]), str(line[2]), str(line[3]))
        else:
            check1 = None
            try:
                check1 = int(line[0])
            except:
                None
            if check1 != None:

                days_in = line[2]
                if days_in is None:
                    days_in = 0
                time_in_lib = line[3]
                if line[3] is None:
                    time_in_lib = 0
                if check[4] is None:
                    check_time = 0
                else:
                    check_time = check[4]
                s = update_sql.format(str(int(check[3]) + int(days_in)),
                                      str(int(check_time) + int(time_in_lib)),
                                      str(line[0]))
                postgres.execute(s)

    print("done")
    conn.commit()
    postgres.close()
    conn.close()
    oracle.close()
    con.close()
