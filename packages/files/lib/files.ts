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
 */
export const writeJSONToFile = async (
	fileName: string,
	data: {},
	withDate = false,
): Promise<string> => {
	try {
		if(fileName.includes('.json')) {
			fileName = fileName.substring(0,fileName.length - 5)
		}
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) + '.json' : fileName + '.json';
		await fs.promises.writeFile(fileNameToWrite, JSON.stringify(data, null, 4));
		return fileNameToWrite;
	} catch (e: any) {
		console.error(`Error writing ${fileName}: ${e}`);
		return "";
	}
};


/**
 * Take an array of arrays and write to CSV file. First row can optionally be the header.
 * 
 * @param fileName 
 * @param data Array of arrays written to csv.
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
		const fileNameToWrite = withDate ? appendDateToFileName(fileName) : fileName;
		await fs.promises.writeFile(fileNameToWrite + '.md', tableString);
	} catch (e) {
		console.error(`Error writing ${fileName}: ${e}`);
	}
};