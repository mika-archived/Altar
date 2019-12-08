import React from "react";
import Monaco from "@monaco-editor/react";

type Props = {
  className?: string;
  onEditorMounted?: (getter: ValueGetter) => void;
};

type ValueGetter = () => string;

const Editor: React.FC<Props> = ({ className, onEditorMounted }) => {
  const initialValue = `
use features qw/say state/;
use strict;
use utf8;
use warnings;
  
use Data::Validator;
  
sub say_hello {
    state $v; $v //= Data::Validator->new(
        str => 'Str',
    )->with(qw/Method/);
    my ($class, $args) = $v->validate(@_);
    my ($str, ) = @$args{qw/str/};

    say "Hello, $str";
}
  
say_hello("Altar");
  `.trim();

  const onEditorDidMount = (valueGetter: ValueGetter, _instance: any): void => {
    if (onEditorMounted) onEditorMounted(valueGetter);
  };

  return (
    <div className={className}>
      <Monaco
        height="100%"
        width="100%"
        theme="dark"
        language="perl"
        value={initialValue}
        editorDidMount={onEditorDidMount}
      />
    </div>
  );
};

export default Editor;
