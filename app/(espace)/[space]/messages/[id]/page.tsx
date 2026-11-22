import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { reportMessage, sendMessage } from "@/lib/actions";
import { getConversation } from "@/lib/data";
import { formatDateTime, fullName } from "@/lib/format";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Conversation" };

export default async function ConversationPage(props: {
  params: Promise<{ space: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const { id } = await props.params;
  const data = await getConversation(id, member.id);
  if (!data) notFound();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-4">
      <PageTitle title={data.conversation.subject} text={data.other ? fullName(data.other) : ""} />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <div className="grid gap-2">
        {data.thread.map((message) => {
          const mine = message.senderId === member.id;
          return (
            <article key={message.id} className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${mine ? "ml-auto bg-navy text-white" : "bg-white"}`}>
              <p className="leading-6">{message.body}</p>
              <p className={`mt-1 text-xs ${mine ? "text-white/70" : "text-ink/50"}`}>{formatDateTime(message.createdAt)}</p>
              {mine ? null : (
                <form action={reportMessage}>
                  <input type="hidden" name="messageId" value={message.id} />
                  <button className="mt-1 text-xs underline" type="submit">Signaler</button>
                </form>
              )}
            </article>
          );
        })}
      </div>
      <form action={sendMessage} className="card grid gap-3 p-4">
        <input type="hidden" name="conversationId" value={id} />
        <label className="field"><span>Message</span><textarea name="body" required /></label>
        <SubmitButton>Envoyer</SubmitButton>
      </form>
    </div>
  );
}
