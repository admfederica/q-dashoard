import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    });

    const tasks = response.results.map((page) => {
      const p = page.properties;
      return {
        name: p["Project name"]?.title?.[0]?.plain_text || "",
        status: p["Status"]?.status?.name || "Not started",
        priority: p["Priority"]?.select?.name || "Medium",
        team: p["Team"]?.multi_select?.map((t) => t.name) || [],
        sprint: p["Sprint"]?.select?.name || "",
        desc: p["Descripción"]?.rich_text?.[0]?.plain_text || "",
      };
    });

    return Response.json(tasks);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
