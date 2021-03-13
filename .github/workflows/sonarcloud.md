# SonarCloud Workflow

SonarCloud is used to gather quality metrics, including static code analysis for Javascript. 

In order to report unit test code coverage back to SonarCloud, we need to use the Chrome Debugger Protocol to extract coverage data, and transform it to SonarCloud's expected Generic Report Format.

## Steps
- checkout the repository
- generate a certificate
- run a `nginx` server with the certificate on `https://localhost/todos`
- install `chromium-browser`, `jq`, `curl` and `websocat`
- run `chromium-browser` in headless mode and instruct over the Chrome Debugger Protocol web socket to collect coverage after navigating to the unit test documents.
- transform Chrome coverage format to SonarCloud Generic Coverage Report format with [`transform-coverage.js`](../sonarcloud/transform-coverage.js)
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

