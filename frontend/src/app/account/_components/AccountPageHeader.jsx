export default function AccountPageHeader({ title, description }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
