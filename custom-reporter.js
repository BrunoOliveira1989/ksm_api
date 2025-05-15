import { writeFileSync } from "node:fs";

const extractName = (path) => {
  return path.split('\\').pop()?.split('.')[0] ?? 'unknown'
}

export default (results) =>  {
  const lines = [];

  lines.push('✅ Test Summary');
  lines.push(`Total: ${results.numTotalTests}`);
  lines.push(`Passed: ${results.numPassedTests}`);
  lines.push(`Failed: ${results.numFailedTests}`);
  lines.push(`Skipped: ${results.numPendingTests}`);
  lines.push('');

  // biome-ignore lint/complexity/noForEach: <explanation>
  results.testResults.forEach((suite) => {
    console.log(suite.testFilePath)
    lines.push(`📄 ${extractName(suite.testFilePath)}`);
    // biome-ignore lint/complexity/noForEach: <explanation>
    suite.testResults.forEach((test) => {
      lines.push(`  - ${test.title} [${test.status.toUpperCase()}]`);
    });
    lines.push('');
  });

  writeFileSync('report.txt', lines.join('\n'), 'utf-8');

  return results;
}