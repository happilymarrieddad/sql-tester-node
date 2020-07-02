
# Database
db.create:
	db-migrate create $(NAME)

db.migrate:
	db-migrate up

db.clear:
	db-migrate down --count 10000

db.reset: db.clear db.migrate

# System
install.deps:
	npm install -g \
		db-migrate \
		db-migrate-mysql
