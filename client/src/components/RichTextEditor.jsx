import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { FaBold, FaItalic, FaStrikethrough, FaCode, FaList, FaListOl } from "react-icons/fa";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive("bold") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Bold"
        >
          <FaBold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive("italic") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Italic"
        >
          <FaItalic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${editor.isActive("strike") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Strikethrough"
        >
          <FaStrikethrough size={16} />
        </button>

        <div className="border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Heading 1"
        >
          <span className="font-bold text-sm">H1</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Heading 2"
        >
          <span className="font-bold text-sm">H2</span>
        </button>

        <div className="border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive("bulletList") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Bullet List"
        >
          <FaList size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive("orderedList") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Ordered List"
        >
          <FaListOl size={16} />
        </button>

        <div className="border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded ${editor.isActive("codeBlock") ? "bg-yellow-400 text-white" : "bg-white hover:bg-gray-200"}`}
          title="Code Block"
        >
          <FaCode size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="p-2 rounded bg-white hover:bg-gray-200"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="p-4 bg-white min-h-48">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
