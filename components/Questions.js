/* eslint-disable import/extensions */
import { YesNoTextType } from '../utils/constants.js';
import CustomPromise from '../utils/promises.js';
import 'dotenv/config';

const askSpaceId = async () => {
  const listQuestion = [
    `Backlog 's SpaceId (default: ${process.env.DEFAULT_SPACE_ID})`,
  ];
  const result = await CustomPromise.promptGetListQuestionPromise(
    listQuestion,
  );
  return result[listQuestion[0]] || process.env.DEFAULT_SPACE_ID;
};

const askYesNoApiKey = async () => {
  const listQuestion = [
    'Do you have Backlog\'s APIKey?',
  ];
  const listChoices = [YesNoTextType.YES, YesNoTextType.NO];
  const result = await CustomPromise.getRadioButtonAnswerPromise(
    listQuestion,
    listChoices,
  );
  return result[listQuestion];
};

const askApiKey = async () => {
  const listQuestion = [
    'Backlog\'s APIKey',
  ];
  const result = await CustomPromise.promptGetListQuestionPromise(
    listQuestion,
  );
  return result[listQuestion[0]] || process.env.DEFAULT_API_KEY;
};

const askProjectName = async () => {
  const listQuestion = [
    'Backlog\'s Project name',
  ];
  const result = await CustomPromise.promptGetListQuestionPromise(
    listQuestion,
  );
  return result[listQuestion[0]] || process.env.DEFAULT_PROJECT_NAME;
};

const Questions = {
  askSpaceId,
  askYesNoApiKey,
  askApiKey,
  askProjectName,
};

export default Questions;
