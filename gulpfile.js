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

var user = process.env.GIT_USER;
var token = process.env.GIT_TOKEN;
var user_mail = process.env.GIT_MAIL;

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


gulp.task('sync-to-private', function (done) {

    shelljs.exec(`git config --global user.email "${user_mail}"`);
    shelljs.exec(`git config --global user.name "${user}"`);
    
    // Check for changes in the docs folder
    var changes = shelljs.exec(`git diff --name-only HEAD^ HEAD docs/`);
    var changedFileNames = changes.stdout.split('\n').filter(Boolean); // Filter out any empty strings

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
    var clone = shelljs.exec(`git clone ${gitPath} ${clonePath}`, { silent: false });

    if (clone.code !== 0) {
        console.error(clone.stderr);
        done();
        return;
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
    
    // Cleanup: Remove the temporary clone directory
    shelljs.cd('..'); // Move out of the clone directory
    shelljs.rm('-rf', clonePath); // Remove the temporary clone directory
    done();
});

// gulp.task('ship-to-private', function (done) {

//     shelljs.exec(`git config --global user.email "${user_mail}"`);
//     shelljs.exec(`git config --global user.name "${user}"`);
    
//     // Check for changes in the docs folder
//     var changes = shelljs.exec(`git diff --name-only HEAD^ HEAD docs/`);
//     var changedFileNames = changes.stdout.split('\n').filter(Boolean); // Filter out any empty strings

//     // Check if there are any changes in the docs folder
//     if (changedFileNames.length === 0) {
//         console.log('No changes in the docs folder. Exiting.');
//         done();
//         return;
//     }
    
//     // Clone the private repository into a temporary directory
//     var clonePath = './private-temp';
//     var gitPath = `https://${user}:${token}@github.com/AnandarajRaman/private.git`;
//     console.log('Clone of private repo started...');
//     var clone = shelljs.exec(`git clone ${gitPath} ${clonePath}`, { silent: false });

//     if (clone.code !== 0) {
//         console.error(clone.stderr);
//         done();
//         return;
//     }

//     console.log('Clone of private repo completed.');

//     // Synchronize files from the public docs folder to the private repo docs folder using rsync
//     shelljs.exec(`rsync -av --delete ./docs/ ${clonePath}/docs/`);

//     // Commit and push changes to the private repo
//     shelljs.cd(clonePath);
//     shelljs.exec('git add .');
//     shelljs.exec('git commit -m "Update from public repo"');
//     shelljs.exec('git push');
//     console.log('Changes synced to private repo.');
    
//     // Cleanup: Remove the temporary clone directory
//     shelljs.cd('..'); // Move out of the clone directory
//     shelljs.rm('-rf', clonePath); // Remove the temporary clone directory
//     done();
// });


// gulp.task('ship-to-private', function (done) {

//     console.log('---check----' + user_mail);
//     console.log('---user---' + user);

//     shelljs.exec(`git config --global user.email "${user_mail}"`);
//     shelljs.exec(`git config --global user.name "${user}"`);
    
//     // Check for changes in the docs folder
//     var changes = shelljs.exec(`git diff --name-only HEAD^ HEAD docs/`);
//     var changedFileNames = changes.stdout.split('\n').filter(Boolean); // Filter out any empty strings

//     // Check if there are any changes in the docs folder
//     if (changedFileNames.length === 0) {
//         console.log('No changes in the docs folder. Exiting.');
//         done();
//         return;
//     }
    
//     // Clone the private repository into a temporary directory
//     var clonePath = './private-temp';
//     var gitPath = `https://${user}:${token}@github.com/AnandarajRaman/private.git`;
//     console.log('Clone of private repo started...');
//     var clone = shelljs.exec(`git clone ${gitPath} ${clonePath}`, { silent: false });

//     if (clone.code !== 0) {
//         console.error(clone.stderr);
//         done();
//         return;
//     }

//     console.log('Clone of private repo completed.');

//     // Copy changed files from the public docs folder to the private repo docs folder
//     shelljs.cd(clonePath);
    
//     // Copy only the changed files
//     for (var i = 0; i < changedFileNames.length; i++) {
//         var changedFileName = changedFileNames[i];
//         var relativePath = changedFileName.replace(/^docs\//, ''); // Remove 'docs/' from the file path to get the relative path within the docs folder
//         shelljs.cp('-rf', `../${changedFileName}`, `./docs/${relativePath}`);
//     }


//     // Commit and push changes to the private repo
//     shelljs.exec('git add .');
//     shelljs.exec('git commit -m "Update from public repo"');
//     shelljs.exec('git push');

//     console.log('Changes synced to private repo.');
    
//     // Cleanup: Remove the temporary clone directory
//     shelljs.cd('..'); // Move out of the clone directory
//     shelljs.rm('-rf', clonePath); // Remove the temporary clone directory
//     done();
// });

// gulp.task('ship-to-private', function (done) {
//     // Check for changes in the docs folder
//     var changes = shelljs.exec(`git diff --name-only`);
//     var changedFileNames = changes.stdout.split('\n');

//   var docsChanges = changedFileNames.filter(fileName => fileName.includes('docs/'));

//     // Check if there are any changes in the docs folder
//     if (docsChanges.length === 0) {
//         console.log('No changes in the docs folder. Exiting.');
//         done();
//         return;
//     }

//     // Clone the private repository into a temporary directory
//     var clonePath = './private-temp';
//     var gitPath = `https://${user}:${token}@github.com/AnandarajRaman/private.git`;
//     console.log('Clone of private repo started...');
//     var clone = shelljs.exec(`git clone ${gitPath} ${clonePath}`, { silent: false });

//     if (clone.code !== 0) {
//         console.error(clone.stderr);
//         done();
//         return;
//     }

//     console.log('Clone of private repo completed.');

//     // Copy changed files from the public docs folder to the private repo docs folder
//     shelljs.cd(clonePath);

//     // Copy only the changed files
//     for (var i = 0; i < docsChanges.length; i++) {
//         var changedFileName = docsChanges[i];
//         // Remove 'docs/' from the file path to get the relative path within the docs folder
//         var relativePath = changedFileName.replace(/^docs\//, '');
//         shelljs.cp('-rf', `../../${changedFileName}`, `./docs/${relativePath}`);
//     }

//     // Commit and push changes to the private repo
//     shelljs.exec('git add .');
//     shelljs.exec('git commit -m "Update from public repo"');
//     shelljs.exec('git push');

//     console.log('Changes synced to private repo.');
    
//     // Cleanup: Remove the temporary clone directory
//     shelljs.cd('..'); // Move out of the clone directory
//     shelljs.rm('-rf', clonePath); // Remove the temporary clone directory
//     done();
// });




// gulp.task('ship-to-private', function (done) {
//     // Check if there are commits before the current HEAD
//     var hasPreviousCommit = shelljs.exec('git rev-parse HEAD^', { silent: true }).code === 0;

//     if (!hasPreviousCommit) {
//         console.log('No previous commit. Exiting.');
//         done();
//         return;
//     }

//     // Check for changes in the docs folder
//     var changes = shelljs.exec('git diff --name-only HEAD^ HEAD');
//     var changedFileNames = changes.stdout.split('\n');

//     var docsChanges = changedFileNames.filter(fileName => fileName.startsWith('docs/'));

//     // Check if there are any changes in the docs folder
//     if (docsChanges.length === 0) {
//         console.log('No changes in the docs folder. Exiting.');
//         done();
//         return;
//     }

//     // Clone the private repository into the docs folder
//     var gitPath = `https://${user}:${token}@github.com/AnandarajRaman/private.git`;
//     console.log('Clone of private repo started...');
//     var clone = shelljs.exec(`git clone ${gitPath} ./docs`, { silent: false });

//     if (clone.code !== 0) {
//         console.error(clone.stderr);
//         done();
//         return;
//     }

//     console.log('Clone of private repo completed.');

//     // Copy changed files from the public docs folder to the private repo docs folder
//     shelljs.cd('./docs');

//     // Copy only the changed files
//     for (var i = 0; i < docsChanges.length; i++) {
//         var changedFileName = docsChanges[i];
//         shelljs.cp('-rf', `../${changedFileName}`, '.');
//     }

//     // Commit and push changes to the private repo
//     shelljs.exec('git add .');
//     shelljs.exec('git commit -m "Update from public repo"');
//     shelljs.exec('git push');

//     console.log('Changes synced to private repo.');
//     shelljs.cd('..'); // Return to the root directory
//     done();
// });


// const gulp = require('gulp');
// const { sync } = require('glob');
// const md = require('markdownlint');
// const spellcheck = require('markdown-spellcheck');
// const fs = require('fs');
// const path = require('path');
// const { execSync } = require('child_process');
// const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
// const { cd, exec } = require('shelljs');
// const { join } = require('path');







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

gulp.task('typo', (done) => {
    // Write the spellings array to the .spelling file in the .bin location
    writeFileSync('./node_modules/.bin/.spelling', spellings.join('\n'));
    // Change directory to the .bin location
    cd('./node_modules/.bin/');
    // Run the mdspell command to check for typos in markdown files
    const mdspellcmd = `mdspell ../../docs/**/*.md  -r -n -a -x --color --en-us`;
    const output = exec(mdspellcmd);
    // Return to the root directory
    cd('../../');
    // Check the output of the mdspell command
    if (output.code !== 0) {
        process.exit(1);
    }
    // Signal that the task is done
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
gulp.task('default', gulp.series('md-lint','typo','filename', 'foldername'));













// gulp.task('md-lint', (done) => {
//     const options = {
//         files: sync('*.md').concat(sync('./docs/**/*.md')),
//         config: require('./.markdownlint.json')
//     };
//     md(options, (result, err) => {
//         if (err && err.toString().length) {
//             console.error(err.toString());
//             process.exit(1);
//         } else {
//             console.log('\n*** Markdown Lint Succeeded ***\n');
//             done();
//         }
//     });
// });

// function getSpelling() {
//     let spellingFile = join(__dirname + './spelling');
//     let spelling = existsSync(spellingFile) ? '\n' + readFileSync(spellingFile, 'utf8') : '';
//     return readFileSync('./.spelling', 'utf8') + spelling;
// }

// gulp.task('typo', (done) => {
//     // copy/paste .spelling file in .bin location
//     writeFileSync('./node_modules/.bin/.spelling', getSpelling());
//     // goto .bin location
//     cd('./node_modules/.bin/');
//     // run mdspell command
//     const mdspellcmd = `mdspell ../../docs/**/*.md  -r -n -a -x --color --en-us`;
//     const output = exec(mdspellcmd);
//     // return root location
//     cd('../../');
//     if (output.code !== 0) {
//         process.exit(1);
//     }
//     done();
// });

// // Task for validating filenames
// gulp.task('filename', (done) => {
//     const docsPath = 'docs';
//     const files = fs.readdirSync(docsPath);

//     files.forEach(file => {
//         const fileName = path.basename(file);
//         const fileNameWithoutExt = fileName.split('.')[0];

//         if (fileName !== fileNameWithoutExt.toLowerCase() + '.md') {
//             console.error(`Error: Invalid filename detected: ${fileName}`);
//             process.exit(1);
//         }
//     });

//     console.log('\n*** Filename Validation Succeeded ***\n');
//     done();
// });

// // Task for validating folder names
// gulp.task('foldername', (done) => {
//     const docsPath = 'docs';
//     const folders = fs.readdirSync(docsPath);

//     folders.forEach(folder => {
//         if (!fs.statSync(path.join(docsPath, folder)).isDirectory()) return;

//         if (folder !== folder.toLowerCase()) {
//             console.error(`Error: Invalid folder name detected: ${folder}`);
//             process.exit(1);
//         }
//     });

//     console.log('\n*** Foldername Validation Succeeded ***\n');
//     done();
// });

// // Default task
// gulp.task('default', gulp.series('md-lint','typo','filename', 'foldername'));










// // Task for linting Markdown files based on .markdownlint.json
// gulp.task('md-lint', (done) => {
//     const options = {
//         files: ['docs/**/*.md'],
//         config: require('./.markdownlint.json')
//     };

//     markdownlint(options, (err, result) => {
//         if (err) {
//             console.error(err.toString());
//             process.exit(1);
//         } else {
//             console.log('\n*** Markdown Lint Succeeded ***\n');
//             done();
//         }
//     });
// });

// // Task for checking typos in Markdown files based on .spelling file
// gulp.task('typo', (done) => {
//     try {
//         // Read the contents of the .spelling file
//         const spellingContent = fs.readFileSync('./.spelling', 'utf8');

//         // Run mdspell command to check spelling in Markdown files of the docs folder
//         const mdspellcmd = `npx mdspell docs/**/*.md -r -n -a -x --color --en-us -d . --ignore-acronyms --ignore-numbers --ignore-urls --ignore-emails ${spellingContent}`;
//         const output = execSync(mdspellcmd, { stdio: 'inherit' });

//         done();
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1);
//     }
// });
// gulp.task('markdown-lint', (done) => {
//     const docsPath = 'docs/**/*.md'; // Path to markdown files

//     // Options for markdownlint
//     const options = {
//         files: [docsPath],
//         config: require(path.resolve('.markdownlint.json')) // Load .markdownlint.json config
//     };

//     // Run markdownlint
//     markdownlint(options, (err, result) => {
//         if (err) {
//             console.error(err.toString());
//             process.exit(1);
//         }

//         if (result && result.toString()) {
//             console.log(result.toString());
//             process.exit(1);
//         }

//         console.log('Markdown linting succeeded.');
//         done();
//     });
// });

// gulp.task('spell-check', (done) => {
//     const docsPath = 'docs/**/*.md'; // Path to markdown files

//     // Options for spellcheck
//     const options = {
//         files: [docsPath],
//         dictionary: path.resolve('.spelling') // Path to .spelling dictionary file
//     };

//     // Run spellcheck
//     spellcheck(options, (err, result) => {
//         if (err) {
//             console.error(err.toString());
//             process.exit(1);
//         }

//         if (result && result.toString()) {
//             console.log(result.toString());
//             process.exit(1);
//         }

//         console.log('Spellcheck succeeded.');
//         done();
//     });
// });
