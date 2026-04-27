import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useCommissionTopicsQuery } from '@/queries/commission-topic.queries'
import { CommissionTopicList } from '@/components/commission-topic/commission-topic-list.component'
import { CommissionTopicForm } from '@/components/commission-topic/commission-topic-form.component'
import { CommissionTopicDeleteDialog } from '@/components/commission-topic/commission-topic-delete-dialog.component'
import { Button } from '@/components/ui/button'
import type { CommissionTopicResponse } from '@/types/commission-topic.types'

type OverlayState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; topic: CommissionTopicResponse }
  | { type: 'delete'; topic: CommissionTopicResponse }

  const CommissionTopicsPage = () => {
    const { data: topics = [], isLoading } = useCommissionTopicsQuery();
    const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });

    const handleClose = () => setOverlay({ type: 'none' });

    if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2">
            Management
          </p>
          <h1 className="text-2xl font-bold font-playfair text-foreground">
            Commission Topics
          </h1>
        </div>
        <Button
          onClick={() => setOverlay({ type: 'create' })}
          className="gap-2 bg-brand-green text-white hover:bg-brand-green-hover"
        >
          <Plus className="w-4 h-4" />
          New topic
        </Button>
      </div>

      <CommissionTopicList
        topics={topics}
        onEdit={(topic) => setOverlay({ type: 'edit', topic })}
        onDelete={(topic) => setOverlay({ type: 'delete', topic })}
      />

      {overlay.type !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl border border-border p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-playfair text-foreground">
                {overlay.type === 'create' && 'New Topic'}
                {overlay.type === 'edit' && 'Edit Topic'}
                {overlay.type === 'delete' && 'Delete Topic'}
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {overlay.type === 'create' && (
              <CommissionTopicForm onClose={handleClose} />
            )}
            {overlay.type === 'edit' && (
              <CommissionTopicForm topic={overlay.topic} onClose={handleClose} />
            )}
            {overlay.type === 'delete' && (
              <CommissionTopicDeleteDialog topic={overlay.topic} onClose={handleClose} />
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default CommissionTopicsPage