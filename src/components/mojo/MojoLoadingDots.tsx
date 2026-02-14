import { Sparkles } from 'lucide-react';

export default function MojoLoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <Sparkles className="w-3 h-3 text-mojo" />
          <span className="text-[10px] font-semibold text-mojo">Mojo</span>
        </div>
        <div className="flex gap-1.5 py-0.5">
          <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
          <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
          <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
        </div>
      </div>
    </div>
  );
}
