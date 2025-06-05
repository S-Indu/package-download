#!/usr/bin/env node

import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { promisify } from 'util';
import { exec } from 'child_process';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

const execAsync = promisify(exec);
const sleep = (ms = 2000) => new Promise(res => setTimeout(res, ms));

let packages = 'npm i ';
let frontFramework = '';
let create = '';

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow('Hey Developer! \n');
    await sleep();
    rainbowTitle.stop();
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
    const jokeData = await response.json();
    console.log(chalk.blueBright("Today's TechByte:"));
    console.log(boxen(chalk.green(jokeData.joke)));
    await sleep();
}

async function projType() {
    const answers = await inquirer.prompt({
        name: 'question_1',
        type: 'list',
        message: 'What type of project are you going to build?',
        choices: ['Front-end', 'Backend']
    });
    return handleType(answers.question_1);
}

async function handleType(proj) {
    if (proj === 'Front-end') {
        const framework = await inquirer.prompt({
            name: 'frontFrame',
            type: 'list',
            message: 'Select a frontend framework from the list:',
            choices: ['React', 'Vue', 'Next', 'Angular']
        });
        frontFramework = framework.frontFrame;
        if (framework.frontFrame === 'React') create = 'npx create-react-app my-app && cd my-app && ';
        else if (framework.frontFrame === 'Next') create = 'npx create-next-app my-app && cd my-app && ';
        else if (framework.frontFrame === 'Vue') create = 'npm install -g @vue/cli && vue create my-app && cd my-app && ';
        else if (framework.frontFrame === 'Angular') create = 'npm install -g @angular/cli && ng new my-app1 && cd my-app1 && ';
        packages = create + packages;
        return handleCss();
    } else {
        const framework = await inquirer.prompt({
            name: 'backFrame',
            type: 'list',
            message: 'Select a backend framework from the list:',
            choices: ['Express', 'Nest', 'Koa']
        });
        packages += framework.backFrame.toLowerCase();
        return handleCss();
    }
}

async function handleCss() {
    const wantCss = await inquirer.prompt({
        name: 'wantCss',
        type: 'confirm',
        message: 'Do you need any CSS frameworks?'
    });
    if (wantCss.wantCss) {
        const framework = await inquirer.prompt({
            name: 'framework',
            type: 'list',
            message: 'Select your framework:',
            choices: ['Bootstrap', 'Tailwind', 'Bulma', 'Foundation']
        });
        if (framework.framework === 'Bootstrap') packages += ' bootstrap';
        else if (framework.framework === 'Tailwind') packages += ' tailwindcss postcss autoprefixer && npx tailwindcss init';
        else if (framework.framework === 'Bulma') packages += ' bulma';
        else packages += ' foundation-sites';
    }
    return others1();
}

async function others1() {
    const wantForm = await inquirer.prompt({
        name: 'wantForm',
        type: 'confirm',
        message: 'Do you need any form libraries?'
    });
    if (wantForm.wantForm) {
        if (frontFramework === 'React' || frontFramework === 'Next') {
            const form = await inquirer.prompt({
                name: 'form',
                type: 'list',
                message: 'Select the form package:',
                choices: ['formik', 'react-hook-form', 'final-form']
            });
            packages += ` ${form.form}`;
        } else if (frontFramework === 'Vue') {
            const form = await inquirer.prompt({
                name: 'form',
                type: 'list',
                message: 'Select the form package:',
                choices: ['vee-validate', 'vuelidate', 'vue-formulate']
            });
            packages += ` ${form.form}`;
        } else if (frontFramework === 'Angular') {
            const form = await inquirer.prompt({
                name: 'form',
                type: 'list',
                message: 'Select the form package:',
                choices: ['reactive-forms', 'angular-formly']
            });
            packages += ` ${form.form}`;
        }
    }
    return others2();
}

async function others2() {
    const needUi = await inquirer.prompt({
        name: 'needUiLib',
        message: 'Do you need any UI libraries?',
        type: 'confirm'
    });
    if (needUi.needUiLib) {
        const uiLib = await inquirer.prompt({
            name: 'uiLib',
            message: 'Select the UI library you want:',
            type: 'list',
            choices: ['@mui/material', 'shadcn-ui',  'ant-design', 'react-bootstrap', 'blueprint-js']
        });
        switch (uiLib.uiLib) {
            case '@mui/material':
                packages += ' @mui/material @emotion/react @emotion/styled';
                break;
            case 'shadcn-ui':
                packages += ' shadcn-ui';
                break;
            case 'ant-design':
                packages += ' antd';
                break;
            case 'react-bootstrap':
                packages += ' bootstrap react-bootstrap';
                break;
            case 'blueprint-js':
                packages += ' @blueprintjs/core @blueprintjs/icons';
                break;
        }
    }
    return others3();
}

async function others3() {
    const needChart = await inquirer.prompt({
        name: 'needChart',
        message: 'Do you need a chart library?',
        type: 'confirm'
    });
    if (needChart.needChart) {
        const chart = await inquirer.prompt({
            name: 'chart',
            message: 'Select a chart library:',
            type: 'list',
            choices: ['chart.js', 'plotly.js', 'google-charts', 'highcharts', 'amcharts', 'd3']
        });
        switch (chart.chart) {
            case 'chart.js':
                packages += ' chart.js';
                break;
            case 'amcharts':
                packages += ' @amcharts/amcharts4';
                break;
            case 'd3':
                packages += ' d3';
                break;
            default:
                packages += ` ${chart.chart}`;
        }
    }
    return others4();
}

async function others4() {
    const needSM = await inquirer.prompt({
        name: 'needSM',
        message: 'Do you need a state management library?',
        type: 'confirm'
    });
    if (needSM.needSM) {
        const state = await inquirer.prompt({
            name: 'state',
            type: 'list',
            message: 'Select one:',
            choices: ['redux', 'recoil', 'zustand', 'mobx']
        });
        packages += ` ${state.state}`;
    }
    return others5();
}

async function others5() {
    const needTest = await inquirer.prompt({
        name: 'needTest',
        type: 'confirm',
        message: 'Need testing libraries?'
    });
    if (needTest.needTest) {
        let choices = [];
        if (frontFramework === 'React')
            choices = ['jest', 'cypress', 'karma', 'react-testing-library'];
        else if (frontFramework === 'Vue')
            choices = ['vue-test-utils', 'cypress', 'karma'];
        else if (frontFramework === 'Angular')
            choices = ['cypress'];
        const test = await inquirer.prompt({
            name: 'test',
            type: 'list',
            message: 'Select a testing library:',
            choices: choices
        });
        packages += ` ${test.test}`;
    }
    return others6();
}

async function others6() {
    const needI18n = await inquirer.prompt({
        name: 'needI18n',
        type: 'confirm',
        message: 'Need i18n?'
    });
    if (needI18n.needI18n) {
        let choices = [];
        if (frontFramework === 'React')
            choices = ['react-intl', 'i18next'];
        else if (frontFramework === 'Vue')
            choices = ['vue-i18n', 'nuxt-i18n'];
        else if (frontFramework === 'Angular')
            choices = ['@ngx-translate/core', '@angular/localize'];
        const i18n = await inquirer.prompt({
            name: 'i18n',
            type: 'list',
            message: 'Select an i18n library:',
            choices: choices
        });
        packages += ` ${i18n.i18n}`;
    }
   
    return installPackage();
}

async function installPackage() {
    const spinner = createSpinner('Installing packages...').start();
    try {
        await execAsync(packages);
        spinner.success();
        const msg = 'Happy Coding!';
        figlet(msg, (err, data) => {
            if (!err) {
                console.log(gradient.pastel.multiline(data));
            }
        });
    } catch (error) {
        spinner.error(`Error installing package: ${error}`);
    }
}

(async function main() {
    await welcome();
    await projType();
})();
