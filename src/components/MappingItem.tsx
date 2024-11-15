import { DeleteOutlined } from "@ant-design/icons";
import { Checkbox, Tooltip, Typography, Input, Button } from "antd";
type MappingItemProps = {
  itemKey: string;
  mapping: string;
  isSelected: boolean;
  onCheckboxChange: (key: string) => void;
  onInputChange: (key: string, value: string) => void;
  onRemoveKey: (key: string) => void;
};

const MappingItem = ({
  itemKey,
  mapping,
  isSelected,
  onCheckboxChange,
  onInputChange,
  onRemoveKey,
}: MappingItemProps) => (
  <div className="mapping-item">
    <Checkbox checked={isSelected} onChange={() => onCheckboxChange(itemKey)} />
    <Tooltip title={itemKey}>
      <Typography.Text
        style={{
          marginRight: "8px",
          minWidth: "80px",
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {itemKey}:
      </Typography.Text>
    </Tooltip>
    <Input
      value={mapping}
      onChange={(e) => onInputChange(itemKey, e.target.value)}
      disabled={!isSelected}
      style={{ flex: 1 }}
    />
    <Button
      danger
      onClick={() => onRemoveKey(itemKey)}
      size="small"
      icon={<DeleteOutlined />}
    >
      删除
    </Button>
  </div>
);

export { MappingItem };
