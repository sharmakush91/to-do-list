"use strict";

const circBtn = document.querySelector(".circleBtn");
const textContainer = document.querySelector(".text-box-container");
const input = document.querySelector(".addText");
const selectInput = document.querySelector(".allOptions");
const form = document.querySelector(".form");

const draggableBox = document.querySelector(".draggable-box");

function clickFunction(e) {
  e.preventDefault();
  const inputValue = input.value;

  // Create a new Div
  const textBox = document.createElement("div");
  textBox.classList.add("textBox");
  textBox.draggable = "true";
  textBox.id = `TextBox-${Date.now()}`;

  // Create new text box
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.classList.add("toDoList");
  newInput.value = inputValue;

  // Create Checkmark
  const checkMark = document.createElement("button");
  checkMark.classList.add("fa", "fa-check", "checkmark-icon");

  // Create Bin Icon
  const binIcon = document.createElement("button");
  binIcon.classList.add("fa", "fa-trash-o", "bin-icon");

  // Append elements
  textBox.appendChild(newInput);
  textBox.appendChild(checkMark);
  textBox.appendChild(binIcon);
  textContainer.appendChild(textBox);

  selectInput.addEventListener("change", function () {
    const filterValue = selectInput.value;

    if (
      filterValue === "completed" &&
      !newInput.classList.contains("strikeThrough")
    ) {
      textBox.classList.add("hidden");
    } else if (
      filterValue === "incomplete" &&
      newInput.classList.contains("strikeThrough")
    ) {
      textBox.classList.add("hidden");
    } else {
      textBox.classList.remove("hidden");
    }
  });

  // Clear input and focus
  input.value = "";
  input.focus();

  saveTasks();

  // Remove Text
  binIcon.addEventListener("click", function () {
    textBox.remove();
    saveTasks();
  });

  // Add line through for completed tasks
  checkMark.addEventListener("click", function (e) {
    e.preventDefault();
    newInput.classList.toggle("strikeThrough");
    newInput.style.backgroundColor = newInput.classList.contains(
      "strikeThrough"
    )
      ? "#25D366"
      : "";
    checkMark.style.backgroundColor = newInput.classList.contains(
      "strikeThrough"
    )
      ? "#128C7E"
      : "";
    saveTasks();
  });

  // Enable Draggable property to the To Do List
  textBox.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", textBox.id);
  });
}

function dropToBox(e) {
  e.preventDefault();
  e.stopPropagation();

  const textData = e.dataTransfer.getData("text/plain");
  const draggableEle = document.getElementById(textData);

  // Check if the drop target is the draggableBox itself
  if (e.currentTarget === draggableBox) {
    // Check if the element is not already inside the draggableBox
    e.currentTarget.appendChild(draggableEle); // Valid drop, append element
  } else {
    // If dropping on top of an existing element inside the draggableBox
    alert("Cannot drop onto another element.");
    // Move it back to the original container
    textContainer.appendChild(draggableEle);
  }
  saveTasks();
}

function textContainerDrop(e) {
  e.preventDefault();
  textContainer.classList.remove("drag-over"); // Remove border after drop

  const textData = e.dataTransfer.getData("text/plain");
  const draggableEle = document.getElementById(textData);

  // Check if there's an existing text box and insert before or after it
  textContainer.appendChild(draggableEle);
  saveTasks();
}

function handleDragOver(e) {
  e.preventDefault();
}

// Function to handle dragleave event
function handleDragLeave(e) {
  e.preventDefault();
  textContainer.classList.remove("drag-over"); // Remove when not dragging over
}

function saveTasks() {
  const tasks = [];
  const draggableBoxTasks = [];

  // Save tasks in textContainer
  textContainer.querySelectorAll(".textBox").forEach((element) => {
    tasks.push({
      value: element.querySelector(".toDoList").value,
      checkMark: element
        .querySelector(".toDoList")
        .classList.contains("strikeThrough"),
    });
  });

  // Save tasks in draggableBox
  draggableBox.querySelectorAll(".textBox").forEach((element) => {
    draggableBoxTasks.push({
      value: element.querySelector(".toDoList").value,
      checkMark: element
        .querySelector(".toDoList")
        .classList.contains("strikeThrough"),
    });
  });

  // Store the tasks arrays in localStorage as JSON strings
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("draggableBoxTasks", JSON.stringify(draggableBoxTasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const draggableBoxTasks =
    JSON.parse(localStorage.getItem("draggableBoxTasks")) || [];

  // Load tasks in textContainer
  tasks.forEach((task) => {
    const textBox = document.createElement("div");
    textBox.classList.add("textBox");
    textBox.draggable = "true";
    textBox.id = `TextBox-${Date.now()}`;

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("toDoList");
    newInput.value = task.value;

    const checkMark = document.createElement("button");
    checkMark.classList.add("fa", "fa-check", "checkmark-icon");

    const binIcon = document.createElement("button");
    binIcon.classList.add("fa", "fa-trash-o", "bin-icon");

    textBox.appendChild(newInput);
    textBox.appendChild(checkMark);
    textBox.appendChild(binIcon);
    textContainer.appendChild(textBox);

    if (task.checkMark) {
      newInput.classList.add("strikeThrough");
      newInput.style.backgroundColor = "#25D366";
      checkMark.style.backgroundColor = "#128C7E";
    }

    binIcon.addEventListener("click", function () {
      textBox.remove();
      saveTasks();
    });

    checkMark.addEventListener("click", function (e) {
      e.preventDefault();
      newInput.classList.toggle("strikeThrough");
      newInput.style.backgroundColor = newInput.classList.contains(
        "strikeThrough"
      )
        ? "#25D366"
        : "";
      checkMark.style.backgroundColor = newInput.classList.contains(
        "strikeThrough"
      )
        ? "#128C7E"
        : "";

      saveTasks();
    });

    textBox.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", textBox.id);
    });
  });

  // Load tasks in draggableBox
  draggableBoxTasks.forEach((task) => {
    const textBox = document.createElement("div");
    textBox.classList.add("textBox");
    textBox.draggable = "true";
    textBox.id = `TextBox-${Date.now()}`;

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("toDoList");
    newInput.value = task.value;

    const checkMark = document.createElement("button");
    checkMark.classList.add("fa", "fa-check", "checkmark-icon");

    const binIcon = document.createElement("button");
    binIcon.classList.add("fa", "fa-trash-o", "bin-icon");

    textBox.appendChild(newInput);
    textBox.appendChild(checkMark);
    textBox.appendChild(binIcon);
    draggableBox.appendChild(textBox);

    if (task.checkMark) {
      newInput.classList.add("strikeThrough");
      newInput.style.backgroundColor = "#25D366";
      checkMark.style.backgroundColor = "#128C7E";
    }

    binIcon.addEventListener("click", function () {
      textBox.remove();
      saveTasks();
    });

    checkMark.addEventListener("click", function (e) {
      e.preventDefault();
      newInput.classList.toggle("strikeThrough");
      newInput.style.backgroundColor = newInput.classList.contains(
        "strikeThrough"
      )
        ? "#25D366"
        : "";
      checkMark.style.backgroundColor = newInput.classList.contains(
        "strikeThrough"
      )
        ? "#128C7E"
        : "";

      saveTasks();
    });

    textBox.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", textBox.id);
    });
  });
}

window.addEventListener("load", loadTasks);

// Add event listener for button click
circBtn.addEventListener("click", clickFunction);
// Enable Drag inside My Priorities container
draggableBox.addEventListener("dragover", handleDragOver);
//Drop element to box
draggableBox.addEventListener("drop", dropToBox);
// Allow dropping elements back into textContainer

textContainer.addEventListener("dragover", handleDragOver);
textContainer.addEventListener("drop", textContainerDrop);
textContainer.addEventListener("dragleave", handleDragLeave);
