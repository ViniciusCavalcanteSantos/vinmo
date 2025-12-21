import {Button, Empty, Space} from "antd";
import React from "react";
import {useT} from "@/i18n/client";
import {ApiError} from "@/lib/ApiError";
import {FrownOutlined} from "@ant-design/icons";

interface ErrorEmptyProps {
  error: unknown;
  onRetry?: () => void;
}

export default function ErrorEmpty({error, onRetry}: ErrorEmptyProps) {
  const {t} = useT();

  let title = t("something_went_wrong");
  let description = error instanceof ApiError || error instanceof Error ? error.message : undefined;

  return (
    <Empty
      className='my-8'
      classNames={{image: '!h-auto'}}
      image={
        <FrownOutlined
          className='!text-ant-text-sec text-5xl mb-2'
          style={{}}
        />
      }
      description={
        <Space orientation="vertical" align="center">
          <strong>{title}</strong>
          {description && (
            <span className="text-gray-500 text-sm">
              {description}
            </span>
          )}
        </Space>
      }
    >
      {onRetry && (
        <Button onClick={onRetry}>
          {t("try_again")}
        </Button>
      )}
    </Empty>
  );
}
