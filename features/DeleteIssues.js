/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import open from 'open';
import Project from '@apis/Project.js';
import Issue from '@apis/Issue.js';
import Questions from '@components/Questions.js';
import { YesNoTextType } from '@utils/constants.js';

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

    await Issue.deleteListRemote({ spaceId, apiKey, currentProjectId });
  } catch (err) {
    console.log('err: ', err);
  }
};

const DeleteIssues = {
  exec,
};

export default DeleteIssues;
