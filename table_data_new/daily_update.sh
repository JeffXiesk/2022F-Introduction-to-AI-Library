start_time=$(($(date +%s%N)/1000000))

cd /home/niu/Documents/ai_intro/table_data_new

python=/home/niu/miniconda3/envs/ai_intro/bin/python3

echo "$python test.py"
$python test.py

echo "$python util/loan_data/data_update.py"
$python util/loan_data/data_update.py

echo "$python util/update_needbook.py"
$python util/update_needbook.py

echo "$python util/update_needdiscussionroom.py"
$python util/update_needdiscussionroom.py

echo "$python util/update_lib_time.py"
$python util/update_lib_time.py

echo "$python util/download_from_postgres.py"
$python util/download_from_postgres.py

echo "$python backend_core/user_user.py"
$python backend_core/user_user.py

echo "$python backend_core/user_static.py"
$python backend_core/user_static.py

echo "$python backend_core/bookloadrecord_bookloadrecord_and_book.py"
$python backend_core/bookloadrecord_bookloadrecord_and_book.py

echo "$python backend_core/discussionroom_discussionroom.py"
$python backend_core/discussionroom_discussionroom.py

echo "$python backend_core/update_iorecord.py"
$python backend_core/update_iorecord.py


end_time=$(($(date +%s%N)/1000000))
echo "Update finished in $(date), costing "$(($end_time-$start_time))"ms." >> update_log.log