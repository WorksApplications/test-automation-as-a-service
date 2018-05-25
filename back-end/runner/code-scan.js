const fs = require('fs-extra');

function retriveAllTestClass(testcases) {
  let classes = [];

  const filterForClass = (data) => {
    for (let key in data) {
      if (key.startsWith('taas_')) {
        continue;
      } else if (key === 'testcases') {
        data[key].forEach((testcase) => {
          let className = testcase.locator.split('#')[0];
          if (!classes.includes(className)) {
            classes.push(className);
          }
        });
      } else {
        filterForClass(data[key]);
      }
    }
  };

  filterForClass(testcases);
  return classes;
}

async function readCode(classes, workspace) {
  let codes = [];
  for (let i = 0; i < classes.length; i++) {
    let className = classes[i];
    let filePath = className.replace(/\./g, '/');
    let classFile = workspace + 'main/src/main/java/' + filePath + '.java';
    let code = await fs.readFile(classFile);
    codes.push({
      'class': className,
      'code': code.toString()
    });
  }
  return codes;
}

async function readAllCode(methodCalls, workspace) {
  for (let i = 0; i < methodCalls.length; i++) {
    let className = methodCalls[i].class;
    let modulePath = methodCalls[i].module;
    let filePath = className.replace(/\./g, '/');
    let classFile = workspace + modulePath + filePath + '.java';
    let code = await fs.readFile(classFile);
    methodCalls[i]['code'] = code.toString();
  }
}

module.exports = {
  retriveAllTestClass,
  readCode,
  readAllCode
};