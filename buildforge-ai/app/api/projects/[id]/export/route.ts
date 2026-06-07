import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { generateCodeScaffold } from "@/lib/agents/code-generator";
import type { AgentType } from "@/types/agent";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const url = new URL(req.url);
  const format = url.searchParams.get("format");

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const runs = await prisma.agentRun.findMany({
    where: { projectId: id, status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
  });

  const agentOutputs: Partial<Record<AgentType, unknown>> = {};
  for (const run of runs) {
    if (run.output) agentOutputs[run.agentType as AgentType] = JSON.parse(run.output);
  }

  const scaffold = generateCodeScaffold(project.name, agentOutputs);

  if (format === "zip") {
    const zipBuffer = buildZip(scaffold.files.map(f => ({ path: f.path, content: f.content })));
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return new Response(Buffer.from(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}.zip"`,
      },
    });
  }

  return NextResponse.json({
    files: scaffold.files.map((f) => ({ ...f, name: f.path.split("/").pop() || f.path })),
    techStack: Object.values(scaffold.packageJson?.dependencies || {}).map(String),
    setupInstructions: scaffold.setupInstructions,
    projectName: scaffold.projectName,
    readme: scaffold.readme,
  });
}

interface ZipEntry {
  path: string;
  content: string;
}

function buildZip(files: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.path);
    const contentBytes = encoder.encode(file.content);
    const crc = crc32(contentBytes);
    const size = contentBytes.length;

    // Local file header (30 bytes + name)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lh = new DataView(localHeader.buffer);
    lh.setUint32(0, 0x04034b50, true);   // signature
    lh.setUint16(4, 20, true);            // version needed
    lh.setUint16(6, 0, true);             // flags
    lh.setUint16(8, 0, true);             // compression: stored
    lh.setUint16(10, 0, true);            // mod time
    lh.setUint16(12, 0, true);            // mod date
    lh.setUint32(14, crc, true);          // crc32
    lh.setUint32(18, size, true);         // compressed size
    lh.setUint32(22, size, true);         // uncompressed size
    lh.setUint16(26, nameBytes.length, true); // filename length
    lh.setUint16(28, 0, true);            // extra field length
    localHeader.set(nameBytes, 30);

    localHeaders.push(localHeader, contentBytes);

    // Central directory header (46 bytes + name)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const ch = new DataView(centralHeader.buffer);
    ch.setUint32(0, 0x02014b50, true);    // signature
    ch.setUint16(4, 20, true);            // version made by
    ch.setUint16(6, 20, true);            // version needed
    ch.setUint16(8, 0, true);             // flags
    ch.setUint16(10, 0, true);            // compression
    ch.setUint16(12, 0, true);            // mod time
    ch.setUint16(14, 0, true);            // mod date
    ch.setUint32(16, crc, true);          // crc32
    ch.setUint32(20, size, true);         // compressed size
    ch.setUint32(24, size, true);         // uncompressed size
    ch.setUint16(28, nameBytes.length, true); // filename length
    ch.setUint16(30, 0, true);            // extra field length
    ch.setUint16(32, 0, true);            // file comment length
    ch.setUint16(34, 0, true);            // disk number start
    ch.setUint16(36, 0, true);            // internal attrs
    ch.setUint32(38, 0, true);            // external attrs
    ch.setUint32(42, offset, true);       // local header offset
    centralHeader.set(nameBytes, 46);

    centralHeaders.push(centralHeader);
    offset += localHeader.length + contentBytes.length;
  }

  const cdOffset = offset;
  const cdBytes = concat(centralHeaders);
  const cdSize = cdBytes.length;

  // End of central directory (22 bytes)
  const eocd = new Uint8Array(22);
  const ed = new DataView(eocd.buffer);
  ed.setUint32(0, 0x06054b50, true);     // signature
  ed.setUint16(4, 0, true);              // disk number
  ed.setUint16(6, 0, true);              // disk with cd
  ed.setUint16(8, files.length, true);   // entries on disk
  ed.setUint16(10, files.length, true);  // total entries
  ed.setUint32(12, cdSize, true);        // cd size
  ed.setUint32(16, cdOffset, true);      // cd offset
  ed.setUint16(20, 0, true);             // comment length

  return concat([...localHeaders, cdBytes, eocd]);
}

function concat(arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const arr of arrays) {
    result.set(arr, pos);
    pos += arr.length;
  }
  return result;
}

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
