export function serializeSVG(elements) {
    function serializeElement(element) {
        const { tag, props, children = [] } = element;
        const attrs = Object.entries(props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");
        const openingTag = `<${tag}${attrs ? " " + attrs : ""}>`;
        const closingTag = `</${tag}>`;
        const selfClosingTag = openingTag.replace(">", "/>");
        if (children.length > 0) {
            const childrenContent = children.map(serializeElement).join("");
            return `${openingTag}${childrenContent}${closingTag}`;
        }
        else {
            return `${selfClosingTag}`;
        }
    }
    return elements.map(serializeElement).join("");
}
