import React from "react";
import Monaco from "@monaco-editor/react";

type Props = {
  className?: string;
  value: string;
  onEditorMounted?: (getter: ValueGetter) => void;
};

type ValueGetter = () => string;

const Editor: React.FC<Props> = ({ className, value, onEditorMounted }) => {
  const onEditorDidMount = (valueGetter: ValueGetter, _instance: any): void => {
    if (onEditorMounted) onEditorMounted(valueGetter);
  };

  return (
    <div className={className}>
      <Monaco height="100%" width="100%" theme="dark" language="perl" value={value} editorDidMount={onEditorDidMount} />
    </div>
  );
};

export default Editor;
