import {Button, ButtonProps} from "antd";

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      style={{
        fontWeight: "500",
        padding: "19px 12px",
        borderRadius: 4,
        ...(props.style || {}),
      }}
    />
  );
};