"use client";

import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Space} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import Dropzone, {FileWithUploadData} from "@/components/ui/Dropzone";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useRemoveImage} from "@/lib/queries/images/useRemoveImage";
import {useEvent} from "@/lib/queries/events/useEvent";
import {useUploadEventPhoto} from "@/lib/queries/events/useUploadEventPhoto";
import PageHeader from "@/components/common/layout/PageHeader";
import UploadStats from "@/components/features/app/events/EventWorkspace/UploadZone/_components/UploadStats";

const UploadZone: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const params = useParams();
  const eventId = Number(params.event_id)

  const [form] = Form.useForm();
  const [loadingForm] = useState(false);

  const {data: event} = useEvent(eventId, true)
  const {mutateAsync: uploadEventPhoto} = useUploadEventPhoto()
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
    await uploadEventPhoto({
      eventId: eventId, photo: file,
      onProgress: (progress) => {
        updateFile(file.id, {progress: Math.min(progress, 90)});
      }
    })
      .then(res => {
        updateFile(file.id, {
          imageId: res.image.id,
          status: 'success',
          progress: 100,
        });
      })
      .catch(err => {
        notification.warning({title: err.message})
        updateFile(file.id, {status: 'error'});
      })
  }

  const onFilesAdded = (newFiles: FileWithUploadData[]) => {
    setFiles(prev => [...newFiles, ...prev]);
  };

  const onFilesRemoved = async (file: FileWithUploadData) => {
    if (!file.imageId) return

    try {
      removeImage.mutate(file.imageId, {
        onSuccess: (res => {
          notification.success({title: res.message})
          setFiles(prev => prev.filter(f => f.id !== file.id));
        })
      });

    } catch (err: any) {
      notification.warning({title: err.message})
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

            <UploadStats totalPhotos={stats.totalSelected} totalSuccess={stats.totalSuccess}
                         totalPending={stats.totalPending} totalError={stats.totalError}/>

            <Form.Item className="!mt-4 flex justify-end">
              <Space className="flex justify-end">
                <Button type="primary">
                  <Link href='/app/events'>
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

export default UploadZone;