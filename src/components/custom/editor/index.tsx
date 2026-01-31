"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-gray-100 animate-pulse rounded" />
  ),
});

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const modules = {
  toolbar: [["bold", "italic", "underline"], ["blockquote"]],
};

const formats = ["bold", "italic", "underline", "blockquote"];

const Editor = ({ value, onChange, placeholder, disabled }: EditorProps) => {
  const quillModules = useMemo(() => modules, []);

  return (
    <div className={disabled ? "quill-disabled" : ""}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={quillModules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
      <style jsx global>{`
        .quill-disabled .ql-toolbar {
          pointer-events: none;
          opacity: 0.6;
        }
        .quill-disabled .ql-container {
          background-color: #f5f5f5;
        }
        .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
