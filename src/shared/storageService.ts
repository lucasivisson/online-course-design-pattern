import { unlink, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import crypto from 'crypto';

export const uploadsDir = join(process.cwd(), 'public', 'uploads');

export async function saveFileToDisk(
  fileBuffer: Buffer,
  originalName: string
): Promise<string> {

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const uniqueFileName = `${crypto.randomUUID()}-${originalName}`;
  const filePath = join(uploadsDir, uniqueFileName);

  await writeFile(filePath, fileBuffer);

  // Caminho público para o front-end
  return `uploads/${uniqueFileName}`;
}

export async function deleteUploadedFile(relativePath: string): Promise<void> {
  const filePath = path.join(process.cwd(), relativePath);

  try {
    await unlink(filePath);
    console.log(`Arquivo ${filePath} excluído com sucesso.`);
  } catch (error) {
    console.error(`Erro ao excluir o arquivo ${filePath}:`, error);
    throw error;
  }
}