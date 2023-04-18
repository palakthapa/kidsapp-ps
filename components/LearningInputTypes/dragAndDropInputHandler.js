import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function DraggableComponent({ correctWord, successHandler, failureHandler }) {
    const items = shuffleArray(correctWord.split(''));
    const [draggedItems, setDraggedItems] = useState(items);
    const [placedItems, setPlacedItems] = useState({});

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        let sourceId = result.source.droppableId,
            sourceIndex = result.source.index,
            destinationId = result.destination.droppableId?.includes("target") ? "target" : result.destination.droppableId,
            destinationIndex = destinationId === "target" ? parseInt(result.destination.droppableId.split("-").pop()) : result.destination.index;


        if(placedItems[destinationIndex]) return;

        const draggedItemsArr = Array.from(draggedItems);

        if (destinationId === "target") {
            const [reorderedItem] = draggedItemsArr.splice(sourceIndex, 1);
            setPlacedItems(state => {
                state[destinationIndex] = draggedItems[sourceIndex];
                return state;
            });
        }

        setDraggedItems(draggedItemsArr);
        if(draggedItemsArr.length === 0) {
            let wordArr = Object.values(placedItems);
            let word = wordArr.join('');

            if(word === correctWord) {
                if(successHandler) successHandler();
            } else {
                if(failureHandler) failureHandler();
            }
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="w-max h-max flex flex-col justify-around">
                <div className="flex flex-wrap justify-around mb-5">
                    {items.map((item, index) => (
                        <Droppable droppableId={"target-" + index} key={index}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-gray-200 w-[40px] h-[40px] border border-dashed border-gray-700 rounded-md mr-2"
                                >
                                    {placedItems[index] ? <div className="w-full h-full text-center py-2 uppercase">{placedItems[index]}</div> : null}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

                <Droppable droppableId="items" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={"relative h-[40px] flex justify-around w-[" + (40 * (items.length + 1)) + "px]"}>
                            {draggedItems.map((item, index) => (
                                <Draggable key={index} draggableId={"item-" + index} index={index} >
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className="bg-gray-200 w-[40px] h-[40px] text-center border border-gray-700 rounded-md py-2 uppercase mr-2"
                                        >
                                            {item}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

