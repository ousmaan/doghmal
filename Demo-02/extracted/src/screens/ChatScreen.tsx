import { useEffect, useRef, useState } from "react";
import { BadgeCheck, MessageCircle, Send } from "lucide-react";
import { cn } from "../utils/cn";
import { useLang } from "../i18n";
import { advisorOf, waLink } from "../data";
import { SubHeader } from "../components";

/* ============================================================================
   IN-APP ADVISOR CHAT — human-first by design. The thread opens with a message
   written BY the advisor ("معك أبو فهد… خطي المباشر"), never a bot greeting.
   Quick templates pre-populate the most common Saudi service asks; any message
   still falls back to the advisor's real WhatsApp via the header action.
   ============================================================================ */

interface Msg { from: "advisor" | "me"; text: string }

export function ChatScreen({ id }: { id: string }) {
  const { t, lang } = useLang();
  const advisor = advisorOf(id);
  const name = lang === "ar" ? advisor.nameAr : advisor.nameEn;

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    { from: "advisor", text: t.chatSeed.replace("{name}", name.split(" ")[0]) },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing]);

  const templates = [t.chatTpl1, t.chatTpl2, t.chatTpl3];

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMsgs((m) => [...m, { from: "me", text: clean }]);
    setInput("");
    setTyping(true);
    // The advisor (human) picks up — simulated short delay, then a warm Saudi reply
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "advisor", text: t.chatReply }]);
    }, 1400);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader
        title={name}
        sub={advisor.online ? t.advisorOnline : t.repliesIn}
        right={
          <a target="_blank" rel="noreferrer" aria-label="WhatsApp"
            href={waLink(advisor.wa, lang === "ar" ? "متابعة من محادثة التطبيق" : "Following up from the app chat")}
            className="press grid size-9 place-items-center rounded-full bg-wa text-white shadow-card">
            <MessageCircle className="size-4" />
          </a>
        }
      />

      {/* human-first honesty strip */}
      <p className="mx-4 mt-2.5 rounded-full bg-white px-3 py-1.5 text-center text-[9.5px] font-bold text-steel/60 shadow-card">
        {t.chatNote}
      </p>

      {/* thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <div className="flex flex-col gap-2.5">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex items-end gap-2 rise", m.from === "me" ? "flex-row-reverse" : "")}>
              {m.from === "advisor" && (
                <img src={advisor.photo} alt={name} className="size-7 shrink-0 rounded-full object-cover bg-alu-deep" loading="lazy" />
              )}
              <div className={cn("max-w-[74%] rounded-[20px] px-3.5 py-2.5 text-[12px] font-semibold leading-relaxed shadow-card text-start",
                m.from === "me"
                  ? "rounded-br-md rtl:rounded-br-[20px] rtl:rounded-bl-md bg-charcoal text-white"
                  : "rounded-bl-md rtl:rounded-bl-[20px] rtl:rounded-br-md bg-white text-charcoal")}>
                {m.text}
                {i === 0 && m.from === "advisor" && (
                  <span className="mt-1 flex items-center gap-1 text-[8.5px] font-black text-toyota">
                    <BadgeCheck className="size-2.5" /> {t.advisorRole}
                  </span>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <img src={advisor.photo} alt={name} className="size-7 shrink-0 rounded-full object-cover bg-alu-deep" />
              <div className="flex items-center gap-1.5 rounded-[20px] rounded-bl-md rtl:rounded-bl-[20px] rtl:rounded-br-md bg-white px-4 py-3 shadow-card">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-steel/50 pulse-dot" style={{ animationDelay: `${d * 0.18}s` }} />
                ))}
                <span className="text-[9px] font-bold text-steel/50">{t.typing}</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* pre-populated templates */}
      <div className="snapx flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2">
        {templates.map((tp) => (
          <button key={tp} onClick={() => send(tp)}
            className="press shrink-0 rounded-full border border-toyota/25 bg-toyota/6 px-3.5 py-2 text-[11px] font-extrabold text-toyota">
            {tp}
          </button>
        ))}
      </div>

      {/* composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 border-t border-black/5 bg-white/92 p-3 backdrop-blur-xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          aria-label={t.chatPlaceholder}
          className="h-11 min-w-0 flex-1 rounded-full bg-alu px-4 text-[12.5px] font-semibold text-charcoal outline-none placeholder:text-steel/45 focus:ring-2 focus:ring-toyota/30"
        />
        <button type="submit" aria-label={t.chatTitle} disabled={!input.trim()}
          className="press grid size-11 shrink-0 place-items-center rounded-full bg-toyota text-white shadow-red disabled:bg-steel/30 disabled:shadow-none">
          <Send className="size-4.5 rtl-mirror" />
        </button>
      </form>
    </div>
  );
}
