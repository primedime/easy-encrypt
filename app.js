// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    mainTitle: '.main-title',
    mainMenu: '#main-menu',
    beginBtn: '.begin-btn',
    exitBtn: '.exit-btn',
    methodSelect: '#method-select',
    methodChoices: '#method-choices',
    selected: 'select[id="method-choices"]',
    encryptedArea: '#encrypted-area',
    inputString: '#input-string',
    encryptedOutput: '#encrypted-output'
  };

  return {
    clearChooseMethodState: () => {
      document.querySelector(UISelectors.methodSelect).style.display = 'none';
      document.querySelector(UISelectors.encryptedArea).style.display = 'none';
    },
    showChooseMethodState: () => {
      document.querySelector(UISelectors.mainMenu).style.display = 'none';
      document.querySelector(UISelectors.encryptedArea).style.display = 'none';
      document.querySelector(UISelectors.methodSelect).style.display = 'block';
    },
    getStringInput: () => {
      return {
        string: document.querySelector(UISelectors.inputString).value
      };
    },
    displayEncryptedOutput: inputText => {
      const methodChoice = document.querySelector(UISelectors.methodChoices);
      const encryptedText = document.querySelector(UISelectors.encryptedOutput);

      if (methodChoice.value === 'methodA') {
        encryptedText.innerHTML = SelectCtrl.turnToX(inputText);
      } else if (methodChoice.value === 'methodB') {
        encryptedText.innerHTML = SelectCtrl.encryptStringPlusOne(inputText);
      } else if (methodChoice.value === 'methodC') {
        encryptedText.innerHTML = SelectCtrl.encryptStringTimesThree(inputText);
      }
    },
    showInput: () => {
      document.querySelector(UISelectors.encryptedArea).style.display = 'block';
    },
    clearInput: () => {
      document.querySelector(UISelectors.inputString).value = '';
    },
    clearOutput: () => {
      document.querySelector(UISelectors.encryptedOutput).innerHTML = '';
    },
    resetOutput: () => {
      UICtrl.clearOutput();
      UICtrl.displayEncryptedOutput(document.querySelector(UISelectors.inputString).value);
    },
    showExit: () => {
      document.querySelector(UISelectors.mainMenu).style.display = 'none';
      document.querySelector(UISelectors.encryptedArea).style.display = 'none';
      document.querySelector(UISelectors.methodSelect).style.display = 'none';

      document.querySelector(UISelectors.mainTitle).innerHTML = 'Goodbye!';
      setTimeout(() => window.location.reload(true), 2500);
    },
    getSelectors: () => {
      return UISelectors;
    }
  };
})();

// Selector Controller
const SelectCtrl = (() => {
  return {
    turnToX: string => {
      const x = 'X';
      return string
        .split('')
        .map(char => x)
        .join('');
    },
    encryptStringPlusOne: string => {
      if (!/[\x00-\x7F]/) {
        return `${string} contains a non-ACSII character`;
      } else {
        return string
          .split('')
          .map(char => String.fromCharCode(char.charCodeAt(0) + 1))
          .join('');
      }
    },
    encryptStringTimesThree: string => {
      const nextChars = [1, 2, 3];

      if (!/[\x00-\x7F]/) {
        return `${string} contains a non-ACSII character`;
      } else {
        return string
          .split('')
          .reduce((accumulator, char) => {
            return [...accumulator, ...nextChars.map(i => String.fromCharCode(char.charCodeAt(0) + i))];
          }, [])
          .join()
          .replace(/,/g, '');
      }
    }
  };
})();

// App Controller
const App = ((UICtrl, UISelectors, SelectCtrl) => {
  const loadEventListeners = () => {
    UICtrl.clearChooseMethodState();

    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.beginBtn).addEventListener('click', chooseMethod);
    document.querySelector(UISelectors.exitBtn).addEventListener('click', exitProgram);
    document.querySelector(UISelectors.inputString).addEventListener('keyup', textToEncrypt);
    document.querySelector(UISelectors.selected).onchange = changeEventHandler;
  };

  const chooseMethod = e => {
    UICtrl.showChooseMethodState();

    e.preventDefault();
  };

  const changeEventHandler = (elem, e) => {
    const value = elem.target.value;
    if (!value) {
      UICtrl.showChooseMethodState();
      UICtrl.clearInput();
      UICtrl.clearOutput();
    } else {
      UICtrl.showInput();
      UICtrl.resetOutput();
    }

    e.preventDefault();
  };

  const textToEncrypt = (elem, e) => {
    const inputText = elem.target.value;
    UICtrl.displayEncryptedOutput(inputText);

    e.preventDefault();
  };

  const exitProgram = e => {
    UICtrl.showExit();

    e.preventDefault();
  };

  return {
    init: () => {
      loadEventListeners();
    }
  };
})(UICtrl, SelectCtrl);

App.init();
