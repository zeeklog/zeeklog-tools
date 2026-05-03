'use client'

import { types as extensionToMimeType, extensions as mimeTypeToExtension } from 'mime-types'
import { useMemo, useState } from 'react'

export function MimeTypesTool() {
  const mimeToExtOptions = useMemo(
    () => Object.keys(mimeTypeToExtension).map((label) => ({ label, value: label })),
    [],
  )
  const extToMimeOptions = useMemo(
    () =>
      Object.keys(extensionToMimeType).map((ext) => ({
        label: `.${ext}`,
        value: ext,
      })),
    [],
  )
  const mimeInfos = useMemo(
    () => Object.entries(mimeTypeToExtension).map(([mimeType, extensions]) => ({ mimeType, extensions })),
    [],
  )

  const [selectedMime, setSelectedMime] = useState('')
  const [selectedExt, setSelectedExt] = useState('')

  const extensionsFound = selectedMime ? (mimeTypeToExtension[selectedMime] ?? []) : []
  const mimeTypeFound = selectedExt ? extensionToMimeType[selectedExt] : ''

  return (
    <div className="space-y-10">
      <section className="space-y-3 rounded-xl border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900">MIME → 扩展名</h2>
        <p className="text-sm text-gray-600">选择 MIME 类型，查看常见文件扩展名。</p>
        <input
          list="mime-type-list"
          value={selectedMime}
          onChange={(e) => setSelectedMime(e.target.value)}
          placeholder="例如 application/pdf"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <datalist id="mime-type-list">
          {mimeToExtOptions.map((o) => (
            <option key={o.value} value={o.value} />
          ))}
        </datalist>
        {extensionsFound.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {extensionsFound.map((ext) => (
              <span key={ext} className="rounded-full bg-orange-100 px-2 py-0.5 text-sm text-orange-900">
                .{ext}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900">扩展名 → MIME</h2>
        <p className="text-sm text-gray-600">选择扩展名（不含点），查看关联 MIME。</p>
        <input
          list="ext-list"
          value={selectedExt}
          onChange={(e) => setSelectedExt(e.target.value.replace(/^\./, ''))}
          placeholder="例如 pdf"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <datalist id="ext-list">
          {extToMimeOptions.map((o) => (
            <option key={o.value} value={o.value} label={o.label} />
          ))}
        </datalist>
        {selectedExt && mimeTypeFound ? (
          <p className="rounded-full bg-orange-100 px-3 py-1 font-mono text-sm text-orange-900">{mimeTypeFound}</p>
        ) : null}
      </section>

      <div className="max-h-96 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="p-2">MIME</th>
              <th className="p-2">扩展名</th>
            </tr>
          </thead>
          <tbody>
            {mimeInfos.map(({ mimeType, extensions }) => (
              <tr key={mimeType} className="border-t border-gray-100">
                <td className="p-2 font-mono text-xs">{mimeType}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {extensions.map((ext) => (
                      <span key={ext} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                        .{ext}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
