import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import type { ResolvedGalleryItem } from '@/lib/galleryUrls';

interface Props {
  items: ResolvedGalleryItem[];
  categories: string[];
  onUpdate: (id: string, patch: { title?: string; category?: string }) => void;
  onDelete: (id: string, paths: (string | null | undefined)[]) => void;
  onReorder: (orderedIds: string[]) => void;
}

const SortableCard = ({
  item,
  categories,
  onUpdate,
  onDelete,
}: {
  item: ResolvedGalleryItem;
  categories: string[];
  onUpdate: Props['onUpdate'];
  onDelete: Props['onDelete'];
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`overflow-hidden bg-card/50 relative ${isDragging ? 'opacity-70 ring-2 ring-primary z-50' : ''}`}
    >
      <button
        type="button"
        aria-label="Trage pentru a muta"
        className="absolute top-2 left-2 z-10 rounded-md bg-background/80 backdrop-blur p-2 text-foreground touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
        {item.thumbUrl && item.type === 'image' ? (
          <img src={item.thumbUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
        ) : item.thumbUrl && item.thumb_path ? (
          <img src={item.thumbUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground px-2 text-center break-all">VIDEO</span>
        )}
      </div>

      <div className="p-3 space-y-2">
        <Input
          defaultValue={item.title}
          className="h-8 text-sm"
          onBlur={(e) => e.target.value !== item.title && onUpdate(item.id, { title: e.target.value })}
        />
        <div className="flex items-center justify-between gap-2">
          <select
            defaultValue={item.category}
            onChange={(e) => onUpdate(item.id, { category: e.target.value })}
            className="h-8 rounded-md bg-secondary/40 border border-border text-xs px-2 text-foreground"
          >
            {Array.from(new Set([...categories, item.category])).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(item.id, [item.src, item.video_url, item.thumb_path])}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const SortableGalleryGrid = ({ items, categories, onUpdate, onDelete, onReorder }: Props) => {
  const [order, setOrder] = useState(items);

  useEffect(() => {
    setOrder(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.findIndex((i) => i.id === active.id);
    const newIndex = order.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(order, oldIndex, newIndex);
    setOrder(next);
    onReorder(next.map((i) => i.id));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Trage de pictograma din colțul fiecărei casete ca să schimbi ordinea. Pe telefon ține apăsat o
        clipă pe pictogramă, apoi mută.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {order.map((item) => (
              <SortableCard
                key={item.id}
                item={item}
                categories={categories}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableGalleryGrid;
