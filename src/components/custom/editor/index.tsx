"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { useColorMode } from "@/lib/providers/theme";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
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
  const { resolvedTheme } = useColorMode();
  const quillModules = useMemo(() => modules, []);

  useEffect(() => {
    const editorContainer = document.querySelector(".ql-editor") as HTMLElement;
    const toolbar = document.querySelector(".ql-toolbar") as HTMLElement;
    const container = document.querySelector(".ql-container") as HTMLElement;

    if (resolvedTheme === "dark") {
      if (editorContainer) {
        editorContainer.style.backgroundColor = "#1f1f1f";
        editorContainer.style.color = "#ffffff";
      }
      if (toolbar) {
        toolbar.style.backgroundColor = "#1f1f1f";
        toolbar.style.border = "1px solid #424242";
        toolbar.querySelectorAll(".ql-stroke").forEach((el: any) => {
          el.style.stroke = "#ffffff";
        });
        toolbar.querySelectorAll(".ql-fill").forEach((el: any) => {
          el.style.fill = "#ffffff";
        });
        toolbar.querySelectorAll("button").forEach((btn: any) => {
          btn.style.color = "#ffffff";
        });
        toolbar.querySelectorAll(".ql-picker-label").forEach((label: any) => {
          label.style.color = "#ffffff";
        });
      }
      if (container) {
        container.style.backgroundColor = "#1f1f1f";
        container.style.border = "1px solid #424242";
      }
    } else {
      if (editorContainer) {
        editorContainer.style.backgroundColor = "";
        editorContainer.style.color = "";
      }
      if (toolbar) {
        toolbar.style.backgroundColor = "";
        toolbar.style.border = "";
        toolbar.querySelectorAll(".ql-stroke").forEach((el: any) => {
          el.style.stroke = "";
        });
        toolbar.querySelectorAll(".ql-fill").forEach((el: any) => {
          el.style.fill = "";
        });
        toolbar.querySelectorAll("button").forEach((btn: any) => {
          btn.style.color = "";
        });
        toolbar.querySelectorAll(".ql-picker-label").forEach((label: any) => {
          label.style.color = "";
        });
      }
      if (container) {
        container.style.backgroundColor = "";
        container.style.border = "";
      }
    }
  }, [resolvedTheme]);

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
        .dark .quill-disabled .ql-container {
          background-color: #1a1a1a;
        }
        .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
