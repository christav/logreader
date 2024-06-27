// Helper functions for getting test file names

const sampleDir = `${__dirname}/../stream-processing/sample-files`;

export function sampleFilePath(fileName: string): string {
  return `${sampleDir}/${fileName}`;
}
