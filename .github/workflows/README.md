# Github workflows

## Lighthouse

The Lighthouse workflow starts a web server and launches Lighthouse to inspect the web application:
- actions/checkout
- generate certificate
- docker start nginx with deployed web application and certificate
- treosh/lighthouse-ci-action
- actions/upload-artifact
- docker stop nginx
- report github status + comment with badges

## SonarCloud
- actions/checkout
- generate certificate
- docker start nginx with deployed application and certificate
- setup Chromium Debugger Protocol environment
- run unit tests in Chromium and collect coverage
- transform coverage data into Sonar Generic Coverage Data
- docker stop nginx
- SonarSource/sonarcloud-github-action

