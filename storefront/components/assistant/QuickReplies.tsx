'use client'

interface QuickRepliesProps {
  replies: string[]
  onSelect: (reply: string) => void
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null

  return (
    <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onSelect(reply)}
            className="px-3 py-2 bg-white border border-primary-300 text-primary-700 rounded-full text-sm hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 hover:scale-105"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  )
}
