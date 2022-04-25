/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
import XLSX from 'xlsx';
import fs from 'fs';
import dayjs from 'dayjs';
import { ExcelConst } from '../utils/constants.js';
import { convertRowColToCell } from '../utils/helpers.js';

let maxEndRowIndex = -1;

const isFileExisted = (filePath) => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  return false;
};

const getDataEachColumn = ({ workSheet, workSheetMergeData, currentColIndex }) => {
  let endRowIndex = -1;
  const mergeRowStartEndArr = workSheetMergeData
    .filter((item) => item.s.c === currentColIndex)
    .map((item) => {
      // Check whole merged rows to find current endRowIndex
      if (endRowIndex < item.e.r) {
        endRowIndex = item.e.r;
      }
      return {
        name: workSheet[convertRowColToCell({ row: item.s.r, col: currentColIndex })].w,
        startRow: item.s.r,
        endRow: item.e.r,
        startCol: currentColIndex,
        endCol: currentColIndex,
      };
    });
  // Check after merged rows, do we have any single row afterwards?
  if (maxEndRowIndex < 0) {
    while (workSheet[convertRowColToCell({ row: endRowIndex + 1, col: currentColIndex })]) {
      mergeRowStartEndArr.push({
        name: workSheet[convertRowColToCell({ row: endRowIndex + 1, col: currentColIndex })].w,
        startRow: endRowIndex + 1,
        endRow: endRowIndex + 1,
        startCol: currentColIndex,
        endCol: currentColIndex,
      });
      endRowIndex += 1;
    }
  } else {
    while (endRowIndex <= maxEndRowIndex && currentColIndex !== ExcelConst.COL_START_INDEX) {
      mergeRowStartEndArr.push({
        name: workSheet[convertRowColToCell({ row: endRowIndex + 1, col: currentColIndex })]?.w,
        startRow: endRowIndex + 1,
        endRow: endRowIndex + 1,
        startCol: currentColIndex,
        endCol: currentColIndex,
      });
      endRowIndex += 1;
    }
  }
  // Check between merged rows, do we have any single row?
  for (let curRowIndex = ExcelConst.ROW_START_INDEX; curRowIndex <= endRowIndex; curRowIndex++) {
    let isCurRowIndexInRange = false;
    mergeRowStartEndArr.forEach((mmrseItem) => {
      if (curRowIndex >= mmrseItem.startRow && curRowIndex <= mmrseItem.endRow) {
        isCurRowIndexInRange = true;
      }
    });
    if (!isCurRowIndexInRange) {
      mergeRowStartEndArr.push({
        name: workSheet[convertRowColToCell({ row: curRowIndex, col: currentColIndex })]?.w,
        startRow: curRowIndex,
        endRow: curRowIndex,
        startCol: currentColIndex,
        endCol: currentColIndex,
      });
    }
  }
  // If this column is Category, then we have maximum endRowIndex
  if (currentColIndex === ExcelConst.COL_START_INDEX) {
    maxEndRowIndex = endRowIndex;
  }
  const sortedMergeRowStartEndArr = mergeRowStartEndArr.sort((a, b) => a?.startRow - b?.startRow);
  return sortedMergeRowStartEndArr;
};

const getDataFromFile = (filePath) => {
  if (!isFileExisted(filePath)) return undefined;
  const workBook = XLSX.readFile(filePath);
  const workSheet = workBook.Sheets.WBS_Estimation_and_Actual;
  const workSheetMergeData = workSheet['!merges'];

  // Get 1st column to generate Issue-Category
  const categoryFromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_START_INDEX });
  // Get all other columns to generate all levels
  const lvl1FromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_LEVEL_1_INDEX });
  const lvl2FromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_LEVEL_2_INDEX });
  const lvl3FromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_LEVEL_3_INDEX });
  const lvl4FromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_LEVEL_4_INDEX });
  const startDateFromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_START_DATE_INDEX }).map((item) => ({
    ...item,
    name: item?.name ? dayjs(item?.name, 'M/D/YY').format('YYYY-MM-DD') : undefined,
  }));
  const endDateFromExcelArr = getDataEachColumn({ workSheet, workSheetMergeData, currentColIndex: ExcelConst.COL_END_DATE_INDEX }).map((item) => ({
    ...item,
    name: item?.name ? dayjs(item?.name, 'M/D/YY').format('YYYY-MM-DD') : undefined,
  }));

  // Integrate issues into array and return results
  const resultData = [];
  for (const categoryItem of categoryFromExcelArr) {
    const filterLevel1 = lvl1FromExcelArr?.filter((item) => item?.startRow >= categoryItem?.startRow && item?.startRow <= categoryItem?.endRow);
    for (const filterLevel1Item of filterLevel1) {
      const filterLevel2 = lvl2FromExcelArr?.filter((item) => item?.startRow >= filterLevel1Item?.startRow && item?.startRow <= filterLevel1Item?.endRow);
      for (const filterLevel2Item of filterLevel2) {
        const filterLevel3 = lvl3FromExcelArr?.filter((item) => item?.startRow >= filterLevel2Item?.startRow && item?.startRow <= filterLevel2Item?.endRow);
        for (const filterLevel3Item of filterLevel3) {
          const filterLevel4 = lvl4FromExcelArr?.filter((item) => item?.startRow >= filterLevel3Item?.startRow && item?.startRow <= filterLevel3Item?.endRow);
          for (const filterLevel4Item of filterLevel4) {
            resultData.push({
              category: categoryItem?.name,
              level1: filterLevel1Item?.name,
              level2: filterLevel2Item?.name,
              level3: filterLevel3Item?.name,
              level4: filterLevel4Item?.name,
              startDate: startDateFromExcelArr?.find((item) => filterLevel4Item.startRow >= item.startRow && filterLevel4Item.endRow <= item.endRow)?.name,
              dueDate: endDateFromExcelArr?.find((item) => filterLevel4Item.startRow >= item.startRow && filterLevel4Item.endRow <= item.endRow)?.name,
              startRow: filterLevel4Item?.startRow,
              endRow: filterLevel4Item?.endRow,
            });
          }
        }
      }
    }
  }
  const resultDataAfterProcess = resultData?.filter((item) => item.category || item.level1 || item.level2 || item.level3 || item.level4).map((item) => {
    const {
      category, level1, level2, level3, level4, startDate, dueDate,
    } = item;
    const summary = `[${level1}]${level2 ? ` - [${level2}]` : ''}${level3 ? ` - [${level3}]` : ''}${level4 ? ` - [${level4}]` : ''}`;
    return {
      summary,
      categoryTypeArr: [category],
      issueType: 'Task',
      priorityType: undefined,
      startDate,
      dueDate,
    };
  });
  return {
    categories: categoryFromExcelArr.filter((item) => item?.name).map((item) => item.name),
    allData: resultDataAfterProcess,
  };
};

const Excel = {
  isFileExisted,
  getDataFromFile,
};

export default Excel;
