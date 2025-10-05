const EmptyState = ({
  icon: Icon,
  message,
}: {
  icon: any;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border rounded-lg bg-muted/10">
    <Icon className="h-10 w-10 mb-2 text-muted-foreground/70" />
    <p>{message}</p>
  </div>
);

export default EmptyState;
