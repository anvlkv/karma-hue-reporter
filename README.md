# karma-hue-reporter

Test reporter, that sets hue lights depending on number of tests passing.

## Usage

To use in your own Node.js project, just execute
```
npm install karma-hue-reporter --save-dev
```
This will download the karma-hue-reporter and add the dependency to `package.json`.

Then add ``'hue'`` to reporters in karma.conf.js, e.g.

```
reporters: ['hue']
```

## Configuration

``` js
//karma.conf.js
...
  config.set({
    ...
      reporters: ["hue"],
      hueReporter: {
        ip: '123.234.234.2', // discover your hue hub ip address using https://www.meethue.com/api/nupnp
        user:'user', // follow this guidance to create a user https://www.developers.meethue.com/documentation/configuration-api#71_create_user
        applyTo: 'lights', // chouse from light or groups
        applyToId: '1' // light or group id
      }
      plugins: ["karma-hue-reporter"],
    ...
```

## Contributing

### Running tests

To run the tests for the index.js file, run: `npm test`

### Generating Coverage

To see the coverage report for the module, run: `npm run coverage`
