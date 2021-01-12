import React from 'react'

var dragSrcEl;
var tableRows;

export function startReorder(tableID) {
  tableRows = document.querySelectorAll(tableID)

  for (var row = 0; row < tableRows.length; row++) {
    tableRows[row].draggable = 'true'
  }

  [].forEach.call(tableRows, function(tableRow) {
    tableRow.addEventListener('dragstart', handleDragStart, false)
    tableRow.addEventListener('dragenter', handleDragEnter, false)
    tableRow.addEventListener('dragover', handleDragOver, false)
    tableRow.addEventListener('dragleave', handleDragLeave, false)
    tableRow.addEventListener('drop', handleDrop, false)
    tableRow.addEventListener('dragend', handleDragEnd, false)
  })
}

export function finishReorder(tableID) {
  tableRows = document.querySelectorAll(tableID)

  for (var row = 0; row < tableRows.length; row++) {
    tableRows[row].draggable = 'false'
  }

  [].forEach.call(tableRows, function(tableRow) {
    tableRow.removeEventListener('dragstart', handleDragStart, false)
    tableRow.removeEventListener('dragenter', handleDragEnter, false)
    tableRow.removeEventListener('dragover', handleDragOver, false)
    tableRow.removeEventListener('dragleave', handleDragLeave, false)
    tableRow.removeEventListener('drop', handleDrop, false)
    tableRow.removeEventListener('dragend', handleDragEnd, false)
  })
}

function handleDragStart(element) {
  this.style.opacity = '0.4'
  dragSrcEl = this
  element.dataTransfer.effectAllowed = 'none'
  element.dataTransfer.setData('text/html', this.innerHTML)
}

function handleDragOver(element) {
  if (element.preventDefault) {
    element.preventDefault()
  }

  element.dataTransfer.dropEffect = 'move'

  return false
}

function handleDragEnter(element) {
  this.classList.add('over')
}

function handleDragLeave(element) {
  this.classList.remove('over')
}

function handleDrop(element) {
  if (element.stopPropagation) {
    element.stopPropagation()
  }

   if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML
    this.innerHTML = element.dataTransfer.getData('text/html')
    let swap = dragSrcEl.id
    dragSrcEl.id = this.id
    this.id = swap
  }

  return false
}

function handleDragEnd(element) {
  this.style.opacity = '1';

  [].forEach.call(tableRows, function(tableRow) {
    tableRow.classList.remove('over')
  })
  console.log('Drag Ended')
}

export function getTimeDifference(timeSubmitted, currentTime) {
    var difference = currentTime - timeSubmitted

    if (difference < 60) {
        return "A few seconds ago"
    } else if (difference < 120) {
        return "A minute ago"
    } else if (difference < 3600) {
        var mins = Math.floor(difference / 60)
        return mins + " minutes ago"
    } else if (difference < 7200) {
        return "An hour ago"
    } else if (difference < 86400) {
        var hours = Math.floor(difference / 3600)
        return hours + " hours ago"
    } else if (difference < 172800) {
        return "A day ago"
    } else if (difference < 2592000) {
        var days = Math.floor(difference / 172800)
        return days + " days ago"
    } else if (difference < 5184000) {
        return "A month ago"
    } else if (difference < 31104000) {
        var months = Math.floor(difference / 2592000)
        return months + " months ago"
    } else if (difference < 62208000) {
        return "A year ago"
    } else {
        var years = Math.floor(difference / 31104000)
        return years + "years ago"
    }
}

export function taskType(type) {
    switch (type) {
        case "multiple-choice-single":
          return "Multiple Choice - Single Answer"
        case "multiple-choice-multiple":
          return "Multiple Choice - Multiple Answers"
        case "standard":
          return "Standard"
        case "content":
          return "Content Only"
        case "short-answer":
          return "Short Answer"
    }
}
