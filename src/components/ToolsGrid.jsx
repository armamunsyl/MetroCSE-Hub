const accentClasses = {
  'tool-blue': 'from-[#c8ddff] to-[#7aa4ff]',
  'tool-green': 'from-[#d4f5e5] to-[#49d39f]',
  'tool-amber': 'from-[#ffe8c6] to-[#ffb84a]',
  'tool-violet': 'from-[#e1d6ff] to-[#9b7dff]',
}

function ToolsGrid({ tools }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => (
        <div
          key={tool.title}
          className="flex min-h-[86px] items-center gap-3 rounded-2xl border border-[#edf0ff] bg-white p-3 shadow-[0_12px_26px_rgba(36,44,98,0.08)] sm:grid sm:min-h-[140px] sm:gap-3 sm:p-4"
        >
          <div
            className={`grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br ${accentClasses[tool.accent]}`}
            aria-hidden="true"
          >
            <span className="h-3 w-3 rounded-sm bg-white/90" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1f2a63] sm:text-base">
              {tool.title}
            </div>
            <div className="mt-1 hidden text-sm text-[#5c66a5] sm:block">
              {tool.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToolsGrid
