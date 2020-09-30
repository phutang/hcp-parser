#!/usr/bin/env node

const CSVToJSON = require('csvtojson');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

(async function() {
    clear();

    console.log(chalk.yellow(
        figlet.textSync('HCP Parser', { horizontalLayout: 'full' })
    ));

    console.log('\n');

    const answers = await inquirer.prompt([
        {
            name: 'filename',
            message: 'Enter filename: ',
        },
    ]);

    console.log('\n');
    console.log(chalk.cyan('Processing...')); 
    console.log('--------------------------------------------------------------');

    try {
        const filename = answers.filename;

        const data = await CSVToJSON().fromFile(filename);

        const currentPath = process.cwd();

        const d = new Date();
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

        const currentDate = `${da}-${mo}-${ye}`;

        let formattedList = [];

        for (let item of data) {
            let newItem = '';

            const baseUrl = 'https://hcp.wellbean.com.au';
            const hcpName = item['Name of HCP'];
            const hcpPracticeName = item['Practice'];
            const hcpEmail = item['Email'];
            const hcpPhone = item['Contact Number'];

            newItem = `${baseUrl}/?hcpName=${encodeURIComponent(hcpName)}&hcpPracticeName=${encodeURIComponent(hcpPracticeName)}&hcpEmail=${encodeURIComponent(hcpEmail)}&hcpPhone=${encodeURIComponent(hcpPhone)}`;

            console.log(newItem);

            formattedList.push(newItem);
        }

        formattedList.shift();
        fs.writeFile(
          `${currentPath}/output-${currentDate}.js`,
          JSON.stringify(formattedList, null, 4).replace(/"([^"]+)":/g, '$1:'),
          (err) => {
          if (err) {  
              console.log(err)
          }  
          return;
      });
    } catch (err) {
        console.log(chalk.red('Error'));
        console.log(err);
    }
})();