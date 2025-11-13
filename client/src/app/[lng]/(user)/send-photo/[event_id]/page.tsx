"use client";

import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Space, Statistic} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import PageHeader from "@/components/PageHeader";
import Dropzone, {FileWithUploadData} from "@/components/Dropzone";
import {ApiStatus} from "@/types/ApiResponse";
import Link from "next/link";
import Event from "@/types/Event";
import {eventPhotoUpload, fetchEvent} from "@/lib/database/Event";
import {useParams, useRouter} from "next/navigation";
import {removeImage} from "@/lib/database/Image";

const Page: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const params = useParams();
  const eventId = params.event_id as string
  const router = useRouter();

  const [form] = Form.useForm();
  const [loadingForm] = useState(false);

  const [event, setEvent] = useState<Event | null>(null);

  const [files, setFiles] = useState<FileWithUploadData[]>([]);
  const [stats, setStats] = useState({
    totalSelected: 0,
    totalSuccess: 0,
    totalError: 0,
    totalPending: 0,
  });

  useEffect(() => {
    if (!eventId) return;
    fetchEvent(Number(eventId), true)
      .then((res) => {
        if (res.status === ApiStatus.SUCCESS) {
          setEvent(res.event)
        }
      })
      .catch(() => {
        notification.error({message: t('unable_to_load_event')})
        router.push('/events')
      })
  }, [eventId]);

  const updateStats = (currentFiles?: FileWithUploadData[]) => {
    currentFiles = currentFiles ?? files
    const totalSelected = currentFiles.length;
    const totalSuccess = currentFiles.filter((f) => f.status === 'success').length;
    const totalError = currentFiles.filter((f) => f.status === 'error').length;
    const totalPending = totalSelected - totalSuccess - totalError;

    setStats({
      totalSelected,
      totalSuccess,
      totalError,
      totalPending,
    });
  };

  useEffect(() => {
    updateStats()
  }, [files]);

  const handleUpload = async (file: FileWithUploadData) => {
    let fileName = file.name.replace(/\.[^/.]+$/, "");
    fileName = fileName
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}\p{M}\s'-]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!fileName) fileName = "Sem nome";

    const res = await eventPhotoUpload(eventId, file, (progress) => {
      setFiles(prev =>
        prev.map(f => {
          if (f.id === file.id) {
            f.progress = Math.min(progress, 90);
          }
          return f;
        })
      );
    })

    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message})
      setFiles(prev =>
        prev.map(f => {
          if (f.id === file.id) {
            f.status = 'error'
          }
          return f
        })
      )
    } else {
      setFiles(prev =>
        prev.map(f => {
          if (f.id === file.id) {
            f.imageId = res.image.id
            f.status = 'success'
            f.progress = 100
          }
          return f
        })
      )
    }
  }

  const onFilesAdded = (newFiles: FileWithUploadData[]) => {
    setFiles(prev => [...newFiles, ...prev]);
    newFiles.forEach(async (file) => {
      await handleUpload(file)
    })
  };

  const onFilesRemoved = async (file: FileWithUploadData) => {
    if (!file.imageId) return

    try {
      const res = await removeImage(file.imageId);
      if (res.status !== ApiStatus.SUCCESS) {
        notification.warning({message: res.message})
        return
      }

      notification.success({message: res.message})
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (err) {
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
              description={t('newly_added_photos_may_take_some_time_to_be_separated')}
            />

            <Row gutter={16} className="mt-4">
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('total_photos')}
                    value={stats.totalSelected}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('photos_uploaded_successfully')}
                    value={stats.totalSuccess}
                    valueStyle={{color: "#3f8600"}}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('photos_pending_for_submission')}
                    value={stats.totalPending}
                    valueStyle={{color: "#faad14"}}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('photos_with_error')}
                    value={stats.totalError}
                    valueStyle={{color: "#cf1322"}}
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