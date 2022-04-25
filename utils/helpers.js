/* eslint-disable import/extensions */
import { ExcelColName } from './constants.js';

export const convertRowColToCell = ({ row, col }) => `${ExcelColName[col]}${row + 1}`;

export const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
