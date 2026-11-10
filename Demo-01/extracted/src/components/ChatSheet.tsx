import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";
import { fill } from "../lib/i18n";
import type { TKey } from "../lib/i18n";
import { Icon } from "./icons";
import { Sheet, WaButton } from "./ui";

/* In-app advisor chat — deliberately HUMAN-FIRST:
   messages read like a person at the service desk ("معك محمد بنفسه"),
   never like a bot. Quick templates mirror the questions the counter
   hears daily; WhatsApp remains one tap away for the real thread. */
interface Msg { id: number; from: "me" | "adv"; text: string }

export default function ChatSheet() {
  const app = useApp();
  const { t, L, lang, chatWith, closeChat, draft } = app;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const advisor = chatWith;

  useEffect(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (!advisor) return;
    const first = L(advisor.name).split(" ")[0];
    const seed: Msg[] = [{ id: ++idRef.current, from: "adv", text: fill(t("chat.greet"), { name: first }) }];
    setMsgs(seed);
    setTyping(false);
    setInput("");
    /* human acknowledging the actual request from the booking draft */
    if (draft.serviceId) {
      const svc = t(`sv.${draft.serviceId}` as TKey);
      timers.current.push(window.setTimeout(() => setTyping(true), 700));
      timers.current.push(window.setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, {
          id: ++idRef.current,
          from: "adv",
          text: lang === "ar" ? `شفت طلبك «${svc}» وأنا أجهّزه لك بنفسي 👌` : `I can see your “${svc}” request — I'm prepping it myself 👌`,
        }]);
      }, 1900));
    }
    return () => { timers.current.forEach((id) => window.clearTimeout(id)); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advisor?.id, lang]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  if (!advisor) return null;

  const send = (text: string, replyKey?: TKey) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: ++idRef.current, from: "me", text: text.trim() }]);
    setInput("");
    timers.current.push(window.setTimeout(() => setTyping(true), 450));
    timers.current.push(window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: ++idRef.current, from: "adv", text: t(replyKey ?? "chat.rGeneric") }]);
    }, 1650));
  };

  const templates: { q: TKey; r: TKey }[] = [
    { q: "chat.q1", r: "chat.r1" },
    { q: "chat.q2", r: "chat.r2" },
    { q: "chat.q3", r: "chat.r3" },
  ];

  return (
    <Sheet open={!!advisor} onClose={closeChat} title={t("a.chat")}>
      {/* human identity header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/6">
        <div className="relative shrink-0">
          <img src={advisor.photo} alt={L(advisor.name)} className="w-12 h-12 rounded-2xl object-cover border border-white/10 bg-card2" />
          <span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-ok border-2 border-panel pulse-ok" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-extrabold text-alu truncate">{L(advisor.name)}</p>
          <p className="text-[9px] text-mute font-semibold truncate" dir={lang === "ar" ? "ltr" : "rtl"}>
            {lang === "ar" ? advisor.name.en : advisor.name.ar}
          </p>
          <p className="text-[9.5px] font-bold text-ok mt-0.5">{t("a.online")}</p>
        </div>
        <WaButton small phone={advisor.phone} text={fill(t("a.waMsg"), { name: L(advisor.name).split(" ")[0] })} label="WhatsApp" />
      </div>

      {/* thread */}
      <div ref={scrollRef} className="h-60 overflow-y-auto py-3.5 space-y-2.5">
        {msgs.map((m) => (
          <div key={m.id} className={`msg-in flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] px-3.5 py-2.5 text-[12px] font-semibold leading-relaxed rounded-2xl ${m.from === "me" ? "btn-red text-white rounded-ee-md" : "bg-card2 border border-white/8 text-alu rounded-es-md"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg-in flex justify-start">
            <div className="bg-card2 border border-white/8 rounded-2xl rounded-es-md px-4 py-3 flex items-center gap-1.5">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-silver inline-block" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-silver inline-block" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-silver inline-block" />
              <span className="text-[9px] font-bold text-mute ms-1.5">{t("chat.typing")}</span>
            </div>
          </div>
        )}
      </div>

      {/* pre-populated templates */}
      <p className="text-[9.5px] font-bold text-mute mb-2">{t("chat.hint")}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {templates.map((tp) => (
          <button key={tp.q} onClick={() => send(t(tp.q), tp.r)}
            className="press min-h-[36px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10.5px] font-bold text-silver">
            {t(tp.q)}
          </button>
        ))}
      </div>

      {/* composer */}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("chat.ph")}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-[12.5px] font-semibold text-alu placeholder:text-mute/60 outline-none focus:border-red/50" />
        <button type="submit" aria-label={t("a.chat")} disabled={!input.trim()}
          className={`press w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white ${input.trim() ? "btn-red" : "bg-white/8 text-mute"}`}>
          <Icon name="send" size={17} className={app.dir === "rtl" ? "-scale-x-100" : ""} />
        </button>
      </form>
    </Sheet>
  );
}
