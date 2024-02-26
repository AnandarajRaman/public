const gulp = require('gulp');
const { sync } = require('glob');
const md = require('markdownlint');
const spellcheck = require('markdown-spellcheck');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const { cd, exec } = require('shelljs');
const { join } = require('path');
var shelljs = require('shelljs');

// Environment variables
var user = process.env.GIT_USER;
var token = process.env.GIT_TOKEN;
var user_mail = process.env.GIT_MAIL;

// List of spellings to check
const spellings = [
    'boldreports',
    'datasource',
    'postgresql',
    'dataset',
    'drilldown',
    'programmatically',
    'localhost',
    'Employee_Dev',
    'Employee_Staging',
    'Company_Staging',
    'Company_Dev',
    'Company_Live',
    'SaaS',
    'Rijndael',
    'RA-GRS',
    'geo-redundant',
    'Antimalware',
    'PCI-certified',
    'antimalware',
    'opensource',
    'userpassword',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1',
    'YmhhLnN1a3VtYXJhbkBzeW5jZnVzaW9uLmNvbSIsIm5hbWVpZCI6IjEiLCJ1',
    'bmlxdWVfbmFtZSI6ImM0NWFiZmE0LTBlNjAtNGI4Yy04NWM4LWMxNTBiOGJh',
    'MjlkNyIsIklQIjoiOjoxIiwiaXNzdWVkX2RhdGUiOiIxNjMxNzEyOTYzIiwi',
    'bmJmIjoxNjMxNzEyOTYzLCJleHAiOjE2MzIzMTc3NjMsImlhdCI6MTYzMTcx',
    'Mjk2MywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTc3OC9yZXBvcnRpbmcv',
    'c2l0ZS9zaXRlOTEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxNzc4L3Jl',
    'cG9ydGluZy9zaXRlL3NpdGU5MSJ9.d24190nn6i2UNz_8hX1mI0JZTNO9zPX',
    '1HYSlGClkUyw',
    'serviceAuthorizationToken',
    'serverurl',
    'reportServiceUrl',
    'reportPath',
    'serviceUrl',
    'whitelist',
    'whitelisted',
    'sharepoint',
    'pre-flight',
    'wildcard'
];

// Task for linting markdown files
gulp.task('md-lint', (done) => {
    const options = {
        files: sync('*.md').concat(sync('./docs/**/*.md')),
        config: require('./.markdownlint.json')
    };
    md(options, (result, err) => {
        if (err && err.toString().length) {
            console.error(err.toString());
            process.exit(1);
        } else {
            console.log('\n*** Markdown Lint Succeeded ***\n');
            done();
        }
    });
});

// Task for checking typos in markdown files
gulp.task('typo', (done) => {
    writeFileSync('./node_modules/.bin/.spelling', spellings.join('\n'));
    cd('./node_modules/.bin/');
    const mdspellcmd = `mdspell ../../docs/**/*.md  -r -n -a -x --color --en-us`;
    const output = exec(mdspellcmd);
    cd('../../');
    if (output.code !== 0) {
        process.exit(1);
    }
    done();
});

// Task for validating filenames
gulp.task('filename', (done) => {
    const docsPath = 'docs';
    const files = fs.readdirSync(docsPath);
    files.forEach(file => {
        const fileName = path.basename(file);
        const fileNameWithoutExt = fileName.split('.')[0];
        if (fileName !== fileNameWithoutExt.toLowerCase() + '.md') {
            console.error(`Error: Invalid filename detected: ${fileName}`);
            process.exit(1);
        }
    });
    console.log('\n*** Filename Validation Succeeded ***\n');
    done();
});

// Task for validating folder names
gulp.task('foldername', (done) => {
    const docsPath = 'docs';
    const folders = fs.readdirSync(docsPath);
    folders.forEach(folder => {
        if (!fs.statSync(path.join(docsPath, folder)).isDirectory()) return;
        if (folder !== folder.toLowerCase()) {
            console.error(`Error: Invalid folder name detected: ${folder}`);
            process.exit(1);
        }
    });
    console.log('\n*** Foldername Validation Succeeded ***\n');
    done();
});

// Default task
gulp.task('test', gulp.series('md-lint','typo','filename', 'foldername'));

// Task to synchronize changes
gulp.task('sync-to-repo', function (done) {

    shelljs.exec(`git config --global user.email "${user_mail}"`);
    shelljs.exec(`git config --global user.name "${user}"`);
    
    // Check for changes in the docs folder
    var changes = shelljs.exec(`git diff --name-only HEAD^ HEAD docs/`);
    var changedFileNames = changes.stdout.split('\n').filter(Boolean); // Filter out any empty strings

    console.log(changedFileNames);
    console.log("\n");

    var changedFileNames1 = changes.stdout.split('\n'); // Filter out any empty strings
    console.log(changedFileNames1);


    // Check if there are any changes in the docs folder
    if (changedFileNames.length === 0) {
        console.log('No changes in the docs folder. Exiting.');
        done();
        return;
    }
    
    // Clone the private repository into a temporary directory
    var clonePath = './private-temp';
    var gitPath = `https://${user}:${token}@github.com/AnandarajRaman/private.git`;
    console.log('Clone of private repo started...');
    var clone = shelljs.exec(`git clone ${gitPath} ${clonePath}`);

    if (clone.code !== 0) {
        console.error(clone.stderr);
        process.exit(1);
    }

    console.log('Clone of private repo completed.');

    // Synchronize files from the public docs folder to the private repo docs folder using rsync
    shelljs.exec(`rsync -av --delete ./docs/ ${clonePath}/docs/`);

    // Commit and push changes to the private repo
    shelljs.cd(clonePath);
    shelljs.exec('git add .');
    shelljs.exec('git commit -m "Update from public repo"');
    shelljs.exec('git push');
    console.log('Changes synced to private repo.');

    shelljs.cd('..'); // Move out of the clone directory
    shelljs.rm('-rf', clonePath); // Remove the temporary clone directory
    done();
});
