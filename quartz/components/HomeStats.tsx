import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const HomeStats: QuartzComponent = ({ allFiles, cfg, displayClass }: QuartzComponentProps) => {
  const posts = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    const title = String(f.frontmatter?.title ?? "")
    return slug !== "index" && !slug.endsWith("/index") && !title.includes("목차")
  })

  const categories = new Set(
    posts.map((f) => (f.slug ?? "").split("/")[0]).filter((s) => s.length > 0),
  )
  const tags = new Set(posts.flatMap((f) => (f.frontmatter?.tags ?? []) as string[]))

  const latest = posts
    .map((f) => f.dates?.created)
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0]
  const latestStr = latest
    ? latest.toLocaleDateString(cfg.locale ?? "ko-KR", { year: "numeric", month: "short", day: "numeric" })
    : "-"

  return (
    <div class={classNames(displayClass, "home-stats")}>
      <div class="stat">
        <span class="num">{posts.length}</span>
        <span class="label">📚 전체 글</span>
      </div>
      <div class="stat">
        <span class="num">{categories.size}</span>
        <span class="label">🗂️ 카테고리</span>
      </div>
      <div class="stat">
        <span class="num">{tags.size}</span>
        <span class="label">🏷️ 태그</span>
      </div>
      <div class="stat">
        <span class="num small">{latestStr}</span>
        <span class="label">🕘 마지막 글</span>
      </div>
    </div>
  )
}

HomeStats.css = `
.home-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0.8rem 0 1.2rem;
}
.home-stats .stat {
  flex: 1 1 110px;
  text-align: center;
  padding: 0.9rem 0.6rem;
  border: 1px solid var(--lightgray);
  border-radius: 10px;
  background: var(--light);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.home-stats .stat:hover {
  transform: translateY(-3px);
  border-color: var(--secondary);
}
.home-stats .stat .num {
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--secondary);
  line-height: 1.2;
}
.home-stats .stat .num.small {
  font-size: 1.05rem;
  padding: 0.35rem 0 0.15rem;
}
.home-stats .stat .label {
  font-size: 0.8rem;
  color: var(--darkgray);
}
`

export default (() => HomeStats) satisfies QuartzComponentConstructor
