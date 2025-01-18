import { SVGElement } from "./parseSVG";

export function updateShapeColorById(
  elements: SVGElement[],
  id: string,
  isShapeFill: boolean,
  newColor: string
): SVGElement[] {
  function updateElement(elements: SVGElement[]): SVGElement[] {
    return elements.map((element) => {
      if (element.id === id) {
        if (isShapeFill) {
          return {
            ...element,
            props: {
              ...element.props,
              fill: newColor,
            },
          };
        } else {
          return {
            ...element,
            props: {
              ...element.props,
              stroke: newColor,
            },
          };
        }
      }

      // Recursively update children
      if (element.children) {
        return {
          ...element,
          children: updateElement(element.children),
        };
      }

      return element;
    });
  }

  return updateElement(elements);
}
