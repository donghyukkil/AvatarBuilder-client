import { useEffect, useState } from "react";

import NavBar from "../../components/NavBar";
import CanvasContainer from "../../components/CanvasContainer";
import UnitSelectorContainer from "../../components/UnitSelectorContainer";

import getSvgDataArray from "../../utils/getSvgDataArray";

import { CONFIG } from "../../constants/config";

const Sketch = () => {
  const [elements, setElements] = useState({
    head: { svgData: null, fillColor: "#000000" },
    face: { svgData: null, fillColor: "#000000" },
    body: { svgData: null, fillColor: "#000000" },
  });

  const handleElementChange = (unitType, newElementData) => {
    setElements((prevElements) => ({
      ...prevElements,
      [unitType]: newElementData,
    }));
  };

  const fetchInitialSvgData = async () => {
    try {
      const unitTypes = ["head", "face", "body"];
      const svgDataArray = [];

      for (const unitType of unitTypes) {
        const response = await fetch(
          `${CONFIG.BACKEND_SERVER_URL}/units?unitType=${unitType}&page=1&per_page=1`,
        );

        const { units } = await response.json();
        const { list } = units;
        const urls = list.map((item) => item.url);

        const svgDataArrayForUnit = await getSvgDataArray(urls);
        svgDataArray.push(svgDataArrayForUnit);
      }

      setElements((prevElements) => ({
        ...prevElements,
        head: { ...prevElements["head"], svgData: svgDataArray[0][0] },
        face: { ...prevElements["face"], svgData: svgDataArray[1][0] },
        body: { ...prevElements["body"], svgData: svgDataArray[2][0] },
      }));
    } catch (error) {
      console.error("Error");
    }
  };

  useEffect(() => {
    fetchInitialSvgData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex">
        <UnitSelectorContainer
          style={"w-1/2 h-full bg-gray-200 p-4"}
          elements={elements}
          onElementChange={handleElementChange}
        />
        <CanvasContainer
          style={"w-1/2 h-full bg-gray-300 p-4"}
          elements={elements}
        />
      </div>
    </>
  );
};

export default Sketch;
