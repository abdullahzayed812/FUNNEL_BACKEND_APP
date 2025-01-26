export function updateShapeColorById(elements, id, isShapeFill, newColor) {
    function updateElement(elements) {
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
                }
                else {
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
