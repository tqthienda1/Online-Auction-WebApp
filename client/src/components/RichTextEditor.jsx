import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichTextEditor({ onChange }) {
  return (
    <Editor
      apiKey={import.meta.env.VITE_RichTextEditorApiKey}
      init={{
        plugins: [
          // Core editing features
          "anchor",
          "autolink",
          "charmap",
          "codesample",
          "emoticons",
          "link",
          "lists",
          "media",
          "searchreplace",
          "table",
          "visualblocks",
          "wordcount",
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Dec 16, 2025:
        ],
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "First.Name", title: "First Name" },
          { value: "Email", title: "Email" },
        ],
        ai_request: (request, respondWith) =>
          respondWith.string(() =>
            Promise.reject("See docs to implement AI Assistant")
          ),
        uploadcare_public_key: "e84e018ec74924df9c95",
      }}
      initialValue=""
      onEditorChange={(newContent) => {
        if (onChange) onChange(newContent); // trả ra cho parent nếu muốn
      }}
    />
  );
}
