/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import Project from '../apis/Project.js';
import Issue from '../apis/Issue.js';

const exec = async () => {
  try {
    // Get spaceId + apiKey - from Input
    const spaceId = process.env.DEFAULT_SPACE_ID;
    const apiKey = process.env.DEFAULT_API_KEY;

    // Get projects list
    const simpleProjectsList = await Project.getListRemote({ spaceId, apiKey });
    console.log(simpleProjectsList);

    // Get chosen project - from Input
    const currentProjectName = process.env.DEFAULT_PROJECT_NAME;
    const currentProjectId = simpleProjectsList.find((prItem) => prItem?.name === currentProjectName)?.id;
    if (currentProjectId === undefined) {
      return;
    }

    await Issue.deleteListRemote({ spaceId, apiKey, currentProjectId });
  } catch (err) {
    console.log('err: ', err);
  }
};

const DeleteIssues = {
  exec,
};

export default DeleteIssues;
