import psycopg2

conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'  #
                        )
# 创建表
sql = """with tot as (select sid, last_name, sum(num) as total
             from (select sid, last_name, aa.type, evaluate, count(type) as num
                   from (select sid, last_name, title, type, substr(evaluate, 0, 2) as evaluate
                         from postgres.intro_ai.loan_data) aa
                   group by sid, last_name, type, evaluate
                   order by sid asc) bb
             group by sid, last_name)
select a.sid,
       a.last_name,
       tot.total,
       sum(A) as A,
       sum(B) as B,
       sum(C) as C,
       sum(D) as D,
       sum(E) as E,
       sum(F) as F,
       sum(G) as G,
       sum(H) as H,
       sum(I) as I,
       sum(J) as J,
       sum(K) as K,
       sum(L) as L,
       sum(M) as M,
       sum(N) as N,
       sum(O) as O,
       sum(P) as P,
       sum(Q) as Q,
       sum(R) as R,
       sum(S) as S,
       sum(T) as T,
       sum(U) as U,
       sum(V) as V,
       sum(W) as W,
       sum(X) as X,
       sum(Y) as Y,
       sum(Z) as Z
from (select *,
             (case when evaluate = 'A' then num else 0 end) as A,
             (case when evaluate = 'B' then num else 0 end) as B,
             (case when evaluate = 'C' then num else 0 end) as C,
             (case when evaluate = 'D' then num else 0 end) as D,
             (case when evaluate = 'E' then num else 0 end) as E,
             (case when evaluate = 'F' then num else 0 end) as F,
             (case when evaluate = 'G' then num else 0 end) as G,
             (case when evaluate = 'H' then num else 0 end) as H,
             (case when evaluate = 'I' then num else 0 end) as I,
             (case when evaluate = 'J' then num else 0 end) as J,
             (case when evaluate = 'K' then num else 0 end) as K,
             (case when evaluate = 'L' then num else 0 end) as L,
             (case when evaluate = 'M' then num else 0 end) as M,
             (case when evaluate = 'N' then num else 0 end) as N,
             (case when evaluate = 'O' then num else 0 end) as O,
             (case when evaluate = 'P' then num else 0 end) as P,
             (case when evaluate = 'Q' then num else 0 end) as Q,
             (case when evaluate = 'R' then num else 0 end) as R,
             (case when evaluate = 'S' then num else 0 end) as S,
             (case when evaluate = 'T' then num else 0 end) as T,
             (case when evaluate = 'U' then num else 0 end) as U,
             (case when evaluate = 'V' then num else 0 end) as V,
             (case when evaluate = 'W' then num else 0 end) as W,
             (case when evaluate = 'X' then num else 0 end) as X,
             (case when evaluate = 'Y' then num else 0 end) as Y,
             (case when evaluate = 'Z' then num else 0 end) as Z


      from (select sid, last_name, aa.type, evaluate, count(type) as num
            from (select sid, last_name, title, type, substr(evaluate, 0, 2) as evaluate
                  from postgres.intro_ai.loan_data) aa
            group by sid, last_name, type, evaluate
            order by sid asc) aa) a
         left join tot on tot.sid = a.sid
group by a.sid, a.last_name, tot.total
order by total desc"""

postgres = conn.cursor()
postgres.execute(sql)
data = postgres.fetchall()
ins_sql = '''insert into postgres.intro_ai.need_book(sid, name, total, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z)
 VALUES ({},'{}',{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{})'''

postgres.execute('truncate table intro_ai.need_book')

if __name__ == '__main__':

    for i in data:
        s = ins_sql.format(i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9],i[10],i[11],i[12],i[13],i[14],i[15],i[16],i[17],i[18],i[19],i[20],i[21],i[22],i[23],i[24],i[25],i[26],i[27],i[28])
        # print(s)
        postgres.execute(s)
        # print(i)
        # break

    print("Done")
    conn.commit()
    postgres.close()
    conn.close()
