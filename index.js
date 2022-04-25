#!/usr/bin/env node
/* eslint-disable import/extensions */

import AddIssuesList from './features/AddIssuesList.js';
// import DeleteIssues from './features/DeleteIssues.js';

const main = async () => {
  try {
    await AddIssuesList.exec();
    // await DeleteIssues.exec();
  } catch (err) {
    console.log('err: ', err);
  }
};

main();
