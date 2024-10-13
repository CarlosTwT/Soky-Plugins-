import * as fs from 'fs';
import { startSubBotFromSession } from './startSubBotFromSession.js';

export const startAllSubBots = async (sock) => {
  const sessionsPath = './storage/temp/jadibots'; 
  const sessionDirs = fs.readdirSync(sessionsPath);

  console.log(sessionDirs)

  for (const sessionDir of sessionDirs) {
    const sessionPath = `${sessionsPath}/${sessionDir}`;
    if (fs.existsSync(`${sessionPath}/creds.json`)) {

      await startSubBotFromSession(sessionPath, sock);
    }
  }
};
