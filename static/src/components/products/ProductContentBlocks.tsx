import type { MarkdownBlock, MarkdownInline } from "../../content/products/index.js";

function MarkdownInlineContent({
  nodes,
}: {
  readonly nodes: MarkdownInline[];
}) {
  return (
    <>
      {nodes.map((node, index) => {
        const key = `${node.type}-${index}-${"value" in node ? node.value : "node"}`;
        if (node.type === "text") return <span key={key}>{node.value}</span>;
        if (node.type === "emphasis") return <em key={key}>{node.value}</em>;
        if (node.type === "strong") return <strong key={key}>{node.value}</strong>;
        if (node.type === "code") return <code key={key}>{node.value}</code>;
        return (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {node.value}
          </a>
        );
      })}
    </>
  );
}

export function ProductContentBlocks({
  blocks,
}: {
  readonly blocks: MarkdownBlock[];
}) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "paragraph") {
          return (
            <p key={key}>
              <MarkdownInlineContent nodes={block.content} />
            </p>
          );
        }
        if (block.type === "blockquote") {
          return (
            <blockquote key={key}>
              <MarkdownInlineContent nodes={block.content} />
            </blockquote>
          );
        }
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-item-${itemIndex}`}>
                  <MarkdownInlineContent nodes={item} />
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <div key={key} className="product-detail-table-wrap">
            <table className="product-detail-table">
              <thead>
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={`${key}-header-${headerIndex}`}>
                      <MarkdownInlineContent nodes={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${key}-row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>
                        <MarkdownInlineContent nodes={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
