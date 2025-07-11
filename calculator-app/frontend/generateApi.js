import { execSync } from "child_process";
import fs from "fs";

const currentWorkingDirectory = process.cwd();
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8000/openapi.json");
    const data = await response.text();
    await new Promise((resolve, reject) => {
      fs.writeFile(
        `${currentWorkingDirectory}/api/swagger.yaml`,
        data,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Successfully saved swagger.yaml");
            resolve();
          }
        }
      );
    });
    return data;
  } catch (error) {
    console.log("Failed while fetching swagger.json");
    console.error("Error fetching data:", error);
  }
};

const generateApis = async () => {
  await fetchData();
  console.log("Generating Api types...");
  await new Promise((resolve, reject) => {
    execSync(
      `npx openapi-typescript ./api/swagger.yaml --output ./api/generated/generated-api.ts --default-non-nullable ture --export-type true`,
      {
        cwd: currentWorkingDirectory,
        stdio: "inherit",
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });

  console.log("Generating auto mocks...");
  await new Promise((resolve, reject) => {
    execSync(
      "npx msw-auto-mock ./api/swagger.yaml -o ./api/generated/msw-auto-mocks.js --base-url http://localhost:8000 --max-array-length 10 --codes 200",
      {
        cwd: currentWorkingDirectory,
        stdio: "inherit",
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

generateApis();
