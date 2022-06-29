export function removeClassName(className,...elements) {
    for (const element of elements) {
      element.classList.remove(className);
    }
  }

export function toggleClassName(className,...elements) {
    for (const element of elements) {
      element.classList.toggle(className);
    }
}

export function addClassName(className,...elements) {
    for (const element of elements) {
      element.classList.add(className);
    }
}

export function randomSort(array) {
    let currentIndex = array.length;
    let randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

export function checkArr(array, sizeParts) {
  const checkArray = []
  for (let i = 0; i < 48 / sizeParts; i++) {
    checkArray.push([])
  }

  checkArray.forEach(partArray => {
    let i = 0;
    while (partArray.length < sizeParts) {
      if (partArray.includes(array[i])) {
        i++
      } else {
        partArray.push(array[i])
        array.splice(i, 1)
      }
    }
  })
  return checkArray.join(',').split(',')
}

export function increaseCircle(operand, limit, reset) {
    if (operand < limit) {
        operand += 1;
      } else {
        operand = reset;
      }
    return operand
}

export function decreaseCircle(operand, reset) {
  if (operand !== 0) {
    operand -= 1;
  } else {
    operand = reset;
  }
  return operand
}


