import {Card, Col, Row, Statistic} from "antd";
import React from "react";
import {useT} from "@/i18n/client";

interface UploadStatsProps {
  totalPhotos: number | string
  totalSuccess: number | string
  totalPending: number | string
  totalError: number | string
}

export default function UploadStats({totalPhotos, totalSuccess, totalPending, totalError}: UploadStatsProps) {
  const {t} = useT()

  return (
    <Row gutter={16} className="mt-4">
      <Col xs={24} sm={12} md={6} className="mb-4 md:mb-0">
        <Card className="h-full">
          <Statistic
            title={t('total_photos')}
            value={totalPhotos}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6} className="mb-4 md:mb-0">
        <Card className="h-full">
          <Statistic
            title={t('photos_uploaded_successfully')}
            value={totalSuccess}
            classNames={{content: '!text-ant-success'}}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6} className="mb-4 sm:mb-0">
        <Card className="h-full">
          <Statistic
            title={t('photos_pending_for_submission')}
            value={totalPending}
            classNames={{content: '!text-ant-warning'}}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className="h-full">
          <Statistic
            title={t('photos_with_error')}
            value={totalError}
            classNames={{content: '!text-ant-error'}}
          />
        </Card>
      </Col>
    </Row>
  )
}