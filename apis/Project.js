import fetch from 'node-fetch';

const getListRemote = async ({ spaceId, apiKey }) => {
  const projectsListRes = await fetch(`https://${spaceId}.backlog.com/api/v2/projects?apiKey=${apiKey}`);
  const projectsListResJSON = await projectsListRes.json();
  const simpleProjectsList = projectsListResJSON.map((prItem) => {
    const { id, name } = prItem;
    return {
      id,
      name,
    };
  });
  return simpleProjectsList;
};

const Project = {
  getListRemote,
};

export default Project;
