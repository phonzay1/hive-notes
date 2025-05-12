import * as fs from 'fs';
import * as path from 'path';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const folderPath = path.resolve(__dirname, '..', 'note-photos');

function isImage(file: string): boolean {
  return IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

async function getBase64ImageUris(folderPath: string): Promise<Record<string, string>> {
  const files = await fs.promises.readdir(folderPath);
  const base64ImageUris: Record<string, string> = {};

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isFile() && isImage(file)) {
      // const data = await fs.promises.readFile(filePath);
      // const base64 = data.toString('base64');
      const ext = path.extname(file).toLowerCase();
      const base64Image = fs.readFileSync(filePath, "base64")
      const dataUri = `data:image/${ext};base64,${base64Image}`;
      base64ImageUris[file] = dataUri;
    }
  }

  return base64ImageUris;
}

export async function getBase64ImageUrisFromFolder() {
  const uris = await getBase64ImageUris(folderPath)
  return uris;
}
