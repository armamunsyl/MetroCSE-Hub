import {
  HiOutlineCalculator,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineFolder,
} from 'react-icons/hi2'

const toolIcons = {
  'Cover Letter Maker': HiOutlineDocumentText,
  'CV Templates': HiOutlineClipboardDocumentList,
  'GPA Calculator': HiOutlineCalculator,
  'CGPA Calculator': HiOutlineCalculator,
  'Notes & Resources': HiOutlineFolder,
}

function ToolsGrid({ tools }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => {
        const Icon = toolIcons[tool.title] ?? HiOutlineDocumentText
        return (
          <div
            key={tool.title}
            className="flex min-h-[86px] items-center gap-3 rounded-2xl bg-[#1E3A8A] p-3 text-white shadow-[0_14px_26px_rgba(30,58,138,0.25)] sm:grid sm:min-h-[140px] sm:gap-3 sm:p-4"
          >
            <div
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/30 bg-white/15 text-white"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white sm:text-base">
                {tool.title}
              </div>
              <div className="mt-1 hidden text-sm text-white/80 sm:block">
                {tool.description}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ToolsGrid
