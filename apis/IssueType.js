import fetch from 'node-fetch';

const getListRemote = async ({ spaceId, apiKey, currentProjectId }) => {
  const issueTypesListRes = await fetch(`https://${spaceId}.backlog.com/api/v2/projects/${currentProjectId}/issueTypes?apiKey=${apiKey}`);
  const issueTypesJSON = await issueTypesListRes.json();
  return issueTypesJSON;
};

const IssueType = {
  getListRemote,
};

export default IssueType;
