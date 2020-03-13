module.exports = {
  base: "/",
  title: "Data Driven Drawings JS Library",
  description: "",
  themeConfig: {
    sidebarDepth: 2,
    repo: "1cgonza/dddrawings-js",
    docsDir: "docs",
    sidebar: [
      {
        title: "Math",
        path: "/reference/math",
        collapsable: true,
        sidebarDepth: 2,
        children: ["/reference/math/"]
      }
    ]
  }
};
