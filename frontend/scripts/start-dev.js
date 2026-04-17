const { spawn } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";

function runProcess(command, args, cwd, label) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });

  child.on("error", (error) => {
    console.error(`[${label}] failed to start:`, error.message);
  });

  return child;
}

const frontendDir = process.cwd();
const backendProcess = isWindows
  ? runProcess("cmd.exe", ["/c", "npm", "run", "start:backend"], frontendDir, "backend")
  : runProcess("npm", ["run", "start:backend"], frontendDir, "backend");
const frontendProcess = isWindows
  ? runProcess("cmd.exe", ["/c", "npm", "run", "start:frontend"], frontendDir, "frontend")
  : runProcess("npm", ["run", "start:frontend"], frontendDir, "frontend");

let shuttingDown = false;

function terminateChild(child) {
  if (!child || child.killed) return;

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  child.kill("SIGTERM");
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  terminateChild(frontendProcess);
  terminateChild(backendProcess);

  setTimeout(() => {
    process.exit(exitCode);
  }, 500);
}

frontendProcess.on("exit", (code) => {
  shutdown(code || 0);
});

backendProcess.on("exit", (code) => {
  shutdown(code || 0);
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
