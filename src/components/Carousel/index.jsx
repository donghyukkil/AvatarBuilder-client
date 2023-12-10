import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";

import Button from "../Button";
import ChildCanvas from "../ChildCanvas";

const Carousel = ({
  items,
  currentPage,
  totalPages,
  itemsPerPage = 3,
  onPrevButtonClick,
  onNextButtonClick,
  fillColor,
  elements,
  onElementChange,
  unitType,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center w-full">
        <Button
          onClick={onPrevButtonClick}
          disabled={currentPage === 1}
          style={`ml-8 ${"disabled:opacity-25"}`}
          data-testid="Prev"
        >
          <AiOutlineCaretLeft size={40} />
        </Button>
        <div className="flex space-x-5">
          {totalPages !== 0 &&
            Array.from({ length: itemsPerPage }).map((_, index) => {
              const item = items?.[index];

            return (
              <div key={index} className="w-1/3">
                {item && typeof item === "string" ? (
                  <div className="bg-gray-200 rounded-lg w-52 h-52">
                    {item.includes("<svg") ? (
                      <ChildCanvas
                        svgData={item}
                        width={200}
                        height={200}
                        fillColor={fillColor}
                        elements={elements}
                        onElementChange={onElementChange}
                        unitType={unitType}
                      />
                    ) : (
                      <img
                        src={item}
                        alt={`Item ${index + 1}`}
                        className="w-full h-full rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-52 h-52 bg-gray-200 rounded-lg"></div>
                )}
              </div>
            );
          })}
        </div>
        <Button
          onClick={onNextButtonClick}
          disabled={currentPage === totalPages}
          style={`mr-8 ${"disabled:opacity-25"}`}
          data-testid="Next"
        >
          <AiOutlineCaretRight size={40} />
        </Button>
      </div>
    </div>
  );
};

export default Carousel;
