/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import dayjs from 'dayjs';
import fetch from 'node-fetch';

const addItemToRemote = async ({
  spaceId, apiKey, taskItem, issueTypesJSON, priorityTypesJSON, categoriesTypeFromRemoteJSON, currentProjectId,
}) => {
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
  await fetch(`https://${spaceId}.backlog.com/api/v2/issues?apiKey=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify(bodyTask),
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(`Adding task ${bodyTask.summary}...`);
};

const addListToRemote = async () => {};

const deleteListRemote = async ({
  spaceId, apiKey, currentProjectId,
}) => {
  const listIssuesFromRemoteAllRes = await fetch(`https://${spaceId}.backlog.com/api/v2/issues?apiKey=${apiKey}`);
  const listIssuesFromRemoteAllJSON = await listIssuesFromRemoteAllRes.json();
  const listIssuesFromRemote = listIssuesFromRemoteAllJSON?.filter((issueItem) => issueItem?.projectId === currentProjectId);
  for (const issueFromRemote of listIssuesFromRemote) {
    await fetch(`https://${spaceId}.backlog.com/api/v2/issues/${issueFromRemote?.id}?apiKey=${apiKey}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`Deleting task ${issueFromRemote.summary}...`);
  }
};

const Issue = {
  addItemToRemote,
  addListToRemote,
  deleteListRemote,
};

export default Issue;
