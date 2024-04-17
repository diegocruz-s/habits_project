echo '\n\n requesting with correct body'
curl -X POST --data-binary '{"password": "Diego@123","email": "diego@gmail.com","name":"Diego"}' localhost:3333/user
