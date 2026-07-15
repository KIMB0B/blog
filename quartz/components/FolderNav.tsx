import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative, simplifySlug, stripSlashes } from "../util/path"
import { classNames } from "../util/lang"

// 폴더 페이지 상단에 하위 폴더들을 카드 그리드로 자동 표시합니다.
// 각 하위 폴더 index.md의 frontmatter에서 icon, description을 읽습니다.
const FolderNav: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
  const folderSlug = stripSlashes(simplifySlug(fileData.slug!))

  const childIndexes = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    if (!slug.startsWith(folderSlug + "/") || !slug.endsWith("/index")) return false
    const rest = slug.slice(folderSlug.length + 1)
    return rest.split("/").length === 2 // 바로 아래 단계의 index만
  })

  if (childIndexes.length === 0) {
    return null
  }

  const cards = childIndexes.map((f) => {
    const childFolder = (f.slug ?? "").replace(/\/index$/, "")
    const count = allFiles.filter((p) => {
      const slug = p.slug ?? ""
      const title = String(p.frontmatter?.title ?? "")
      return (
        slug.startsWith(childFolder + "/") &&
        !slug.endsWith("/index") &&
        !title.includes("목차")
      )
    }).length

    const rawTitle = String(f.frontmatter?.title ?? childFolder)
    const name = rawTitle.replace(/^📁\s*/, "")
    const icon = String((f.frontmatter as Record<string, unknown>)?.icon ?? "📁")
    const desc = String((f.frontmatter as Record<string, unknown>)?.description ?? "")

    return { name, icon, desc, count, slug: simplifySlug(f.slug!) as SimpleSlug }
  })

  cards.sort((a, b) => b.count - a.count)

  return (
    <div class={classNames(displayClass, "folder-nav")}>
      <div class="home-cards">
        {cards.map((c) => (
          <a class="home-card internal" href={resolveRelative(fileData.slug!, c.slug)}>
            <div class="card-title">
              {c.icon} {c.name}
            </div>
            {c.desc && <div class="card-desc">{c.desc}</div>}
            <div class="card-count">글 {c.count}개</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default (() => FolderNav) satisfies QuartzComponentConstructor
