import psycopg2

conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'  #
                        )
# 创建表
sql = """select library_time.sid,library_time.name, library_time.days_in_lib, library_time.time_in_lib_min, need_discussion_time.days, need_discussion_time.time_min, total, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
from postgres.intro_ai.library_time
left join postgres.intro_ai.need_discussion_time on library_time.sid= need_discussion_time.sid
left join postgres.intro_ai.need_book on need_book.sid = library_time.sid"""

postgres = conn.cursor()
postgres.execute(sql)
data = postgres.fetchall()
if __name__ == '__main__':
    with open('./table/final.csv', 'w', encoding='utf-8') as f:
        for line in data:
            s = ''
            for i in range(len(line)):
                s = s+str(line[i])
                if i != len(line)-1:
                    s = s+','
            s = s+'\n'
            s = s.encode('UTF-8').decode('UTF-8')
            f.write(s)
    print("done")
    postgres.close()
    conn.close()
    f.close()
