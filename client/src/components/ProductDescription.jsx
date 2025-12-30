import { useEffect, useRef, useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

import { CiSquarePlus } from "react-icons/ci";
import RichTextEditor from "./RichTextEditor";
import { formattedDate } from "@/helper/formatDate";

const COLLAPSED_HEIGHT = 1000;

const ProductDescription = ({
  descriptions = [],
  editable,
  onSave,
  message,
}) => {
  const contentRef = useRef(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAddBox, setShowAddBox] = useState(false);
  const [editorValue, setEditorValue] = useState("");

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
            <div key={d.id ?? index} className="mb-6">
              {index > 0 && d.createdAt && (
                <>
                  <div className="w-[90%] h-0.5 bg-gray-100 mx-auto "></div>
                  <div className="mt-2 text-sm text-gray-400 text-right italic">
                    Added on {formattedDate(d.createdAt)}
                  </div>
                </>
              )}
              <div dangerouslySetInnerHTML={{ __html: d.productDescription }} />
            </div>
          ))}

          {editable && (
            <>
              {!showAddBox && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="flex-1 h-px bg-gray-300" />

                  <button
                    onClick={() => setShowAddBox(true)}
                    title="Add description"
                  >
                    <CiSquarePlus className="w-14 h-14 text-gray-400 hover:text-yellow-400 hover:scale-105 duration-200 transition" />
                  </button>

                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              )}

              {message && (
                <div
                  className={`
                    mt-4 rounded-md px-4 py-2 text-md text-center font-medium
                    text-yellow-500 
                 `}
                >
                  {message}
                </div>
              )}
            </>
          )}
        </div>

        {editable && showAddBox && (
          <div
            className="
              mt-8 rounded-xl border border-gray-300
              bg-white p-6 shadow-md
              transition-all
            "
          >
            <h3 className="mb-4 text-sm font-semibold text-gray-700 tracking-wide">
              Add New Description
            </h3>

            <RichTextEditor
              value={editorValue}
              onChange={setEditorValue}
              placeholder="Write product details here..."
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddBox(false);
                  setEditorValue("");
                }}
                className="
                  rounded-md px-4 py-2 text-sm
                  text-gray-600 hover:bg-gray-100
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!editorValue.trim()) return;
                  onSave(editorValue);
                  setShowAddBox(false);
                  setEditorValue("");
                }}
                className="
                  rounded-md bg-yellow-400 px-5 py-2
                  text-sm font-medium text-white
                  hover:bg-yellow-500 transition
                "
              >
                Save
              </button>
            </div>
          </div>
        )}

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
