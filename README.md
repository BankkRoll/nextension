# Nextension
### An Advanced CLI Tool for Building Next.js Applications as Chrome Extensions

<p align="center">
  <img src="https://i.giphy.com/media/TLeLKUdIc1tvAxb7ab/giphy.webp" alt="Nextension Logo" style="display: block; margin: auto; width: 60%; max-width: 80%;" />
</p>

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Features](#features)
5. [Customization](#customization)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)


## Introduction

Nextension is an advanced CLI (Command Line Interface) tool designed for developers proficient in Next.js to easily convert their Next.js applications into fully functional Chrome extensions. With Nextension, developers can rapidly create Chrome extensions from their Next.js projects, enabling them to leverage the power of Next.js for building progressive web applications and taking advantage of the Chrome extension ecosystem for distribution.

## Installation & Usage

To install Nextension, ensure that you have Node.js version 14.0.0 or higher installed on your system. Then, you can install & run Nextension globally using this command:

```shell
npx nextension
```

Nextension will automatically build your Next.js application and generate the necessary files to create a Chrome extension in the `nextension` directory.

## Features

Nextension comes packed with several advanced features to streamline the process of building Chrome extensions from Next.js projects:

- **Next.js Compatibility:** Nextension is designed to seamlessly integrate with Next.js applications, preserving all the features and capabilities of Next.js during the conversion process.

- **Chrome Extension Manifest Generation:** Nextension generates the required `manifest.json` file automatically, ensuring your Chrome extension adheres to the Chrome Extension Manifest format.

- **HTML Code Formatting:** Nextension leverages `js-beautify` to format HTML code, optimizing it for readability and maintainability.

- **Assets Handling:** Nextension automatically copies your assets directory to the output directory, making sure all necessary assets are available for your Chrome extension.

- **Dynamic Imports for ESM Compatibility:** Nextension uses dynamic imports for compatibility with ECMAScript Modules (ESM), enabling seamless integration with modern JavaScript projects.

## Customization

Nextension allows you to customize various aspects of the Chrome extension generation process to suit your specific requirements. You can modify the behavior of Nextension through configuration options.

## Configuration

Nextension supports a configuration file named `nextension.config.js` in your project's root directory. By creating this file, you gain granular control over the Chrome extension's output, enabling you to tailor it precisely to your needs.

Here is an example of a `nextension.config.js` file:

```javascript
module.exports = {
    // Add your configuration options here
};
```

## Troubleshooting

If you encounter any issues while using Nextension, please open an issue on [GitHub](https://github.com/BankkRoll/nextension/issues).

## Contributing

At Nextension, we believe that collaboration and contributions from the developer community are essential for improving our tool and making it even more powerful and user-friendly. If you're interested in contributing to Nextension, we'd love to have your help!

### How to Contribute

To get started with contributing to Nextension, please follow these steps:

1.
**Fork the Repository:** Start by forking the Nextension repository on GitHub. This will create a copy of the repository under your GitHub account.

2.
**Clone the Repository:** Next, clone your forked repository to your local machine using the following command:

```shell
   git clone https://github.com/BankkRoll/nextension.git
```

3.
**Create a Branch:** Before making any changes, create a new branch for your contribution. It's a best practice to name your branch in a descriptive and meaningful way. For example:

```shell
   git checkout -b feature/add-new-feature
```

4.
**Make Your Changes:** Now you can start making your changes to the codebase. Whether you're fixing a bug, adding a new feature, or improving existing functionality, please make sure to follow our coding guidelines and best practices.


5.
**Test Your Changes:** Before submitting your contribution, ensure that all existing tests pass and add new tests as needed.


6.
**Commit and Push:** Once you've made your changes and tested them thoroughly, commit your changes and push them to your forked repository:

```shell
   git add .
   git commit -m "Add new feature: Description of your changes"
   git push origin feature/add-new-feature
```

7.
**Create a Pull Request:** Now it's time to create a pull request from your branch to the main Nextension repository. Navigate to your GitHub repository and click on the "New pull request" button. Provide a clear and detailed description of your changes, and submit the pull request.

We greatly appreciate your contributions, and together, we can make Nextension even better for all developers! If you have any questions or need assistance with the contribution process, feel free to reach out to us on ```[GitHub](https://github.com/BankkRoll/nextension)```.

## License

Nextension is open-source software released under the [MIT License](https://example.com/nextension/license). Feel free to use and modify Nextension as per the terms of the license.

---

Thank you for choosing Nextension! We hope you find it a valuable tool for building powerful Chrome extensions with the ease and flexibility of Next.js. Happy coding!
