/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import open from 'open';
import { fakeData, YesNoTextType } from '@utils/constants.js';
import Category from '@apis/Category.js';
import IssueType from '@apis/IssueType.js';
import Priority from '@apis/Priority.js';
import Project from '@apis/Project.js';
import Questions from '@components/Questions.js';
import Issue from '@apis/Issue.js';

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

    // Get categories type (Design, Mobile, API, CMS) - from Excel
    // Then add categories type to remote project
    const categoriesTypeExcel = ['Requirement', 'Design', 'Mobile', 'API', 'CMS'];
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

const AddIssuesList = {
  exec,
};

export default AddIssuesList;
