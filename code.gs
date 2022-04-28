 var habId = "#habId#";
 var habToken = "#habToken#";
 var habitToCheck = '![PSN](https://i.imgur.com/Dt7diBq.png) **Poisonous habit**'
 var taskName = '![PSN](https://i.imgur.com/Dt7diBq.png) **Productivity psychotic gas**'
 var firstChecklistName = "All curses checked"
 var secondChecklistName = "No soon To-Dos"
 var thirdChecklistName = "No overdue To-Dos"
 
 
 function scheduleCron() {
  const getParams = {
    "method" : "get",
    "headers" : {
      "x-api-user" : habId, 
      "x-api-key" : habToken
    }
  };
    const postParams = {
    "method" : "post",
    "headers" : {
      "x-api-user" : habId, 
      "x-api-key" : habToken
    }
  };
// Below code until next comment is finding and defining the daily and its checklist items

  let response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=dailys", getParams)
  response = JSON.parse(response.getContentText())
  Logger.log('Searching for the task: ' + taskName)
  let haveNoSoonToDosID;
  for (task of response.data) {
    Logger.log(task.text + taskName)
    if (task.text.trim().toLowerCase() === taskName.trim().toLowerCase()){
      Logger.log('Found task ' + task.id)
// the below for loop is my primary issue, I'm already aware of the issue with the second checklist item scoring
      for (task of task.checklist) {
        Logger.log(task.checklist)
    
      }


        let allCursesDone = task.checklist[0]
        Logger.log("First checklist item is "+ allCursesDone)
        let haveNoSoonToDos = task.checklist[1]
        Logger.log(haveNoSoonToDos)
        let noOverdueToDos = task.checklist[2]
        Logger.log("Third checklist item is "+ noOverdueToDos)
        let allCursesDoneID = allCursesDone.id
        Logger.log(allCursesDoneID)
        let haveNoSoonToDosID = haveNoSoonToDos.id
        Logger.log({haveNoSoonToDosID})
        noOverdueToDosID = noOverdueToDos.id
        Logger.log(noOverdueToDosID)
      

    UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=dailys", getParams)
    }
    else {
      Logger.log('Daily not found')
    }
  }


/*
Get an array of the task's checklist items
Compare each checklist items name with the names with a .trim().getLowercase() at the top of this file.
 If they don't match 
 create new checklist items
*/




// Below code until next comment is the auto check for all curses done
   var defaultEasyChallengePoisons = ["B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Time Magic", "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Ritual Preparation", "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Volunteering curse", "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Old Magician's Curse", "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Questing for Ingredient", "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Mana Vampirism Curse", "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Organizational Curse", "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Curse of the To-Do Bosses", "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Procrastinator's Curse", "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Villian's Curse"]
  var dailyTasks = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=dailys", getParams)
  var parsedDT = JSON.parse(dailyTasks.getContentText())
  var poisonsDone = true
for (task of parsedDT.data) {
  let isPoisonTitle = false
  for (poisonTitle of defaultEasyChallengePoisons) {
    if (poisonTitle.trim().toLowerCase() === task.text.trim().toLowerCase()) {
        isPoisonTitle = true
        break
    }
  }

      if (isPoisonTitle === true && task.completed === false) {
        poisonsDone = false
        break

      }
    }
 if (poisonsDone == true) {
   Logger.log('All curses checked, scoring checklist item')
   UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/1dbc3eaf-1510-4bb4-95b6-d23bf535f925/score", postParams)
 }





 // Below code until next comment is the auto check for no soon to-dos
var today = new Date()
var days;
var task;
var soonToDoDate;
var d = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=todos", getParams)
var parsedD = JSON.parse(d.getContentText())
function toDoin14Days(value){
  task = value
  soonToDoDate=new Date(task.date).valueOf();
  var todayUTC = today
  var td=new Date(todayUTC).valueOf();
  var sec=1000;
  var min=60*sec;
  var hour=60*min;
  var day=24*hour;
  var diff=soonToDoDate-td;
  days=Math.floor(diff/day);
  days = 17 // this is debug code
  Logger.log("due date difference from today is" + " "+  '%s days',days);
  return days < 13
}
var soonToDosExist = parsedD.data.some(toDoin14Days)
Logger.log("task checklist item is "+ task.checklist[1])
 if (soonToDosExist === false) {
   Logger.log('scoring checklist item')
   UrlFetchApp.fetch(`https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/${haveNoSoonToDosID}/score`, postParams)
 }

// All below code until the next comment is for checking checklist items' completion status and ticking the negative habit if they aren't completed.
      if(allCursesDone.completed == false) {
        Logger.log('First checklist, "All poisons checked" failed deducting health...')
        Logger.log(task.checklist[0])
        response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=habits", getParams)
        response = JSON.parse(response.getContentText())
        habit = checkHabitExists(response)
        if(habit) {
          scoreHabit(habit.id)
         
        } else {
          id = createHabit()
          scoreHabit(habit.id)
            
        }
      }
      if(haveNoSoonToDos.completed == false) {
        Logger.log('Second checklist, "No soon ToDos" failed deducting health...')
        Logger.log(haveNoSoonToDos)
        response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=habits", getParams)
        response = JSON.parse(response.getContentText())
        habit = checkHabitExists(response)
        if(habit) {
          scoreHabit(habit.id)
          scoreHabit(habit.id)

         
        } else {
          id = createHabit()
          scoreHabit(habit.id)
          scoreHabit(habit.id)
            
        }
    }
        if(noOverdueToDos.completed == false) {
          Logger.log('Third checklist, "No overdue To-Dos" failed deducting health...')
          Logger.log(task.checklist[2])
          response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user?type=habits", getParams)
          response = JSON.parse(response.getContentText())
          habit = checkHabitExists(response)
          if(habit) {
            scoreHabit(habit.id)
            scoreHabit(habit.id)
            scoreHabit(habit.id)
          
          } else {
            id = createHabit()
            scoreHabit(habit.id)
            scoreHabit(habit.id)
            scoreHabit(habit.id)
              
          }
    }
  }
 
 
 function scoreHabit(id) {
 const postParams = {
    "method" : "post",
    "headers" : {
      "x-api-user" : habId, 
      "x-api-key" : habToken
    }
  };
  Logger.log('Scoring the habit...')
  response = UrlFetchApp.fetch(`https://habitica.com/api/v3/tasks/${id}/score/down`, postParams)
  if(response.getResponseCode() === 200) {
    Logger.log('Scoring successful')
  } else {
    Logger.log('There was an issue scoring the habit: ' + response.getContentText())
  }
 }
 function createHabit() {
 const postParams = {
    "method" : "post",
    "headers" : {
      "x-api-user" : habId, 
      "x-api-key" : habToken
    },
    'payload' : {
      'text': habitToCheck,
      'type': 'habit',
      'up': false
    }
  };
 Logger.log('Habit not yet created, creating one...')
 response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user", postParams)
 if(response.getResponseCode() === 201) {
   Logger.log('Habit created successfully')
   response = JSON.parse(response.getContentText())
   return response.data["_id"]
 }
 }
 function checkHabitExists(response) {
 for (habit of response.data) {
   if (habit.text.trim().toLowerCase() === habitToCheck.trim().toLowerCase()) {
     return habit
   }
 }
 return null
 }
 
