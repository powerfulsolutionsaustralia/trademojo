interface MojoQuickRepliesProps {
  replies: string[];
  onReply: (reply: string) => void;
}

export default function MojoQuickReplies({ replies, onReply }: MojoQuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 pl-1">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onReply(reply)}
          className="text-[11px] px-3 py-1.5 bg-white border border-border rounded-full text-foreground hover:border-mojo hover:text-mojo transition-all cursor-pointer shadow-sm"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
