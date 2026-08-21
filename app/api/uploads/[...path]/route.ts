import { readFile } from "node:fs/promises";
import path from "node:path";
import { resolveUploadFilePath } from "@/lib/upload-path";

export const runtime = "nodejs";

const contentTypes = new Map([
  [".webp", "image/webp"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".ico", "image/x-icon"],
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const publicPath = `/api/uploads/${segments.join("/")}`;
  const absolutePath = resolveUploadFilePath(publicPath);
  const contentType = absolutePath ? contentTypes.get(path.extname(absolutePath).toLowerCase()) : null;

  if (!absolutePath || !contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(absolutePath);

    return new Response(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(file.byteLength),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
