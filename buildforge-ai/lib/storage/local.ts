/**
 * Local file storage abstraction.
 * In production this can be swapped for AWS S3 by setting STORAGE_PROVIDER=s3
 * and configuring AWS_* env vars. Used by the upload routes and report
 * generation.
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const STORAGE_ROOT = path.join(process.cwd(), ".storage");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function saveFile(
  buffer: Buffer,
  filename: string,
  folder = "uploads",
): Promise<{ key: string; url: string }> {
  const hash = crypto.randomBytes(8).toString("hex");
  const key = path.join(folder, `${hash}-${filename}`);
  const fullPath = path.join(STORAGE_ROOT, key);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, buffer);
  return { key, url: `/api/files/${key}` };
}

export async function readFile(key: string): Promise<Buffer> {
  const fullPath = path.join(STORAGE_ROOT, key);
  return fs.readFile(fullPath);
}

export async function deleteFile(key: string) {
  const fullPath = path.join(STORAGE_ROOT, key);
  try {
    await fs.unlink(fullPath);
  } catch {
    /* ignore */
  }
}

export async function getFileSize(key: string): Promise<number> {
  const fullPath = path.join(STORAGE_ROOT, key);
  const stat = await fs.stat(fullPath);
  return stat.size;
}
