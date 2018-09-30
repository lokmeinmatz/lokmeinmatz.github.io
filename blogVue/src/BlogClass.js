export default class Blog {
  //{title: subPath, fullPath: blog.title, url: blogPage ? blog.URL : '', children: []}
  constructor(title, fullPath, url, children) {
    this.title = title
    this.fullPath = fullPath
    this.url = url
    this.children = (children != null) ? children : []
    this.content = {}
  }

  loadContent() {
    fetch('https://lokmeinmatz.github.io/' + this.url + '/index.md').then(r => console.log(r))
  }
}