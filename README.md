# wese-clients
## Table of Contents
1. [Introduction](#introduction)
1. [Framework](#framework)
    1. [React Native](#react-native)
    1. [Expo](#expo)
1. [Package Manager and Packages](#package-manager-and-packages)
    1. [Package Manager](#package-manager)
    1. [Packages](#packages)
1. [Localization](#localization)
    1. [Languages/Locales](#languageslocales)
    1. [Timezone](#timezone)
    1. [Currency](#currency)
1. [Navigation](#navigation)
1. [Code Style](#code-style)
    1. [Directory Structure](#directory-structure)
    1. [Styling, Linting and Code Enforcement](#styling-linting-and-code-enforcement)
1. [Development](#development)
    1. [Get Started](#get-started)
    1. [Build Project](#build-project)

## Introduction
This document aims to serve as an official documentation for understanding and working with the WESE Client Cross-Platform Mobile Application.

`wese-clients` is a `Cross-Platform` Mobile Application - meaning that it is written in one language but can run on both `Android` and `iOS` platforms. 

This document will highlight the code approaches, principles, and guidelines on how the Application was developed and how it should, henceforth, be developed.

This document is meant to be used by system analysts, software engineers, and other stakeholders involved in understanding and/or expanding the core functionality of the WESE core as far as the client software is concerned and introduce more use cases to fit their requirements.

The design of the application was created using Figma and can be accessed [here](https://www.figma.com/file/vS0zwH5DOwrJM2VEEvaNZQ/WESE-Client-Mobile-App).

<br>

___
<br>

## Framework
The following the tools used to build the mobile application on:
- React Native
- Expo

### React Native
WESE clients mobile application is a [React Native](https://reactnative.dev) application. It combines the best parts of native development with the React JavaScript Library.

Therefore, knowledge in ReactJS is compulsory and needful in the development, testing and maintenance of the applications' code base.

### Expo
[Expo](https://expo.dev) is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React. For our use case, we have used Expo to build a React Android and iOS application (React Native). To access the Expo documentation, [click here](https://docs.expo.dev).

WESE clients application is managed using expo tools and follows the expo `Managed Workflow`.
A managed workflow uses `expo-cli` on the computer and a development client on the mobile devices (Expo Go app or a development build). The Managed workflow typically uses one or more Expo services, such as push notifications, build, and updates.

Expo tries to manage as much of the complexity of building apps for you as we can, which is why we call it the managed workflow. For more on Managed Workflow [click here](https://docs.expo.dev/introduction/managed-vs-bare/#managed-workflow).


<br>

___
<br>

## Package Manager and Packages
### Package Manager
A package manager is a system or set of tools used to automate installing, upgrading, configuring and using software.

WESE uses [yarn](https://yarnpkg.com/) package manager. An alternative to the npm package manager, Yarn was created as a collaboration of Facebook, Exponent, Google, and Tilde to solve consistency, security, and performance problems with large codebases.

### Packages
All packages in WESE client application were installed from the NPM registry. However, to be safe, use `npx expo install` to install packages as it is optimized to check for compatibilities of packages with the overall project.

All React Native packages are supported except that those that require Manual Linking. This is because Expo's `Managed Workflow` does not allow Manual Linking. For the benefit of using Expo's `Managed Workflow`, please avoid installing packages that require Manual Linking.

For better memory management of the application, it is strictly prohibited to install packages that will not be utilized by at least 50% when there are less memory extensive alternatives. Here, utilization refers to the amount of code base imported in the project. While this is an optimization policy, it should be enforced and adhered to by all who will work on WESE Client application.

To view installed packages, see `./package.json` in the root folder of the project.

<br>

___
<br>

## Localization
### Languages/Locales
The WESE client application supports `Swahili` (`sw`) and `English` (`en`, `en-US`).
Localization is enabled through the [`i18n-js` JavaScript package](https://www.npmjs.com/package/i18n-js).

Localization settings and language files are all found under `./localization` in the project directory.

### Timezone
The WESE Client Application supports the `East Africa Time (GMT+3)` timezone. This is also in sync with the server times used and is not adjusted for different timezones.

### Currency
At the moment, WESE Client Application supports Tanzanian Shillings `TZS` currency only.

<br>

___
<br>

## Navigation
The WESE client application uses [React Navigation](https://reactnavigation.org) which provides Routing and navigation for Expo and React Native apps.

React Navigation is modular, hence, reduces app size and provides many different navigators that can be combined and nested. WESE Client Application uses the `Stack Navigator` and creates a `Switch Navigator` that toggles the login and dashboard/panel navigators.

The defined and created Stack Navigators are all found under `./navigation` in the project directory.

<br>

___
<br>

## Code Style
This section explains the coding preferences used in the project and should be understood to ensure that code written is uniform and standardized. 

### Directory Structure
```js
📦wese-clients // root
 ┣ 📂assets // media assets
 ┃ ┣ 📜adaptive-icon.png
 ┃ ┣ 📜bodaboda-transparent.png
 ┃ ┣ 📜bodaboda.png
 ┃ ┣ 📜cameloil.png
 ┃ ┣ 📜engen.png
 ┃ ┣ 📜favicon.png
 ┃ ┣ 📜icon.png
 ┃ ┣ 📜lakeoil.png
 ┃ ┣ 📜logo.png
 ┃ ┣ 📜oilcom.png
 ┃ ┣ 📜oryx.png
 ┃ ┣ 📜oryxLogo.png
 ┃ ┗ 📜splash.png
 ┣ 📂components // react components that are not used as screens on their own
 ┃ ┣ 📂svg // svg icons folder
 ┃ ┃ ┣ 📜customerSupport.js
 ┃ ┃ ┣ 📜faqs.js
 ┃ ┃ ┣ 📜key.js
 ┃ ┃ ┣ 📜loan.js
 ┃ ┃ ┣ 📜privacy.js
 ┃ ┃ ┣ 📜settings.js
 ┃ ┃ ┣ 📜user-group.js
 ┃ ┃ ┗ 📜whatsapp.js
 ┃ ┣ 📜Accordion.js
 ┃ ┣ 📜BarCodeScanner.js
 ┃ ┣ 📜Carousel.js
 ┃ ┣ 📜EyeToggler.js
 ┃ ┣ 📜Header.js
 ┃ ┣ 📜Input.js
 ┃ ┣ 📜InputError.js
 ┃ ┣ 📜InputLengthCounter.js
 ┃ ┣ 📜LoginModal.js
 ┃ ┣ 📜Modal.js
 ┃ ┣ 📜ModalCenter.js
 ┃ ┣ 📜ModalFull.js
 ┃ ┗ 📜Select.js
 ┣ 📂helper // helper functions (formatters, etc)
 ┃ ┣ 📜moment.js
 ┃ ┣ 📜numeral.js
 ┃ ┣ 📜queryClient.js
 ┃ ┗ 📜store.js
 ┣ 📂hooks // react hooks
 ┃ ┣ 📜useAuth.js
 ┃ ┣ 📜useImagePicker.js
 ┃ ┣ 📜useNotifications.js
 ┃ ┗ 📜useToggle.js
 ┣ 📂localization // localization settings and language files
 ┃ ┣ 📜en.js
 ┃ ┣ 📜i18n.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜sw.js
 ┣ 📂navigation // navigation constructors (Stack Navigator...)
 ┃ ┣ 📜index.js
 ┃ ┣ 📜introduction.js
 ┃ ┗ 📜panel.js
 ┣ 📂node_modules // installed packages
 ┣ 📂screens // screens
 ┃ ┣ 📜faqs.js
 ┃ ┣ 📜home.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜login.js
 ┃ ┣ 📜notifications.js
 ┃ ┣ 📜privacy.js
 ┃ ┣ 📜register.js
 ┃ ┣ 📜settings.js
 ┃ ┗ 📜terms.js
 ┣ 📜.eslintrc.js // eslint configurations
 ┣ 📜.gitignore
 ┣ 📜App.js // Application entry
 ┣ 📜README.md // documentation
 ┣ 📜app.json // expo configurations
 ┣ 📜package.json // project metadata and functional attributes
```

### Styling, Linting and Code Enforcement
WESE client application uses `Eslint` to style, lint and enforce code. [Eslint](https://eslint.org) is built into most text editors to statically analyze code to quickly find problems. Eslint checks is code adheres to the configuration found in `.eslintrc.js` and is configured to automatically fix most problems.

To enforce code, Eslint is configured to run before every code commit. While developing, make sure your code complies to the set configuration to be able to commit.

- NB: The Eslint is configured to extend the AirBnB style guide which is among the most common and reliable configurations in the development community. Futhermore, default `react`, `react-hooks` and `react-native` plugins are added to enable eslint to lint react native code.

<br>

___
<br>

## Development
### Get Started
To start development, first install the `expo-cli`. Expo CLI documentation can be found [here](https://docs.expo.dev/workflow/expo-cli/#installation).

Secondly, install packages using `yarn`.

Thirdly, start the expo development server: `npx expo start`.

### Build Project
To start development, first install the `expo application services cli`. Expo Application Services CLI documentation can be found [here](https://docs.expo.dev/eas).

Secondly, build the desired platform application(s). The `eas build` documentation can be found [here](https://docs.expo.dev/build/setup/).

<br>

___
<br>