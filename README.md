# githistory

## githistory

A simple wrapper around gitlog npm module that will search through all local git repositories in a given directory and print to the console a git history of commit dates and messages in chronilogical order for a given commit author and date.

### Parameters

* -r: Path to directory containing repo directories.
* -a: Commit author's full name use for filtering.
* -d: Number representing the number of days to include in the search.  ie, 7 would search the previous week, 14 would search the previous 2 weeks of git history.
* -n: Max number of commits to return per repository.

### Example Usage

    index.js -r C:/Users/mhaus/Source/Repos -a 'Marshall Hauser' -d 7 -n ' 1000' 

will result in the following being printed to console:

    Git history for Marshall Hauser since 10/27/2017:
    fatal: Not a git repository (or any of the parent directories): .git
    fatal: Not a git repository (or any of the parent directories): .git
    fatal: Not a git repository (or any of the parent directories): .git
    fatal: Not a git repository (or any of the parent directories): .git
    fatal: Not a git repository (or any of the parent directories): .git
    Marshall Hauser - 11/02/2017 **********************************************
      12:49 PM|vt.web
        #PDM-1171 - Hotfix - LinkPhoto was not being checked for null.
    
    Marshall Hauser - 11/01/2017 **********************************************
      3:30 PM|vt_emailparser
        Added a new builld property group and forgot to add the <TeamCityBuild>false</TeamCityBuild>
      3:22 PM|vt_tourpublish
        Auto increment the build number.
      3:09 PM|vt_tourpublish
        Added new build target for setting the build number.
      2:04 PM|vt_tourpublish
        Renamed
      2:00 PM|vt_tourpublish
        Added Reshaper solution level settings file.
    
    Marshall Hauser - 10/31/2017 **********************************************
      4:47 PM|vt_emailparser
        Added new compilation config for Any CPU
      10:26 AM|vt_videomaint
        Made button clicks async.
    
    Marshall Hauser - 10/30/2017 **********************************************
      1:32 PM|vt.web
        #PDM-1125 - Added warning about how this setting is not supported by VT studio.
      10:46 AM|listingsourceupdate
        #PDM-1139 - Ran translations for BrightMLS
