export default function EmptyState({ message = "No items found." }) {
  return (
    <div className="empty">
      <h3>{message}</h3>
      <p className="muted">Try changing your filters or check back later.</p>
    </div>
  );
}
