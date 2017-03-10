Swimlanes
=====================

Scrapes data from Pivotal Tracker, GitHub, (and soon Heroku), and organizes stories from the current sprint in a kanban-style board based on its state in these services.

![pivotal swimlanes](https://cloud.githubusercontent.com/assets/2212806/23809022/fbe5cfc6-0599-11e7-8d9d-3442921db098.png)

### Setup
- Register a GitHub Developer application [here](https://github.com/settings/developers). The Authorization callback URL (if using the
default ENV host) should be `http://localhost:3000/github_authorized`
- `cp .env-sample .env`
- In .env, fill in the generated client ID and secret from your GitHub developer application
- `mix deps.get`
- `npm install`
- `mix phoenix.server`
- [https://localhost:3000](https://localhost:3000)
- Enter your Pivotal API Token, found at the bottom of your [profile](https://www.pivotaltracker.com/profile)
- Select your Pivotal project
- Authorize your GitHub account, and make sure you request/grant permission to the repo(s) you want to use
- Search your GitHub repo and select it
- Continue to the project board

### Front end linting
`npm run lint`

### Tech Stack
- Phoenix (Elixir):  data persistence and reporting API
- Redux:  maintain state on the frontend
- React JS:  Front End Views
