import fs from 'fs';
import moment from 'moment';

/**
 * Appends "-YYYY-MM-DD" to the fileName.
 * 
 * @param fileName Name of the file (Does not include '.json')
 */
const appendDateToFileName = (
	fileName: string,
): string => {
	return `${fileName}-${moment().format('YYYY-MM-DD')}`
};

/**
 * removeExtension
 * 
 * @param fileName Name of the file with or without extension
 * @param extension .json, .md, .csv etc
 * @returns fileName without extension
 */
const removeExtension = (
	fileName: string,
	extension: '.json' | '.md' | '.csv'
): string => {
	if(fileName.includes(extension)) {
		fileName = fileName.substring(0,fileName.length - extension.length)
	}
	return fileName;
};

/**
 * Read a json file from local storage by providing a path, file name and file extension.
 * 
 * @param filePath 
 * @returns 
 */
export const readJSONFile = async (filePath: string): Promise<Buffer> => {
	try {
		const buffer = await fs.promises.readFile(filePath, 'utf8');
		return JSON.parse(buffer);
	} catch (e: any) {
		throw new Error(`Error reading ${filePath}: ${e}`);
	}
};

/**
 * Write a js object to local storage by providing a path, file name and file extension.
 * 
 * @param fileName 
 * @param data 
 * @param withDate Append date to the filename.
 */
export const writeJSONToFile = async (
	fileName: string,
	data: {},
	withDate = false,
): Promise<string> => {
	try {
		fileName = removeExtension(fileName, '.json');
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) + '.json' : fileName + '.json';
		await fs.promises.writeFile(fileNameToWrite, JSON.stringify(data, null, 4));
		return fileNameToWrite;
	} catch (e: any) {
		console.error(`Error writing ${fileName}: ${e}`);
		return "";
	}
};

/**
 * Take an array of flat objects with the same shape and save to a .csv file
 * 
 * @param fileName 
 * @param data Array of objects written to csv.
 * @param withDate Append date to the filename.
 */
export const writeJSONToCSV = async <O extends Record<string, string | number>>(
	fileName: string,
	data: Array<O>,
	withDate = false,
): Promise<void> => {
	const objectKeys = Object.keys(data[0])
	const csv = [objectKeys.join(',')];
	const csvString = [...csv, ...data.map(row => {
		return objectKeys.map(key => row[key]).join(',')
	})].join('\n')

	try {
		fileName = removeExtension(fileName, '.csv');
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) : fileName;
		await fs.promises.writeFile(fileNameToWrite + '.csv', csvString);
	} catch (e) {
		console.error(`Error writing ${fileName}: ${e}`);
	}
};


/**
 * Take an array of arrays and write to CSV file. First row can optionally be the header.
 * 
 * @param fileName 
 * @param data Array of arrays written to csv.
 * @param withDate Append date to the filename.
 */
export const writeArrayToCSV = async (
	fileName: string,
	data: any[][],
	withDate = false,
): Promise<void> => {
	// Construct the comma separated string
	// If a column values contains a comma then surround the column value by double quotes
	const csv = data.map((row) =>
		row.map((item) =>
			typeof item === 'string' && item.indexOf(',') >= 0
				? `"${item}"`
				: String(item)
		).join(',')
	).join('\n');

	try {
		fileName = removeExtension(fileName, '.csv');
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) : fileName;
		await fs.promises.writeFile(fileNameToWrite + '.csv', csv);
	} catch (e) {
		console.error(`Error writing ${fileName}: ${e}`);
	}
};

/**
 * Take an array of arrays and write to a Markdown file in table format. First row can optionally be the header.
 * 
 * @param fileName 
 * @param data Array of arrays written to markdown table.
 * @param withDate Append date to the filename.
 */
export const writeMarkdownTableToFile = async (
	fileName: string,
	data: any[][],
	withDate = false,
): Promise<void> => {
	let tableString = '';

	const columnWidth = data[0].length;
	const headerDivider = '\n |' + '-------------|'.repeat(columnWidth);

	for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
		const rowDetails = data[rowIdx];
		tableString = tableString.concat('|');
		for await (const detail of rowDetails) {
			tableString = tableString.concat(detail + '|');
		}
		if (rowIdx === 0) {
			tableString = tableString.concat(headerDivider);
		}
		tableString = tableString.concat('\n');
	}

	try {
		fileName = removeExtension(fileName, '.md');
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) : fileName;
		await fs.promises.writeFile(fileNameToWrite + '.md', tableString);
	} catch (e) {
		console.error(`Error writing ${fileName}: ${e}`);
	}
};