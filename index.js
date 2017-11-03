const fs = require('fs');
const gitlog = require('gitlog');
const _ = require('lodash');
const dateformat = require('dateformat');
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
        msg += "Missing -d: Number of days subtracted from today because the start date to filter.\n";
    } 
    if (argv.n === undefined) {
        msg += "Missing -n: Max number of commits to return per repository.\n";
    }

    if (msg.length > 0) {
        console.log(msg);
    }

    return msg.length === 0;
}


var today = new Date();

var options = {
    repos: argv.r,
    author: argv.a,
    sinceDate: new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate() - argv.d
    ),
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

                    var display = {
                        project: directory,
                        author: commit.authorName,
                        date: commit.authorDate,
                        message: commit.subject
                    }
                    console.log(JSON.stringify(display, null, 4));
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

function getCommits() {
    
        // Get list of all repos
        var directories = getDirectories(options.repos);
    
        var commitHistory = [];

        _.forEach(directories, function (directory) {
            var repoPath = options.repos + "/" + directory;
    
            try {
                optionsGit.repo = repoPath;
                var commits = gitlog(optionsGit);
                //console.log(directory + " (" + commits.length + " commits since " + options.sinceDate + " ) " + "****************")
    
                if (commits.length > 0) {
                    _.forEach(commits, function (commit, index) {
                        var summary = {
                            project: directory,
                            author: commit.authorName,
                            date:  dateformat(commit.authorDate, "mm/dd/yyyy"),
                            time: dateformat(commit.authorDate, "shortTime"),
                            message: commit.subject
                        }

                        commitHistory.push(summary);
                        //console.log(JSON.stringify(summary, null, 4));
                    });
                }
            }
            catch (e) {
                if (IsNotRepoError(e)) {
                    //console.log(directory + " is not a git repository...")
                } else {
                    throw e
                }
            }
    
        });

        return commitHistory;
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

    //showHistory();
    var commits = getCommits();
    var sorted = _.sortBy(commits, ['date', 'time']).reverse();
    var grouped = _.groupBy(sorted, 'date');

    _.forEach(grouped, function (group) {
        console.log(options.author + " - " + group[0].date + " **********************************************");

        _.forEach(group, function(commit){
            console.log("  " + commit.time);
            console.log("    " + commit.project);
            console.log("    " + commit.message);
        });

        console.log("");
    });
}


