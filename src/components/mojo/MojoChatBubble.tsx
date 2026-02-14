import { Sparkles } from 'lucide-react';

interface MojoChatBubbleProps {
  role: 'user' | 'mojo';
  content: string;
}

export default function MojoChatBubble({ role, content }: MojoChatBubbleProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
          role === 'user'
            ? 'bg-mojo text-white rounded-br-md'
            : 'bg-white text-foreground border border-border rounded-bl-md shadow-sm'
        }`}
      >
        {role === 'mojo' && (
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-mojo" />
            <span className="text-[10px] font-semibold text-mojo">Mojo</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
