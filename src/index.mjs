import { createProcessor } from "@mdx-js/mdx"
import fs from "fs/promises"
import path from "path"

function isHeading(node) {
  return node.type === "heading"
}

function visit(node) {
  if (isHeading(node)) {
    const data = this.data()

    data.hello['nice'] = 'try'
    console.log(data)
  }
  if (node.children) {
    node.children.forEach((n) => visit.call(this, n))
  }
}

export async function compileMdx() {
  const filePath = path.join(process.cwd(), "src/test.mdx")
  const source = await fs.readFile(filePath, "utf-8")
  const compiler = createProcessor({
    jsx: true,
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [
      function () {
        return (tree, _, done) => {
          visit.call(this, tree)
          done()
        }
      },
    ],
  })
  const data = {}
  compiler.data("hello", data)
  const result = await compiler.process(source)
  console.log("result", result, data)
  console.log("guess what", compiler.data())
}

compileMdx()
