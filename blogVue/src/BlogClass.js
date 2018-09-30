import marked from 'marked'

marked.setOptions({
  baseUrl: 'https://lokmeinmatz.github.io'
})


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
    console.log('loading blog')
    fetch('https://lokmeinmatz.github.io/' + this.url + '/index.md')
    .then(r => {
      if(r.ok) return r.text()
      throw new Error('Blog Entry ' + r.url + ' not found')
    })
    .then(r => {

      
      this.content = marked(r)
      
      if(typeof this.content != 'string') {
        console.log('Blog not found')
        this.content = marked('**Blog wurde nicht gefunden**')
      }
      
    })
    .catch(() => {
      console.log('Blog not found')
      this.content = marked('**Blog wurde nicht gefunden**')
    })
  }
}