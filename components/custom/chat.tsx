"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";

import {
  Message as PreviewMessage,
  ThinkingMessage,
} from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { ExtendedSession } from "@/app/(auth)/auth";
import { Textarea } from "../ui/textarea";
import { LoadingSkeleton } from "./integrations";
import dynamic from "next/dynamic";
import { ParagraphTypes } from "@/lib/paragon/useParagon";
import { DropdownMenu } from "../ui/dropdown-menu";
import { FunctionTool } from "@/app/(chat)/api/chat/route";
import { ErrorIcon } from "./icons";
import { Input } from "../ui/input";

const IntegrationsLazy = dynamic(() => import("./integrations"), {
  loading: () => (
    <div className="pt-12 pr-3 w-full">
      <LoadingSkeleton />
    </div>
  ),
  ssr: false,
});

export function Chat({
  id,
  initialMessages,
  session,
  savedPrompt,
  savedTools,
}: {
  id: string;
  initialMessages: Array<Message>;
  session: { paragonUserToken?: string };
  savedPrompt?: string | null;
  savedTools?: string[] | null;
}) {
  //TODO: Change this to impersonated user
  const [systemPrompt, setSystemPrompt] = useState(
    savedPrompt ?? "You are a helpful assistant."
  );
  const [tools, setTools] = useState<ParagraphTypes[string]>([]);
  const [actions, setActions] = useState<FunctionTool[]>([]);
  //TODO: Make this be the first integration
  const [selectedSource, setSelectedSource] = useState<string>("googledrive");

  const {
    messages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    body: {
      id,
      systemPrompt,
      actions,
    },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/chat/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>(isLoading);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  console.log(selectedSource);

  return (
    <div className="flex justify-between max-w-full h-[calc(100dvh-32px)] pt-12">
      <div className="p-3 bg-background min-w-[300px] w-80 overflow-y-scroll">
        <IntegrationsLazy
          session={session}
          onUpdateTools={setTools}
          onUpdateActions={setActions}
          initialToolsSelected={savedTools as string[]}
          setSelectedSourceAction={setSelectedSource}
        />
      </div>
      <div className="rounded-md max-w-[500px] pt-5 mx-3">
        <div className="flex flex-col justify-between h-full">
          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Impersonate User</p>
            <Input
              value={systemPrompt}
              className="min-h-[24px] overflow-y-scroll rounded-lg text-base"
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
          <div
            ref={messagesContainerRef}
            className="overflow-y-scroll h-full flex flex-col gap-2 pr-3"
          >
            {messages.map((message) => (
              <PreviewMessage
                key={message.id}
                role={message.role}
                content={message.content}
                attachments={message.experimental_attachments}
                toolInvocations={message.toolInvocations}
                annotations={message.annotations}
              />
            ))}
            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "user" && (
                <ThinkingMessage />
              )}
            {error && (
              <PreviewMessage
                key="error"
                role="assistant"
                content={
                  <div>
                    <p className="text-red-400 mt-1 flex items-center">
                      <ErrorIcon />
                      <span className="ml-1">
                        <span className="">Error generating response.</span>{" "}
                        {error?.message}
                      </span>
                    </p>
                    <button
                      className="font-bold text-sm"
                      type="button"
                      onClick={() => reload()}
                    >
                      Retry
                    </button>
                  </div>
                }
                toolInvocations={[]}
              />
            )}
            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>

          <form className="flex flex-row gap-2 relative items-end w-full px-4 md:px-0">
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              append={append}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
