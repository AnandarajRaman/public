//gulpfile.js
const gulp = require('gulp');
const markdownlint = require('gulp-markdownlint');
const spellcheck = require('gulp-markdown-spellcheck');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');

// Task for linting Markdown files based on .markdownlint.json
gulp.task('md-lint', (done) => {
    gulp.src(['*.md', './docs/**/*.md'])
        .pipe(markdownlint({
            config: require('./.markdownlint.json') // Using the configuration from .markdownlint.json in the root directory
        }))
        .pipe(markdownlint.reporter())
        .on('error', function(err) {
            console.error(err.toString());
            process.exit(1);
        })
        .on('end', function() {
            console.log('\n*** Markdown Lint Succeeded ***\n');
            done();
        });
});

// Task for checking typos in Markdown files based on .spelling file
gulp.task('typo', (done) => {
    try {
        // Read the contents of the .spelling file
        const spellingContent = readFileSync('./.spelling', 'utf8');

        // Run mdspell command to check spelling in Markdown files of the docs folder
        const mdspellcmd = `npx mdspell docs/**/*.md -r -n -a -x --color --en-us -d . --ignore-acronyms --ignore-numbers --ignore-urls --ignore-emails ${spellingContent}`;
        const output = execSync(mdspellcmd, { stdio: 'inherit' });

        done();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

// Task for validating filenames
gulp.task('filename', function(done) {
    const docsPath = 'docs';
    const files = fs.readdirSync(docsPath);
    let error = false;

    files.forEach(file => {
        const fileName = path.basename(file);
        const fileNameWithoutExt = fileName.split('.')[0];

        if (fileName !== fileNameWithoutExt.toLowerCase() + '.md') {
            console.error(`Error: Invalid filename detected: ${fileName}`);
            error = true;
        }
    });

    if (error) {
        process.exit(1);
    }

    done();
});

// Task for validating folder names
gulp.task('foldername', function(done) {
    const docsPath = 'docs';
    const folders = fs.readdirSync(docsPath);
    let error = false;

    folders.forEach(folder => {
        if (!fs.statSync(path.join(docsPath, folder)).isDirectory()) return;

        if (folder !== folder.toLowerCase()) {
            console.error(`Error: Invalid folder name detected: ${folder}`);
            error = true;
        }
    });

    if (error) {
        process.exit(1);
    }

    done();
});

// Default task
gulp.task('default', gulp.series('md-lint', 'typo', 'filename', 'foldername'));
