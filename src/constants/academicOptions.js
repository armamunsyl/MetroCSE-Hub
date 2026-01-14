const batchNumbers = Array.from({ length: 11 }, (_, index) => 56 + index)
const sectionLetters = Array.from({ length: 10 }, (_, index) => String.fromCharCode(65 + index))

const batchOptions = batchNumbers.map((batch) => ({
  value: String(batch),
  label: `CSE ${batch}`,
}))

const sectionOptions = sectionLetters.map((section) => ({
  value: section,
  label: `Sec ${section}`,
}))

const batchLabels = batchOptions.map((option) => option.label)
const sectionLabels = sectionOptions.map((option) => option.label)

export { batchNumbers, sectionLetters, batchOptions, sectionOptions, batchLabels, sectionLabels }
