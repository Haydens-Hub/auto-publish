# Auto Publish
This is a [Next.js](https://nextjs.org) project created for [prototyp3](https://prototyp3.org/)'s Fall 2025 Cohort!

Auto Publish replaces Hayden's Hub previous Google Forms-based submission system with a custom-made form web app. Submissions are stored in a [MongoDB](https://www.mongodb.com/) databse and displayed in a secure overview where they can be:

- Synced to Contentful as new post drafts
- Used to update existing Contentful drafts of the same name
- Permanently deleted from the system

## Set Up
In order to use Auto Publish, you'll need to create a `.env` file with the following variables:
```
DB_CONNECTION_STRING=<mongodb atlas connection string>
CONTENTFUL_SPACE_ID=<contentful space id>
CONTENTFUL_CMA_TOKEN=<contentful cma token>
```
Optionally, you can provide a `CONTENTFUL_ENVIRONMENT` variable to specify what environment within your Contentful Space you wish to use.
> [!WARNING]  
> By default, Auto Publish will use `master` as the `CONTENTFUL_ENVIRONMENT` variable if none is specified. This could disrupt your production environment!
## Scripts
To run the development server:
```bash
npm run dev
```
To produce optimized build files:
```bash
npm run build
```
To run normally:
```bash
npm start
```
For linting:
```bash
npm run lint
```
For formatting:
```bash
npm run format
```
## Migrations
[ts-migrate-mongoose](https://www.npmjs.com/package/ts-migrate-mongoose) is being used for the migrations. When substituting for `<migration-name>`, please remember not to include the timestamp.

To roll a migration up use: 
```bash
npx migrate up
```
To roll a migration up to a certain version use: 
```bash
npx migrate up <migration-name>
```
To roll a SINGLE migration up, use:
```bash
npx migrate up <migration-name> --single
```
To roll down a migration use: 
```bash
npx migrate down
```
To roll a migration down from a certain version onwards use: 
```bash
npx migrate down <migration-name>
```
To roll a SINGLE migration down, use:
```bash
npx migrate down <migration-name> --single
```
