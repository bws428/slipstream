_Streamline your aviation record keeping._

## What is Slipstream?

Still entering your flight times manually? Those days are over.

Slipstream is a web browser extension that allows you to export your completed flight pairings from CrewTrac and download them as a CSV (comma-separated values) file, which can then be imported into any digital logbook software such as LogTen Pro, ZuluLog, ForeFlight, and others.

## How Does It Work?

1. Navigate to CrewTrac's "Pairing Inquire" page for any completed pairing.
2. Click the "Export" button to download that pairing as a CSV file.
3. Import the CSV file into your preferred digital logbook.
4. Grab a cocktail 🍸 and relax.

## Getting Help

If you think you've found a bug, or if you have ideas for new features, please [create a new issue](https://github.com/bws428/slipstream/issues) on this project's GitHub page.

## Supported Airlines

Slipstream currently only works with Spirit Airlines' CrewTrac website. Other airlines may be supported in the future. If you're interested in testing Slipstream at your airline, please contact the developer.


## Installation

To install the Slipstream extension, use the links below for your preferred web browser:

* [Slipstream for Google Chrome](https://chrome.google.com/webstore/detail/slipstream/bokjbdfakchehkhehaomoaihpfoddheo)
* [Slipstream for Firefox](https://addons.mozilla.org/en-US/firefox/addon/slipstream/)

## Contributing

To install Slipstream locally for development, first clone the repository using the [GitHub CLI](https://cli.github.com/):

```shell
gh repo clone bws428/slipstream
```

Next, install all NodeJS dependencies using [`npm`](https://www.npmjs.com/):

```shell
npm install
```

Finally, build the `dist/slipstream.js` file for testing in your browser:

```shell
npm run build
```

Unit tests are available for some of the modules by running:

```shell
npm run test
```

