#!/usr/bin/env node

import inquirer from "inquirer";
import { exec } from "child_process";

export default async function main() {
  const res = await askForGitConfig();
  if (res.type === "Global") {
    await runCommand(`git config --global user.name "${res.name}"`);
    await runCommand(`git config --global user.email "${res.email}"`);
  } else {
    await runCommand(`git config --local user.name "${res.name}"`);
    await runCommand(`git config --local user.email "${res.email}"`);
  }
  console.log("Git configuration set!");
  console.log("Your name is: ", res.name, " and your email is: ", res.email);
}

// runCommand executes a shell command and returns the output as a string.
// The command is passed in as an argument.
// The return value is a promise, so it can be used with async/await.
function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      (err: any, stdout: string | PromiseLike<string>, stderr: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout);
      }
    );
  });
}

// This function asks the user for git configuration settings
// Input: none
// Output: git configuration settings
// Side effects: none
// Notes: none
async function askForGitConfig() {
  console.log("Set your git configuration: ");
  const responses = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
      default: "John Doe",
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
      default: "john@yopmail.com",
    },
    {
      type: "list",
      name: "type",
      message: "What type of configuration is this?",
      choices: ["Global", "Local"],
    },
  ]);

  return responses;
}

if (require.main === module) {
  main();
}
