var habId = "#habId#";
var habToken = "#habToken#";
var habitToCheck =
  "![PSN](https://i.imgur.com/Dt7diBq.png) **Poisonous habit**";
var taskName =
  "![PSN](https://i.imgur.com/Dt7diBq.png) **Productivity psychotic gas**";
var firstChecklistName = "All curses checked";
var secondChecklistName = "No soon To-Dos";
var thirdChecklistName = "No overdue To-Dos";

function scheduleCron() {
  const getParams = {
    method: "get",
    headers: {
      "x-api-user": habId,
      "x-api-key": habToken,
    },
  };
  const postParams = {
    method: "post",
    headers: {
      "x-api-user": habId,
      "x-api-key": habToken,
    },
  };
  // Below code until next comment is finding and defining the daily and its checklist items

  let response = UrlFetchApp.fetch(
    "https://habitica.com/api/v3/tasks/user?type=dailys",
    getParams
  );
  response = JSON.parse(response.getContentText());
  Logger.log("Searching for the task: " + taskName);
  let allCursesDone;
  var haveNoSoonToDos;
  var noOverdueToDos;
  var allCursesDoneID;
  var haveNoSoonToDosID;
  let noOverdueToDosID;
  var allCursesDoneExists = false;
  var noSoonToDosExists = false;
  var noOverdueToDosExists = false;
  for (task of response.data) {
    if (task.text.trim().toLowerCase() === taskName.trim().toLowerCase()) {
      Logger.log("Found task " + task.id);

      for (check of task.checklist) {
        if (
          check.text.trim().toLowerCase() ===
          firstChecklistName.trim().toLowerCase()
        ) {
          allCursesDoneExists = true;
          allCursesDone = check;
          allCursesDoneID = allCursesDone.id;
          Logger.log(
            "Curse completion item name is" +
              " " +
              "'" +
              allCursesDone.text +
              "'" +
              ", its ID is: " +
              allCursesDoneID
          );
        }
        if (
          check.text.trim().toLowerCase() ===
          secondChecklistName.trim().toLowerCase()
        ) {
          noSoonToDosExists = true;
          haveNoSoonToDos = check;
          haveNoSoonToDosID = haveNoSoonToDos.id;
          Logger.log(
            "No soon ToDo's title is:" +
              " " +
              "'" +
              haveNoSoonToDos.text +
              "'" +
              ", its id is: " +
              haveNoSoonToDosID
          );
        }
        if (
          check.text.trim().toLowerCase() ===
          thirdChecklistName.trim().toLowerCase()
        ) {
          noOverdueToDosExists = true;
          noOverdueToDos = check;
          noOverdueToDosID = noOverdueToDos.id;
          Logger.log(
            "No Over Due To-Do item's title is: " +
              "'" +
              noOverdueToDos.text +
              "'" +
              ", its id is: " +
              noOverdueToDosID
          );
        }
      }
      if (!allCursesDoneExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: firstChecklistName,
        };
        const newCursesCompletedItemResponse = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/",
          newItem
        );
        const newCursesCompletedItem = JSON.parse(
          newCursesCompletedItemResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of newCursesCompletedItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            firstChecklistName.trim().toLowerCase()
          ) {
            allCursesDoneExists = true;
            allCursesDone = checklistItem;
            allCursesDoneID = allCursesDone.id;
            Logger.log(
              "Curse completion item did not exist, it has been made; it's title is" +
                " " +
                "'" +
                allCursesDone.text +
                "'" +
                ", its ID is: " +
                allCursesDoneID
            );
          }
        }
      }
      if (!noSoonToDosExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: secondChecklistName,
        };
        const NoSoonToDosItemResponse = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/",
          newItem
        );
        const NoSoonToDosItem = JSON.parse(
          NoSoonToDosItemResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of NoSoonToDosItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            secondChecklistName.trim().toLowerCase()
          ) {
            soonToDosExist = true;
            haveNoSoonToDos = checklistItem;
            haveNoSoonToDosID = haveNoSoonToDos.id;
            Logger.log(
              "Have no soon to-dos item did not exist, it has been made; it's title is" +
                " " +
                "'" +
                haveNoSoonToDos.text +
                "'" +
                ", its ID is: " +
                haveNoSoonToDosID
            );
          }
        }
      }
      if (!noOverdueToDosExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: thirdChecklistName,
        };
        const NoOverdueToDosItemResponse = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/",
          newItem
        );
        const NoOverDueToDosItem = JSON.parse(
          NoOverdueToDosItemResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of NoOverDueToDosItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            thirdChecklistName.trim().toLowerCase()
          ) {
            noOverdueToDosExists = true;
            noOverdueToDos = checklistItem;
            noOverdueToDosID = noOverdueToDos.id;
            Logger.log(
              "no over due to-dos item did not exist, it has been made; it's title is" +
                " " +
                "'" +
                noOverdueToDos.text +
                "'" +
                ", its ID is: " +
                noOverdueToDosID
            );
          }
        }
      }
    } else {
      Logger.log("Daily not found yet or already passed");
    }
  }

  if (allCursesDoneExists === true) {
    // Below code until next comment is the auto check for all curses done
    var defaultEasyChallengePoisons = [
      "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Time Magic",
      "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Ritual Preparation",
      "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Volunteering curse",
      "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Old Magician's Curse",
      "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Questing for Ingredient",
      "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Mana Vampirism Curse",
      "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Organizational Curse",
      "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Curse of the To-Do Bosses",
      "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Procrastinator's Curse",
      "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Villian's Curse",
    ];
    var dailyTasks = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=dailys",
      getParams
    );
    var parsedDT = JSON.parse(dailyTasks.getContentText());
    var poisonsDone = true;
    for (task of parsedDT.data) {
      let isPoisonTitle = false;
      for (poisonTitle of defaultEasyChallengePoisons) {
        if (
          poisonTitle.trim().toLowerCase() === task.text.trim().toLowerCase()
        ) {
          isPoisonTitle = true;
          break;
        }
      }

      if (isPoisonTitle === true && task.completed === false) {
        poisonsDone = false;
        break;
      }
    }
    if (poisonsDone == true) {
      Logger.log("All curses checked, scoring checklist item");
      UrlFetchApp.fetch(
        `https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/${allCursesDoneID}/score`,
        postParams
      );
    }
  } else {
    Logger.log("something went wrong");
  }

  // Below code until next comment is the auto check for no soon to-dos
  if (noSoonToDosExists === true) {
    var today = new Date();
    var days;
    var task;
    var soonToDoDate;
    var d = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=todos",
      getParams
    );
    var parsedD = JSON.parse(d.getContentText());
    function toDoin14Days(value) {
      task = value;
      soonToDoDate = new Date(task.date).valueOf();
      var todayUTC = today;
      var td = new Date(todayUTC).valueOf();
      var sec = 1000;
      var min = 60 * sec;
      var hour = 60 * min;
      var day = 24 * hour;
      var diff = soonToDoDate - td;
      days = Math.floor(diff / day);
      // days = 17 this is currently unneeded debug code
      Logger.log("due date difference from today is" + " " + "%s days", days);
      return days < 13;
    }
    var soonToDosExist = parsedD.data.some(toDoin14Days);
    Logger.log("task checklist item is " + haveNoSoonToDos.text);
    if (soonToDosExist === false) {
      Logger.log("scoring checklist item");
      UrlFetchApp.fetch(
        `https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/${haveNoSoonToDosID}/score`,
        postParams
      );
    }
  } else {
    Logger.log("something went wrong");
  }

  // Below code until next comment is the auto checking for no overdue to-dos
  if (noOverdueToDosExists === true) {
    var overdue = false;
    let today;
    today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    //tomorrow.setDate(tomorrow.getDate()+1)
    let sec;
    let min;
    let hour;
    sec = 1000;
    min = 60 * sec;
    hour = 60 * min;
    day = 24 * hour;
    var d = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=todos",
      getParams
    );
    var parsedD = JSON.parse(d.getContentText());
    for (task of parsedD.data) {
      var ToDoDate = new Date(task.date);
      ToDoDate = new Date(
        ToDoDate.getFullYear(),
        ToDoDate.getMonth(),
        ToDoDate.getDate()
      );
      Logger.log({ ToDoDate, today, today });
      if (ToDoDate < today) {
        overdue = true;
        break;
      }
    }

    Logger.log("task checklist item is " + { noOverdueToDos });
    if (overdue === false) {
      Logger.log("scoring checklist item");
      UrlFetchApp.fetch(
        `https://habitica.com/api/v3/tasks/d819fba4-5ae4-4c12-b949-26bb09b90b43/checklist/${noOverdueToDosID}/score`,
        postParams
      );
    }
  } else {
    Logger.log("something went wrong");
  }

  // All below code until the next comment is for checking checklist items' completion status and ticking the negative habit if they aren't completed.
  if (allCursesDone.completed == false) {
    Logger.log(
      'First checklist, "All poisons checked" failed deducting health...'
    );
    response = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=habits",
      getParams
    );
    response = JSON.parse(response.getContentText());
    habit = checkHabitExists(response);
    if (habit) {
      scoreHabit(habit.id);
    } else {
      id = createHabit();
      scoreHabit(habit.id);
    }
  }
  if (haveNoSoonToDos.completed == false) {
    Logger.log('Second checklist, "No soon ToDos" failed deducting health...');
    Logger.log(haveNoSoonToDos);
    response = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=habits",
      getParams
    );
    response = JSON.parse(response.getContentText());
    habit = checkHabitExists(response);
    if (habit) {
      scoreHabit(habit.id);
      scoreHabit(habit.id);
    } else {
      id = createHabit();
      scoreHabit(habit.id);
      scoreHabit(habit.id);
    }
  }
  if (noOverdueToDos.completed == false) {
    Logger.log(
      'Third checklist, "No overdue To-Dos" failed deducting health...'
    );
    response = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user?type=habits",
      getParams
    );
    response = JSON.parse(response.getContentText());
    habit = checkHabitExists(response);
    if (habit) {
      scoreHabit(habit.id);
      scoreHabit(habit.id);
      scoreHabit(habit.id);
    } else {
      id = createHabit();
      scoreHabit(habit.id);
      scoreHabit(habit.id);
      scoreHabit(habit.id);
    }
  }

  function scoreHabit(id) {
    const postParams = {
      method: "post",
      headers: {
        "x-api-user": habId,
        "x-api-key": habToken,
      },
    };
    Logger.log("Scoring the habit...");
    response = UrlFetchApp.fetch(
      `https://habitica.com/api/v3/tasks/${id}/score/down`,
      postParams
    );
    if (response.getResponseCode() === 200) {
      Logger.log("Scoring successful");
    } else {
      Logger.log(
        "There was an issue scoring the habit: " + response.getContentText()
      );
    }
  }
  function createHabit() {
    const postParams = {
      method: "post",
      headers: {
        "x-api-user": habId,
        "x-api-key": habToken,
      },
      payload: {
        text: habitToCheck,
        type: "habit",
        up: false,
      },
    };
    Logger.log("Habit not yet created, creating one...");
    response = UrlFetchApp.fetch(
      "https://habitica.com/api/v3/tasks/user",
      postParams
    );
    if (response.getResponseCode() === 201) {
      Logger.log("Habit created successfully");
      response = JSON.parse(response.getContentText());
      return response.data["_id"];
    }
  }
  function checkHabitExists(response) {
    for (habit of response.data) {
      if (
        habit.text.trim().toLowerCase() === habitToCheck.trim().toLowerCase()
      ) {
        return habit;
      }
    }
    return null;
  }
}
