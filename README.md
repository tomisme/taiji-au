ssh -L 49154:127.0.0.1:49154 root@tomisme.com

bash couchdb-dump/bin/couchdb-dump.sh root:[dbpassword]@172.17.0.6 locations > db-backup/[date].txt
