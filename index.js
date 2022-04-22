#!/usr/bin/env node
/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { fakeData } from './constants.js';
import Category from './features/Category.js';
import IssueType from './features/IssueType.js';
import Priority from './features/Priority.js';
import Project from './features/Project.js';
import Issue from './features/Issue.js';

const main = async () => {
  try {
    // Get spaceId + apiKey - from Input
    const spaceId = 'spquyt';
    const apiKey = 'W4SxYIQDbqnGBuPmAY7W2qx0mVMHyVEPSkUlLGSYzNvvsnZrNqFfS9wpENwLeR8a';

    // Get projects list
    const simpleProjectsList = await Project.getListRemote({ spaceId, apiKey });
    console.log(simpleProjectsList);

    // Get chosen project - from Input
    const currentProjectName = 'TestAuto';
    const currentProjectId = simpleProjectsList.find((prItem) => prItem?.name === currentProjectName)?.id;
    if (currentProjectId === undefined) {
      return;
    }

    // Get categories type (Design, Mobile, API, CMS) - from Excel
    // Then add categories type to remote project
    const categoriesTypeExcel = ['Design', 'Mobile', 'API', 'CMS'];
    await Category.addListToRemote({
      categoriesTypeExcel, spaceId, apiKey, currentProjectId,
    });

    // Get categories type (Design, Mobile, API, CMS) - from Remote
    const categoriesTypeFromRemoteJSON = await Category.getListRemote({ spaceId, apiKey, currentProjectId });

    // Get list issue-types from remote project
    const issueTypesJSON = await IssueType.getListRemote({ spaceId, apiKey, currentProjectId });

    // Get list priorities-types from remote project
    const priorityTypesJSON = await Priority.getListRemote({ spaceId, apiKey });

    // Get list tasks from Excel
    // fakeData for simulation
    for (const taskItem of fakeData) {
      await Issue.addItemToRemote({
        spaceId,
        apiKey,
        taskItem,
        issueTypesJSON,
        priorityTypesJSON,
        categoriesTypeFromRemoteJSON,
        currentProjectId,
      });
    }
  } catch (err) {
    console.log('err: ', err);
  }
};

// await Issue.deleteListRemote({ spaceId, apiKey, currentProjectId });

main();
