#!/bin/bash
export PGPASSWORD='postgres'

echo "config dragonstackdb "

dropdb -U node_user dragonstackdb
createdb -U node_user dragonstackdb

psql -U node_user dragonstackdb < ./bin/sql/account.sql
psql -U node_user dragonstackdb < ./bin/sql/generation.sql
psql -U node_user dragonstackdb < ./bin/sql/dragon.sql
psql -U node_user dragonstackdb < ./bin/sql/traits.sql
psql -U node_user dragonstackdb < ./bin/sql/dragonTrait.sql
psql -U node_user dragonstackdb < ./bin/sql/accountDragon.sql



node ./bin/insertTraits.js

echo "dragonstackdb was config "
