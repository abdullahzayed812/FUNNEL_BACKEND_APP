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

// parseSVG(
//   `<svg width="1080" height="1080" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 566L1080 338.5V0H0V566Z" fill="#074A76"/><path d="M616 433L1080 333.5V379.5L616 433Z" fill="#B9512A"/><path d="M607 437L1080 334V536L607 437Z" fill="#EB6E40"/></svg>`
// );

// export interface SVGElementProps {
//   [key: string]: string;
// }

// export interface SVGElement {
//   id: string; // Unique id for each element
//   tag: string;
//   props: SVGElementProps;
//   children?: SVGElement[];
// }

// export function parseSVG(svgString: string | null): SVGElement[] {
//   if (!svgString) return [];

//   const svgElements: SVGElement[] = [];
//   const tagRegex = /<(\w+)([^>]*)\/?>/g;
//   const attrRegex = /(\w[\w-]*?)=["']([^"']*)["']/g;
//   const closingTagRegex = /<\/(\w+)>/g; // Used for closing tags

//   let match: RegExpExecArray | null;
//   let idCounter = 0;

//   const parseElement = (svgString: string, startIndex: number): { element: SVGElement, nextIndex: number } => {
//     const match = tagRegex.exec(svgString.slice(startIndex));

//     if (!match) return { element: { id: '', tag: '', props: {} }, nextIndex: startIndex };

//     const [fullMatch, tagName, attributesString] = match;
//     const props: SVGElementProps = {};

//     let attrMatch: RegExpExecArray | null;
//     while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
//       props[attrMatch[1]] = attrMatch[2];
//     }

//     const element: SVGElement = {
//       id: `element-${idCounter++}`,
//       tag: tagName,
//       props,
//       children: [],
//     };

//     let childrenStartIndex = tagRegex.lastIndex;
//     if (!fullMatch.endsWith("/>")) {
//       const closingTagMatch = new RegExp(`</${tagName}>`);
//       const closingTagIndex = svgString.indexOf(closingTagMatch.source, childrenStartIndex);

//       if (closingTagIndex !== -1) {
//         const childrenString = svgString.slice(childrenStartIndex, closingTagIndex);
//         let childIndex = 0;

//         while (childIndex < childrenString.length) {
//           const { element: childElement, nextIndex } = parseElement(childrenString, childIndex);
//           element.children!.push(childElement);
//           childIndex = nextIndex;
//         }
//       }
//     }

//     return { element, nextIndex: tagRegex.lastIndex };
//   };

//   let index = 0;
//   while (index < svgString.length) {
//     const { element, nextIndex } = parseElement(svgString, index);
//     svgElements.push(element);
//     index = nextIndex;
//   }

//   return svgElements;
// }
