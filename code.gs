/* Copyright 2021 @Lord_Vlad

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  This script was originally comissioned by the copyright owner. I (@Stryder2076) started using it myself and modified and distributed it with his permission.*/

const jsonString =
  HtmlService.createHtmlOutputFromFile("config.html").getContent();
const jsonObject = JSON.parse(jsonString);
const habId = jsonObject.coreSettings.habId;
const habToken = jsonObject.coreSettings.habToken; // Never share your API token with anyone even on Github
const soonTodoBlacklist =
  jsonObject.optionalSettings.blacklists.todoSoonDueDateBlacklist;
const overDueTodoBlacklist =
  jsonObject.optionalSettings.blacklists.todoOverDueBlacklist;
const lowTodoCountItemBlacklist =
  jsonObject.optionalSettings.blacklists.todoCountItemBlacklist;
const habitToCheck = jsonObject.coreSettings.habitToCheck;
const taskName = jsonObject.coreSettings.taskName;
const AllCursesCheckedChecklistName =
  jsonObject.checklistItemNames.allCursesCheckedName;
const haveNoSoonToDosChecklistName =
  jsonObject.checklistItemNames.noSoonTodosName;
const haveNoOverdueToDosChecklistName =
  jsonObject.checklistItemNames.noOverdueTodosName;
const haveLessThanTwentyTodosName =
  jsonObject.checklistItemNames.haveALowTodoCountName;
const allCursesCheckedItemIsEnabled =
  jsonObject.optionalSettings.itemToggles.allCursesCheckedItemStatus;

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

  // below code until next comment goes through every todo and makes it default to not being blacklisted and counts the completed checklist item count

  let allTodos = UrlFetchApp.fetch(
    "https://habitica.com/api/v3/tasks/user?type=todos",
    getParams
  );
  let parsedTD = JSON.parse(allTodos.getContentText());
  let completedChecklistCount = 0;
  for (todo of parsedTD.data) {
    for (completedChecklist of todo.checklist) {
      if (completedChecklist.complete === true) {
        completedChecklistCount += 1;
      }
    }
    todo.blacklisted = false;
  }

  // Below code until next comment is fetching the list of daily tasks and defining the majority of variables that will be used later on.

  let response = UrlFetchApp.fetch(
    "https://habitica.com/api/v3/tasks/user?type=dailys",
    getParams
  );
  response = JSON.parse(response.getContentText());
  Logger.log("Searching for the task: " + taskName);
  // This for loop goes through every task and checks to see if it's the same as the chosen daily up top.
  for (task of response.data) {
    if (task.text.trim().toLowerCase() === taskName.trim().toLowerCase()) {
      Logger.log("Found task " + task.id);
      var taskId = task.id;
      const defaultEasyChallengeCurses = [
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

      const defaultHardChallengeCurses = [
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Time Magic",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Ritual Preparation",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Volunteering curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Old Magician's Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Questing for Ingredient",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Mana Vampirism Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Organizational Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Curse of the To-Do Bosses",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Procrastinator's Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Villian's Curse",
      ];

      const defaultClassBasedChallengeCurses = [
        "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Time Magic",
        "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Ritual Preparation",
        "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Volunteering curse",
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Old Magician's Curse",
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Questing for Ingredient",
        "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlue.png) Mana Vampirism Curse",
        "B![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Organizational Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Curse of the To-Do Bosses",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Procrastinator's Curse",
        "D![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullBlack.png) Villian's Curse",
      ];

      const mageCurseName =
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Wild Magic Curse";
      const rougeCurseName =
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Kleptomania";
      const healerCurseName =
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Healing Duty";
      const warriorCurseName =
        "R![Poison](http://avians.net/arrow/Habitica/YAP_Images/SkullRed.png) Cursed Armor";
      const allPossibleCurses = defaultEasyChallengeCurses.concat(
        defaultHardChallengeCurses,
        defaultClassBasedChallengeCurses,
        mageCurseName,
        rougeCurseName,
        healerCurseName,
        warriorCurseName
      );
      let curseList = [];
      for (taskListItem of response.data) {
        for (curse of allPossibleCurses) {
          if (curse === taskListItem.text) {
            curseList.push(curse);
          }
        }
      }

      //curseList = []; // this is debug code
      // This for loop looks through the checklist of the correct task and checks to see if the checklist items exist, if they do it communicates that to another code section through a function output and moves on, otherwise nothing happens
      if (curseList.length > 0 && allCursesCheckedItemIsEnabled === true) {
        var allCursesCheckedOutput = findItemAndCreateIfDidntExist(
          task.checklist,
          AllCursesCheckedChecklistName,
          "All curses checked"
        );
      }
      const haveNoSoonToDosOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        haveNoSoonToDosChecklistName,
        "Have no soon to-dos"
      );
      const haveNoOverDueTodosOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        haveNoOverdueToDosChecklistName,
        "Have no over Due To-Dos"
      );

      const haveLessThanTwentyTodosOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        haveLessThanTwentyTodosName,
        "Have a low to-do count"
      );

      if (allCursesCheckedOutput) {
        // Below code until next comment is the auto check for all curses done, I plan on adding more arrays that you can toggle the concatination of to allow for the addon challenge and other difficulties, sorrt for any inconvenience

        let dailyTasks = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=dailys",
          getParams
        );
        let parsedDT = JSON.parse(dailyTasks.getContentText());
        const findTaskCursesOutput = findTaskCurses(
          parsedDT.data,
          allCursesCheckedOutput,
          allPossibleCurses
        );
        Logger.log(findTaskCursesOutput);

        Logger.log("Task checklist item is " + AllCursesCheckedChecklistName);
        if (
          findTaskCursesOutput === true &&
          allCursesCheckedOutput.completed === false
        ) {
          Logger.log("All curses checked, scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${allCursesCheckedOutput.id}/score`,
            postParams
          );
          allCursesCheckedOutput.completed = true;
        }
      }
      else {
        Logger.log("You either aren't in any curse challenges, or have the item turned off. If neither of these are true please report this error")
      }

      if (haveNoSoonToDosOutput) {
        let today = new Date();
        let days;
        let task;
        let soonToDoDate;

        function toDoin14Days(value) {
          task = value;
          soonToDoDate = new Date(task.date).valueOf();
          let todayUTC = today;
          let td = new Date(todayUTC).valueOf();
          let sec = 1000;
          let min = 60 * sec;
          let hour = 60 * min;
          let day = 24 * hour;
          let diff = soonToDoDate - td;
          days = Math.floor(diff / day);
          //days = 17; //this is debug code
          Logger.log(
            "due date difference from today is" + " " + "%s days",
            days
          );
          let blacklistedTodosDateList;
          const findBlacklistedsoonTodosOutput = findBlacklistedTodos(
            "Soon to-dos",
            soonTodoBlacklist,
            blacklistedTodosDateList
          );
          Logger.log(findBlacklistedsoonTodosOutput);
          return days < 13 && task.blacklisted === false;
        }
        let soonToDosExist = parsedTD.data.some(toDoin14Days);
        Logger.log("task checklist item is " + haveNoSoonToDosOutput.text);
        if (
          soonToDosExist === false &&
          haveNoSoonToDosOutput.completed === false
        ) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveNoSoonToDosOutput.id}/score`,
            postParams
          );
          haveNoSoonToDosOutput.completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }

      // Below code until next comment is the auto checking for no overdue to-dos

      if (haveNoOverDueTodosOutput) {
        let overdue = false;
        let today;
        today = new Date();
        today = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        let sec;
        let min;
        let hour;
        sec = 1000;
        min = 60 * sec;
        hour = 60 * min;
        day = 24 * hour;
        let blacklistedTodosOverdueList;
        const findBlacklistedOverdueTodosOutput = findBlacklistedTodos(
          "Overdue to-dos",
          overDueTodoBlacklist,
          blacklistedTodosOverdueList
        );
        Logger.log(findBlacklistedOverdueTodosOutput);
        for (possibleOverDueToDo of parsedTD.data) {
          if (possibleOverDueToDo.date) {
            let ToDoDate = new Date(possibleOverDueToDo.date);

            ToDoDate = new Date(
              ToDoDate.getFullYear(),
              ToDoDate.getMonth(),
              ToDoDate.getDate()
            );

            //ToDoDate = today; // this is debug code
            Logger.log({ ToDoDate, today, today });

            if (ToDoDate < today && possibleOverDueToDo.blacklisted === false) {
              overdue = true;
              break;
            }

            Logger.log(
              "Have no overdue to-dos checklist item is " +
              haveNoOverDueTodosOutput.text
            );
            if (
              overdue === false &&
              haveNoOverDueTodosOutput.completed === false
            ) {
              Logger.log("scoring checklist item");
              UrlFetchApp.fetch(
                `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveNoOverDueTodosOutput.id}/score`,
                postParams
              );
              haveNoOverDueTodosOutput.completed = true;
            }
          }
        }
        Logger.log("task checklist item is " + haveNoOverDueTodosOutput.text);
        if (overdue === false && haveNoOverDueTodosOutput.completed === false) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveNoOverDueTodosOutput.id}/score`,
            postParams
          );
          haveNoOverDueTodosOutput.completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }

      if (haveLessThanTwentyTodosOutput) {
        let toDoCount = 0;
        let toDoLimit = 20; // change this to whatever your goal for your to-do count is
        for (task of parsedTD.data) {
          if (task.blacklisted === true) {
            continue;
          }
          toDoCount = toDoCount + 1;
        }
        //toDoCount = 10; // this is debug code
        if (
          toDoCount < toDoLimit &&
          haveLessThanTwentyTodosOutput.completed === false
        ) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveLessThanTwentyTodosOutput.id}/score`,
            postParams
          );
          haveLessThanTwentyTodosOutput.completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }
      if (allCursesCheckedItemIsEnabled === true && curseList.length > 0) {
        if (
          allCursesCheckedOutput.completed === true &&
          haveNoSoonToDosOutput.completed === true &&
          haveNoOverDueTodosOutput.completed === true &&
          haveLessThanTwentyTodosOutput.completed === true
        ) {
          Logger.log("Scoring daily");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/score/up`,
            postParams
          );
        }
      }
      else {
        if (
          haveNoSoonToDosOutput.completed === true &&
          haveNoOverDueTodosOutput.completed === true &&
          haveLessThanTwentyTodosOutput.completed === true
        ) {
          Logger.log("Scoring daily");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/score/up`,
            postParams
          );
        }
      }

      // All below code until the next comment is for checking checklist items' completion status and ticking the negative habit if they aren't completed.
      if (curseList > 0 && allCursesCheckedItemIsEnabled === true) {
      if (allCursesCheckedOutput.completed == false) {
        Logger.log(
          JSON.stringify({ allCursesCheckedOutput }) +
            " checklist item " +
            "failed deducting health..."
        );
        response = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=habits",
          getParams
        );
        response = JSON.parse(response.getContentText());
        habit = checkHabitExists(response);
        if (habit) {
          // You can change the amount of habit scoring in this if statement and the below else statement to configure the punishment for failure of each checklist item, be careful with using too many as it can cause rate limiting
          scoreHabit(habit.id);
        } else {
          id = createHabit();
          scoreHabit(habit.id);
        }
      }
    }
      if (haveNoSoonToDosOutput.completed == false) {
        Logger.log(
          JSON.stringify({ haveNoSoonToDosOutput }) +
            " Checklist item " +
            " failed deducting health..."
        );
        response = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=habits",
          getParams
        );
        response = JSON.parse(response.getContentText());
        habit = checkHabitExists(response);
        if (habit) {
          // You can change the amount of habit scoring in this if statement and the below else statement to configure the punishment for failure of each checklist item, be careful with using too many as it can cause rate limiting
          scoreHabit(habit.id);
          scoreHabit(habit.id);
        } else {
          id = createHabit();
          scoreHabit(habit.id);
          scoreHabit(habit.id);
        }
      }
      if (haveNoOverDueTodosOutput.completed == false) {
        Logger.log(
          JSON.stringify({ haveNoOverDueTodosOutput }) +
            " checklist failed deducting health..."
        );
        response = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=habits",
          getParams
        );
        response = JSON.parse(response.getContentText());
        habit = checkHabitExists(response);
        if (habit) {
          // You can change the amount of habit scoring in this if statement and the below else statement to configure the punishment for failure of each checklist item, be careful with using too many as it can cause rate limiting
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
      if (haveLessThanTwentyTodosOutput.completed == false) {
        Logger.log(
          JSON.stringify({ haveLessThanTwentyTodosOutput }) +
            " checklist item " +
            "failed deducting health..."
        );
        response = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=habits",
          getParams
        );
        response = JSON.parse(response.getContentText());
        habit = checkHabitExists(response);
        if (habit) {
          // You can change the amount of habit scoring in this if statement and the below else statement to configure the punishment for failure of each checklist item, be careful with using too many as it can cause rate limiting
          scoreHabit(habit.id);
        } else {
          id = createHabit();
          scoreHabit(habit.id);
        }
      }
    }
  }

  function findItemAndCreateIfDidntExist(
    checklist,
    itemName,
    itemNameInLogStatement
  ) {
    for (check of checklist) {
      if (check.text.trim().toLowerCase() === itemName.trim().toLowerCase()) {
        Logger.log(
          itemNameInLogStatement +
            " item name is" +
            " " +
            "'" +
            check.text +
            "'" +
            ", its ID is: " +
            check.id
        );
        return check;
      }
    }

    const newItem = JSON.parse(JSON.stringify(postParams));
    newItem.payload = {
      text: itemName,
    };
    const checklistItemResponse = UrlFetchApp.fetch(
      `https://habitica.com/api/v3/tasks/${taskId}/checklist/`,
      newItem
    );
    const Item = JSON.parse(checklistItemResponse.getContentText());
    // below code is looking for the checklist item that was just made to properly define the variable
    for (checklistItem of Item.data.checklist) {
      if (
        checklistItem.text.trim().toLowerCase() ===
        itemName.trim().toLowerCase()
      ) {
        Logger.log(
          itemNameInLogStatement +
            " item did not exist, it has been made; it's title is" +
            " " +
            "'" +
            checklistItem.text +
            "'" +
            ", its ID is: " +
            checklistItem.id
        );
        return checklistItem;
      }
    }
    return null;
  }

  function findBlacklistedTodos(
    taskTypeInLogStatement,
    blacklistedConfig,
    blacklistedTodosArray
  ) {
    blacklistedTodosArray = [];
    for (todo of parsedTD.data) {
      for (blacklistedTodo of blacklistedConfig) {
        if (
          blacklistedTodo.trim().toLowerCase() ===
          todo.text.trim().toLowerCase()
        ) {
          todo.blacklisted = true;
          blacklistedTodosArray.push(todo.text);
        }
      }
    }
    Logger.log(
      "These are the blacklisted " + taskTypeInLogStatement + " found"
    );
    return blacklistedConfig;
  }

  function findTaskCurses(dailyTasksAfterParsing, allCursesCheckedData, possibleCursesList) {


    for (possibleCurseTask of dailyTasksAfterParsing) {
      for (curseTitle of possibleCursesList) {
        let isPoisonTitle = false;
        if (
          curseTitle.trim().toLowerCase() ===
          possibleCurseTask.text.trim().toLowerCase()
        ) {
          isPoisonTitle = true;
        }
        //possibleCurseTask.completed = true; // this is debug code
        if (isPoisonTitle === true && possibleCurseTask.completed === false) {
          return false;
        }
      }
    }
    return true;
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
