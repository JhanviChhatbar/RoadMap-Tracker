import fs from "fs";
import path from "path";
import { Task, Section, CarryOverLog } from "@/types";

const dbPath = path.join(process.cwd(), "data", "roadmap.json");
const dataDir = path.dirname(dbPath);

export interface Database {
  tasks: Task[];
  sections: Section[];
  carryOverLogs: CarryOverLog[];
  dailyLogs: any[];
}

let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing database or create new
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      db = JSON.parse(data);
    } else {
      db = {
        tasks: [],
        sections: [],
        carryOverLogs: [],
        dailyLogs: [],
      };
    }
  }
  return db!;
}


export function initializeDatabase() {
  getDatabase();
  // Database is already initialized in getDatabase()
  saveDatabase();
}

export function saveDatabase() {
  if (db) {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  }
}

export default getDatabase;
