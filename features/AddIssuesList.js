/* eslint-disable spaced-comment */

/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
//@ts-check

import open from 'open';
import { YesNoTextType } from '../utils/constants.js';
import Category from '../apis/Category.js';
import IssueType from '../apis/IssueType.js';
import Priority from '../apis/Priority.js';
import Project from '../apis/Project.js';
import Questions from '../components/Questions.js';
import Issue from '../apis/Issue.js';
import Excel from '../components/Excel.js';
import { sleep } from '../utils/helpers.js';

const exec = async () => {
  try {
    // Get spaceId + apiKey - from Input
    const spaceId = await Questions.askSpaceId();
    if (!spaceId) return;
    const yesNoApiKey = await Questions.askYesNoApiKey();
    if (yesNoApiKey === YesNoTextType.NO) {
      open(`https://${spaceId}.backlog.com/EditApiSettings.action`);
    }
    const apiKey = await Questions.askApiKey();

    // Get projects list
    const simpleProjectsList = await Project.getListRemote({ spaceId, apiKey });
    console.log(simpleProjectsList);

    // Get chosen project - from Input
    const currentProjectName = await Questions.askProjectName();
    const currentProjectId = simpleProjectsList.find((prItem) => prItem?.name === currentProjectName)?.id;
    if (currentProjectId === undefined) {
      return;
    }

    // Get file excel name
    const excelFileName = await Questions.askExcelFileName();
    const dataFromExcel = Excel.getDataFromFile(excelFileName);
    if (!dataFromExcel) {
      console.log('Error in reading data from excel!');
      return;
    }
    // Get categories type - from Excel
    // Delete old from remote
    // Then add categories type to remote project
    const categoriesTypeExcel = dataFromExcel.categories;
    await Category.deleteListRemote({ spaceId, apiKey, currentProjectId });
    await sleep(1000);
    await Category.addListToRemote({
      categoriesTypeExcel, spaceId, apiKey, currentProjectId,
    });
    await sleep(500);

    // Get categories type - from Remote
    const categoriesTypeFromRemoteJSON = await Category.getListRemote({ spaceId, apiKey, currentProjectId });

    // Get list issue-types from remote project
    const issueTypesJSON = await IssueType.getListRemote({ spaceId, apiKey, currentProjectId });
    await sleep(500);

    // Get list priorities-types from remote project
    const priorityTypesJSON = await Priority.getListRemote({ spaceId, apiKey });
    await sleep(500);

    // Get list tasks from Excel
    for (const taskItem of dataFromExcel?.allData) {
      await Issue.addItemToRemote({
        spaceId,
        apiKey,
        taskItem,
        issueTypesJSON,
        priorityTypesJSON,
        categoriesTypeFromRemoteJSON,
        currentProjectId,
        taskIndex: dataFromExcel?.allData?.indexOf(taskItem),
      });
      await sleep(1000);
    }
  } catch (err) {
    console.log('err: ', err);
  }
};

const AddIssuesList = {
  exec,
};

export default AddIssuesList;
