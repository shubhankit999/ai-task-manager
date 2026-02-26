import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../state/TaskContext.jsx';
import TaskCard from './TaskCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function TaskList({ onEdit }) {
  const {
    tasks,
    filteredSortedTasks,
    deleteTask,
    reorderTasks,
    filterPriority,
    filterStatus
  } = useTasks();

  const hasTasks = tasks.length > 0;

  const dndEnabled =
    filterPriority === 'All' && filterStatus === 'All' && filteredSortedTasks.length > 0;

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;
    if (!dndEnabled) return;
    reorderTasks(source.index, destination.index);
  };

  if (!hasTasks) {
    return <EmptyState />;
  }

  const content = (
    <div className="space-y-3">
      {filteredSortedTasks.map((task, index) =>
        dndEnabled ? (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`transition-shadow ${
                  snapshot.isDragging ? 'shadow-lg shadow-primary-500/30' : ''
                }`}
              >
                <TaskCard task={task} onEdit={onEdit} onDelete={deleteTask} />
              </div>
            )}
          </Draggable>
        ) : (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={deleteTask} />
        )
      )}
    </div>
  );

  if (!dndEnabled) {
    return (
      <div className="space-y-2">
        {content}
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Drag-and-drop reordering is available when no filters are applied.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
            {content.props.children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

