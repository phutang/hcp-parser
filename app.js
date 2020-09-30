#!/usr/bin/env node

const CSVToJSON = require('csvtojson');
const converter = require('json-2-csv');
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

        let formattedList = [];

        for (let item of data) {
            let hcp = {};
            let uniqueUrl = '';

            const baseUrl = 'https://hcp.wellbean.com.au';
            const hcpName = item['Name of HCP'];
            const hcpPracticeName = item['Practice'];
            const hcpEmail = item['Email'];
            const hcpPhone = item['Contact Number'];

            uniqueUrl = `${baseUrl}/?hcpName=${encodeURIComponent(hcpName)}&hcpPracticeName=${encodeURIComponent(hcpPracticeName)}&hcpEmail=${encodeURIComponent(hcpEmail)}&hcpPhone=${encodeURIComponent(hcpPhone)}`;

            hcp.name = hcpName;
            hcp.uniqueUrl = uniqueUrl;
            
            console.log(hcp);

            formattedList.push(hcp);
        }

        formattedList.shift();
        fs.writeFile(
          `${currentPath}/output.json`,
          JSON.stringify(formattedList, null, 4),
          (err) => {
          if (err) {  
              console.log(err)
          }  
          return;
        });

        converter.json2csv(formattedList, (err, csv) => {
            if (err) {
                throw err;
            }
    
            console.log(csv);
        
            fs.writeFileSync('output.csv', csv);      
        });

    } catch (err) {
        console.log(chalk.red('Error'));
        console.log(err);
    }
})();