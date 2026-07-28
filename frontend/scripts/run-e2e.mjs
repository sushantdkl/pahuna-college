import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const npx = isWindows ? "npx.cmd" : "npx";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100";
const serverPort = new URL(baseURL).port || (baseURL.startsWith("https:") ? "443" : "80");

function run(command, args, options = {}) {
  return spawn(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...options.env },
    shell: isWindows,
    stdio: options.stdio || "inherit",
  });
}

async function isReady() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(baseURL, {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok || response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServer(timeoutMs = 120000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await isReady()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${baseURL}`);
}

async function stopServer(server) {
  if (!server || server.killed) {
    return;
  }

  if (isWindows) {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      killer.once("exit", resolve);
      killer.once("error", resolve);
    });
    return;
  }

  server.kill("SIGTERM");
}

let server;
let startedServer = false;

try {
  if (!(await isReady())) {
    server = run(npm, ["run", "start", "--", "--port", serverPort], {
      stdio: "inherit",
    });
    startedServer = true;
    await waitForServer();
  }

  const test = run(npx, ["playwright", "test"], {
    env: {
      PLAYWRIGHT_BASE_URL: baseURL,
      PLAYWRIGHT_SKIP_WEB_SERVER: "1",
    },
  });

  const code = await new Promise((resolve) => {
    test.once("exit", resolve);
    test.once("error", () => resolve(1));
  });

  process.exitCode = code ?? 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (startedServer) {
    await stopServer(server);
  }

  process.exit(process.exitCode ?? 0);
}
