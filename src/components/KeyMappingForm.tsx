import {
  MinusSquareOutlined,
  CheckSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Space, Button, Input } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MappingItem } from "./MappingItem";

const { Search } = Input;

type KeyMappingFormProps = {
  keys: string[];
  onMappingChange: (mapping: {
    mappings: { [key: string]: string };
    selectedKeys: { [key: string]: boolean };
  }) => void;
};
type DateType = {
  mappings: Record<string, any>;
  selectedKeys: Record<string, any>;
  sortOrder: "asc" | "desc";
  searchTerm: string;
};
const KeyMappingForm = ({ keys, onMappingChange }: KeyMappingFormProps) => {
  const [state, setState] = useState<DateType>({
    mappings: keys.reduce((acc, key) => ({ ...acc, [key]: key }), {}),
    selectedKeys: keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    sortOrder: "asc",
    searchTerm: "",
  });

  useEffect(() => {
    // 更新映射
    setState((prev) => ({
      ...prev,
      mappings: keys.reduce((acc, key) => ({ ...acc, [key]: key }), {}),
      selectedKeys: keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    }));
  }, [keys]);

  useEffect(() => {
    onMappingChange({
      mappings: state.mappings,
      selectedKeys: state.selectedKeys,
    });
  }, [onMappingChange, state.mappings, state.selectedKeys]);

  // 使用 useCallback 优化性能
  const updateState = useCallback((updates: Partial<DateType>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // 使用 useMemo 优化过滤和排序逻辑
  const filteredAndSortedKeys = useMemo(() => {
    return Object.keys(state.selectedKeys)
      .filter((key) =>
        key.toLowerCase().includes(state.searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        state.sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
      );
  }, [state.selectedKeys, state.searchTerm, state.sortOrder]);

  const handleInputChange = (key: string, value: any) => {
    updateState({ mappings: { ...state.mappings, [key]: value } });
  };

  const handleCheckboxChange = (key: string) => {
    updateState({
      selectedKeys: {
        ...state.selectedKeys,
        [key]: !state.selectedKeys[key],
      },
    });
  };

  const handleRemoveKey = (keyToRemove: string) => {
    const { [keyToRemove]: _, ...restSelectedKeys } = state.selectedKeys;
    const { [keyToRemove]: __, ...restMappings } = state.mappings;
    updateState({
      selectedKeys: restSelectedKeys,
      mappings: restMappings,
    });
  };

  const toggleAllSelection = () => {
    const allSelected = Object.values(state.selectedKeys).every((v) => v);
    updateState({
      selectedKeys: Object.keys(state.selectedKeys).reduce(
        (acc, key) => ({ ...acc, [key]: !allSelected }),
        {}
      ),
    });
  };

  const toggleSortOrder = () => {
    const newSortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    const sortedKeys = Object.keys(state.selectedKeys).sort((a, b) =>
      newSortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
    );
    updateState({
      sortOrder: newSortOrder,
      selectedKeys: sortedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: state.selectedKeys[key] }),
        {}
      ),
      mappings: sortedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: state.mappings[key] }),
        {}
      ),
    });
  };

  return (
    <>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {Search && (
          <Search
            placeholder="搜索键名"
            onSearch={(value) => updateState({ searchTerm: value })}
            onChange={(e) => updateState({ searchTerm: e.target.value })}
            style={{ width: "100%", maxWidth: "300px" }}
            allowClear
          />
        )}
        <Space>
          <Button
            onClick={toggleAllSelection}
            icon={
              Object.values(state.selectedKeys).every((v) => v) ? (
                <MinusSquareOutlined />
              ) : (
                <CheckSquareOutlined />
              )
            }
          >
            {Object.values(state.selectedKeys).every((v) => v)
              ? "取消全选"
              : "全选"}
          </Button>
          <Button
            onClick={toggleSortOrder}
            icon={
              state.sortOrder === "asc" ? (
                <SortAscendingOutlined />
              ) : (
                <SortDescendingOutlined />
              )
            }
          >
            {state.sortOrder === "asc" ? "按字母降序" : "按字母升序"}
          </Button>
        </Space>
      </Space>
      {filteredAndSortedKeys.length > 0 && (
        <div className="mapping-grid">
          {filteredAndSortedKeys.map((key) => (
            <MappingItem
              key={key}
              itemKey={key}
              mapping={state.mappings[key]}
              isSelected={state.selectedKeys[key]}
              onCheckboxChange={handleCheckboxChange}
              onInputChange={handleInputChange}
              onRemoveKey={handleRemoveKey}
            />
          ))}
        </div>
      )}
    </>
  );
};

export { KeyMappingForm };
