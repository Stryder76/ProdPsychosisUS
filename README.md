# ProdPsychosisUS

This branch is where I will push new features and fix bugs before pushing to main. I would strongly advise against using the code.gs file here, it could easily be problematic for users, I would only advise you use this branch if you want to look for bugs.

This repository is my hosting location and publication of the user script I made from [@Lord_Vlad](https://habitica.com/profile/ce36e72e-50fd-4e98-908b-34b3c06e9664)'s orginal [challenge](https://habitica.com/challenges/074dec30-252f-42aa-9dc8-a6462b982a59) and [Userscript.](https://pastebin.com/Ajbc6u8D) I do not own the copyright and have his permission to have this repo.

The Userscript includes 4 checklist items that are automatically created if they don't already exist, they are automatically checked off if the conditions are true, if they are not true, the negative habit gets ticked a number of times based on the checklist item, I won't repeat that as it's already in the [challenge](https://habitica.com/challenges/4867732f-4019-4880-823e-5f3a178acea8) description

Setup guide:

1. Make a google app script by going to script.google.com it should prompt you to make a script if it's your first time on the site.

2. Copy the code from code.gs and config.html after downloading one of the [releases](https://github.com/Stryder76/ProdPsychosisUS/releases) I would reccomend picking the latest release not marked as a pre-release, e.g, not alpha or beta, or unstable by any other means and put it into the google app script

3. Setup a trigger to run on scheduleCron and make it Time-driven, you can make it repeat either daily on a range of hours (I personally have it run between 2-3 AM) or at a specific hourly interval, the trigger section is right below the code section.

You should replace the strings in quotes in config.html with your data.

There is some config guides contained inline in the code, you should be fine. Feel free to start an [issue](https://github.com/Stryder76/ProdPsychosisUS/issues/new/choose) or ask in the [guild](https://habitica.com/groups/guild/bb4fe1e3-b7fa-4aa6-878b-1ecef0ca55f3) if you need anything.

There is a list of ideas for how you can modify this in the [challenge](https://habitica.com/challenges/4867732f-4019-4880-823e-5f3a178acea8) description

I plan on adding another guide for adding your own checklist items here.


have a requirement for less than 20 to-dos - done 

restructure code with functions - currently working on

Have a requirement for 4 to-dos done - queued and unknown in regards to how to execute on it

Have a requirement for 5 checklist items on to-dos clicked - queued and unknown in regards to how to execute on it

Make to-do blacklisting for the overdue and no soon to-do checklist items. This will allow stuff like monthly reviews which can only be done a few days ahead of time to work properly - queued and unknown in regards to how to execute on it

Uncheck all items when false - queued

make a non user script version of the challenge with more dallies queued

