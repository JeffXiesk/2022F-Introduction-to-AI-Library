import psycopg2




conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'#
                        )
# 创建表
insert_sql="""insert into user_statistics_data_userstatisticsdata (id, user_id, discussroom_count, discussroom_length, discussroom_percentage, loadbook_count, loadbook_type, loadbook_percentage, librarytime_count, librarytime_length, librarytime_percentage,user_tag)
VALUES ({},{},{},{},{},{},1,{},{},{},{},{})"""

insert_sql_new="""insert into user_statistics_data_userstatisticsdata (id, user_id, discussroom_count, discussroom_length, discussroom_percentage, loadbook_count, loadbook_type, loadbook_percentage, librarytime_count, librarytime_length, librarytime_percentage,user_tag)
VALUES (%s,%s,%s,%s,%s,%s,1,%s,%s,%s,%s,%s)"""

postgres = conn.cursor()
postgres.execute('truncate table user_statistics_data_userstatisticsdata')

def findres(line):
    if line == 'None':
        return 0
    else:
        return int(line)
# 使用 execute()  方法执行 SQL 查询
if __name__ == '__main__':
    with open('./table/final.csv', 'r', encoding='utf-8') as f:
        data = f.readlines()
        uid_to_disc_len={}
        uid_to_disc_len_rank={}
        uid_to_disc_cnt={}
        uid_to_load_count={}
        uid_to_load_count_rank={}
        uid_to_libt_cnt={}
        uid_to_libt_len={}
        uid_to_libt_len_rank={}
        uid_to_user_tag={}


        for i in data:
            line = i.split(',')
            uid=line[0]
            uid_to_disc_len[uid]=findres(line[5])
            uid_to_disc_cnt[uid]=findres(line[4])
            uid_to_load_count[uid]=findres(line[6])
            uid_to_libt_cnt[uid]=findres(line[2])
            uid_to_libt_len[uid]=findres(line[3])
            


        uid_to_disc_len_sorted = dict(sorted(uid_to_disc_len.items(), key=lambda item: item[1]))
        uid_to_load_count_sorted = dict(sorted(uid_to_load_count.items(), key=lambda item: item[1]))
        uid_to_libt_len_sorted = dict(sorted(uid_to_libt_len.items(), key=lambda item: item[1]))
        
        # calculate uid_to_disc_len_rank
        idx=1
        rank=0
        pre=0
        length=len(uid_to_disc_len_sorted)
        for item in uid_to_disc_len_sorted:
            if (uid_to_disc_len_sorted[item]>pre):
                rank=idx
            uid_to_disc_len_rank[item]=rank/length
            pre=uid_to_disc_len_sorted[item]
            idx+=1

        # calculate uid_to_disc_len_rank
        idx=1
        rank=0
        pre=0
        length=len(uid_to_load_count_sorted)
        for item in uid_to_load_count_sorted:
            if (uid_to_load_count_sorted[item]>pre):
                rank=idx
            uid_to_load_count_rank[item]=rank/length
            pre=uid_to_load_count_sorted[item]
            idx+=1
        # print(uid_to_load_count_rank['12011206'])
        # print(uid_to_load_count_rank['12011204'])

        # calculate uid_to_disc_len_rank
        idx=1
        rank=0
        pre=0
        length=len(uid_to_libt_len_sorted)
        for item in uid_to_libt_len_sorted:
            if (uid_to_libt_len_sorted[item]>pre):
                rank=idx
            uid_to_libt_len_rank[item]=rank/length
            pre=uid_to_libt_len_sorted[item]
            idx+=1

        with open('./table/result.csv') as f1:
            tag_data=f1.readlines()
            for str_line in tag_data:
                line=str_line.split(',')
                tag=int(line[1])*3+int(line[2])+1
                # print(tag)

                uid_to_user_tag[line[0]]=tag
        for i in data:
            uid=i.split(',')[0]
            if uid not in uid_to_user_tag.keys():
                uid_to_user_tag[uid]=1


        # print(len(uid_to_disc_len))
        # print(len(uid_to_disc_len_rank))
        # print(len(uid_to_disc_cnt))
        # print(len(uid_to_load_count))
        # print(len(uid_to_load_count_rank))
        # print(len(uid_to_libt_cnt))
        # print(len(uid_to_libt_len))
        # print(len(uid_to_libt_len_rank))
        # print(len(uid_to_user_tag))

        cnt=0
        args=[]
        for i in data:
            line=i.split(',')
            uid=line[0]
            # s = insert_sql.format(cnt, uid, findres(line[4]),findres(line[5]),uid_to_disc_len_rank[uid],findres(line[6]),uid_to_load_count_rank[uid],findres(line[2]),findres(line[3]),uid_to_libt_len_rank[uid],findres(uid_to_user_tag[uid]))
            args.append((cnt, uid, findres(line[4]),findres(line[5]),round(uid_to_disc_len_rank[uid]*100,2),findres(line[6]),round(uid_to_load_count_rank[uid]*100,2),findres(line[2]),findres(line[3]),round(uid_to_libt_len_rank[uid]*100,2),findres(uid_to_user_tag[uid])))
            
            cnt += 1
            # postgres.execute(s)

            # if cnt % 1000==0:
                # print(cnt)
        postgres.executemany(insert_sql_new,args)

        conn.commit()
        print("Done")
        postgres.close()
        conn.close()
