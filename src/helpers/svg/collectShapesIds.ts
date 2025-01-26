import { SVGElement } from "./parseSVG";

export function collectSvgSegmentsIdsContainsPrimaryProp(elements: SVGElement[], searchKey: string): string[] {
  const shapeElements: string[] = [];

  function traverse(element: SVGElement) {
    if (searchKey in element.props) {
      shapeElements.push(element.id);
    }

    if (element.children) {
      for (const child of element.children) {
        traverse(child);
      }
    }
  }

  for (const element of elements) {
    traverse(element);
  }

  return shapeElements;
}
