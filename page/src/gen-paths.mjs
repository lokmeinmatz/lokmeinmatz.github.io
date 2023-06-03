import * as path from 'node:path'
import * as fs from 'node:fs/promises'

const STATIC_PATHS = [
    '/',
    '/impressum',
    '/blog',
]

const FILE_NAME = './routesFile.txt'

/**
 * 
 * @returns {Promise<string[]>}
 */
async function getAllBlogSlugs() {
    return fs.readFile('./src/assets/blog/blogs.json').then(raw => {
        const parsed = JSON.parse(raw)
        return parsed.articles.map(a => a.file)
    })
}

async function genPaths() {
    
    const allPaths = [
        ...STATIC_PATHS,
        ...await getAllBlogSlugs().then(s => s.map(s => '/blog/' + s))
    ];

    await fs.writeFile(FILE_NAME, allPaths.join('\n'), { encoding: 'utf-8' });
    console.log(`updated ${allPaths.length} paths in ${FILE_NAME}`)
}

genPaths()