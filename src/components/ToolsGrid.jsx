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
            className="flex min-h-[86px] items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_10px_18px_rgba(0,0,0,0.06)] sm:grid sm:min-h-[140px] sm:gap-3 sm:p-4"
          >
            <div
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-[#E5E7EB] text-[#1E3A8A]"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0F172A] sm:text-base">
                {tool.title}
              </div>
              <div className="mt-1 hidden text-sm text-[#475569] sm:block">
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
