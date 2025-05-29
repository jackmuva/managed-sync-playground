import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  LanguageModelV1,
  Message,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";
import { customMiddleware } from "./custom-middleware";
import { randomUUID } from "crypto";
import { generateUUID } from "@/lib/utils";
import { ExtendedSession } from "@/app/(auth)/auth";

export const customModel = ({
  type = "openai",
  model = "gpt-4o",
}: {
  type?: "openai" | "anthropic";
  model?: string;
}) =>
  wrapLanguageModel({
    model:
      type === "openai" ? openai(model) : (anthropic(model) as LanguageModelV1),
    middleware: customMiddleware,
  });

// NOTE: Consider making an interface for returned data from cf search
interface AutoRagSearchResults {
  success: boolean,
  result: {
    object: string,
    search_query: string,
    data: Array<any>,
    has_more: boolean,
    next_page: string
  },
}

export const invokeRagMessages = async (query: string, session: ExtendedSession, impersonatedUser: string): Promise<{ sources: Array<string>, message: Message }> => {
  const searchResults = await retrieveContext(query, session, impersonatedUser);
  const messageContent = [];
  const sources = [];
  for (const context of searchResults?.result.data!) {
    for (const content of context.content) {
      messageContent.push(content.text);
    }
    sources.push(context.filename);
  }

  const ragMessage: Message = {
    id: generateUUID(),
    role: 'assistant',
    content: messageContent.join('\n') + '\nUsing the provided information, give me a better and summarized answer',
  }

  return { sources: sources, message: ragMessage }
}

const retrieveContext = async (query: string, session: ExtendedSession, impersonatedUser: string): Promise<AutoRagSearchResults | null> => {
  const request = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/autorag/rags/${process.env.AUTORAG_NAME}/ai-search`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AUTORAG_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      max_num_results: 5,
      //FIX: fix filter
      //filters: [
      //  {
      //    type: "eq",
      //    key: "folder",
      //    value: session.user.id + "/",
      //  },
      //]
    }),
  });

  const response: AutoRagSearchResults = await request.json();
  if (response.success) {
    const allowedContext = await enforcePermissionsOnContext(response.result.data, impersonatedUser);
    return {
      success: response.success,
      result: {
        object: response.result.object,
        search_query: response.result.search_query,
        data: allowedContext,
        has_more: response.result.has_more,
        next_page: response.result.next_page
      },
    }
  }
  return null;
}

const enforcePermissionsOnContext = async (contexts: Array<any>, impersonatedUser: string): Promise<Array<any>> => {
  //NOTE: may not be the best endpoint to use, depending on how many objects a user may have access to
  //const permRequest = await fetch(process.env.MANAGED_SYNC_URL + "/permissions/list-objects", {
  //  method: "POST",
  //  headers: {
  //    "Authorization": `Bearer ${session.paragonUserToken}`,
  //    "Content-Type": "application/json",
  //  },
  //  body: JSON.stringify({
  //    user: {
  //      id: impersonatedUser 
  //    }
  //  }),
  //});
  //const permResponse = await permRequest.json();
  //const permObjects: Array<any> = permResponse.objects;
  //
  //TODO: Swap this chunk code out when permission api is ready
  const permObjects = [{ id: "developers.cloudflare.com_1748454679157.html" }];

  const permSet = new Set(permObjects.map((obj) => {
    return obj.id;
  }));

  //FIX: robust implementation of gettin filename
  //console.log(permSet);
  //console.log(contexts[1].filename.split("/").at(-1))
  const allowedContext = contexts.filter((context) => permSet.has(context.filename.split("/").at(-1)));
  return allowedContext;
}
