import _locale
_locale._getdefaultlocale = (lambda *args: ['zh_CN', 'utf8'])

import cx_Oracle as cx     
con = cx.connect('EXTZNCARD', 'EXTZNCARDADMIN', '172.18.18.25:1521/ORCL11G') 
cursor = con.cursor()       
cursor.execute("""with aa as (SELECT EMPLOYEENO, EMPNAME, count(LIBDATE) as LIBCOUNT
from (SELECT EMPLOYEENO, EMPNAME, LIBDATE
      FROM (SELECT EMPLOYEENO, -- 编号
                   EMPNAME,    -- 姓名
                   OCCURTIME,  -- 刷卡时间
                   DEVICENO,   -- 刷卡编号
                   (to_date(substr(OCCURTIME, 0, 10))) as LIBDATE,
                   DEVICENAME, -- 设备名称
                   FLAG        -- 进出标志
            FROM SYNONYM_EMP_GUARD_DATA_9084
            where DEVICENAME like '琳恩%'
               or DEVICENAME like '一丹%'
               or DEVICENAME like '涵泳%')

      group by EMPLOYEENO, EMPNAME, LIBDATE
      order by LIBDATE asc)
group by EMPLOYEENO, EMPNAME
order by EMPLOYEENO DESC  ),
bb as ( SELECT EMPLOYEENO, EMPNAME, sum(ATTIME_min) as LIBTIME FROM(SELECT EMPLOYEENO,
       EMPNAME,
       OCCURTIME,
       DEVICENO,
       DEVICENAME,
       FLAG,
       pre,
       PREFLAG,
       (ROUND(TO_NUMBER(OCCURTIME - pre) * 24 * 60 ) ) as ATTIME_min
FROM (SELECT EMPLOYEENO, -- 编号
             EMPNAME,    -- 姓名
             OCCURTIME,  -- 刷卡时间
             DEVICENO,   -- 刷卡编号
             DEVICENAME, -- 设备名称
             FLAG,       -- 进出标志

             lag(OCCURTIME, 1) over (partition by EMPLOYEENO order by OCCURTIME asc) as pre,
             lag(FLAG, 1) over (partition by EMPLOYEENO order by OCCURTIME asc)      as PREFLAG

      FROM SYNONYM_EMP_GUARD_DATA_9084
      order by EMPLOYEENO, OCCURTIME asc)
where FLAG = 'O'
  and PREFLAG = 'I' )
where ATTIME_min < 1440
GROUP BY EMPLOYEENO, EMPNAME
ORDER BY EMPLOYEENO DESC )
SELECT aa.EMPLOYEENO, aa.EMPNAME, aa.LIBCOUNT,bb.LIBTIME from aa left join bb on aa.EMPLOYEENO=bb.EMPLOYEENO
order by aa.EMPLOYEENO""")
data = cursor.fetchall()

if __name__ == '__main__':

  with open('./table/lib_intime_data.csv','w') as f:
    for line in data:
      f.write(str(line[0])+','+str(line[1])+','+str(line[2])+','+str(line[3])+'\n')
  print("done")
  cursor.close()
  con.close()