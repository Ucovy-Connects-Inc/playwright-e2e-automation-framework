import path from 'path';

export class TestDataReader {
  constructor(testFilePath, dataSource) {
    const testFileName = path.basename(testFilePath, ".spec.js");
    const dataFilePath = path.resolve(__dirname, `../test-data/${testFileName}.data.js`);
    
    // Dynamically import the test data module
    const dataModule = require(dataFilePath);
    const dataObject = dataModule[dataSource];
    
    if (!dataObject) {
      throw new Error(`Test data for source "${dataSource}" not found in ${dataFilePath}`);
    }
    
    this.testData = dataObject;
  }
}