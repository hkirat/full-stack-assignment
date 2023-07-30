const { exec } = require('child_process');
const fs = require('fs');

const prepareFiles = async (src: string, lang: string, input: string, expectedOutput: string) => {
    let fileName = "";
    let filePath = "";
    switch(lang) {
        case 'cpp':
            fileName = 'src.cpp';
            filePath = `codeSandbox/${fileName}`;
            await fs.writeFileSync(filePath, src, (err: Error) => {
                if (err) {
                    console.error('Error writing to file:', err);
                }
                else {
                    console.log(`Data written to file ${fileName} successfully!`);
                }
            });
    }
    fileName = 'input.txt';
    filePath = `codeSandbox/${fileName}`;
    await fs.writeFileSync(filePath, input, (err: Error) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
        else {
            console.log(`Data written to file ${fileName} successfully!`);
        }
    });

    fileName = 'expected_output.txt';
    filePath = `codeSandbox/${fileName}`;
    await fs.writeFileSync(filePath, expectedOutput, (err: Error) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
        else {
            console.log(`Data written to file ${fileName} successfully!`);
        }
    });
}

const getCommand = (srcFile: string, language: string, inputFile: string, outputFile: string, resultFile: string, timeLimit: string, memoryLimit: string) => {
    return `docker run --rm \
    -v "$(pwd)/codeSandbox/${srcFile}:/code-exec/${srcFile}" \
    -v "$(pwd)/codeSandbox/${inputFile}:/code-exec/input.txt" \
    -v "$(pwd)/codeSandbox/${outputFile}:/code-exec/output.txt" \
    -v "$(pwd)/codeSandbox/${resultFile}:/code-exec/result.txt" \
    online-judge ${srcFile} input.txt output.txt result.txt ${language} ${timeLimit} ${memoryLimit}`
}

const getExecutionResult = async () => {
    let fileName = 'output.txt';
    let filePath = `codeSandbox/${fileName}`;
    const output: string = await fs.readFileSync(filePath, 'utf-8');

    fileName = 'result.txt';
    filePath = `codeSandbox/${fileName}`;
    const result = await fs.readFileSync(filePath, 'utf-8');

    fileName = 'expected_output.txt';
    filePath = `codeSandbox/${fileName}`;
    const expectedOutput = await fs.readFileSync(filePath, 'utf-8');
    
    let message = null, info = null, time = null, memory = null;
    result.split("\n").forEach((row: string) => {
        if(row.includes("Message: ")) {
            message = row.split("Message: ")[1];
        }
        if(row.includes("Info: ")) {
            info = row.split("Info: ")[1];
        }
        if(row.includes("Time: ")) {
            time = row.split("Time: ")[1];
        }
        if(row.includes("Memory: ")) {
            memory = row.split("Memory: ")[1];
        }
    });

    return {
        message,
        info,
        time,
        memory,
        output,
        verdict: expectedOutput.trim() === output.trim()? "AC": "WA"
    };
}

export const execute = async (src: string, lang: string, timeout: string, input: string, expectedOutput: string) => {
    await prepareFiles(src, lang, input, expectedOutput);
    const command: string = getCommand("src.cpp", "cpp", "input.txt", "output.txt", "result.txt", "2", "10000");
    try {
        exec(command, async (error: Error, stdout: Error, stderr: Error) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            return await getExecutionResult();
        });

    }
    catch(e) {
        console.log("Error executing command");
    }
    return await getExecutionResult();
}