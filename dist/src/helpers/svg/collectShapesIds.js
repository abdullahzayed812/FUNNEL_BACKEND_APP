export function collectSvgSegmentsIdsContainsPrimaryProp(elements, searchKey) {
    const shapeElements = [];
    function traverse(element) {
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
