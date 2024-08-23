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
    <div>
      <div className="flex">
        <div className="flex flex-col" style={{ marginTop: "25px" }}>
          <Button
            onClick={onPrevButtonClick}
            disabled={currentPage === 1}
            style={`${"disabled:opacity-25"}`}
            data-testid="Prev"
          >
            <AiOutlineCaretLeft size={40} />
          </Button>
        </div>
        <div className="flex flex-1 space-x-5">
          {totalPages !== 0 &&
            Array.from({ length: itemsPerPage }).map((_, index) => {
              const item = items?.[index];

              return (
                <div key={index} className="flex-1">
                  {item && typeof item === "string" ? (
                    <div className="">
                      {item.includes("<svg") ? (
                        <ChildCanvas
                          svgData={item}
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
                    <div className=""></div>
                  )}
                </div>
              );
            })}
        </div>
        <div
          className="flex flex-col"
          style={{ marginTop: "25px", marginLeft: "15px" }}
        >
          <Button
            onClick={onNextButtonClick}
            disabled={currentPage === totalPages}
            style={`${"disabled:opacity-25"}`}
            data-testid="Next"
          >
            <AiOutlineCaretRight size={40} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
