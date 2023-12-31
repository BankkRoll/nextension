# Nextension
### An Advanced CLI Tool for Building Next.js Applications as Chrome Extensions
![npm](https://img.shields.io/npm/v/nextension)
![npm](https://img.shields.io/npm/dt/nextension)
![NPM](https://img.shields.io/npm/l/nextension)
![GitHub issues](https://img.shields.io/github/issues/BankkRoll/nextension)

![imageedit_16_4061035640](https://github.com/BankkRoll/nextension/assets/106103625/cf13bdf8-300f-485d-bfa9-2aa2a801c2a0)

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation and Usage](#installation-and-usage)
4. [Command Line Options](#command-line-options)
5. [Examples](#examples)
6. [File Structure](#file-structure)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

Nextension is an advanced CLI (Command Line Interface) tool designed for developers proficient in Next.js to easily convert their Next.js applications into fully functional Chrome extensions. With Nextension, developers can rapidly create Chrome extensions from their Next.js projects, enabling them to leverage the power of Next.js for building progressive web applications and taking advantage of the Chrome extension ecosystem for distribution.

## Features

Nextension is equipped with a variety of features to simplify the process of transforming Next.js projects into Chrome extensions:

- **Seamless Next.js Integration:** Maintains all Next.js capabilities during the conversion process.
- **Automatic Manifest Generation:** Generates the required `manifest.json` file, adhering to the Chrome Extension Manifest format. If a `manifest.json` isn't found in your assets directory, it prompts you to generate a template.
- **HTML Code Beautification:** Uses `js-beautify` to enhance readability and maintainability of the HTML code.
- **Assets Handling:** Copies your assets directory to the output directory automatically, ensuring all necessary assets are included in your Chrome extension.
- **Package Manager Detection:** Automatically identifies your project's package manager (npm, yarn, or pnpm) and uses it to run the build commands.
- **File Organization:** Arranges your files into specific directories like `scripts`, `styles`, and `icons`, resulting in a clean directory structure.
- **Robust Error Handling:** Logs any issues encountered during the build process, assisting in troubleshooting.

## Installation and Usage

To install Nextension, ensure that you have Node.js version 14.0.0 or higher installed on your system.

### Global Installation

For global installation, use the following command:

```shell
npm install -g nextension
```

This allows you to run `nextension` from any directory:

```shell
nextension [options]
```

### Local Installation

For local installation (specific to a project):

```shell
npm install --save-dev nextension
```

After you've installed Nextension, you can run it in your project using the following command:

```shell
npx nextension [options]
```


## Command Line Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--help` | `-h` | Run help command for options panel |
| `--verbose` | `-v` | Run with verbose logging |
| `--generate-manifest` | `-m` | Prompt to generate a manifest file if not present |
| `--generate-background` | `-b` | Prompt to generate a background script if not present |
| `--generate-content` | `-c` | Prompt to generate a content script if not present |
| `--generate-popup` | `-p` | Prompt to generate a popup script and HTML if not present |
| `--generate-options` | `-o` | Prompt to generate an options script and HTML if not present |
| `--generate-action` | `-a` | Prompt to generate an action script if not present |

## Examples

To use Nextension with verbose logging:

```shell
nextension --verbose
```

```shell
nextension -v
```

To generate a manifest file if not present:

```shell
nextension --generate-manifest
```

```shell
nextension -m
```

## File Structure

| File / Directory | Description |
|------------------|-------------|
| [`dist/build.d.ts`](https://github.com/BankkRoll/nextension/blob/main/dist/build.d.ts) | TypeScript definition file for `build.js` |
| [`dist/build.js`](https://github.com/BankkRoll/nextension/blob/main/dist/build.js) | Transpiled JavaScript file of `build.ts` |
| [`dist/build.js.map`](https://github.com/BankkRoll/nextension/blob/main/dist/build.js.map) | Source map file for `build.js` |
| [`dist/cli.d.ts`](https://github.com/BankkRoll/nextension/blob/main/dist/cli.d.ts) | TypeScript definition file for `cli.js` |
| [`dist/cli.js`](https://github.com/BankkRoll/nextension/blob/main/dist/cli.js) | Transpiled JavaScript file of `cli.ts` |
| [`dist/cli.js.map`](https://github.com/BankkRoll/nextension/blob/main/dist/cli.js.map) | Source map file for `cli.js` |
| [`dist/utils.d.ts`](https://github.com/BankkRoll/nextension/blob/main/dist/utils.d.ts) | TypeScript definition file for `utils.js` |
| [`dist/utils.js`](https://github.com/BankkRoll/nextension/blob/main/dist/utils.js) | Transpiled JavaScript file of `utils.ts` |
| [`dist/utils.js.map`](https://github.com/BankkRoll/nextension/blob/main/dist/utils.js.map) | Source map file for `utils.js` |
| [`src/build.ts`](https://github.com/BankkRoll/nextension/blob/main/src/build.ts) | TypeScript source file for the build process |
| [`src/cli.ts`](https://github.com/BankkRoll/nextension/blob/main/src/cli.ts) | TypeScript source file for the CLI |
| [`src/utils.ts`](https://github.com/BankkRoll/nextension/blob/main/src/utils.ts) | TypeScript source file for utility functions |
| [`package-lock.json`](https://github.com/BankkRoll/nextension/blob/main/package-lock.json) | Automatically generated file for any operations where npm modifies `node_modules` or `package.json` |
| [`package.json`](https://github.com/BankkRoll/nextension/blob/main/package.json) | File that lists the packages your project depends on |
| [`README.md`](https://github.com/BankkRoll/nextension/blob/main/README.md) | The file that contains the documentation for your project |
| [`tsconfig.json`](https://github.com/BankkRoll/nextension/blob/main/tsconfig.json) | The configuration file for the TypeScript compiler |

## Troubleshooting

If you encounter any issues while using Nextension, please open an issue on [GitHub](https://github.com/BankkRoll/nextension/issues).

## Contributing

We appreciate contributions from the developer community! To contribute:

1. Fork the Nextension repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your contribution.
4. Make your changes to the codebase.
5. Ensure that all existing tests pass and add new tests as needed.
6. Commit your changes and push them to your forked repository.
7. Create a pull request from your branch to the main Nextension repository.

If you have any questions or need assistance with the contribution process, feel free to reach out to us on [GitHub](https://github.com/BankkRoll/nextension).

## License

Nextension is open-source software released under the [MIT License](https://example.com/nextension/license). Feel free to use and modify Nextension as per the terms of the license.

---

Thank you for choosing Nextension! We hope you find it a valuable tool for building powerful Chrome extensions with the ease and flexibility of Next.js. Happy coding!

[Return to Top](#nextension)
