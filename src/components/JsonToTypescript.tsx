import { useCallback, useEffect, useState } from "react";
import JsonToTS from "json-to-ts";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

const JsonSchemaToTypescript = ({
  value,
}: {
  value: null | Object | Array<any>;
}) => {
  const [typesString, setTypesString] = useState<string>();
  const transformer = useCallback(async (value: null | Object | Array<any>) => {
    if (!!value && typeof value === "object") {
      const res = JsonToTS(value, {
        rootName: "root",
      }).reduce((acc, curr) => {
        return !!acc ? acc + "\n\n" + curr : acc + curr;
      }, "");

      setTypesString(res);
    }
  }, []);

  useEffect(() => {
    transformer(value);
  }, [value]);

  if (!typesString) {
    return null;
  }

  return (
    <Editor
      value={typesString}
      onValueChange={(code) => setTypesString(code)}
      highlight={(code) => highlight(code, languages.js, "ts")}
      disabled
      padding={16}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        backgroundColor: "#fafafa",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        marginTop: 24,
        maxHeight: 600,
        overflow: "auto",
      }}
    />
  );
};

export { JsonSchemaToTypescript };
