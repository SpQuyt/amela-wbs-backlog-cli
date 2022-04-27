/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import dayjs from 'dayjs';
import fetch from 'node-fetch';
import { sleep } from '../utils/helpers.js';

const addItemToRemote = async ({
  spaceId, apiKey, taskItem, issueTypesJSON, priorityTypesJSON, categoriesTypeFromRemoteJSON, currentProjectId, taskIndex,
}) => {
  try {
    const {
      summary, categoryTypeArr, issueType, priorityType, startDate, dueDate,
    } = taskItem;
    const defaultIssueId = issueTypesJSON?.find((issItem) => issItem.name === 'Task')?.id;
    const issueTypeId = issueTypesJSON?.find((issItem) => issItem.name === issueType)?.id;
    const defaultPriorityId = priorityTypesJSON?.find((priItem) => priItem.name === 'Normal')?.id;
    const priorityId = priorityTypesJSON?.find((priItem) => priItem.name === priorityType)?.id;
    const categoryId = categoryTypeArr?.map((taskItemCageItem) => categoriesTypeFromRemoteJSON?.find((cateItemRemote) => taskItemCageItem === cateItemRemote?.name)?.id);
    const bodyTask = {
      projectId: currentProjectId,
      summary,
      issueTypeId: issueTypeId || defaultIssueId,
      priorityId: priorityId || defaultPriorityId,
      categoryId,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
    };
    let resAddIssue;
    let resAddIssueJSON;
    let countTrying = 0;
    while (resAddIssueJSON?.summary === undefined) {
      if (countTrying > 0) {
        console.log(`----Retrying adding task ${bodyTask?.summary}, count: ${countTrying}`);
        await sleep(7000);
      }
      countTrying++;
      resAddIssue = await fetch(`https://${spaceId}.backlog.com/api/v2/issues?apiKey=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify(bodyTask),
        headers: { 'Content-Type': 'application/json' },
      });
      resAddIssueJSON = await resAddIssue.json();
    }
    console.log(`Added task number ${taskIndex + 1}: ${resAddIssueJSON?.summary}...`);
  } catch (err) {
    console.log(`Error in adding tasks remotely ${err}`);
  }
};

const addListToRemote = async () => {};

const deleteListRemote = async ({
  spaceId, apiKey, currentProjectId,
}) => {
  let listIssuesFromRemoteAllRes = await fetch(`https://${spaceId}.backlog.com/api/v2/issues?apiKey=${apiKey}`);
  let listIssuesFromRemoteAllJSON = await listIssuesFromRemoteAllRes.json();
  let listIssuesFromRemote = listIssuesFromRemoteAllJSON?.filter((issueItem) => issueItem?.projectId === currentProjectId);
  let multipleNumber = 1;
  while (listIssuesFromRemote?.length > 0) {
    for (const issueFromRemote of listIssuesFromRemote) {
      await sleep(1500);
      let resAddIssue;
      let resAddIssueJSON;
      let countTrying = 0;
      while (resAddIssueJSON?.summary === undefined) {
        if (countTrying > 0) {
          console.log(`----Retrying count: ${countTrying}`);
          await sleep(7000);
        }
        countTrying++;
        resAddIssue = await fetch(`https://${spaceId}.backlog.com/api/v2/issues/${issueFromRemote?.id}?apiKey=${apiKey}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        resAddIssueJSON = await resAddIssue.json();
      }
      console.log(`Deleted task number ${[listIssuesFromRemote?.indexOf(issueFromRemote) + 1] * multipleNumber}: ${issueFromRemote?.summary}...`);
    }
    listIssuesFromRemoteAllRes = await fetch(`https://${spaceId}.backlog.com/api/v2/issues?apiKey=${apiKey}`);
    listIssuesFromRemoteAllJSON = await listIssuesFromRemoteAllRes.json();
    listIssuesFromRemote = listIssuesFromRemoteAllJSON?.filter((issueItem) => issueItem?.projectId === currentProjectId);
    multipleNumber++;
  }
};

const Issue = {
  addItemToRemote,
  addListToRemote,
  deleteListRemote,
};

export default Issue;
