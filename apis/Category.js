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

const deleteListRemote = async ({
  spaceId, apiKey, currentProjectId,
}) => {
  const listCategoriesFromRemoteRes = await fetch(`https://${spaceId}.backlog.com/api/v2/projects/${currentProjectId}/categories?apiKey=${apiKey}`);
  const listCategoriesFromRemoteJSON = await listCategoriesFromRemoteRes.json();
  for (const categoryFromRemote of listCategoriesFromRemoteJSON) {
    await fetch(`https://${spaceId}.backlog.com/api/v2/projects/${currentProjectId}/categories/${categoryFromRemote?.id}?apiKey=${apiKey}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`Deleting category ${categoryFromRemote.name}...`);
  }
};

const Category = {
  getListRemote,
  addListToRemote,
  deleteListRemote,
};

export default Category;
