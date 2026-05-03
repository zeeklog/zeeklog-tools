type GroupNavItem = {
  id: string
  title: string
  count: number
}

type ToolsGroupNavProps = {
  groups: GroupNavItem[]
}

export function ToolsGroupNav({ groups }: ToolsGroupNavProps) {
  return (
    <nav className="space-y-1.5" aria-label="工具功能分组">
      {groups.map((group) => (
        <a
          key={group.id}
          href={`#group-${group.id}`}
          className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <span className="pl-2">
            {group.title}
            <span className="ml-1 text-xs text-slate-400">({group.count})</span>
          </span>
        </a>
      ))}
    </nav>
  )
}
