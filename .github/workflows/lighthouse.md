# Lighthouse Workflow

This is a customized workflow for running a local web server hosting the [`docs`](../../docs) directory before running the Lighthouse check.

## Steps
- checkout the repository
- generate a certificate
- run a `nginx` server with the certificate on `https://localhost/todos`
- launch [treosh/lighthouse-ci-action](https://github.com/marketplace/actions/lighthouse-ci-action) with the [`lighthouserc.yml`](../lighthouse/lighthouserc.yml) configuration on `https://localhost/todos`
- upload Lighthouse reports as artifacts
- report averaged scores as a Github comment with badges

## Example

![PR Comment](https://user-images.githubusercontent.com/1573003/111026219-71839700-83e9-11eb-9507-4abec2b70d18.png)
