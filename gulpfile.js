const gulp = require('gulp');
const markdownlint = require('markdownlint');
const spellcheck = require('markdown-spellcheck');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
gulp.task('default', gulp.series('filename', 'foldername'));
