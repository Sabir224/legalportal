// // CEEditable.jsx
// import React from "react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Bold from "@tiptap/extension-bold";
// import Italic from "@tiptap/extension-italic";
// import Underline from "@tiptap/extension-underline";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";

// export default function CEEditable({ html = "", onChange, placeholder = "Type here...", className = "" }) {
//     const editor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 history: true, // yahan enable hai by default
//             }),
//             Bold,
//             Italic,
//             Underline,
//             BulletList,
//             OrderedList,
//         ],
//         content: html || "",
//         onUpdate: ({ editor }) => {
//             onChange?.(editor.getHTML());
//         },
//     });

//     if (!editor) return null;

//     return (
//         <div className={`border rounded p-2 ${className}`} style={{ background: "white" }}>
//             {/* Toolbar */}
//             <div className="d-flex gap-2 mb-2 flex-wrap">
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().toggleBold().run()}>
//                     <b>B</b>
//                 </button>
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().toggleItalic().run()}>
//                     <i>I</i>
//                 </button>
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().toggleUnderline().run()}>
//                     <u>U</u>
//                 </button>
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                     • Bullet
//                 </button>
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
//                     1. List
//                 </button>
//                 {/* Undo / Redo buttons */}
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().undo().run()}>
//                     ⎌ Undo
//                 </button>
//                 <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().redo().run()}>
//                     ↻ Redo
//                 </button>
//             </div>

//             {/* Editable Area */}
//             <EditorContent editor={editor} style={{ minHeight: "50px", textAlign: "justify" }} />
//         </div>
//     );
// }









// CEEditable.jsx
import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

// ========== Helpers ==========

// Array -> HTML
const listToHtml = (list) => {
  if (!Array.isArray(list)) return "";
  return `
    <ol>
      ${list
      .map(
        (heading) => `
          <li>
            <strong>${heading.title || ""}</strong>
            <ul>
              ${(heading.points || [])
            .map(
              (p) => `
                  <li>
                    ${p.text || ""}
                    ${p.subpoints?.length
                  ? `<ul>${p.subpoints
                    .map((sp) => `<li>${sp.text || ""}</li>`)
                    .join("")}</ul>`
                  : ""
                }
                  </li>
                `
            )
            .join("")}
            </ul>
          </li>
        `
      )
      .join("")}
    </ol>
  `;
};

// HTML -> Array
const htmlToList = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const sections = [];

  doc.querySelectorAll("ol > li").forEach((li) => {
    const headingText = (li.querySelector("strong")?.textContent || "").trim();

    const points = Array.from(li.querySelectorAll(":scope > ul > li")).map(
      (point) => {
        const text = (point.childNodes[0]?.textContent || "").trim();

        // subpoints handle
        const subpoints = Array.from(
          point.querySelectorAll(":scope > ul > li")
        ).map((sp) => ({
          text: (sp.textContent || "").trim(),
        }));

        return { text, subpoints };
      }
    );

    sections.push({ title: headingText, points });
  });

  return sections;
};

// ========== Component ==========
export default function CEEditable({
  html = "",
  list = null,
  onChange,
  placeholder = "Type here...",
  disable,
  className = "",
}) {
  // agar list mila hai to HTML bana lo
  const initialHtml = list ? listToHtml(list) : html;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
    ],
    content: initialHtml || "",
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML();
      if (list) {
        onChange?.(htmlToList(newHtml));
      } else {
        onChange?.(newHtml);
      }
    },
  });

  // Tab indentation handler
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        // yahan \u00A0 = non-breaking space hai
        // hum 8 spaces insert karenge
        editor.commands.insertContent("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("keydown", handleKeyDown);

    return () => {
      dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);


  useEffect(() => {
    if (editor) {
      editor.setEditable(!disable);
    }
  }, [disable, editor]);
  if (!editor) return null;

  return (
    <div className={`border rounded p-2 ${className}`} style={{ background: "white" }}>
      {/* Toolbar */}
      <div className="d-flex gap-2 mb-2 flex-wrap">
        <button
          type="button"
          className="btn btn-sm btn-light"
          disabled={disable}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          disabled={disable}
          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          disabled={disable}

          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          disabled={disable}

          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Bullet
        </button>
        <button
          type="button"
          disabled={disable}

          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          type="button"
          disabled={disable}

          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ⎌ Undo
        </button>
        <button
          type="button"
          disabled={disable}

          className="btn btn-sm btn-light"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻ Redo
        </button>
      </div>

      {/* Editable Area */}
      <EditorContent
        editor={editor}
        disabled={disable}
        style={{ minHeight: "50px", textAlign: "justify" }}
      />
    </div>
  );
}
