#!/usr/bin/env node
/* eslint-disable import/extensions */

import AddIssuesList from './features/AddIssuesList.js';

const main = async () => {
  try {
    await AddIssuesList.exec();
  } catch (err) {
    console.log('err: ', err);
  }
};

main();
