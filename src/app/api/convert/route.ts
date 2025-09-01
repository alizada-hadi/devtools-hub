// src/app/api/convert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Font } from "fonteditor-core";

// Ensure this route runs in Node.js runtime
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Parse multipart form data using NextRequest.formData()
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const formatsRaw = formData.get("formats") as string | null;

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    let formats: string[] = [];
    try {
      if (formatsRaw) {
        formats = JSON.parse(formatsRaw);
        if (!Array.isArray(formats)) {
          throw new Error("Formats must be an array");
        }
      }
    } catch (err) {
      console.error("Error parsing formats:", err);
      return NextResponse.json(
        { error: "Invalid formats provided" },
        { status: 400 }
      );
    }

    if (!formats.length) {
      console.error("No output formats selected");
      return NextResponse.json(
        { error: "No output formats selected" },
        { status: 400 }
      );
    }

    const validFormats = ["ttf", "otf", "woff", "woff2", "eot", "svg"];
    const invalidFormats = formats.filter(
      (f) => !validFormats.includes(f.toLowerCase())
    );
    if (invalidFormats.length) {
      console.error("Invalid output formats:", invalidFormats);
      return NextResponse.json(
        { error: `Invalid output formats: ${invalidFormats.join(", ")}` },
        { status: 400 }
      );
    }

    // Read the file as a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "";
    const ext = originalName.split(".").pop()?.toLowerCase() || "";

    const inputTypeMap: { [key: string]: string } = {
      ttf: "ttf",
      otf: "otf",
      woff: "woff",
      woff2: "woff2",
      eot: "eot",
      svg: "svg",
    };

    const inputType = inputTypeMap[ext];
    if (!inputType) {
      console.error("Unsupported input format:", ext);
      return NextResponse.json(
        { error: `Unsupported input format: ${ext}` },
        { status: 400 }
      );
    }

    let font;
    try {
      console.log("Creating font with type:", inputType);
      font = Font.create(buffer, {
        type: inputType as "ttf" | "otf" | "woff" | "woff2" | "eot" | "svg",
      });
    } catch (error) {
      console.error("Error creating font:", error);
      return NextResponse.json(
        { error: "Error reading font file" },
        { status: 500 }
      );
    }

    const results: Array<{ format: string; base64: string; size: string }> = [];
    const failedFormats: string[] = [];

    for (const format of formats) {
      try {
        console.log(`Converting to format: ${format}`);
        const outputBuffer = font.write({
          type: format as "ttf" | "otf" | "woff" | "woff2" | "eot" | "svg",
        });

        let bufferToUse: Buffer;
        if (Buffer.isBuffer(outputBuffer)) {
          bufferToUse = outputBuffer;
        } else if (outputBuffer instanceof ArrayBuffer) {
          bufferToUse = Buffer.from(outputBuffer);
        } else if (ArrayBuffer.isView(outputBuffer)) {
          bufferToUse = Buffer.from(
            outputBuffer.buffer,
            outputBuffer.byteOffset,
            outputBuffer.byteLength
          );
        } else {
          throw new Error("Unknown outputBuffer type");
        }

        const base64 = bufferToUse.toString("base64");
        const size = `${(bufferToUse.length / 1024).toFixed(1)}KB`;
        results.push({
          format: format.toUpperCase(),
          base64,
          size,
        });
        console.log(`Successfully converted to ${format}`);
      } catch (error) {
        console.error(`Failed to convert to ${format}:`, error);
        failedFormats.push(format);
      }
    }

    if (!results.length) {
      console.error(
        "No successful conversions. Failed formats:",
        failedFormats
      );
      return NextResponse.json(
        {
          error: `No successful conversions. Failed formats: ${failedFormats.join(
            ", "
          )}`,
        },
        { status: 500 }
      );
    }

    if (failedFormats.length) {
      console.warn("Some formats failed to convert:", failedFormats);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
