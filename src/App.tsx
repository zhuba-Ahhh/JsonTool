import {
  EyeOutlined,
  DownloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { message, Space, Button, Typography, Input, Collapse } from "antd";
import { useState, useCallback, useEffect } from "react";
import { KeyMappingForm } from "./components/KeyMappingForm";
import JSONView from "react-json-view";
import "./App.less";
import { JsonSchemaToTypescript } from "./components/JsonToTypescript";

const { TextArea } = Input;
const { Title } = Typography;

type DateProps = {
  jsonData: string;
  parsedData: null | Object | Array<any>;
  keyMappings: any;
  keys: string[];
};
const App = () => {
  const [state, setState] = useState<DateProps>({
    jsonData: localStorage.getItem("jsonData") || "{}",
    parsedData: null,
    keyMappings: {},
    keys: [], // 添加新的状态来存储键
  });

  const updateState = (updates: Partial<DateProps>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleJsonData = useCallback(
    (action: "view" | "clear") => {
      try {
        let data;
        if (action === "view") {
          // 格式化 JSON 数据
          const formattedJson = JSON.stringify(
            JSON.parse(state.jsonData),
            null,
            2
          );
          data = JSON.parse(formattedJson);
          localStorage.setItem("jsonData", formattedJson);

          // 提取键
          const extractedKeys = Object.keys(
            Array.isArray(data) ? data[0] : data
          );

          // 更新状态
          updateState({
            jsonData: formattedJson,
            parsedData: data,
            keys: extractedKeys, // 更新键
          });

          // 更新 keyMappings
          const newKeyMappings = {
            mappings: extractedKeys.reduce(
              (acc, key) => ({ ...acc, [key]: key }),
              {}
            ),
            selectedKeys: extractedKeys.reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            ),
          };
          updateState({ keyMappings: newKeyMappings });

          message.success("解析成功");
        } else if (action === "clear") {
          data = {};
          updateState({
            jsonData: "{}",
            parsedData: null,
            keyMappings: {},
            keys: [],
          });
          localStorage.setItem("jsonData", "{}");
        }
      } catch (error) {
        message.error("输入的JSON数据格式有误，请检查后重试！");
        console.error(error);
      }
    },
    [state.jsonData]
  );

  useEffect(() => {
    handleJsonData("view");
  }, []);

  const exportToJson = useCallback(() => {
    try {
      let data = state.parsedData || JSON.parse(state.jsonData);
      localStorage.setItem("jsonData", state.jsonData);

      data = Array.isArray(data) ? data : [data];

      const selectedHeaders = Object.keys(
        state.keyMappings.selectedKeys
      ).filter((key) => state.keyMappings.selectedKeys[key]);

      const csvContent = [
        selectedHeaders
          .map((header) => `"${state.keyMappings.mappings[header] || header}"`)
          .join(","),
        ...data.map((row: Record<string, any>) =>
          selectedHeaders
            .map((header) => {
              let value = row[header] || "";
              value = Array.isArray(value) ? value.join("\n") : String(value);
              return `"${value.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `json数据表_${new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .slice(0, 14)}.csv`;
      link.click();
    } catch (error) {
      message.error("导出失败，请检查数据格式！");
      console.error(error);
    }
  }, [state.jsonData, state.parsedData, state.keyMappings]);

  return (
    <div className="json-converter">
      <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
        JSON 工具
      </Title>
      <div className="action-buttons">
        <Space>
          <Button
            type="primary"
            onClick={() => handleJsonData("view")}
            icon={<EyeOutlined />}
          >
            解析
          </Button>
          <Button onClick={exportToJson} icon={<DownloadOutlined />}>
            导出 CSV
          </Button>
          <Button
            danger
            onClick={() => handleJsonData("clear")}
            icon={<ClearOutlined />}
          >
            清空
          </Button>
        </Space>
      </div>
      <>
        <Collapse
          defaultActiveKey={["TextArea"]}
          items={[
            {
              key: "TextArea",
              label: "JSON数据",
              children: (
                <TextArea
                  value={state.jsonData}
                  onChange={(e) => updateState({ jsonData: e.target.value })}
                  placeholder="请输入或粘贴JSON数据..."
                  rows={10}
                />
              ),
            },
            {
              key: "KeyMappingForm",
              label: "表头映射",
              children: (
                <KeyMappingForm
                  keys={state.keys}
                  onMappingChange={(mappings) =>
                    updateState({ keyMappings: mappings })
                  }
                />
              ),
            },
            {
              key: "JSONView",
              label: "JSON预览",
              children: (
                <div className="json-viewer">
                  {state.parsedData && <JSONView src={state.parsedData} />}
                </div>
              ),
            },
            {
              key: "JsonSchemaToTypescript",
              label: "JSONToTypes",
              children: <JsonSchemaToTypescript value={state.parsedData} />,
            },
          ]}
        ></Collapse>
      </>
    </div>
  );
};

export default App;
