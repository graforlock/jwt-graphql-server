# Installation and Usage (Dev)
  - run `npm install` to install node dependencies
  - `docker pull mongo` and `docker run -d -p 27017:27017 mongo`
  - export the dev variables `export $(egrep -v '^#' .env | xargs)`
  - run `npm start` to run the GraphQL server
  - (Alternatively, there is a .vscode launch configuration if you need debugger and extensive features)
  - run `./script tokenmaker.sh` to output example values
  - and then use `messageId` for the `getMassages(messageId: String)` GraphQL query
  - use the JWT token to pupulate headers at `localhost:9000` console:`{ "Authorization": "[token value]" }`

# Running tests
  - Unit tests: `npm run test:unit`
  - Integration test: `docker-compose up --abort-on-container-exit --exit-code-from app`