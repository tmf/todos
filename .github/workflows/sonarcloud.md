# SonarCloud Workflow

SonarCloud is used to gather quality metrics, including static code analysis for Javascript. 

In order to report unit test code coverage back to SonarCloud, we need to use the Chrome Debugger Protocol to extract coverage data, and transform it to SonarCloud's expected Generic Report Format.

## Steps
- checkout the repository
- generate a certificate
- run a `nginx` server with the certificate on `https://localhost/todos`
- install `chromium-browser`, `jq`, `curl` and `websocat`
- run `chromium-browser` in headless mode and instruct over the Chrome Debugger Protocol web socket to collect coverage after navigating to the unit test documents.
- transform Chrome coverage format to [SonarCloud Generic Coverage Report format](https://docs.sonarqube.org/latest/analysis/generic-test/#header-1) with [`transform-coverage.js`](../sonarcloud/transform-coverage.js)
- run [SonarCloud Scan](https://github.com/marketplace/actions/sonarcloud-scan) with coverage report path configured


## Requirements
- Install [SonarCloud Scan](https://github.com/marketplace/actions/sonarcloud-scan) Github action on repository
- Create project in SonarCloud
- Add `SONAR_TOKEN` from https://sonarcloud.io/account/security/ as a [repository action secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) 
	![Action secrets with `SONAR_TOKEN`](https://user-images.githubusercontent.com/1573003/111027011-d80ab400-83ed-11eb-8578-e509f2d3b075.png)
- Configure action arguments in [sonarcloud.yml](sonarcloud.yml) with values from the SonarCloud project dashboard
  ```
	-Dsonar.organization=tmf
	-Dsonar.projectKey=tmf_todos
  ```

## Example

![sonarcloud-bot](https://user-images.githubusercontent.com/1573003/111027198-fc1ac500-83ee-11eb-9dda-69c44a63d35e.png)

![sonarcloud](https://user-images.githubusercontent.com/1573003/111027101-73038e00-83ee-11eb-89a0-36ebd4cf3f87.png)

## Chrome code coverage
See [A quick look at how Chrome's JavaScript code coverage feature works](https://www.mattzeunert.com/2017/03/29/how-does-chrome-code-coverage-work.html)

[Chrome Debugger Protocol](https://chromedevtools.github.io/devtools-protocol) messages used:
```json
{"id":1,"method":"Profiler.enable"}
{"id":3,"method":"Profiler.startPreciseCoverage","params":{"callCount":true,"detailed":true,"allowTriggeredUpdates":false}}
{"id":4,"method":"Page.navigate","params":{"url":"https://localhost/todos/classes/offline-cache.html"}}

{"id":5,"method":"Profiler.takePreciseCoverage"}
```
          