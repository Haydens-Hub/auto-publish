09/26/2025:
You will have to change the DB_CONNECTION_STRING variable to the connection string of your own Database
Currently, The database isn't being used at the moment.

10-03-2025:
Migrations are now usable. To roll a migration up use: npx migrate up
to roll a migration up to a certain version use: npx migrate up <migration-name>
to roll a SINGLE migration up, use npx migrate up <migration-name> --single
to roll down a migration use: npx migrate down
to roll a migration down from a certain version onwards use: npx migrate down<migration-name>
to roll a SINGLE migration down, use npx migrate down <migration-name> --single
For the migration-name, remember not to include the timestamp A
Currently, ts-migrate-mongoose is being used for the migrations.
There is the Old Post migration, which is not being handled by it, but I am unsure of whether the old schema will be used or not.

Also, added the slug for viewing details about specific posts.
