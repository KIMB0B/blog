import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"
import { QuartzPluginData } from "./quartz/plugins/vfile"

// 홈(index) 페이지인지 확인
const isHomePage = (props: QuartzComponentProps) => props.fileData.slug === "index"

// 최신 글 목록에서 index/목차/기출 답안 페이지 제외
const isPost = (f: QuartzPluginData) => {
  const slug = f.slug ?? ""
  const title = String(f.frontmatter?.title ?? "")
  const tags = (f.frontmatter?.tags ?? []) as string[]
  return (
    slug !== "index" &&
    !slug.endsWith("/index") &&
    !title.includes("목차") &&
    !tags.includes("정보처리기사/기출")
  )
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/KIMB0B",
      Tistory: "https://hel-p.tistory.com/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    // 홈 화면에만 블로그 통계 표시
    Component.ConditionalRender(Component.HomeStats(), isHomePage),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  afterBody: [
    // 홈 화면에만 최신 글 목록을 자동으로 표시
    Component.ConditionalRender(
      Component.RecentNotes({
        title: "🕘 최신 글",
        limit: 8,
        showTags: true,
        filter: isPost,
      }),
      isHomePage,
    ),
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "KIMB0B/blog",
        repoId: "R_kgDOMiduQg",
        category: "General",
        categoryId: "DIC_kwDOMiduQs4ChkKK",
        mapping: "pathname",
        strict: true,
        reactionsEnabled: true,
        inputPosition: "bottom",
        theme: "preferred_color_scheme",
      },
    }),
  ]
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
  afterBody: [],
}
