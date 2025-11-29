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

    const res = await createClient({name: fileName, assignments: assignments}, file, (progress) => {
      updateFile(file.id, {progress: Math.min(progress, 90)});
    })

    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message})
      updateFile(file.id, {status: 'error'});
    } else {
      updateFile(file.id, {
        clientId: res.client.id,
        status: 'success',
        progress: 100,
      });
    }
  }

  const onFilesAdded = (newFiles: FileWithUploadData[]) => {
    setFiles(prev => [...newFiles, ...prev]);
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
              onUploadFile={handleUpload}
              icon={<UserOutlined className="!text-ant-primary text-5xl"/>}
              title={t('click_or_drag_photo_to_create_client')}
              description={t('click_or_drag_photo_to_create_client_example')}
            />

            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} sm={12} lg={6}>
                <Card style={{height: '100%'}}>
                  <Statistic
                    title={t('total_photos')}
                    value={stats.totalSelected}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{height: '100%'}}>
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
              <Col xs={24} sm={12} lg={6}>
                <Card style={{height: '100%'}}>
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
              <Col xs={24} sm={12} lg={6}>
                <Card style={{height: '100%'}}>
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