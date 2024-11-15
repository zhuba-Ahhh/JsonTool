import { useCallback, useEffect, useState } from "react";
import JsonToTS from "json-to-ts";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const JsonSchemaToTypescript = ({
  value,
}: {
  value: null | Object | Array<any>;
}) => {
  const [typesString, setTypesString] = useState<string>();
  const [useTypeAlias, setUseTypeAlias] = useState<boolean>(true); // 默认使用类型别名

  const transformer = useCallback(
    async (value: null | Object | Array<any>) => {
      if (!!value && typeof value === "object") {
        const options = useTypeAlias
          ? { rootName: "root" }
          : { rootName: "root", useTypeAlias: false };
        const res = JsonToTS(value, options).reduce((acc, curr) => {
          return !!acc ? acc + "\n\n" + curr : acc + curr;
        }, "");
        setTypesString(res);
      }
    },
    [useTypeAlias, value]
  );

  useEffect(() => {
    transformer(value);
  }, [value, transformer, useTypeAlias]);

  const copyCodeToClipboard = useCallback(() => {
    navigator.clipboard.writeText(typesString || "");
    message.success("复制成功");
  }, [typesString]);

  const toggleUseTypeAlias = useCallback(() => {
    setUseTypeAlias(!useTypeAlias);
  }, [useTypeAlias]);

  if (!typesString) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <Button
          onClick={copyCodeToClipboard}
          icon={<CopyOutlined />}
          style={{ marginRight: 8 }}
        ></Button>
        <Button onClick={toggleUseTypeAlias} style={{ display: "none" }}>
          {useTypeAlias ? "禁用类型别名" : "启用类型别名"}
        </Button>
      </div>
      <Editor
        disabled
        padding={16}
        value={typesString}
        onValueChange={(code) => setTypesString(code)}
        highlight={(code) => highlight(code, languages.js, "typescript")}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          backgroundColor: "#fafafa",
          border: "1px solid #e8e8e8",
          borderRadius: 8,
          maxHeight: 600,
          overflow: "auto",
        }}
      />
    </div>
  );
};

export { JsonSchemaToTypescript };
