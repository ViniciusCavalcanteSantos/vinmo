"use client";

import React, {useEffect, useState} from 'react';
import {Button, Card, Checkbox, Col, Divider, Form, Row, Space, Statistic} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import PageHeader from "@/components/PageHeader";
import Dropzone, {FileWithUploadData} from "@/components/Dropzone";
import {createClient, removeClient} from "@/lib/database/Client";
import {ApiStatus} from "@/types/ApiResponse";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import EventSelector from "@/components/EventSelector";

const Page: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();

  const [form] = Form.useForm();
  const [loadingForm] = useState(false);
  const autoAssign = Form.useWatch('auto_assign', form);

  const [files, setFiles] = useState<FileWithUploadData[]>([]);
  const [stats, setStats] = useState({
    totalSelected: 0,
    totalSuccess: 0,
    totalError: 0,
    totalPending: 0,
  });

  const [assignments, setAssignments] = useState<number[]>([]);

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

    const res = await createClient({name: fileName, assignments: assignments}, file, (progress) => {
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
            f.clientId = res.client.id
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
    if (!file.clientId) return

    try {
      const res = await removeClient(file.clientId);
      if (res.status !== ApiStatus.SUCCESS) {
        notification.warning({message: res.message})
        return
      }

      notification.success({message: res.message})
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (err) {
    }
  }

  const handleAssignChange = (values: number[]) => {
    setAssignments(values);
  }

  return (
    <>
      <PageHeader title={t('automatic_registration_by_photo')}/>

      <div className="flex  items-start gap-4">
        <Card loading={loadingForm} variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full">
          <Form form={form} layout="vertical" name="manage_client_form">
            {<Form.Item
              name="auto_assign"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10}}
            >
              <Checkbox>{t('auto_assign')}</Checkbox>
            </Form.Item>}

            {autoAssign && (
              <div className="mb-4">
                <Divider>{t('assign_clients_to_events')}</Divider>

                <EventSelector value={assignments} onChange={handleAssignChange}/>
              </div>
            )}

            <Dropzone
              onFilesAdded={onFilesAdded}
              onFilesRemoved={onFilesRemoved} files={files}
              icon={<UserOutlined className="!text-primary text-5xl"/>}
              title={t('click_or_drag_photo_to_create_client')}
              description={t('click_or_drag_photo_to_create_client_example')}
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
                  <Link href='/clients'>
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