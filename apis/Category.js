/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fetch from 'node-fetch';

const getListRemote = async ({ spaceId, apiKey, currentProjectId }) => {
  const categoriesTypeFromRemoteRes = await fetch(`https://${spaceId}.backlog.com/api/v2/projects/${currentProjectId}/categories?apiKey=${apiKey}`);
  const categoriesTypeFromRemoteJSON = await categoriesTypeFromRemoteRes.json();
  return categoriesTypeFromRemoteJSON;
};

const addListToRemote = async ({
  categoriesTypeExcel, spaceId, apiKey, currentProjectId,
}) => {
  for (const categoryTypeItem of categoriesTypeExcel) {
    await fetch(`https://${spaceId}.backlog.com/api/v2/projects/${currentProjectId}/categories?apiKey=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        name: categoryTypeItem,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`Adding category ${categoryTypeItem}...`);
  }
};

const Category = {
  getListRemote,
  addListToRemote,
};

export default Category;
