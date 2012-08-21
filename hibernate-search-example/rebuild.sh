./stop-db.sh
mvn clean install
./start-db.sh &
./create-db.sh
./load-db.sh
./create-index.sh
