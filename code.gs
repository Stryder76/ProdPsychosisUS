/* Copyright 2022 @Lord_Vlad

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  This script was originally comissioned by the copyright owner. I (@Stryder2076) started using it myself and modified and distributed it with his permission.*/

// Change the below two consts to your user ID and API token, they can be found here: 'https://habitica.com/user/settings/api'
// Leave the quotes and replace the two # symbols and the variable name inbetween them with your ID and token

const jsonString =
  HtmlService.createHtmlOutputFromFile("config.html").getContent();
const jsonObject = JSON.parse(jsonString);
const habId = jsonObject.habId;
const habToken = jsonObject.habToken; // Never share your API token with anyone even on Github

const habitToCheck =
  "![Crazy person with knife](https://i.imgur.com/Gl0O99r.png) Psychotic break"; // Change this ot the name that you want for the negative habit to click on checklist item failures
const taskName =
  "![insane person with cracked head on top](https://i.imgur.com/ktgyMSM.png) insanity remedy"; // Change this to the name of the daily that you want the checklist items to be on
const AllCursesCheckedChecklistName = "All curses checked"; // Change this to your prefered name for the checklist item that will be auto created first if you don't have it and auto check if you've completed all base curses, I plan on adding modular code for the other challenges in the future
const haveNoSoonToDosChecklistName = "No soon To-Dos"; // Change this to your prefered name for the checklist item that will be auto created second and auto check if you have no to-dos in the next 14 days
const haveNoOverdueToDosChecklistName = "No overdue To-Dos"; // Change this to your prefered name for the checklist item that will be auto created third and auto check if you have no over due todos
const haveLessThanTwentyTodosName = "Have less than 20 todos"; // Change this to your prefered name for the checklist item that wil be auto created fourth and auto check if you have less than 20 to-dos

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
  // Below code until next comment is fetching the list of daily tasks and defining the majority of variables that will be used later on.

  let response = UrlFetchApp.fetch(
    "https://habitica.com/api/v3/tasks/user?type=dailys",
    getParams
  );
  response = JSON.parse(response.getContentText());
  Logger.log("Searching for the task: " + taskName);
  let haveNoSoonToDos;
  let haveNoOverdueTodos;
  let haveLessThanTwentyTodos;
  let allCursesCheckedID;
  let haveNoSoonToDosID;
  let haveNoOverdueToDosID;
  let haveLessThanTwentyTodosID;
  let haveNoSoonToDosExists = false;
  let haveNoOverdueToDosExists = false;
  let haveLessThanTwentyTodosExists = false;
  // This for loop goes through every task and checks to see if it's the same as the chosen daily up top.
  for (task of response.data) {
    if (task.text.trim().toLowerCase() === taskName.trim().toLowerCase()) {
      Logger.log("Found task " + task.id);
      var taskId = task.id;

      // This for loop looks through the checklist of the correct task and checks to see if the checklist items exist, if they do it communicates that to another code section through a function output and moves on, otherwise nothing happens

      findItemAndCreateIfDidntExist(
        task.checklist,
        AllCursesCheckedChecklistName,
        "All curses checked"
      );
      findItemAndCreateIfDidntExist(
        task.checklist,
        haveNoSoonToDosChecklistName,
        "Have no soon to-dos"
      );
      /*

      findItemAndCreateIfDidntExist(
        check,
        haveNoOverdueToDosChecklistName,
        haveNoOverdueToDosExists,
        haveNoOverdueTodos,
        haveNoOverdueToDosID,
        "Have no over Due To-Dos"
      );

      ifItemExists(
        check,
        haveLessThanTwentyTodosName,
        haveLessThanTwentyTodosExists,
        haveLessThanTwentyTodos,
        haveLessThanTwentyTodosID,
        "Have a low to-do count"
      );
      */

      // These below if statements check to see if the checklist items don't exist and if so create them

      /* if (!haveNoSoonToDosExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: haveNoSoonToDosChecklistName,
        };
        const NoSoonToDosItemResponse = UrlFetchApp.fetch(
          `https://habitica.com/api/v3/tasks/${taskId}/checklist/`,
          newItem
        );
        const NoSoonToDosItem = JSON.parse(
          NoSoonToDosItemResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of NoSoonToDosItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            haveNoSoonToDosChecklistName.trim().toLowerCase()
          ) {
            haveNoSoonToDosExists = true;
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
      }*/
      /*   if (!haveNoOverdueToDosExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: haveNoOverdueToDosChecklistName,
        };
        const NoOverdueToDosItemResponse = UrlFetchApp.fetch(
          `https://habitica.com/api/v3/tasks/${taskId}/checklist/`,
          newItem
        );
        const NoOverDueToDosItem = JSON.parse(
          NoOverdueToDosItemResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of NoOverDueToDosItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            haveNoOverdueToDosChecklistName.trim().toLowerCase()
          ) {
            haveNoOverdueToDosExists = true;
            haveNoOverdueTodos = checklistItem;
            haveNoOverdueToDosID = haveNoOverdueTodos.id;
            Logger.log(
              "no over due to-dos item did not exist, it has been made; it's title is" +
                " " +
                "'" +
                haveNoOverdueTodos.text +
                "'" +
                ", its ID is: " +
                haveNoOverdueToDosID
            );
          }
        }
      }*/
      /*     if (!haveLessThanTwentyTodosExists) {
        const newItem = JSON.parse(JSON.stringify(postParams));
        newItem.payload = {
          text: haveLessThanTwentyTodosName,
        };
        const haveLessThanTwentyTodosResponse = UrlFetchApp.fetch(
          `https://habitica.com/api/v3/tasks/${taskId}/checklist/`,
          newItem
        );
        const havelessThanTwentyTodosItem = JSON.parse(
          haveLessThanTwentyTodosResponse.getContentText()
        );
        // below code is looking for the checklist item that was just made to properly define the variable
        for (checklistItem of havelessThanTwentyTodosItem.data.checklist) {
          if (
            checklistItem.text.trim().toLowerCase() ===
            haveLessThanTwentyTodosName.trim().toLowerCase()
          ) {
            haveLessThanTwentyTodosExists = true;
            haveLessThanTwentyTodos = checklistItem;
            haveLessThanTwentyTodosID = haveLessThanTwentyTodos.id;
            Logger.log(
              "Low to-do count item did not exist, it has been made. It's title is" +
                " " +
                "'" +
                haveLessThanTwentyTodos.text +
                "'" +
                ", its ID is: " +
                haveLessThanTwentyTodosID
            );
          }
        }
      }*/

      let functionOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        AllCursesCheckedChecklistName,
        "All curses checked"
      );
      if (functionOutput) {
        // Below code until next comment is the auto check for all curses done, I plan on adding more arrays that you can toggle the concatination of to allow for the addon challenge and other difficulties, sorrt for any inconvenience
        const defaultEasyChallengePoisons = [
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
        let dailyTasks = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=dailys",
          getParams
        );
        let parsedDT = JSON.parse(dailyTasks.getContentText());
        let poisonsDone = true;
        for (task of parsedDT.data) {
          let isPoisonTitle = false;
          for (poisonTitle of defaultEasyChallengePoisons) {
            if (
              poisonTitle.trim().toLowerCase() ===
              task.text.trim().toLowerCase()
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
        //poisonsDone = true; // this is debug code
        Logger.log("Task checklist item is " + AllCursesCheckedChecklistName);
        if (poisonsDone == true) {
          Logger.log("All curses checked, scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${functionOutput.id}/score`,
            postParams
          );
          functionOutput.completed = true;
        }
      }

      // Below code until next comment is the auto check for no soon to-dos
      functionOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        haveNoSoonToDosChecklistName,
        "Have no soon to-dos"
      );

      if (functionOutput) {
        let today = new Date();
        let days;
        let task;
        let soonToDoDate;
        let d = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=todos",
          getParams
        );
        let parsedD = JSON.parse(d.getContentText());
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
          return days < 13;
        }
        let soonToDosExist = parsedD.data.some(toDoin14Days);
        Logger.log("task checklist item is " + functionOutput.text);
        if (soonToDosExist === false) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${
              findItemAndCreateIfDidntExist(
                task.checklist,
                haveNoSoonToDosChecklistName,
                "Have no soon to-dos"
              ).id
            }/score`,
            postParams
          );
          findItemAndCreateIfDidntExist(
            task.checklist,
            haveNoSoonToDosChecklistName,
            "Have no soon to-dos"
          ).completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }

      // Below code until next comment is the auto checking for no overdue to-dos
      if (haveNoOverdueToDosExists === true) {
        let overdue = false;
        let today;
        today = new Date();
        today = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        //tomorrow.setDate(tomorrow.getDate()+1)
        let sec;
        let min;
        let hour;
        sec = 1000;
        min = 60 * sec;
        hour = 60 * min;
        day = 24 * hour;
        let d = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=todos",
          getParams
        );
        let parsedD = JSON.parse(d.getContentText());
        for (task of parsedD.data) {
          let ToDoDate = new Date(task.date);
          ToDoDate = new Date(
            ToDoDate.getFullYear(),
            ToDoDate.getMonth(),
            ToDoDate.getDate()
          );
          //ToDoDate = today; // this is debug code
          Logger.log({ ToDoDate, today, today });
          if (ToDoDate < today) {
            overdue = true;
            break;
          }
        }
        Logger.log("task checklist item is " + haveNoOverdueTodos.text);
        if (overdue === false) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveNoOverdueToDosID}/score`,
            postParams
          );
          haveNoOverdueTodos.completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }

      if (haveLessThanTwentyTodosExists === true) {
        let toDoCount = 0;
        let toDoLimit = 20; // change this to whatever your goal for your to-do count is
        let d = UrlFetchApp.fetch(
          "https://habitica.com/api/v3/tasks/user?type=todos",
          getParams
        );
        let parsedD = JSON.parse(d.getContentText());
        for (task of parsedD.data) {
          toDoCount = toDoCount + 1;
        }
        //toDoCount = 10; // this is debug code
        if (toDoCount < toDoLimit) {
          Logger.log("scoring checklist item");
          UrlFetchApp.fetch(
            `https://habitica.com/api/v3/tasks/${taskId}/checklist/${haveLessThanTwentyTodosID}/score`,
            postParams
          );
          haveLessThanTwentyTodos.completed = true;
        }
      } else {
        Logger.log("something went wrong");
      }

      // All below code until the next comment is for checking checklist items' completion status and ticking the negative habit if they aren't completed.
      const allCursesCheckedOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        AllCursesCheckedChecklistName,
        "All curses checked"
      );
      if (allCursesCheckedOutput.completed == false) {
        Logger.log(
          JSON.stringify({ functionOutput }) +
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
      const haveNoSoonToDosOutput = findItemAndCreateIfDidntExist(
        task.checklist,
        haveNoSoonToDosChecklistName,
        "Have no soon to-dos"
      );
      if (haveNoSoonToDosOutput.completed == false) {
        Logger.log(
          JSON.stringify({ haveNoSoonToDos }) +
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
      if (haveNoOverdueTodos.completed == false) {
        Logger.log(
          JSON.stringify({ haveNoOverdueTodos }) +
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
      if (haveLessThanTwentyTodos.completed == false) {
        Logger.log(
          JSON.stringify({ haveLessThanTwentyTodos }) +
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
        return check;
      }
      return null;
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
