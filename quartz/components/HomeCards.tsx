import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"

// content/ 바로 아래 1단계 폴더들을 카드로 자동 생성합니다.
// 각 폴더의 index.md frontmatter에서 icon, description을 읽습니다.
const HomeCards: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
  const folderIndexes = allFiles.filter((f) => /^[^/]+\/index$/.test(f.slug ?? ""))

  const cards = folderIndexes.map((f) => {
    const folder = (f.slug ?? "").split("/")[0]
    const count = allFiles.filter((p) => {
      const slug = p.slug ?? ""
      const title = String(p.frontmatter?.title ?? "")
      return (
        slug.startsWith(folder + "/") &&
        !slug.endsWith("/index") &&
        !title.includes("목차")
      )
    }).length

    const rawTitle = String(f.frontmatter?.title ?? folder)
    const name = rawTitle.replace(/^📁\s*/, "")
    const icon = String((f.frontmatter as Record<string, unknown>)?.icon ?? "📁")
    const desc = String((f.frontmatter as Record<string, unknown>)?.description ?? "")

    return { folder, name, icon, desc, count, slug: simplifySlug(f.slug!) as SimpleSlug }
  })

  // 글 많은 순으로 자동 정렬
  cards.sort((a, b) => b.count - a.count)

  return (
    <div class={classNames(displayClass, "home-cards-section")}>
      <h2>🗂️ 카테고리 둘러보기</h2>
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

export default (() => HomeCards) satisfies QuartzComponentConstructor
