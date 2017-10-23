const fs = require('fs');
const gitlog = require('gitlog');
const _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));

function validateArgs() {

    var msg = "";

    if (argv.r === undefined) {
        msg += "Missing -r: Path to directory containing repo directories.\n";
    } 
    if (argv.a === undefined) {
        msg += "Missing -a: Commit author's full name.\n";
    } 
    if (argv.d === undefined) {
        msg += "Missing -d: Only search commits since this date.\n";
    } 
    if (argv.n === undefined) {
        msg += "Missing -n: Max number of commits to return per repository.\n";
    }

    if (msg.length > 0) {
        console.log(msg);
    }

    return msg.length === 0;
}


var options = {
    repos: argv.r,
    author: argv.a,
    sinceDate: argv.d,
    maxReturn: argv.n
}

var optionsGit =
    {
        number: options.maxReturn
        , since: options.sinceDate
        , author: options.author
        , fields:
        [ // 'hash'
            //  , 'abbrevHash'
            'authorDate',
            'subject',
            'authorName'
            //  , 'authorDate'
        ]
        , execOptions:
        {
            maxBuffer: 1000 * 1024
        }
    };


// Synchronous
function showHistory() {

    // Get list of all repos
    var directories = getDirectories(options.repos);

    _.forEach(directories, function (directory) {
        var repoPath = options.repos + "/" + directory;

        try {
            optionsGit.repo = repoPath;
            var commits = gitlog(optionsGit);
            console.log(directory + " (" + commits.length + " commits since " + options.sinceDate + " ) " + "****************")

            if (commits.length > 0) {
                _.forEach(commits, function (commit, index) {
                    console.log("Date: " + commit.authorDate + " - " + commit.authorName + " - " + commit.subject);
                });
            }
        }
        catch (e) {
            if (IsNotRepoError(e)) {
                console.log(directory + " is not a git repository...")
            } else {
                throw e
            }
        }
        console.log("");

    });
}

function IsNotRepoError(error) {
    return error.message.indexOf("Not a git repository") > -1
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}


if (validateArgs()) {
    showHistory();
}
