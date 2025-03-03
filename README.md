# Scheduler API

## Serves as a client for creating schedules

### For Local Development

##### yarn
`yarn && yarn dev`
##### npm
`npm i && npm dev`

### For Production Ready Build

##### Run
`docker build -t scheduler-ui-dc .`
##### then run
`docker run --name scheduler-client -p 3000:3000 scheduler-ui-dc`
##### And locate to
[http://localhost:3000](http://localhost:3000)