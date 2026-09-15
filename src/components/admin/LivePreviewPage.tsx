"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Page } from "../../payload-types";
import { RenderBlocks } from "../RenderBlocks";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export function LivePreviewPage({ initialData }: { initialData: Page }) {
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL: serverUrl,
    depth: 2,
  });

  return <RenderBlocks blocks={data.layout} />;
}

