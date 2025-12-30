import { useEffect, useRef, useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

const COLLAPSED_HEIGHT = 1000;

const ProductDescription = ({ descriptions }) => {
  const contentRef = useRef(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;

    requestAnimationFrame(() => {
      const overflow = el.scrollHeight > COLLAPSED_HEIGHT;
      setIsOverflowing(overflow);
    });
  }, [descriptions]);

  return (
    <div className="flex mt-10 justify-center">
      <div className="relative w-[90%]">
        <div
          ref={contentRef}
          style={{
            maxHeight: expanded ? "none" : `${COLLAPSED_HEIGHT}px`,
          }}
          className={`
            prose max-w-none text-justify font-light
            transition-all duration-300
            overflow-hidden
          `}
        >
          {descriptions.map((d, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: d.productDescription }}
            />
          ))}
        </div>

        {isOverflowing && !expanded && (
          <div
            className="pointer-events-none absolute bottom-4
           left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"
          />
        )}

        {isOverflowing && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-yellow-400 transition"
            >
              {expanded ? "View less" : "View More"}
              <span
                className={`transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              >
                <FaAngleDoubleDown />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
