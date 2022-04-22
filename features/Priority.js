import fetch from 'node-fetch';

const getListRemote = async ({ spaceId, apiKey }) => {
  const priorityTypesListRes = await fetch(`https://${spaceId}.backlog.com/api/v2/priorities?apiKey=${apiKey}`);
  const priorityTypesJSON = await priorityTypesListRes.json();
  return priorityTypesJSON;
};

const Priority = {
  getListRemote,
};

export default Priority;
