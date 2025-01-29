export interface SVGElementProps {
  [key: string]: string;
}

export interface SVGElement {
  id: string; // Add an id field
  tag: string;
  props: SVGElementProps;
  children?: SVGElement[];
}

export function parseSVG(svgString: string | null): SVGElement[] {
  if (svgString === null) {
    return [];
  }

  const svgElements: SVGElement[] = [];
  const tagRegex = /<(\w+)([^>]*)\/?>/g;
  const closingTagRegex = /<\/(\w+)>/g;
  const attrRegex = /(\w[\w-]*?)=["']([^"']*)["']/g;

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  const stack: SVGElement[] = [];
  const tempElements: SVGElement[] = [];
  let idCounter = 0; // Unique id counter

  while ((match = tagRegex.exec(svgString)) !== null) {
    const [fullMatch, tagName, attributesString] = match;

    // console.log(match);

    const closingMatch = closingTagRegex.exec(svgString.slice(lastIndex));

    if (closingMatch && closingMatch.index < match.index - lastIndex) {
      while (stack.length && stack[stack.length - 1].tag !== closingMatch[1]) {
        stack.pop();
      }

      stack.pop(); // Pop the matched closing tag
      lastIndex = tagRegex.lastIndex;
      continue;
    }

    const props: SVGElementProps = {};
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
      props[attrMatch[1]] = attrMatch[2];
    }

    // Create new element with a unique id
    const element: SVGElement = {
      id: `element-${idCounter++}`,
      tag: tagName,
      props,
      children: [],
    };

    if (stack.length > 0) {
      stack[stack.length - 1].children!.push(element);
    } else {
      tempElements.push(element);
    }

    if (!fullMatch.endsWith("/>")) {
      stack.push(element);
    }

    lastIndex = tagRegex.lastIndex;
  }

  svgElements.push(...tempElements);

  return svgElements;
}
