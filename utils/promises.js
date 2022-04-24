/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */

import prompt from 'prompt';
import colors from 'colors/safe.js';
import CLUI from 'clui';
import { exec } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';

const { Spinner } = CLUI;

const promptGetListQuestionPromise = async (listQuestions) => new Promise((resolve, reject) => {
  prompt.message = colors.white('');
  prompt.delimiter = colors.white(':');
  prompt.start();
  prompt.get(listQuestions, (err, result) => {
    if (err) {
      console.log('Prompt questions list err: ', err);
      reject(err);
    } else {
      resolve(result);
    }
  });
});

const execCommandLinePromise = async (
  execString,
  cmdMessage = 'Executing command line...',
) => {
  const execCMDStatus = new Spinner(cmdMessage);
  execCMDStatus.start();
  return new Promise((resolve, reject) => {
    exec(execString, (err, stdout, stderr) => {
      stdout && console.log('\nstdout: ', stdout);
      stderr && console.log('stderr: ', stderr);
      if (err) {
        execCMDStatus.stop();
        reject(err);
      } else {
        execCMDStatus.stop();
        resolve(null);
      }
    });
  });
};

const replaceStringFilePromise = async (filePath, oldString, newString) => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log('Replace name string err: ', err);
      reject(err);
    } else {
      data = data.toString();
      data = data.replace(oldString, newString);
      fs.writeFile(filePath, data, (writeErr) => {
        if (writeErr) {
          reject(writeErr);
        } else {
          // console.log(`Data of file ${filePath} has been changed! \n`);
          resolve(null);
        }
      });
    }
  });
});

const createNewFilePromise = async (filePath, content) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(null);
    }
  });
});

const readFilePromise = async (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log('Replace name string err: ', err);
      reject(err);
    } else {
      resolve(data.toString());
    }
  });
});

const appendFilePromise = async (filePath, content) => new Promise((resolve, reject) => {
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.log('Append file err: ', err);
      reject(err);
    } else {
      resolve(null);
    }
  });
});

const getRadioButtonAnswerPromise = async (question, choices) => {
  const questionsList = [
    {
      type: 'rawlist',
      name: question,
      choices,
    },
  ];
  return new Promise((resolve, reject) => {
    inquirer
      .prompt(questionsList)
      .then((answers) => {
        resolve(answers);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const CustomPromise = {
  promptGetListQuestionPromise,
  execCommandLinePromise,
  replaceStringFilePromise,
  createNewFilePromise,
  readFilePromise,
  appendFilePromise,
  getRadioButtonAnswerPromise,
};

export default CustomPromise;
