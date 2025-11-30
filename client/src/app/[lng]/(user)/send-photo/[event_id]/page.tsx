"use client";

import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Space, Statistic} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import PageHeader from "@/components/PageHeader";
import Dropzone, {FileWithUploadData} from "@/components/Dropzone";
import {ApiStatus} from "@/types/ApiResponse";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useRemoveImage} from "@/lib/queries/images/useRemoveImage";
import {useEvent} from "@/lib/queries/event/useEvent";
import {uploadEventPhoto} from "@/lib/api/event/uploadEventPhoto";

const Page: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const params = useParams();
  const eventId = Number(params.event_id)
  const router = useRouter();

  const [form] = Form.useForm();
  const [loadingForm] = useState(false);

  const {data: event} = useEvent(eventId, true)
  const removeImage = useRemoveImage(eventId);

  const [files, setFiles] = useState<FileWithUploadData[]>([]);
  const [stats, setStats] = useState({
    totalSelected: 0,
    totalSuccess: 0,
    totalError: 0,
    totalPending: 0,
  });

  const updateFile = (fileId: string, patch: Partial<FileWithUploadData>) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id !== fileId) return f;
        Object.assign(f, patch);
        return f;
      })
    );
  };

  useEffect(() => {
    const next = files.reduce(
      (acc, f) => {
        acc.totalSelected++;
        if (f.status === 'success') acc.totalSuccess++;
        else if (f.status === 'error') acc.totalError++;
        else acc.totalPending++;
        return acc;
      },
      {totalSelected: 0, totalSuccess: 0, totalError: 0, totalPending: 0}
    );

    setStats(next);
  }, [files]);

  const handleUpload = async (file: FileWithUploadData) => {
    let fileName = file.name.replace(/\.[^/.]+$/, "");
    fileName = fileName
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}\p{M}\s'-]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!fileName) fileName = t('untitled');


    const res = await uploadEventPhoto(eventId, file, (progress) => {
      updateFile(file.id, {progress: Math.min(progress, 90)});
    })

    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message})
      updateFile(file.id, {status: 'error'});
    } else {
      updateFile(file.id, {
        imageId: res.image.id,
        status: 'success',
        progress: 100,
      });
    }
  }

  const onFilesAdded = (newFiles: FileWithUploadData[]) => {
    setFiles(prev => [...newFiles, ...prev]);
  };

  const onFilesRemoved = async (file: FileWithUploadData) => {
    if (!file.imageId) return

    try {
      removeImage.mutate(file.imageId, {
        onSuccess: (res => {
          notification.success({message: res.message})
          setFiles(prev => prev.filter(f => f.id !== file.id));
        })
      });

    } catch (err: any) {
      notification.warning({message: err.message})
    }
  }

  return (
    <>
      <PageHeader title={t('photo_upload')}/>

      <div className="flex  items-start gap-4">
        <Card loading={loadingForm} variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full">
          <Form form={form} layout="vertical" name="manage_client_form">
            <div className="flex flex-col mb-4">
              <span>
                <strong>{t('contract')}:</strong> {event?.contract?.code} - {event?.contract?.title}
              </span>

              <span>
                <strong>{t('event')}:</strong> {event?.type.name}: {event?.title}
              </span>

              <span>
                <strong>{t('cost')}:</strong> {t('credits_per_photo', {value: '0,50'})}
              </span>
            </div>


            <Dropzone
              onFilesAdded={onFilesAdded}
              onFilesRemoved={onFilesRemoved} files={files}
              onUploadFile={handleUpload}
              description={t('newly_added_photos_may_take_some_time_to_be_separated')}
            />

            <Row gutter={16} className="mt-4">
              <Col xs={24} sm={12} md={6} className="mb-4 md:mb-0">
                <Card className="h-full">
                  <Statistic
                    title={t('total_photos')}
                    value={stats.totalSelected}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} className="mb-4 md:mb-0">
                <Card className="h-full">
                  <Statistic
                    title={t('photos_uploaded_successfully')}
                    value={stats.totalSuccess}
                    valueStyle={{color: "#3f8600"}}
                    valueRender={(node) => {
                      return <span className='text-ant-success'>{node}</span>;
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} className="mb-4 sm:mb-0">
                <Card className="h-full">
                  <Statistic
                    title={t('photos_pending_for_submission')}
                    value={stats.totalPending}
                    valueStyle={{color: "#faad14"}}
                    valueRender={(node) => {
                      return <span className='text-ant-warning'>{node}</span>;
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="h-full">
                  <Statistic
                    title={t('photos_with_error')}
                    value={stats.totalError}
                    valueStyle={{color: "#cf1322"}}
                    valueRender={(node) => {
                      return <span className='text-ant-error'>{node}</span>;
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Form.Item className="!mt-4 flex justify-end">
              <Space className="flex justify-end">
                <Button type="primary">
                  <Link href='/events'>
                    {t('finish_and_exit')}
                  </Link>
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Page;